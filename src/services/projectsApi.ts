import type {
  Project,
  ProjectUpdateValues,
  ProjectValues,
  WorkspaceMember,
  WorkspacePermissions,
} from '../types'

type EndpointName =
  | 'projects list'
  | 'workspace members'
  | 'project creation'
  | 'project update'
  | 'project archive'
  | 'project restore'

type ApiConfiguration = {
  url: string | undefined
  method: string | undefined
}

type ProjectListResult = {
  projects: Project[]
  permissions: WorkspacePermissions
}

const endpointConfig: Record<EndpointName, ApiConfiguration> = {
  'projects list': {
    url: import.meta.env.VITE_PROJECTS_LIST_URL,
    method: import.meta.env.VITE_PROJECTS_LIST_METHOD,
  },
  'workspace members': {
    url: import.meta.env.VITE_WORKSPACE_MEMBERS_URL,
    method: import.meta.env.VITE_WORKSPACE_MEMBERS_METHOD,
  },
  'project creation': {
    url: import.meta.env.VITE_PROJECT_CREATE_URL,
    method: import.meta.env.VITE_PROJECT_CREATE_METHOD,
  },
  'project update': {
    url: import.meta.env.VITE_PROJECT_UPDATE_URL,
    method: import.meta.env.VITE_PROJECT_UPDATE_METHOD,
  },
  'project archive': {
    url: import.meta.env.VITE_PROJECT_ARCHIVE_URL,
    method: import.meta.env.VITE_PROJECT_ARCHIVE_METHOD,
  },
  'project restore': {
    url: import.meta.env.VITE_PROJECT_RESTORE_URL,
    method: import.meta.env.VITE_PROJECT_RESTORE_METHOD,
  },
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredString(record: Record<string, unknown>, key: string): string {
  const value = record[key]
  if (typeof value !== 'string') {
    throw new Error(`The API response is missing a valid "${key}" value.`)
  }
  return value
}

function parseMember(value: unknown): WorkspaceMember {
  if (!isRecord(value)) {
    throw new Error('The API returned an invalid workspace member.')
  }

  const avatarUrl = value.avatarUrl
  if (avatarUrl !== null && typeof avatarUrl !== 'string') {
    throw new Error('The API returned an invalid member avatar URL.')
  }

  return {
    id: requiredString(value, 'id'),
    name: requiredString(value, 'name'),
    avatarUrl,
  }
}

function parseProject(value: unknown): Project {
  if (!isRecord(value)) {
    throw new Error('The API returned an invalid project.')
  }

  const { openTaskCount, progress, archived, members } = value
  if (
    typeof openTaskCount !== 'number' ||
    !Number.isInteger(openTaskCount) ||
    openTaskCount < 0 ||
    typeof progress !== 'number' ||
    progress < 0 ||
    progress > 100 ||
    typeof archived !== 'boolean' ||
    !Array.isArray(members)
  ) {
    throw new Error('The API returned incomplete project details.')
  }

  return {
    id: requiredString(value, 'id'),
    name: requiredString(value, 'name'),
    key: requiredString(value, 'key'),
    color: requiredString(value, 'color'),
    description: requiredString(value, 'description'),
    openTaskCount,
    progress,
    archived,
    members: members.map(parseMember),
  }
}

function parsePermissions(value: unknown): WorkspacePermissions {
  if (!isRecord(value)) {
    throw new Error('The API response is missing workspace permissions.')
  }

  const canCreate = value.canCreate
  const canEdit = value.canEdit
  const canArchive = value.canArchive
  const canViewArchived = value.canViewArchived
  if (
    typeof canCreate !== 'boolean' ||
    typeof canEdit !== 'boolean' ||
    typeof canArchive !== 'boolean' ||
    typeof canViewArchived !== 'boolean'
  ) {
    throw new Error('The API response is missing one or more workspace permissions.')
  }

  return { canCreate, canEdit, canArchive, canViewArchived }
}

function configuredRequest(name: EndpointName, projectId?: string, body?: unknown) {
  const config = endpointConfig[name]
  if (!config.url || !config.method) {
    throw new Error(
      `The ${name} API is not configured. Set its URL and HTTP method in the environment.`,
    )
  }

  let endpoint = config.url
  if (projectId) {
    if (!endpoint.includes('{projectId}')) {
      throw new Error(`The ${name} URL must include the {projectId} placeholder.`)
    }
    endpoint = endpoint.replace('{projectId}', encodeURIComponent(projectId))
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const url = baseUrl ? new URL(endpoint, baseUrl).toString() : endpoint
  const method = config.method.toUpperCase()
  const headers = new Headers({ Accept: 'application/json' })
  const request: RequestInit = {
    method,
    credentials: 'include',
    headers,
  }

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
    request.body = JSON.stringify(body)
  }
  return fetch(url, request)
}

async function readResponse(response: Response): Promise<unknown> {
  const text = await response.text()
  let payload: unknown = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      if (response.ok) {
        throw new Error('The API returned a response that was not valid JSON.')
      }
      payload = text
    }
  }

  if (!response.ok) {
    const message = isRecord(payload) && typeof payload.message === 'string'
      ? payload.message
      : typeof payload === 'string' && payload.trim()
        ? payload
        : `Request failed with status ${response.status}.`
    throw new Error(message)
  }
  return payload
}

export async function fetchProjects(): Promise<ProjectListResult> {
  const payload = await readResponse(await configuredRequest('projects list'))
  if (!isRecord(payload) || !Array.isArray(payload.projects)) {
    throw new Error('The projects API must return a projects array and permissions.')
  }
  return {
    projects: payload.projects.map(parseProject),
    permissions: parsePermissions(payload.permissions),
  }
}

export async function fetchWorkspaceMembers(): Promise<WorkspaceMember[]> {
  const payload = await readResponse(await configuredRequest('workspace members'))
  if (!isRecord(payload) || !Array.isArray(payload.members)) {
    throw new Error('The members API must return a members array.')
  }
  return payload.members.map(parseMember)
}

export async function createProject(values: ProjectValues): Promise<Project> {
  const payload = await readResponse(
    await configuredRequest('project creation', undefined, values),
  )
  return parseProject(payload)
}

export async function updateProject(
  projectId: string,
  values: ProjectUpdateValues,
): Promise<Project> {
  const payload = await readResponse(
    await configuredRequest('project update', projectId, values),
  )
  return parseProject(payload)
}

export async function archiveProject(projectId: string): Promise<void> {
  await readResponse(await configuredRequest('project archive', projectId))
}

export async function restoreProject(projectId: string): Promise<void> {
  await readResponse(await configuredRequest('project restore', projectId))
}
