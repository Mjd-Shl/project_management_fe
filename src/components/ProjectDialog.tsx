import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { Project, ProjectValues, WorkspaceMember } from '../types/apiTypes'
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
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
      >
        <header className="dialog-header">
          <div>
            <p className="eyebrow">{project ? 'PROJECT SETTINGS' : 'NEW WORKSPACE PROJECT'}</p>
            <h2 id="project-dialog-title">{project ? 'Edit project' : 'Create a project'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog">
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
