import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, suggestProjectKey, type ProjectFormValues } from '../projectSchema'
import type { Project, ProjectValues, WorkspaceMember } from '../types'
import { MemberAvatar } from './MemberAvatar'

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

const inputClass = 'min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 read-only:cursor-not-allowed read-only:bg-slate-50 read-only:text-slate-500'
const fieldClass = 'grid min-w-0 gap-2 text-xs font-semibold text-slate-700'
const hintClass = 'text-[10px] font-normal leading-relaxed text-slate-400'
const errorClass = 'text-[10px] font-medium text-red-700'

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
    <form className="grid gap-4 px-6 py-5 max-sm:px-5" onSubmit={handleSubmit(submit)} noValidate>
      {errors.root?.server?.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-relaxed text-red-800" role="alert">{errors.root.server.message}</div>
      )}

      <label className={fieldClass}>
        <span>Project name <span className="text-red-600">*</span></span>
        <input
          autoFocus
          className={inputClass}
          placeholder="e.g. Product launch"
          {...register('name')}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <span className={errorClass}>{errors.name.message}</span>}
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_.8fr]">
        <label className={fieldClass}>
          <span>Project key <span className="text-red-600">*</span></span>
          <input
            className={inputClass}
            placeholder="e.g. LAUNCH"
            maxLength={10}
            readOnly={Boolean(project)}
            {...register('key')}
            aria-invalid={Boolean(errors.key)}
          />
          <span className={hintClass}>{project ? 'Project keys can’t be changed.' : 'Suggested from the project name.'}</span>
          {errors.key && <span className={errorClass}>{errors.key.message}</span>}
        </label>

        <label className={fieldClass}>
          <span>Project color <span className="text-red-600">*</span></span>
          <span className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600">
            <input className="h-6 w-6 cursor-pointer rounded-md border border-slate-200 p-px" type="color" aria-label="Choose project color" {...register('color')} />
            <span>{color?.toUpperCase()}</span>
          </span>
          {errors.color && <span className={errorClass}>{errors.color.message}</span>}
        </label>
      </div>

      <label className={fieldClass}>
        <span>Description</span>
        <textarea
          className={`${inputClass} resize-y`}
          rows={3}
          maxLength={300}
          placeholder="What is this project about?"
          {...register('description')}
          aria-invalid={Boolean(errors.description)}
        />
        <span className={`${hintClass} justify-self-end`}>{description?.length ?? 0}/300</span>
        {errors.description && <span className={errorClass}>{errors.description.message}</span>}
      </label>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-2 text-xs font-semibold text-slate-700">Project members</legend>
        {members.length === 0 ? (
          <p className={hintClass}>No workspace members were returned by the API.</p>
        ) : (
          <div className="grid max-h-[154px] gap-1 overflow-y-auto rounded-lg border border-slate-200 p-1">
            {members.map((member) => (
              <label className="flex min-h-9 cursor-pointer items-center gap-2 rounded-md px-2 text-xs text-slate-700 hover:bg-slate-50" key={member.id}>
                <input className="h-3.5 w-3.5 accent-violet-600" type="checkbox" value={member.id} {...register('memberIds')} />
                <MemberAvatar member={member} />
                <span>{member.name}</span>
              </label>
            ))}
          </div>
        )}
        {errors.memberIds && <span className={errorClass}>{errors.memberIds.message}</span>}
      </fieldset>

      <div className="mt-1 flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button className="min-h-9 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Saving…</> : project ? 'Save changes' : 'Create project'}
        </button>
      </div>
    </form>
  )
}
