import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, suggestProjectKey, type ProjectFormValues } from '../projectSchema'
import type { Project, ProjectValues, WorkspaceMember } from '../types'

type ProjectFormProps = {
  project: Project | null
  members: WorkspaceMember[]
  onSubmit: (values: ProjectValues) => Promise<void>
  onCancel: () => void
}

const defaultValues: ProjectFormValues = {
  name: '',
  key: '',
  color: '#6965db',
  description: '',
  memberIds: [],
}

export function ProjectForm({ project, members, onSubmit, onCancel }: ProjectFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          name: project.name,
          key: project.key,
          color: project.color,
          description: project.description,
          memberIds: project.members.map((member) => member.id),
        }
      : defaultValues,
  })
  const name = useWatch({ control, name: 'name' })
  const description = useWatch({ control, name: 'description' })
  const color = useWatch({ control, name: 'color' })

  useEffect(() => {
    if (!project) {
      setValue('key', suggestProjectKey(name ?? ''), { shouldValidate: true })
    }
  }, [name, project, setValue])

  async function submit(values: ProjectFormValues) {
    try {
      await onSubmit({
        ...values,
        key: project ? project.key : values.key,
      })
    } catch (error) {
      setError('root.server', {
        message: error instanceof Error ? error.message : 'The project could not be saved.',
      })
    }
  }

  return (
    <form className="project-form" onSubmit={handleSubmit(submit)} noValidate>
      {errors.root?.server?.message && (
        <div className="form-alert" role="alert">{errors.root.server.message}</div>
      )}

      <label className="field">
        <span>Project name <span className="required">*</span></span>
        <input
          autoFocus
          placeholder="e.g. Product launch"
          {...register('name')}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <span className="field-error">{errors.name.message}</span>}
      </label>

      <div className="field-row">
        <label className="field">
          <span>Project key <span className="required">*</span></span>
          <input
            placeholder="e.g. LAUNCH"
            maxLength={10}
            disabled={Boolean(project)}
            {...register('key')}
            aria-invalid={Boolean(errors.key)}
          />
          <span className="field-hint">
            {project ? 'Project keys can’t be changed.' : 'Suggested from the project name.'}
          </span>
          {errors.key && <span className="field-error">{errors.key.message}</span>}
        </label>

        <label className="field color-field">
          <span>Project color <span className="required">*</span></span>
          <span className="color-control">
            <input type="color" aria-label="Choose project color" {...register('color')} />
            <span>{color?.toUpperCase()}</span>
          </span>
          {errors.color && <span className="field-error">{errors.color.message}</span>}
        </label>
      </div>

      <label className="field">
        <span>Description</span>
        <textarea
          rows={3}
          maxLength={300}
          placeholder="What is this project about?"
          {...register('description')}
          aria-invalid={Boolean(errors.description)}
        />
        <span className="field-hint align-right">
          {description?.length ?? 0}/300
        </span>
        {errors.description && (
          <span className="field-error">{errors.description.message}</span>
        )}
      </label>

      <fieldset className="member-picker">
        <legend>Project members</legend>
        {members.length === 0 ? (
          <p className="field-hint">No workspace members were returned by the API.</p>
        ) : (
          <div className="member-options">
            {members.map((member) => (
              <label className="member-option" key={member.id}>
                <input type="checkbox" value={member.id} {...register('memberIds')} />
                <MemberAvatar member={member} />
                <span>{member.name}</span>
              </label>
            ))}
          </div>
        )}
        {errors.memberIds && (
          <span className="field-error">{errors.memberIds.message}</span>
        )}
      </fieldset>

      <div className="dialog-actions">
        <button className="button button-quiet" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><span className="button-spinner" /> Saving…</> : project ? 'Save changes' : 'Create project'}
        </button>
      </div>
    </form>
  )
}

export function MemberAvatar({ member, size = 'normal' }: {
  member: WorkspaceMember
  size?: 'normal' | 'small'
}) {
  const initials = member.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return member.avatarUrl ? (
    <img className={`avatar avatar-${size}`} src={member.avatarUrl} alt="" />
  ) : (
    <span className={`avatar avatar-${size} avatar-initials`} aria-hidden="true">
      {initials}
    </span>
  )
}
