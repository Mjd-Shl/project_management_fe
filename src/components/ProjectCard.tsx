import { Archive, ArrowUpRight, Pencil, RotateCcw } from 'lucide-react'
import type { Project } from '../types'
import { MemberAvatar } from './MemberAvatar'

type ProjectCardProps = {
  project: Project
  canEdit: boolean
  canArchive: boolean
  isBusy: boolean
  onEdit: (project: Project) => void
  onArchive: (project: Project) => void
  onRestore: (project: Project) => void
}

export function ProjectCard({
  project,
  canEdit,
  canArchive,
  isBusy,
  onEdit,
  onArchive,
  onRestore,
}: ProjectCardProps) {
  const progress = Math.round(project.progress)

  return (
    <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg">
      <div className="flex items-center gap-2">
        <span
          className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px] text-sm font-bold text-white"
          style={{ backgroundColor: project.color }}
          aria-hidden="true"
        >
          {project.name.trim().slice(0, 1).toUpperCase()}
        </span>
        <span className="text-[10px] font-bold tracking-widest text-slate-400">{project.key}</span>
        {(canEdit || canArchive) && !project.archived && (
          <div className="ml-auto flex gap-1">
            {canEdit && (
              <button
                type="button"
                className="grid h-[30px] w-[30px] place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-500 disabled:opacity-50"
                aria-label={`Edit ${project.name}`}
                title="Edit project"
                onClick={() => onEdit(project)}
              >
                <Pencil size={16} />
              </button>
            )}
            {canArchive && (
              <button
                type="button"
                className="grid h-[30px] w-[30px] place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-500 disabled:cursor-wait disabled:opacity-50"
                aria-label={`Archive ${project.name}`}
                title="Archive project"
                disabled={isBusy}
                onClick={() => onArchive(project)}
              >
                <Archive size={16} />
              </button>
            )}
          </div>
        )}
        {canArchive && project.archived && (
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-violet-700 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-violet-500 disabled:cursor-wait disabled:opacity-50"
            aria-label={`Restore ${project.name}`}
            disabled={isBusy}
            onClick={() => onRestore(project)}
          >
            <RotateCcw size={14} /> Restore
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <h3 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-bold tracking-tight text-slate-800">{project.name}</h3>
        <ArrowUpRight size={17} className="shrink-0 text-slate-300" aria-hidden="true" />
      </div>
      <p className="mb-0 mt-2 line-clamp-2 min-h-[37px] text-xs leading-relaxed text-slate-500">
        {project.description}
      </p>

      <div className="mt-4">
        <div className="mb-2 flex justify-between text-[11px] text-slate-500">
          <span>Project progress</span>
          <strong className="text-slate-700">{progress}%</strong>
        </div>
        <div
          className="h-[5px] overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-label={`${project.name} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span className="block h-full rounded-full transition-[width]" style={{ width: `${project.progress}%`, backgroundColor: project.color }} />
        </div>
        <span className="mt-2 block text-[11px] text-slate-400">
          {project.openTaskCount} open {project.openTaskCount === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <footer className="mt-3 flex min-h-9 items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center pl-0.5" aria-label={`${project.members.length} project members`}>
          {project.members.slice(0, 4).map((member) => (
            <span className="-ml-1 inline-flex rounded-full border-2 border-white first:ml-0" key={member.id} title={member.name}>
              <MemberAvatar member={member} size="small" />
            </span>
          ))}
          {project.members.length > 4 && (
            <span className="-ml-1 inline-grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-slate-100 text-[8px] font-semibold text-slate-600">
              +{project.members.length - 4}
            </span>
          )}
          {project.members.length === 0 && <span className="text-[11px] text-slate-400">No members</span>}
        </div>
        {project.archived && <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">Archived</span>}
      </footer>
    </article>
  )
}
