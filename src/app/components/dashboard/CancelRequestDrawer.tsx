import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Ban, CheckCircle2, Loader2, X, XCircle } from 'lucide-react';
import { inrFromPaise } from './shared';
import type { CancelRow, CancelStatus } from '../../lib/api';

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusChip({ status }: { status: CancelStatus }) {
  const cls =
    status === 'pending'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : status === 'approved'
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : 'bg-red-500/10 text-red-400 border-red-500/20';
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${cls}`}>
      {status}
    </span>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-white/[0.05] last:border-0">
      <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-medium text-neutral-200 text-right">{value}</span>
    </div>
  );
}

type Props = {
  open: boolean;
  row: CancelRow | null;
  /** Which footer action is in flight — only that button shows a spinner. */
  busyAction?: 'approved' | 'rejected' | null;
  onClose: () => void;
  onReview: (row: CancelRow, decision: 'approved' | 'rejected', adminNote: string) => Promise<void>;
};

/** Right drawer — cancel request details (message, order, dates). Not the order page. */
export function CancelRequestDrawer({ open, row, busyAction, onClose, onReview }: Props) {
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote('');
  }, [row?.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [open]);

  if (!open || !row) return null;

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close cancel request"
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (!busyAction) onClose();
        }}
      />
      <aside
        className="fixed inset-y-0 right-0 z-[70] h-dvh w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col overscroll-contain"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-request-title"
      >
        <div className="flex items-start justify-between gap-3 px-5 py-5 border-b border-white/[0.06] bg-[#0d0d0d] shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1">
              Cancel request
            </p>
            <h2 id="cancel-request-title" className="text-lg font-black text-white truncate">
              {row.orderNumber}
            </h2>
            <div className="mt-2">
              <StatusChip status={row.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={!!busyAction}
            className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 shrink-0 disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-6 space-y-6">
          <section>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
              Order details
            </p>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4">
              <Detail label="Order" value={row.orderNumber} />
              <Detail label="Amount" value={inrFromPaise(row.amountPaise)} />
              <Detail label="AWB" value={row.waybill} />
              <Detail label="Requested" value={formatDate(row.createdAt)} />
              <Detail label="Reviewed" value={row.reviewedAt ? formatDate(row.reviewedAt) : null} />
            </div>
          </section>

          <section>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
              Customer
            </p>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4">
              <Detail label="Name" value={row.userName || '—'} />
              <Detail label="Email" value={row.userEmail} />
            </div>
          </section>

          <section>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
              Customer message
            </p>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4">
              <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                {row.reason?.trim() || 'No message provided.'}
              </p>
            </div>
          </section>

          {row.delhiveryError && (
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">
                Delhivery
              </p>
              <p className="text-sm text-amber-300/90 leading-relaxed">{row.delhiveryError}</p>
            </section>
          )}

          {row.adminNote && (
            <section>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
                Admin note
              </p>
              <p className="text-sm text-neutral-300 leading-relaxed">{row.adminNote}</p>
            </section>
          )}

          {row.status === 'pending' && (
            <section>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">
                Your note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Visible to the customer if you reject…"
                className="w-full px-3 py-2.5 rounded-xl border border-white/[0.07] bg-[#111113] text-sm text-neutral-200 outline-none focus:border-white/20 resize-none"
              />
            </section>
          )}
        </div>

        <div className="p-5 border-t border-white/[0.06] bg-[#0d0d0d] shrink-0 space-y-2">
          {row.status === 'pending' && (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!!busyAction}
                onClick={() => void onReview(row, 'approved', note)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50"
              >
                {busyAction === 'approved' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                Approve
              </button>
              <button
                type="button"
                disabled={!!busyAction}
                onClick={() => void onReview(row, 'rejected', note)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50"
              >
                {busyAction === 'rejected' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                Reject
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2.5 text-sm font-bold rounded-xl border border-white/10 text-white hover:bg-white/5 inline-flex items-center justify-center gap-2"
          >
            <Ban className="w-3.5 h-3.5 text-neutral-500" />
            Close
          </button>
        </div>
      </aside>
    </>,
    document.body,
  );
}
