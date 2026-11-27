import { http, HttpResponse } from 'msw'
import { createSeed } from './data'

let db = createSeed()
let signedIn = true
export function resetMocks() { db = createSeed(); signedIn = true }
const error = (status: number, message: string) => HttpResponse.json({ code: `MOCK_${status}`, message }, { status })
const permissions = { canCreate: true, canEdit: true, canArchive: true, canViewArchived: true }
// The contract drives registration, so adding an endpoint without implementation fails loudly.
export const createHandlers = (paths: Record<string, Record<string, unknown>>) => Object.entries(paths).flatMap(([path, methods]) => Object.keys(methods).map((method) =>
  http[method as 'get' | 'post' | 'patch' | 'put' | 'delete'](`*${path.replace(/\{(\w+)\}/g, ':$1')}`, async ({ request, params }) => {
    const forced = request.headers.get('X-Mock-Error')
    if (forced && [400, 401, 403, 404, 409, 500].includes(Number(forced))) return error(Number(forced), 'Requested mock error')
    const endpoint = new URL(request.url).pathname
    if (endpoint.endsWith('/auth/logout')) { signedIn = false; return new HttpResponse(null, { status: 204 }) }
    if (endpoint.endsWith('/auth/login')) {
      const body = await request.json() as { email?: string; password?: string }
      if (!body.email || !body.password) return error(400, 'Email and password are required')
      signedIn = true
      return HttpResponse.json({ accessToken: 'atlas-access-token', user: db.members[0] })
    }
    if (!signedIn || request.headers.get('Authorization') === 'Bearer expired') return error(401, 'Session expired')
    if (endpoint.endsWith('/auth/refresh')) return HttpResponse.json({ accessToken: 'atlas-access-token', user: db.members[0] })
    if (endpoint.endsWith('/auth/me')) return HttpResponse.json(db.members[0])
    if (params.workspaceId && params.workspaceId !== db.workspace.id) return error(404, 'Workspace not found')
    if (endpoint.endsWith('/workspaces')) return HttpResponse.json([db.workspace])
    if (path === '/api/v1/workspaces/{workspaceId}') return HttpResponse.json(db.workspace)
    if (endpoint.endsWith('/members')) return HttpResponse.json({ members: db.members })
    const project = params.projectId ? db.projects.find(p => p.id === params.projectId) : undefined
    if (params.projectId && !project) return error(404, 'Project not found')
    if (endpoint.endsWith('/projects') && method === 'get') return HttpResponse.json({ projects: db.projects, permissions })
    if (endpoint.endsWith('/archive') || endpoint.endsWith('/restore')) {
      project!.archived = endpoint.endsWith('/archive')
      return new HttpResponse(null, { status: 204 })
    }
    if (path === '/api/v1/projects/{projectId}' && method === 'get') return HttpResponse.json(project)
    let body: Record<string, unknown> = {}
    if (['post', 'patch', 'put'].includes(method)) {
      try { body = await request.json() as Record<string, unknown> } catch { return error(400, 'A JSON body is required') }
      if (!body || typeof body !== 'object' || Array.isArray(body)) return error(400, 'Expected a JSON object')
    }
    if (path.endsWith('/projects') || path === '/api/v1/projects/{projectId}') {
      if (typeof body.name !== 'string' || !body.name.trim() || typeof body.key !== 'string' || !body.key.trim() || typeof body.color !== 'string' || typeof body.description !== 'string' || !Array.isArray(body.memberIds) || body.memberIds.some(id => !db.members.some(m => m.id === id))) return error(400, 'Provide valid project details and members')
      if (db.projects.some(p => p.key === body.key && p.id !== project?.id)) return error(409, 'Project key already exists')
      const values = { name: body.name, key: body.key, color: body.color, description: body.description, members: db.members.filter(m => (body.memberIds as string[]).includes(m.id)) }
      if (project) { Object.assign(project, values); return HttpResponse.json(project) }
      const created = { ...values, id: crypto.randomUUID(), openTaskCount: 0, progress: 0, archived: false }
      db.projects.push(created)
      return HttpResponse.json(created)
    }
    const kind = path.includes('/budget') ? 'budgets' : path.includes('/expenses') ? 'expenses' : path.includes('/columns') ? 'columns' : path.includes('/tasks') ? 'tasks' : undefined
    if (!kind) return error(500, `Missing implementation: ${method} ${path}`)
    const collection = db[kind] as unknown as Record<string, unknown>[]
    const item = collection.find(item => params.itemId ? item.id === params.itemId : item.projectId === params.projectId)
    if (params.itemId && !item) return error(404, 'Item not found')
    if (method === 'get') return kind === 'budgets' ? item ? HttpResponse.json(item) : error(404, 'Budget not found') : HttpResponse.json(collection.filter(item => item.projectId === params.projectId))
    if (method === 'delete') { collection.splice(collection.indexOf(item!), 1); return new HttpResponse(null, { status: 204 }) }
    const required = kind === 'budgets' ? ['amount', 'currency'] : kind === 'expenses' ? ['description', 'amount', 'date'] : kind === 'columns' ? ['name', 'position'] : ['title', 'description', 'columnId', 'assigneeId', 'dueDate']
    if (required.some(key => !(key in body))) return error(400, 'Required fields are missing')
    for (const key of required) {
      const value = body[key]
      if (['amount', 'position'].includes(key) ? typeof value !== 'number' || !Number.isFinite(value) || value < 0 : ['assigneeId', 'dueDate'].includes(key) ? value !== null && typeof value !== 'string' : typeof value !== 'string') return error(400, `Invalid ${key}`)
    }
    const projectId = params.projectId ?? item?.projectId
    if (kind === 'tasks' && (!db.columns.some(c => c.id === body.columnId && c.projectId === projectId) || (body.assigneeId !== null && !db.members.some(m => m.id === body.assigneeId)))) return error(400, 'Invalid column or assignee')
    const values = Object.fromEntries(required.map(key => [key, body[key]]))
    if (method === 'patch' || (method === 'put' && item)) { Object.assign(item!, values); return HttpResponse.json(item) }
    const created = { ...values, id: crypto.randomUUID(), projectId }
    collection.push(created)
    return HttpResponse.json(created)
  }),
))
