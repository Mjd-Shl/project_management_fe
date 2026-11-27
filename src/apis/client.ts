import type { paths, components } from './schema'

export type ErrorPayload = components['schemas']['ApiError']
export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: ErrorPayload['details']
  constructor(status: number, payload: ErrorPayload) {
    super(payload.message)
    this.name = 'ApiError'
    this.status = status
    this.code = payload.code
    this.details = payload.details
  }
}
type Method<P extends keyof paths> = Extract<keyof paths[P], 'get' | 'post' | 'put' | 'patch' | 'delete'>
type Operation<P extends keyof paths, M extends Method<P>> = paths[P][M]
type Body<O> = O extends { requestBody: { content: { 'application/json': infer B } } } ? B : never
type PathParams<O> = O extends { parameters: { path: infer P } } ? { params: P } : { params?: never }
type Options<O> = PathParams<O> & ( [Body<O>] extends [never] ? { body?: never } : { body: Body<O> }) & { signal?: AbortSignal }
type Result<O> = O extends { responses: infer R } ? { [S in keyof R]: S extends 200 | 201 | 204 ? R[S] extends { content: { 'application/json': infer D } } ? D : void : never }[keyof R] : never

export function createApiClient(config: { baseUrl?: string; fetch?: typeof fetch; onSignOut?: () => void } = {}) {
  let accessToken: string | null = null
  let refreshPromise: Promise<void> | undefined
  const transport = config.fetch ?? globalThis.fetch.bind(globalThis)
  const url = (path: string) => `${(config.baseUrl ?? '').replace(/\/$/, '')}${path}`
  function signOut() {
    accessToken = null
    config.onSignOut?.()
  }
  async function read(response: Response): Promise<unknown> {
    const text = await response.text()
    let value: unknown
    try { value = text ? JSON.parse(text) : undefined } catch { value = undefined }
    if (!response.ok) {
      const error = value as Partial<ErrorPayload> | undefined
      throw new ApiError(response.status, {
        code: typeof error?.code === 'string' ? error.code : 'HTTP_ERROR',
        message: typeof error?.message === 'string' ? error.message : `Request failed (${response.status}).`,
        details: error?.details,
      })
    }
    if (text && value === undefined) throw new ApiError(response.status, { code: 'INVALID_RESPONSE', message: 'The API returned invalid JSON.' })
    return value
  }
  async function refresh() {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const response = await transport(url('/api/v1/auth/refresh'), { method: 'POST', credentials: 'include', headers: { Accept: 'application/json' } })
          const session = await read(response) as components['schemas']['Session']
          if (!session?.accessToken) throw new ApiError(401, { code: 'INVALID_SESSION', message: 'Please sign in again.' })
          accessToken = session.accessToken
        } catch (error) { signOut(); throw error }
      })().finally(() => { refreshPromise = undefined })
    }
    return refreshPromise
  }
  return {
    setAccessToken(token: string | null) { accessToken = token },
    signOut,
    async request<P extends keyof paths, M extends Method<P>>(path: P, method: M, options: Options<Operation<P, M>>): Promise<Result<Operation<P, M>>> {
      let endpoint: string = path
      for (const [key, value] of Object.entries(options.params ?? {})) endpoint = endpoint.replace(`{${key}}`, encodeURIComponent(String(value)))
      const send = () => transport(url(endpoint), {
        method: method.toUpperCase(), credentials: 'include', signal: options.signal,
        headers: { Accept: 'application/json', ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
      })
      let response = await send()
      if (response.status === 401 && !path.startsWith('/api/v1/auth/')) {
        await refresh()
        response = await send()
        if (response.status === 401) signOut()
      }
      return await read(response) as Result<Operation<P, M>>
    },
  }
}
