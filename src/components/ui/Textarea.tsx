import { useId } from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  id,
  rows = 4,
  className = "",
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const descriptionId = `${textareaId}-description`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium">
          {label}
        </label>
      )}

      <textarea
        {...props}
        id={textareaId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={
          error || helperText ? descriptionId : props["aria-describedby"]
        }
        className={`
          w-full resize-y rounded-control border bg-surface
          px-3 py-2 text-sm text-content
          placeholder:text-muted
          focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-primary
          disabled:cursor-not-allowed disabled:bg-slate-100
          disabled:opacity-60
          ${error ? "border-danger" : "border-muted"}
          ${className}
        `}
      />

      {(error || helperText) && (
        <p
          id={descriptionId}
          className={`text-xs ${error ? "text-danger" : "text-muted"}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}