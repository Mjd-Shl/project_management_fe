import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "./IconButton";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />

        <Dialog.Content
          {...(!description ? { "aria-describedby": undefined } : {})}
          className={`
            fixed left-1/2 top-1/2 z-50
            max-h-[90dvh] w-[calc(100%-2rem)]
            -translate-x-1/2 -translate-y-1/2
            overflow-y-auto rounded-card bg-surface
            p-6 shadow-xl ${sizes[size]}
          `}
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <Dialog.Title className="font-heading text-xl font-semibold">
              {title}
            </Dialog.Title>

            <Dialog.Close asChild>
              <IconButton icon={<X size={18} />} label="Close modal" />
            </Dialog.Close>
          </div>

          {description && (
            <Dialog.Description className="mb-4 text-sm text-muted">
              {description}
            </Dialog.Description>
          )}

          <div>{children}</div>

          {footer && (
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}