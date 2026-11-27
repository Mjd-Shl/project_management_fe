import { Archive, ArrowUpRight, Pencil } from 'lucide-react'
import type { Project } from '../types/apiTypes'
import { MemberAvatar } from './ProjectForm'

type ProjectCardProps = {
  project: Project
  canEdit: boolean
  canArchive: boolean
  onEdit: (project: Project) => void
  onArchive: (project: Project) => void
}

export function ProjectCard({
  project,
  canEdit,
  canArchive,
  onEdit,
  onArchive,
}: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="card-topline">
        <span className="project-mark" style={{ backgroundColor: project.color }} aria-hidden="true">
          {project.name.trim().slice(0, 1).toUpperCase()}
        </span>
        <span className="project-key">{project.key}</span>
        {(canEdit || canArchive) && !project.archived && (
          <div className="card-actions">
            {canEdit && (
              <button
                type="button"
                className="icon-button"
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
                className="icon-button"
                aria-label={`Archive ${project.name}`}
                title="Archive project"
                onClick={() => onArchive(project)}
              >
                <Archive size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="card-title-row">
        <h3>{project.name}</h3>
        <ArrowUpRight size={17} className="card-arrow" aria-hidden="true" />
      </div>
      {project.description && <p className="project-description">{project.description}</p>}

      <div className="progress-block">
        <div className="progress-label">
          <span>Project progress</span>
          <strong>{Math.round(project.progress)}%</strong>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label={`${project.name} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(project.progress)}
        >
          <span style={{ width: `${project.progress}%`, backgroundColor: project.color }} />
        </div>
        <span className="open-tasks">{project.openTaskCount} open tasks</span>
      </div>

      <footer className="card-footer">
        <div className="avatar-stack" aria-label={`${project.members.length} project members`}>
          {project.members.slice(0, 4).map((member) => (
            <span key={member.id} title={member.name}>
              <MemberAvatar member={member} size="small" />
            </span>
          ))}
          {project.members.length > 4 && (
            <span className="avatar avatar-small avatar-overflow">
              +{project.members.length - 4}
            </span>
          )}
          {project.members.length === 0 && <span className="no-members">No members</span>}
        </div>
        {project.archived && <span className="archived-badge">Archived</span>}
      </footer>
    </article>
  )
}
