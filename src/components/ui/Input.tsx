import { useId } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  disabled = false,
  type = "text",
  className = "",
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-content"
        >
          {label}
        </label>
      )}

      <input
        {...props}
        id={inputId}
        type={type}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={
          error || helperText ? descriptionId : undefined
        }
        className={`
          w-full rounded-control border bg-surface
          px-3 py-2 text-sm text-content
          placeholder:text-muted
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-primary
          disabled:cursor-not-allowed
          disabled:bg-slate-100 disabled:opacity-60
          ${error ? "border-danger" : "border-muted"}
          ${className}
        `}
      />

      {(error || helperText) && (
        <p
          id={descriptionId}
          className={`text-xs ${
            error ? "text-danger" : "text-muted"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}