import { useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export function Select({
  label,
  options,
  placeholder,
  error,
  helperText,
  id,
  className = "",
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const descriptionId = `${selectId}-description`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          {...props}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={
            error || helperText ? descriptionId : props["aria-describedby"]
          }
          className={`
            w-full appearance-none rounded-control border
            bg-surface px-3 py-2 pr-9 text-sm text-content
            focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-primary
            disabled:cursor-not-allowed disabled:bg-slate-100
            disabled:opacity-60
            ${error ? "border-danger" : "border-muted"}
            ${className}
          `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2
                     size-4 -translate-y-1/2 text-muted"
        />
      </div>

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