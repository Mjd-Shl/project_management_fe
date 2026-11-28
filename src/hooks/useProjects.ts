import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  archiveProject,
  createProject,
  fetchProjects,
  fetchWorkspaceMembers,
  restoreProject,
  updateProject,
} from '../services/projectsApi'
import type {
  Project,
  ProjectValues,
  WorkspaceMember,
  WorkspacePermissions,
} from '../types'

export type ToastMessage = {
  id: number
  message: string
  kind: 'success' | 'error'
  undoProject?: Project
}

const emptyPermissions: WorkspacePermissions = {
  canCreate: false,
  canEdit: false,
  canArchive: false,
  canViewArchived: false,
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [permissions, setPermissions] = useState(emptyPermissions)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [search, setSearch] = useState('')
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [busyProjectIds, setBusyProjectIds] = useState<Set<string>>(() => new Set())
  const nextToastId = useRef(0)
  const toastTimers = useRef(new Map<number, number>())

  const dismissToast = useCallback((id: number) => {
    const timer = toastTimers.current.get(id)
    if (timer !== undefined) {
      window.clearTimeout(timer)
      toastTimers.current.delete(id)
    }
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback((message: string, kind: ToastMessage['kind'] = 'success', undoProject?: Project) => {
    const id = ++nextToastId.current
    setToasts((current) => [...current, { id, message, kind, undoProject }])
    toastTimers.current.set(id, window.setTimeout(() => dismissToast(id), 7000))
  }, [dismissToast])

  useEffect(() => () => {
    toastTimers.current.forEach((timer) => window.clearTimeout(timer))
    toastTimers.current.clear()
  }, [])

  const loadWorkspace = useCallback(async () => {
    setLoading(true)
    setPageError('')
    try {
      const [projectResult, workspaceMembers] = await Promise.all([
        fetchProjects(),
        fetchWorkspaceMembers(),
      ])
      setProjects(projectResult.projects)
      setPermissions(projectResult.permissions)
      setMembers(workspaceMembers)
    } catch (error) {
      setPageError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadWorkspace()
  }, [loadWorkspace])

  const visibleProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const showArchivedProjects = showArchived && permissions.canViewArchived

    return projects.filter((project) => {
      const matchesArchive = project.archived === showArchivedProjects
      const matchesSearch =
        !normalizedSearch ||
        project.name.toLowerCase().includes(normalizedSearch) ||
        project.key.toLowerCase().includes(normalizedSearch) ||
        project.description.toLowerCase().includes(normalizedSearch)
      return matchesArchive && matchesSearch
    })
  }, [permissions.canViewArchived, projects, search, showArchived])

  const saveProject = useCallback(async (project: Project | null, values: ProjectValues) => {
    if (project) {
      const saved = await updateProject(project.id, values)
      setProjects((current) => current.map((item) => item.id === saved.id ? saved : item))
      notify('Project changes saved.')
      return
    }

    const created = await createProject(values)
    setProjects((current) => [created, ...current])
    setShowArchived(false)
    notify('Project created.')
  }, [notify])

  const setProjectBusy = useCallback((projectId: string, isBusy: boolean) => {
    setBusyProjectIds((current) => {
      const next = new Set(current)
      if (isBusy) next.add(projectId)
      else next.delete(projectId)
      return next
    })
  }, [])

  const archive = useCallback(async (project: Project) => {
    if (busyProjectIds.has(project.id)) return
    setProjectBusy(project.id, true)
    try {
      await archiveProject(project.id)
      setProjects((current) =>
        current.map((item) => item.id === project.id ? { ...item, archived: true } : item),
      )
      notify(`${project.name} archived.`, 'success', project)
    } catch (error) {
      notify(`Could not archive ${project.name}: ${getErrorMessage(error)}`, 'error')
    } finally {
      setProjectBusy(project.id, false)
    }
  }, [busyProjectIds, notify, setProjectBusy])

  const restore = useCallback(async (project: Project) => {
    if (busyProjectIds.has(project.id)) return
    setProjectBusy(project.id, true)
    try {
      await restoreProject(project.id)
      setProjects((current) =>
        current.map((item) => item.id === project.id ? { ...item, archived: false } : item),
      )
      toasts
        .filter((toast) => toast.undoProject?.id === project.id)
        .forEach((toast) => dismissToast(toast.id))
      notify(`${project.name} restored.`)
    } catch (error) {
      notify(`Could not restore ${project.name}: ${getErrorMessage(error)}`, 'error')
    } finally {
      setProjectBusy(project.id, false)
    }
  }, [busyProjectIds, dismissToast, notify, setProjectBusy, toasts])

  const undoArchive = useCallback(async (toast: ToastMessage) => {
    dismissToast(toast.id)
    if (toast.undoProject) await restore(toast.undoProject)
  }, [dismissToast, restore])

  return {
    archive,
    busyProjectIds,
    dismissToast,
    loadWorkspace,
    loading,
    members,
    pageError,
    permissions,
    restore,
    saveProject,
    search,
    setSearch,
    setShowArchived,
    showArchived,
    toasts,
    undoArchive,
    visibleProjects,
  }
}
