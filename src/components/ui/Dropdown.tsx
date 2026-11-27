import { DropdownMenu } from "radix-ui";
import type { ReactNode, ReactElement } from "react";

interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  trigger: ReactElement;
  items: DropdownItem[];
  align?: "start" | "center" | "end";
}

export function Dropdown({
  trigger,
  items,
  align = "end",
}: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={6}
          className="
            z-50 min-w-40 rounded-control border
            border-border bg-surface p-1 shadow-lg
          "
        >
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.id}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className={`
                flex cursor-pointer select-none items-center gap-2
                rounded-control px-3 py-2 text-sm outline-none
                data-highlighted:bg-slate-100
                data-disabled:pointer-events-none
                data-disabled:opacity-50
                ${item.danger ? "text-danger" : "text-content"}
              `}
            >
              {item.icon && (
                <span aria-hidden="true">{item.icon}</span>
              )}

              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}