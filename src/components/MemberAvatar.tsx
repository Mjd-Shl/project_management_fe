import type { WorkspaceMember } from '../types'

type MemberAvatarProps = {
  member: WorkspaceMember
  size?: 'normal' | 'small'
}

export function MemberAvatar({ member, size = 'normal' }: MemberAvatarProps) {
  const initials = member.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
  const sizeClasses = size === 'small' ? 'h-6 w-6 text-[8px]' : 'h-[27px] w-[27px] text-[9px]'

  return member.avatarUrl ? (
    <img className={`inline-grid shrink-0 rounded-full object-cover ${sizeClasses}`} src={member.avatarUrl} alt="" />
  ) : (
    <span className={`inline-grid shrink-0 place-items-center rounded-full bg-violet-100 font-bold text-violet-800 ${sizeClasses}`} aria-hidden="true">
      {initials}
    </span>
  )
}
