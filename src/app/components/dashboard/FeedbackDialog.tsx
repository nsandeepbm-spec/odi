import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle } from 'lucide-react';

export type FeedbackDialogTone = 'success' | 'error';

type Props = {
  open: boolean;
  tone: FeedbackDialogTone;
  title: string;
  message: string;
  detail?: string | null;
  confirmLabel?: string;
  /** Dashboard is dark; storefront checkout uses light. */
  appearance?: 'dark' | 'light';
  onClose: () => void;
};

/** Small centered confirmation — use instead of `window.alert`. Sits above drawers. */
export function FeedbackDialog({
  open,
  tone,
  title,
  message,
  detail,
  confirmLabel = 'OK',
  appearance = 'dark',
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  if (!open) return null;

  const isOk = tone === 'success';
  const light = appearance === 'light';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className={`absolute inset-0 backdrop-blur-sm ${light ? 'bg-black/40' : 'bg-black/65'}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-dialog-title"
        className={`relative z-[101] w-full max-w-sm rounded-2xl p-6 shadow-2xl ${
          light
            ? 'border border-neutral-200 bg-white'
            : 'border border-white/10 bg-[#0d0d0d]'
        }`}
      >
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border ${
            isOk
              ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-500'
              : 'border-red-500/25 bg-red-500/10 text-red-500'
          }`}
        >
          {isOk ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
        </div>
        <h2
          id="feedback-dialog-title"
          className={`text-center text-lg font-black tracking-tight ${
            light ? 'text-neutral-900' : 'text-white'
          }`}
        >
          {title}
        </h2>
        <p
          className={`mt-2 text-center text-sm leading-relaxed ${
            light ? 'text-neutral-600' : 'text-neutral-400'
          }`}
        >
          {message}
        </p>
        {detail ? (
          <p
            className={`mt-3 break-all rounded-xl px-3 py-2 text-center font-mono text-xs ${
              light
                ? 'border border-neutral-200 bg-neutral-50 text-neutral-800'
                : 'border border-white/[0.06] bg-white/[0.03] text-cyan-300'
            }`}
          >
            {detail}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-bold ${
            light
              ? 'bg-neutral-900 text-white hover:bg-neutral-800'
              : 'border border-white/10 bg-white/[0.06] text-white hover:bg-white/10'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>,
    document.body,
  );
}
