import { createApiClient } from './client'
export const api = createApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  onSignOut: () => window.dispatchEvent(new Event('auth:signout')),
})
export const workspaceId = 'atlas-studio'
