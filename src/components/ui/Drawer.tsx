import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "./IconButton";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: "left" | "right";
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />

        <Dialog.Content
          {...(!description ? { "aria-describedby": undefined } : {})}
          className={`
            fixed inset-y-0 z-50 flex w-full max-w-md
            flex-col bg-surface shadow-xl
            ${side === "right" ? "right-0" : "left-0"}
          `}
        >
          <div className="border-b border-border p-5">
            <div className="flex items-center justify-between gap-4">
              <Dialog.Title className="font-heading text-xl font-semibold">
                {title}
              </Dialog.Title>

              <Dialog.Close asChild>
                <IconButton icon={<X size={18} />} label="Close drawer" />
              </Dialog.Close>
            </div>

            {description && (
              <Dialog.Description className="mt-2 text-sm text-muted">
                {description}
              </Dialog.Description>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {children}
          </div>

          {footer && (
            <div className="flex justify-end gap-2 border-t border-border p-5">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}