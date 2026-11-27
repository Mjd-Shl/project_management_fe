import { test, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { setupServer } from 'msw/node'
import { createHandlers, resetMocks } from '../src/apis/mocks/createHandlers'
const contract = JSON.parse(readFileSync(new URL('../openapi.yaml', import.meta.url), 'utf8'))
const server = setupServer(...createHandlers(contract.paths))
const base = 'http://localhost'
before(() => server.listen({ onUnhandledFrame: 'error' }))
after(() => server.close())
beforeEach(() => resetMocks())
const replace = (path: string) => path.replace('{workspaceId}', 'atlas-studio').replace('{projectId}', 'website-redesign').replace('{itemId}', path.includes('columns') ? 'column-0' : path.includes('tasks') ? 'task-1' : 'expense-1')
const bodyFor = (operation: any) => {
  const name = operation.requestBody?.content['application/json'].schema.$ref.split('/').at(-1)
  return ({ Credentials: { email: 'ali@atlas.studio', password: 'demo' }, ProjectInput: { name: 'Client portal', key: 'PORTAL', color: '#6965db', description: 'Client hub', memberIds: ['ali'] }, ColumnInput: { name: 'QA', position: 4 }, TaskInput: { title: 'Review launch', description: 'Review', columnId: 'column-0', assigneeId: 'ali', dueDate: null }, BudgetInput: { amount: 20000, currency: 'USD' }, ExpenseInput: { description: 'Hosting', amount: 100, date: '2026-12-01' } } as Record<string, unknown>)[name]
}
for (const [path, methods] of Object.entries(contract.paths) as [string, Record<string, any>][]) {
  for (const [method, operation] of Object.entries(methods)) {
    test(`${method.toUpperCase()} ${path}: success and error`, async () => {
      const body = bodyFor(operation)
      const response = await fetch(base + replace(path), { method: method.toUpperCase(), headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })
      assert.equal(response.ok, true, await response.text())
      const failure = await fetch(base + replace(path), { method: method.toUpperCase(), headers: { 'X-Mock-Error': '500' }, body: body ? JSON.stringify(body) : undefined })
      assert.equal(failure.status, 500)
      assert.equal((await failure.json()).code, 'MOCK_500')
    })
  }
}
test('project mutations persist in memory and reset restores the seed', async () => {
  const url = base + '/api/v1/projects/website-redesign/archive'
  assert.equal((await fetch(url, { method: 'POST' })).status, 204)
  const projectUrl = base + '/api/v1/projects/website-redesign'
  assert.equal((await (await fetch(projectUrl)).json()).archived, true)
  resetMocks()
  assert.equal((await (await fetch(projectUrl)).json()).archived, false)
})
test('unknown projects and invalid expenses return typed errors', async () => {
  assert.equal((await fetch(base + '/api/v1/projects/missing')).status, 404)
  assert.equal((await fetch(base + '/api/v1/projects/website-redesign/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: -1, description: 'Bad', date: '2026-12-01' }) })).status, 400)
})
