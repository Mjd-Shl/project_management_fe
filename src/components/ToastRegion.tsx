import { Check, CircleHelp, RotateCcw, X } from 'lucide-react'
import type { ToastMessage } from '../hooks/useProjects'

type ToastRegionProps = {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
  onUndo: (toast: ToastMessage) => void
}

export function ToastRegion({ toasts, onDismiss, onUndo }: ToastRegionProps) {
  return (
    <div className="fixed bottom-3 right-3 z-20 grid w-[min(410px,calc(100vw-24px))] gap-2 sm:bottom-6 sm:right-6" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div
          className="flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-700 shadow-lg"
          key={toast.id}
          role={toast.kind === 'error' ? 'alert' : 'status'}
        >
          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${toast.kind === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {toast.kind === 'success' ? <Check size={16} /> : <CircleHelp size={16} />}
          </span>
          <span className="flex-1 leading-relaxed">{toast.message}</span>
          {toast.undoProject && (
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-1 rounded-md bg-violet-50 px-2 py-1 font-semibold text-violet-700 hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-violet-500"
              onClick={() => onUndo(toast)}
            >
              <RotateCcw size={14} /> Undo
            </button>
          )}
          <button
            type="button"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-500"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  )
}
