import { createApiClient } from './client'
// Compile-time assertions: these must remain errors after regenerating the contract.
function contractChecks() {
  const api = createApiClient()
  // @ts-expect-error An endpoint outside the contract cannot be called.
  void api.request('/api/v1/unknown', 'get', {})
  // @ts-expect-error Required path parameters cannot be omitted.
  void api.request('/api/v1/projects/{projectId}', 'get', {})
  // @ts-expect-error A budget amount must be a number.
  void api.request('/api/v1/projects/{projectId}/budget', 'put', { params: { projectId: 'website-redesign' }, body: { amount: 'wrong', currency: 'USD' } })
  // @ts-expect-error Project collections do not accept DELETE.
  void api.request('/api/v1/workspaces/{workspaceId}/projects', 'delete', { params: { workspaceId: 'atlas-studio' } })
}
void contractChecks
