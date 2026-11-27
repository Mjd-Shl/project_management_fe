import type { ComponentProps, ReactNode } from "react";
import { Button } from "./Button";

interface IconButtonProps
  extends Omit<ComponentProps<typeof Button>, "children"> {
  icon: ReactNode;
  label: string;
}

export function IconButton({
  icon,
  label,
  variant = "ghost",
  ...props
}: IconButtonProps) {
  return (
    <Button
      {...props}
      variant={variant}
      aria-label={label}
    >
      {icon}
    </Button>
  );
}