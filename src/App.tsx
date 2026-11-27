import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Archive,
  Check,
  CircleHelp,
  FolderKanban,
  Plus,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'
import { ProjectCard } from './components/ProjectCard'
import { ProjectDialog } from './components/ProjectDialog'
import {
  archiveProject,
  createProject,
  fetchProjects,
  fetchWorkspaceMembers,
  restoreProject,
  updateProject,
} from './services/projectsApi'
import type {
  Project,
  ProjectValues,
  WorkspaceMember,
  WorkspacePermissions,
} from './types/apiTypes'

type ToastMessage = {
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

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [permissions, setPermissions] = useState(emptyPermissions)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [search, setSearch] = useState('')
  const [dialogProject, setDialogProject] = useState<Project | null | undefined>()
  const [toasts, setToasts] = useState<ToastMessage[]>([])

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
      setPageError(errorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadWorkspace()
  }, [loadWorkspace])

  useEffect(() => {
    function onSignOut() {
      setProjects([])
      setMembers([])
      setPermissions(emptyPermissions)
      setDialogProject(undefined)
      setPageError('Your session has expired. Please sign in again.')
    }
    window.addEventListener('auth:signout', onSignOut)
    return () => window.removeEventListener('auth:signout', onSignOut)
  }, [])

  const visibleProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesArchive = project.archived === showArchived
      const matchesSearch =
        !normalizedSearch ||
        project.name.toLowerCase().includes(normalizedSearch) ||
        project.key.toLowerCase().includes(normalizedSearch) ||
        project.description.toLowerCase().includes(normalizedSearch)
      return matchesArchive && matchesSearch
    })
  }, [projects, search, showArchived])

  function notify(message: string, kind: ToastMessage['kind'] = 'success', undoProject?: Project) {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, message, kind, undoProject }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 7000)
  }

  async function saveProject(values: ProjectValues) {
    if (dialogProject) {
      const saved = await updateProject(dialogProject.id, values)
      setProjects((current) => current.map((project) => project.id === saved.id ? saved : project))
      setDialogProject(undefined)
      notify('Project changes saved.')
      return
    }

    const created = await createProject(values)
    setProjects((current) => [created, ...current])
    setShowArchived(false)
    setDialogProject(undefined)
    notify('Project created.')
  }

  async function handleArchive(project: Project) {
    try {
      await archiveProject(project.id)
      setProjects((current) =>
        current.map((item) => item.id === project.id ? { ...item, archived: true } : item),
      )
      notify(`${project.name} archived.`, 'success', project)
    } catch (error) {
      notify(`Could not archive ${project.name}: ${errorMessage(error)}`, 'error')
    }
  }

  async function handleRestore(project: Project) {
    try {
      await restoreProject(project.id)
      setProjects((current) =>
        current.map((item) => item.id === project.id ? { ...item, archived: false } : item),
      )
      notify(`${project.name} restored.`)
    } catch (error) {
      notify(`Could not restore ${project.name}: ${errorMessage(error)}`, 'error')
    }
  }

  async function undoArchive(toast: ToastMessage) {
    setToasts((current) => current.filter((item) => item.id !== toast.id))
    if (toast.undoProject) await handleRestore(toast.undoProject)
  }

  const archivedToggle = permissions.canViewArchived && (
    <label className="archive-toggle">
      <input
        type="checkbox"
        checked={showArchived}
        onChange={(event) => setShowArchived(event.target.checked)}
      />
      <span className="toggle-track"><span /></span>
      <span>Show archived</span>
    </label>
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Aforium home">
          <span className="brand-mark">a</span>
          <span>aforium</span>
        </a>
        <div className="workspace-switcher">
          <span className="workspace-icon">A</span>
          <span className="workspace-copy">
            <strong>Workspace</strong>
            <small>Projects</small>
          </span>
        </div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Workspace navigation">
          <a className="nav-item" href="#projects"><FolderKanban size={18} /> Projects</a>
        </nav>
      </aside>

      <main className="main-content" id="projects">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>Projects</strong></div>
          <div className="topbar-right">
            <span className="today-label">Workspace projects</span>
          </div>
        </header>

        <section className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">YOUR WORKSPACE</p>
              <h1>Projects</h1>
              <p className="page-subtitle">A shared space to organize work and move it forward.</p>
            </div>
            {permissions.canCreate && (
              <button className="button button-primary create-button" onClick={() => setDialogProject(null)}>
                <Plus size={18} /> Create project
              </button>
            )}
          </div>

          <div className="projects-toolbar">
            <div className="result-count">
              {loading
                ? 'Loading projects…'
                : pageError
                  ? 'Project count unavailable'
                  : `${visibleProjects.length} ${visibleProjects.length === 1 ? 'project' : 'projects'}`}
            </div>
            <div className="toolbar-controls">
              {archivedToggle}
              <label className="search-field">
                <Search size={16} />
                <input
                  type="search"
                  placeholder="Search projects"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search projects"
                />
                {search && (
                  <button type="button" aria-label="Clear search" onClick={() => setSearch('')}>
                    <X size={14} />
                  </button>
                )}
              </label>
            </div>
          </div>

          {pageError && (
            <div className="page-alert" role="alert">
              <div><strong>We couldn’t load your workspace.</strong><p>{pageError}</p></div>
              <button className="button button-quiet" type="button" onClick={() => void loadWorkspace()} disabled={loading}>
                {loading ? 'Retrying…' : 'Retry'}
              </button>
            </div>
          )}

          {loading && !pageError && (
            <div className="loading-state" role="status">
              <span className="large-spinner" />
              <strong>Loading your projects</strong>
              <span>Connecting to your workspace…</span>
            </div>
          )}

          {!loading && !pageError && visibleProjects.length > 0 && (
            <div className="project-grid">
              {visibleProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  canEdit={permissions.canEdit}
                  canArchive={permissions.canArchive}
                  onEdit={setDialogProject}
                  onArchive={(selected) => void handleArchive(selected)}
                />
              ))}
            </div>
          )}

          {!loading && !pageError && visibleProjects.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon"><Archive size={23} /></span>
              <h2>{showArchived ? 'No archived projects' : search ? 'No matching projects' : 'No projects yet'}</h2>
              <p>
                {showArchived
                  ? 'Archived projects will appear here.'
                  : search
                    ? 'Try another search term.'
                    : 'Create a project to give your team a place to plan and collaborate.'}
              </p>
              {!showArchived && !search && permissions.canCreate && (
                <button className="button button-primary" onClick={() => setDialogProject(null)}>
                  <Plus size={17} /> Create your first project
                </button>
              )}
            </div>
          )}

          {!loading && !pageError && (
            <div className="page-footnote">
              <span><Check size={14} /> Everything in one place</span>
              <span>{showArchived ? 'Archived projects' : 'Active workspace projects'}</span>
            </div>
          )}
        </section>
      </main>

      {dialogProject !== undefined && (
        <ProjectDialog
          project={dialogProject}
          members={members}
          onClose={() => setDialogProject(undefined)}
          onSubmit={saveProject}
        />
      )}

      <div className="toast-region" aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <div className={`toast toast-${toast.kind}`} key={toast.id} role={toast.kind === 'error' ? 'alert' : 'status'}>
            <span className="toast-icon">{toast.kind === 'success' ? <Check size={16} /> : <CircleHelp size={16} />}</span>
            <span>{toast.message}</span>
            {toast.undoProject && (
              <button type="button" className="toast-action" onClick={() => void undoArchive(toast)}>
                <RotateCcw size={14} /> Undo
              </button>
            )}
            <button
              type="button"
              className="toast-close"
              aria-label="Dismiss notification"
              onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
