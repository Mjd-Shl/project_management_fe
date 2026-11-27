import type { components } from '../schema'
type S = components['schemas']
export function createSeed() {
  const members: S['Member'][] = [
    { id: 'ali', name: 'Ali Hammoud', avatarUrl: null },
    { id: 'maya', name: 'Maya Khoury', avatarUrl: null },
    { id: 'omar', name: 'Omar Haddad', avatarUrl: null },
  ]
  const projects: S['Project'][] = [{ id: 'website-redesign', name: 'Website redesign', key: 'WEB', color: '#6965db', description: 'Redesign Atlas Studio’s portfolio and improve the client enquiry experience.', openTaskCount: 9, progress: 25, members, archived: false }]
  const columns: S['Column'][] = ['Backlog', 'In progress', 'Review', 'Done'].map((name, position) => ({ id: `column-${position}`, projectId: projects[0].id, name, position }))
  const tasks: S['Task'][] = ['Audit existing pages', 'Interview clients', 'Map navigation', 'Design homepage', 'Build design tokens', 'Create project gallery', 'Write studio story', 'Build enquiry form', 'Check accessibility', 'Review mobile layouts', 'Optimize images', 'Launch website'].map((title, i) => ({ id: `task-${i + 1}`, projectId: projects[0].id, title, description: `${title} for the Atlas Studio website launch.`, columnId: columns[Math.floor(i / 3)].id, assigneeId: members[i % 3].id, dueDate: `2026-12-${String(i + 1).padStart(2, '0')}` }))
  return {
    workspace: { id: 'atlas-studio', name: 'Atlas Studio' } satisfies S['Workspace'], members, projects, columns, tasks,
    budgets: [{ id: 'budget-1', projectId: projects[0].id, amount: 15000, currency: 'USD' }] as S['Budget'][],
    expenses: [{ id: 'expense-1', projectId: projects[0].id, description: 'User research incentives', amount: 450, date: '2026-11-25' }, { id: 'expense-2', projectId: projects[0].id, description: 'Font license', amount: 120, date: '2026-11-26' }] as S['Expense'][],
  }
}
