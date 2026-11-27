import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <div
        aria-hidden="true"
        className="
          mb-4 flex size-14 items-center justify-center
          rounded-full bg-slate-100 text-muted
        "
      >
        {icon ?? <Inbox size={28} />}
      </div>

      <h3 className="font-heading text-lg font-semibold">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}