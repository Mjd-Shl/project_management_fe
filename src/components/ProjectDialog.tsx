import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { Project, ProjectValues, WorkspaceMember } from '../types'
import { ProjectForm } from './ProjectForm'

type ProjectDialogProps = {
  project: Project | null
  members: WorkspaceMember[]
  onClose: () => void
  onSubmit: (values: ProjectValues) => Promise<void>
}

export function ProjectDialog({ project, members, onClose, onSubmit }: ProjectDialogProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-10 grid place-items-center overflow-y-auto bg-slate-950/45 p-6 backdrop-blur-sm max-sm:items-end max-sm:p-0"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="max-h-[min(90vh,790px)] w-full max-w-[550px] overflow-y-auto rounded-2xl border border-white/60 bg-white shadow-2xl max-sm:max-h-[93vh] max-sm:rounded-b-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
      >
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5 max-sm:px-5">
          <div>
            <p className="mb-1.5 text-[9px] font-bold tracking-[0.12em] text-slate-400">{project ? 'PROJECT SETTINGS' : 'NEW WORKSPACE PROJECT'}</p>
            <h2 className="m-0 text-xl font-bold tracking-tight text-slate-800" id="project-dialog-title">{project ? 'Edit project' : 'Create a project'}</h2>
          </div>
          <button className="-mr-1 -mt-1 grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-500" type="button" onClick={onClose} aria-label="Close dialog">
            <X size={19} />
          </button>
        </header>
        <ProjectForm
          key={project?.id ?? 'new'}
          project={project}
          members={members}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </section>
    </div>
  )
}
