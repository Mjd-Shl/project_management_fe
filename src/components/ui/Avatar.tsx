import { Avatar as AvatarPrimitive } from "radix-ui";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
};

export function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <AvatarPrimitive.Root
      role="img"
      aria-label={name}
      className={`
        inline-flex shrink-0 items-center justify-center
        overflow-hidden rounded-full bg-slate-200
        font-medium text-content
        ${sizes[size]} ${className}
      `}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt=""
          className="size-full object-cover"
        />
      )}

      <AvatarPrimitive.Fallback aria-hidden="true">
        {initials || "?"}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}