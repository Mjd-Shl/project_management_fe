import type { ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  iconOnly?: boolean;
}

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-slate-200 text-content hover:bg-slate-300",
  outline: "border border-muted text-content hover:bg-slate-100",
  danger: "bg-danger text-white hover:bg-red-800",
  ghost: "text-content hover:bg-slate-100",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

const iconSizes = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  iconOnly = false,
  disabled = false,
  type = "button",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`
        inline-flex shrink-0 items-center justify-center gap-2
        rounded-control font-medium transition-colors
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-primary
        disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]}
        ${iconOnly ? iconSizes[size] : sizes[size]}
        ${className}
      `}
    >
      {loading ? (
        <>
          <LoaderCircle
            size={18}
            className="motion-safe:animate-spin"
            aria-hidden="true"
          />
          {!iconOnly && "Loading..."}
        </>
      ) : (
        children
      )}
    </button>
  );
}