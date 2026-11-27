import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "neutral"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info";
}

const variants = {
  neutral: "bg-slate-100 text-slate-700",
  primary: "bg-blue-50 text-primary",
  success: "bg-green-50 text-success",
  warning: "bg-amber-50 text-warning",
  danger: "bg-red-50 text-danger",
  info: "bg-blue-50 text-info",
};

export function Badge({
  variant = "neutral",
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={`
        inline-flex items-center gap-1 rounded-full
        px-2.5 py-1 text-xs font-medium
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
}