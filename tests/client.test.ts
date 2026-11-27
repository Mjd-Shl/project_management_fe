import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createApiClient, ApiError } from '../src/apis/client'
const projects = '/api/v1/workspaces/{workspaceId}/projects'
const options = { params: { workspaceId: 'atlas-studio' } }
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status })

test('adds token, refreshes once, and retries with the new token', async () => {
  const calls: { path: string; token: string | null }[] = []
  const api = createApiClient({ fetch: async (input, init) => {
    calls.push({ path: String(input), token: new Headers(init?.headers).get('Authorization') })
    if (String(input).endsWith('/refresh')) return json({ accessToken: 'new-token' })
    return calls.length === 1 ? json({ code: 'EXPIRED', message: 'Expired' }, 401) : json({ projects: [], permissions: {} })
  } })
  api.setAccessToken('old-token')
  await api.request(projects, 'get', options)
  assert.equal(calls.length, 3)
  assert.equal(calls[0].token, 'Bearer old-token')
  assert.equal(calls[2].token, 'Bearer new-token')
})

test('second 401 clears token and signs out without another refresh', async () => {
  let refreshes = 0, signouts = 0
  const tokens: (string | null)[] = []
  const api = createApiClient({ onSignOut: () => signouts++, fetch: async (input, init) => {
    if (String(input).endsWith('/refresh')) { refreshes++; return json({ accessToken: 'new-token' }) }
    tokens.push(new Headers(init?.headers).get('Authorization'))
    return json({ code: 'UNAUTHORIZED', message: 'Sign in again' }, 401)
  } })
  api.setAccessToken('old')
  await assert.rejects(api.request(projects, 'get', options), (error: unknown) => error instanceof ApiError && error.status === 401 && error.code === 'UNAUTHORIZED')
  assert.equal(refreshes, 1)
  assert.equal(signouts, 1)
  await assert.rejects(api.request('/api/v1/auth/me', 'get', {}))
  assert.equal(tokens.at(-1), null)
})

test('failed refresh signs out and does not retry the original call', async () => {
  let calls = 0, signouts = 0
  const api = createApiClient({ onSignOut: () => signouts++, fetch: async () => { calls++; return json({ code: 'UNAUTHORIZED', message: 'Expired' }, 401) } })
  await assert.rejects(api.request(projects, 'get', options), ApiError)
  assert.equal(calls, 2)
  assert.equal(signouts, 1)
})

test('concurrent unauthorized requests share one refresh', async () => {
  let refreshes = 0
  const api = createApiClient({ fetch: async (input, init) => {
    if (String(input).endsWith('/refresh')) { refreshes++; await new Promise(resolve => setTimeout(resolve, 10)); return json({ accessToken: 'new' }) }
    return new Headers(init?.headers).get('Authorization') === 'Bearer new' ? json({ projects: [], permissions: {} }) : json({}, 401)
  } })
  await Promise.all([api.request(projects, 'get', options), api.request(projects, 'get', options)])
  assert.equal(refreshes, 1)
})

test('preserves typed server errors and tolerates non-JSON error bodies', async () => {
  const api = createApiClient({ fetch: async () => json({ code: 'VALIDATION', message: 'Invalid budget', details: { amount: 'positive required' } }, 400) })
  await assert.rejects(api.request(projects, 'get', options), (e: unknown) => e instanceof ApiError && e.code === 'VALIDATION' && e.details?.amount === 'positive required')
  const htmlApi = createApiClient({ fetch: async () => new Response('<html>Bad gateway</html>', { status: 502 }) })
  await assert.rejects(htmlApi.request(projects, 'get', options), (e: unknown) => e instanceof ApiError && e.status === 502)
})
