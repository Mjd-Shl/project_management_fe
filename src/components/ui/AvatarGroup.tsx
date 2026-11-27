import { Avatar } from "./Avatar";
import type { AvatarProps } from "./Avatar";

interface AvatarGroupProps {
  users: (AvatarProps & { id: string })[];
  max?: number;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
};

export function AvatarGroup({
  users,
  max = 4,
  size = "md",
}: AvatarGroupProps) {
  const limit = Math.max(0, Math.floor(max));
  const visibleUsers = users.slice(0, limit);
  const remaining = users.length - visibleUsers.length;

  return (
    <div
      role="group"
      aria-label="Team members"
      className="flex items-center -space-x-2"
    >
      {visibleUsers.map((user) => (
        <Avatar
          key={user.id}
          name={user.name}
          src={user.src}
          size={size}
          className="ring-2 ring-surface"
        />
      ))}

      {remaining > 0 && (
        <span
          aria-label={`${remaining} more members`}
          className={`
            inline-flex items-center justify-center
            rounded-full bg-slate-200 font-medium
            text-content ring-2 ring-surface
            ${sizes[size]}
          `}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
}