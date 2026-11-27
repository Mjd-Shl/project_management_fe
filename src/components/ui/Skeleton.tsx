import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangle" | "circle";
}

const variants = {
  text: "h-4 w-full rounded-control",
  rectangle: "h-24 w-full rounded-card",
  circle: "size-10 rounded-full",
};

export function Skeleton({
  variant = "rectangle",
  className = "",
  ...props
}: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={`
        bg-slate-200 motion-safe:animate-pulse
        ${variants[variant]} ${className}
      `}
    />
  );
}