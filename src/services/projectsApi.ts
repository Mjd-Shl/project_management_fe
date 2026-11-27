import { api, workspaceId } from '../apis'
import type { ProjectUpdateValues, ProjectValues } from '../types/apiTypes'
export const fetchProjects = () => api.request('/api/v1/workspaces/{workspaceId}/projects', 'get', { params: { workspaceId } })
export const fetchWorkspaceMembers = async () => (await api.request('/api/v1/workspaces/{workspaceId}/members', 'get', { params: { workspaceId } })).members
export const createProject = (body: ProjectValues) => api.request('/api/v1/workspaces/{workspaceId}/projects', 'post', { params: { workspaceId }, body })
export const updateProject = (projectId: string, body: ProjectUpdateValues) => api.request('/api/v1/projects/{projectId}', 'patch', { params: { projectId }, body })
export const archiveProject = (projectId: string) => api.request('/api/v1/projects/{projectId}/archive', 'post', { params: { projectId } })
export const restoreProject = (projectId: string) => api.request('/api/v1/projects/{projectId}/restore', 'post', { params: { projectId } })
