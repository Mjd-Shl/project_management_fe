import { useId } from "react";
import type { InputHTMLAttributes } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function Checkbox({
  label,
  id,
  disabled,
  className = "",
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={`
        inline-flex items-center gap-2 text-sm
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
      `}
    >
      <input
        {...props}
        id={checkboxId}
        type="checkbox"
        disabled={disabled}
        className={`
          size-4 shrink-0 accent-primary
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-primary
          disabled:cursor-not-allowed
          ${className}
        `}
      />

      <span>{label}</span>
    </label>
  );
}