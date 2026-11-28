import { useState } from 'react'
import {
  Archive,
  Check,
  FolderKanban,
  Plus,
  Search,
  X,
} from 'lucide-react'
import { ProjectCard } from './components/ProjectCard'
import { ProjectDialog } from './components/ProjectDialog'
import { ToastRegion } from './components/ToastRegion'
import { useProjects } from './hooks/useProjects'
import type { Project } from './types'

export default function App() {
  const {
    archive,
    busyProjectIds,
    dismissToast,
    loadWorkspace,
    loading,
    members,
    pageError,
    permissions,
    restore,
    saveProject,
    search,
    setSearch,
    setShowArchived,
    showArchived,
    toasts,
    undoArchive,
    visibleProjects,
  } = useProjects()
  const [dialogProject, setDialogProject] = useState<Project | null | undefined>()

  async function handleSave(values: Parameters<typeof saveProject>[1]) {
    await saveProject(dialogProject ?? null, values)
    setDialogProject(undefined)
  }

  const heading = showArchived ? 'Archived projects' : 'Projects'
  const emptyTitle = showArchived
    ? 'No archived projects'
    : search
      ? 'No matching projects'
      : 'No projects yet'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">
      <aside className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:fixed md:inset-y-0 md:left-0 md:h-screen md:w-60 md:flex-col md:items-stretch md:justify-start md:border-b-0 md:border-r md:px-4 md:py-6">
        <a className="inline-flex items-center gap-2.5 font-extrabold tracking-tight text-slate-800 md:mb-8 md:ml-1" href="#projects" aria-label="Aforium home">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-600 text-lg leading-none text-white">a</span>
          <span>aforium</span>
        </a>
        <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-2 md:min-h-14">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-100 font-bold text-violet-700">A</span>
          <span className="grid gap-0.5">
            <strong className="text-xs">Workspace</strong>
            <small className="text-[11px] text-slate-500">Projects</small>
          </span>
        </div>
        <nav className="flex items-center md:mt-8 md:block" aria-label="Workspace navigation">
          <p className="mb-2 ml-2 hidden text-[10px] font-bold tracking-widest text-slate-400 md:block">WORKSPACE</p>
          <a className="inline-flex min-h-10 items-center gap-3 rounded-lg bg-violet-50 px-3 text-sm font-semibold text-violet-700" href="#projects">
            <FolderKanban size={18} /> Projects
          </a>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 md:ml-60" id="projects">
        <header className="flex h-[58px] items-center justify-between border-b border-slate-200 bg-white/80 px-5 md:h-[68px] md:px-11">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Workspace</span><span className="text-slate-300">/</span><strong className="font-semibold text-slate-700">{heading}</strong>
          </div>
          <span className="hidden text-[11px] text-slate-400 sm:inline">Workspace projects</span>
        </header>

        <section className="mx-auto max-w-[1320px] px-5 pb-8 pt-9 sm:px-8 md:px-11 md:pt-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-bold tracking-[0.12em] text-slate-400">YOUR WORKSPACE</p>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{heading}</h1>
              <p className="m-0 text-sm text-slate-500">A shared space to organize work and move it forward.</p>
            </div>
            {permissions.canCreate && !showArchived && (
              <button
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                onClick={() => setDialogProject(null)}
              >
                <Plus size={18} /> Create project
              </button>
            )}
          </div>

          <div className="mt-8 flex min-h-16 flex-col justify-between gap-3 border-b border-slate-200 py-3 sm:flex-row sm:items-center sm:py-0">
            <div className="text-xs font-semibold text-slate-500">
              {loading ? 'Loading projects…' : pageError ? 'Project count unavailable' : `${visibleProjects.length} ${visibleProjects.length === 1 ? 'project' : 'projects'}`}
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-5">
              {permissions.canViewArchived && (
                <label className="inline-flex cursor-pointer select-none items-center gap-2 text-xs text-slate-600">
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={showArchived}
                    onChange={(event) => setShowArchived(event.target.checked)}
                  />
                  <span className="relative h-[18px] w-8 rounded-full bg-slate-300 transition peer-checked:bg-violet-600 after:absolute after:left-0.5 after:top-0.5 after:h-3.5 after:w-3.5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-3.5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet-600" aria-hidden="true" />
                  Show archived
                </label>
              )}
              <label className="flex h-9 w-[min(210px,58vw)] items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-slate-400 focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100">
                <Search size={16} />
                <input
                  className="w-full border-0 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
                  type="search"
                  placeholder="Search projects"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search projects"
                />
                {search && (
                  <button type="button" className="grid place-items-center text-slate-500 hover:text-slate-900" aria-label="Clear search" onClick={() => setSearch('')}>
                    <X size={14} />
                  </button>
                )}
              </label>
            </div>
          </div>

          {pageError && (
            <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900" role="alert">
              <div>
                <strong className="block text-sm">We couldn’t load your workspace.</strong>
                <p className="mb-0 mt-1 text-xs leading-relaxed text-red-800">{pageError}</p>
              </div>
              <button className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60" type="button" onClick={() => void loadWorkspace()} disabled={loading}>
                {loading ? 'Retrying…' : 'Retry'}
              </button>
            </div>
          )}

          {loading && !pageError && (
            <div className="flex min-h-[335px] flex-col items-center justify-center gap-2.5 text-center text-xs text-slate-500" role="status">
              <span className="mb-1 h-7 w-7 animate-spin rounded-full border-2 border-violet-100 border-t-violet-600" />
              <strong className="text-sm text-slate-700">Loading your projects</strong>
              <span>Connecting to your workspace…</span>
            </div>
          )}

          {!loading && !pageError && visibleProjects.length > 0 && (
            <div className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  canEdit={permissions.canEdit}
                  canArchive={permissions.canArchive}
                  isBusy={busyProjectIds.has(project.id)}
                  onEdit={setDialogProject}
                  onArchive={(selected) => void archive(selected)}
                  onRestore={(selected) => void restore(selected)}
                />
              ))}
            </div>
          )}

          {!loading && !pageError && visibleProjects.length === 0 && (
            <div className="flex min-h-[365px] flex-col items-center justify-center px-5 py-10 text-center">
              <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600"><Archive size={23} /></span>
              <h2 className="mb-2 text-lg font-semibold tracking-tight text-slate-800">{emptyTitle}</h2>
              <p className="mb-5 max-w-[340px] text-xs leading-relaxed text-slate-500">
                {showArchived
                  ? 'Archived projects will appear here.'
                  : search
                    ? 'Try another search term.'
                    : 'Create a project to give your team a place to plan and collaborate.'}
              </p>
              {!showArchived && !search && permissions.canCreate && (
                <button className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600" onClick={() => setDialogProject(null)}>
                  <Plus size={17} /> Create your first project
                </button>
              )}
            </div>
          )}

          {!loading && !pageError && (
            <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-4 text-[11px] text-slate-400 sm:flex-row sm:justify-between">
              <span className="inline-flex items-center gap-1.5 text-slate-500"><Check size={14} className="text-emerald-600" /> Everything in one place</span>
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
          onSubmit={handleSave}
        />
      )}

      <ToastRegion toasts={toasts} onDismiss={dismissToast} onUndo={(toast) => void undoArchive(toast)} />
    </div>
  )
}
