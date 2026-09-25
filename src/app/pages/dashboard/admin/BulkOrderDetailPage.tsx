import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Download,
  IndianRupee,
  Loader2,
  X,
} from 'lucide-react';
import {
  Card,
  DashboardSkeleton,
  inrFromPaise,
} from '../../../components/dashboard/shared';
import {
  BULK_PAYMENT_METHODS,
  getAdminBulkOrder,
  markAdminBulkOrderPaid,
  type BulkOrderDetail,
  type BulkPaymentMethod,
} from '../../../lib/api';
import { downloadOrderInvoice } from '../../../lib/invoice';

const panel =
  '!border-neutral-500/55 shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminBulkOrderDetailPage() {
  const { orderId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [detail, setDetail] = useState<BulkOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [collectMethod, setCollectMethod] = useState<BulkPaymentMethod>('Cash');
  const [collectNotes, setCollectNotes] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [actionNoticeTone, setActionNoticeTone] = useState<'info' | 'error'>('info');
  const autoDownloadDone = useRef(false);

  const load = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const next = await getAdminBulkOrder(orderId);
      setDetail(next);
      setCollectMethod((next.order.bulk_payment_method as BulkPaymentMethod) || 'Cash');
      setCollectNotes(next.order.bulk_notes || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
      setDetail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [orderId]);

  useEffect(() => {
    if (!confirmOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) setConfirmOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [confirmOpen, busy]);

  // After create: ?download=bill|invoice auto-downloads once.
  useEffect(() => {
    if (loading || !detail || autoDownloadDone.current) return;
    const raw = searchParams.get('download');
    if (raw !== 'bill' && raw !== 'invoice') return;
    autoDownloadDone.current = true;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('download');
    setSearchParams(nextParams, { replace: true });

    const paid = detail.order.status === 'paid';
    const kind: 'bill' | 'invoice' =
      raw === 'invoice' && !paid ? 'bill' : raw === 'bill' && paid ? 'invoice' : raw;

    setBusy(true);
    setActionNotice(null);
    void (async () => {
      try {
        await downloadOrderInvoice(
          {
            order: detail.order,
            items: detail.items,
            payments: detail.payments.map((p) => ({
              provider: p.provider,
              status: p.status,
              method: detail.order.bulk_payment_method,
            })),
            user: null,
          },
          { documentKind: kind }
        );
        if (kind === 'bill') {
          setActionNoticeTone('info');
          setActionNotice('Bill downloaded. Mark paid later to unlock the tax invoice.');
        }
      } catch (err) {
        setActionNoticeTone('error');
        setActionNotice(err instanceof Error ? err.message : 'Download failed');
      } finally {
        setBusy(false);
      }
    })();
  }, [loading, detail, searchParams, setSearchParams]);

  if (loading) return <DashboardSkeleton cols={4} rows={6} />;

  if (error || !detail) {
    return (
      <div
        className={`bg-[#0A0A0A] rounded-2xl border border-neutral-500/55 p-10 flex flex-col items-center text-center gap-3 ${panel}`}
      >
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="font-bold text-sm text-white">Could not load bulk order</p>
        <p className="text-xs text-neutral-400 max-w-sm">{error}</p>
        <Link
          to="/dashboard/admin/bulk-orders"
          className="inline-flex items-center gap-2 mt-1 px-4 py-2 rounded-xl border border-neutral-500/70 text-xs font-bold text-cyan-400 hover:border-neutral-400 hover:bg-white/[0.04]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to bulk orders
        </Link>
      </div>
    );
  }

  const { order, items, payments, created_by } = detail;
  const addr = order.shipping_address ?? {};
  const item = items[0];
  const isPaid = order.status === 'paid';

  const downloadDoc = async (
    documentKind: 'auto' | 'bill' | 'invoice',
    source?: BulkOrderDetail | null
  ) => {
    const d = source ?? detail;
    if (!d) return;
    const paid = d.order.status === 'paid';
    // Enforce product rule: unpaid → bill only; paid → tax invoice.
    const kind: 'bill' | 'invoice' =
      documentKind === 'auto'
        ? paid
          ? 'invoice'
          : 'bill'
        : documentKind === 'invoice' && !paid
          ? 'bill'
          : documentKind === 'bill' && paid
            ? 'invoice'
            : documentKind === 'bill'
              ? 'bill'
              : 'invoice';

    setBusy(true);
    setActionNotice(null);
    try {
      await downloadOrderInvoice(
        {
          order: d.order,
          items: d.items,
          payments: d.payments.map((p) => ({
            provider: p.provider,
            status: p.status,
            method: d.order.bulk_payment_method,
          })),
          user: null,
        },
        { documentKind: kind }
      );
      if (kind === 'bill') {
        setActionNoticeTone('info');
        setActionNotice('Bill downloaded. Mark paid later to unlock the tax invoice.');
      } else {
        setActionNoticeTone('info');
        setActionNotice('Tax invoice downloaded.');
      }
    } catch (err) {
      setActionNoticeTone('error');
      setActionNotice(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setBusy(false);
    }
  };

  const openCollectConfirm = () => {
    setConfirmError(null);
    setPaidSuccess(false);
    setConfirmOpen(true);
  };

  const onCollectPayment = async () => {
    setBusy(true);
    setConfirmError(null);
    try {
      const next = await markAdminBulkOrderPaid(detail.order.id, {
        paymentMethod: collectMethod,
        notes: collectNotes.trim() || null,
      });
      setDetail(next);
      setPaidSuccess(true);
      setActionNotice(null);
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setBusy(false);
    }
  };

  const closeConfirm = () => {
    if (busy) return;
    setConfirmOpen(false);
    setConfirmError(null);
    setPaidSuccess(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-w-0"
    >
      <header className="relative z-10 mb-8 overflow-hidden rounded-2xl border border-neutral-500/55 bg-[#0A0A0A] shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-500/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-500/[0.05] blur-3xl pointer-events-none" />

        <div className="relative px-4 sm:px-6 py-5 sm:py-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-400/25 bg-violet-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-violet-300">
                  <Building2 className="w-3 h-3" />
                  Bulk / Offline
                </span>
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                    isPaid
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                  }`}
                >
                  {isPaid ? 'Paid' : 'Payment pending'}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  No Delhivery
                </span>
              </div>
              <h1
                className="font-black tracking-tight text-white leading-none truncate"
                style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)', letterSpacing: '-0.03em' }}
              >
                {order.order_number}
              </h1>
              <p className="mt-3 max-w-xl text-sm text-neutral-400 leading-relaxed">
                {addr.organization_name || 'Buyer'} · {formatDate(order.created_at)}
                {item?.quantity ? ` · Qty ${item.quantity}` : ''}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
              <Link
                to="/dashboard/admin/bulk-orders"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold tracking-wide border border-neutral-500/70 text-white bg-black/40 hover:bg-white/[0.04] hover:border-neutral-400 transition-all rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              {!isPaid ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void downloadDoc('bill')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-amber-500/40 text-amber-300 text-sm font-bold hover:bg-amber-500/10 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  Download bill
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void downloadDoc('invoice')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-black hover:bg-cyan-400 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  Tax invoice
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {actionNotice && (
        <div
          className={`mb-4 relative z-10 rounded-xl border px-4 py-3 text-sm flex items-start justify-between gap-3 ${
            actionNoticeTone === 'error'
              ? 'border-red-500/30 bg-red-500/10 text-red-300'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-100'
          }`}
        >
          <span className="flex items-start gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="break-words">{actionNotice}</span>
          </span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="opacity-80 hover:opacity-100 shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        <div className="lg:col-span-7 space-y-6">
          <Card title="Line items" className={panel}>
            <div className="p-4 sm:p-6">
              {item ? (
                <div className="flex gap-4 items-start">
                  {item.snapshot_image_url && (
                    <div className="w-16 h-16 rounded-xl bg-white/[0.04] border border-neutral-500/50 overflow-hidden shrink-0">
                      <img
                        src={item.snapshot_image_url}
                        alt=""
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">{item.snapshot_name}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Qty {item.quantity} × {inrFromPaise(item.unit_price_paise)} (custom unit price)
                    </p>
                  </div>
                  <p className="text-sm font-black text-white tabular-nums">
                    {inrFromPaise(item.line_total_paise)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">No items</p>
              )}
            </div>
          </Card>

          <Card title="Buyer details" className={panel}>
            <div className="p-4 sm:p-6 space-y-2 text-sm">
              <p className="font-bold text-white">{addr.organization_name || '—'}</p>
              <p className="text-neutral-300">
                {[addr.first_name, addr.last_name].filter(Boolean).join(' ') || '—'}
              </p>
              <p className="text-neutral-400">{addr.phone || '—'}</p>
              {addr.email && <p className="text-neutral-400">{addr.email}</p>}
              {addr.gstin && <p className="text-neutral-500 text-xs">GSTIN {addr.gstin}</p>}
              <p className="text-neutral-500 text-xs pt-2 border-t border-neutral-500/30">
                {[addr.street, addr.city, addr.state, addr.postal_code, addr.country]
                  .filter(Boolean)
                  .join(', ') || 'No address on file'}
              </p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card title="Totals" className={panel}>
            <div className="p-4 sm:p-6 space-y-2 text-sm">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="text-white tabular-nums">{inrFromPaise(order.subtotal_paise)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Discount</span>
                <span className="text-white tabular-nums">−{inrFromPaise(order.discount_paise)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Tax</span>
                <span className="text-white tabular-nums">{inrFromPaise(order.tax_paise ?? 0)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Shipping</span>
                <span className="text-white tabular-nums">{inrFromPaise(order.shipping_paise)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-neutral-500/40">
                <span className="font-bold text-white">Total</span>
                <span className="font-black text-white text-lg tabular-nums">
                  {inrFromPaise(order.total_paise)}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Payment & channel" className={panel}>
            <div className="p-4 sm:p-6 space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-violet-500/30 text-violet-300 bg-violet-500/10">
                  BULK_OFFLINE
                </span>
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    isPaid
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {isPaid ? 'Paid' : 'Pending collection'}
                </span>
              </div>

              {!isPaid ? (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <IndianRupee className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-white">Collect payment later</p>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        Download a <span className="text-amber-200 font-semibold">bill</span> now.
                        When Cash / UPI / bank transfer is received, record it here — then generate
                        the tax invoice.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500 block mb-2">
                      Payment method collected
                    </label>
                    <select
                      value={collectMethod}
                      onChange={(e) => setCollectMethod(e.target.value as BulkPaymentMethod)}
                      disabled={busy}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#050505] border border-neutral-500/50 text-sm text-white outline-none focus:border-cyan-500"
                    >
                      {BULK_PAYMENT_METHODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500 block mb-2">
                      Collection notes (optional)
                    </label>
                    <textarea
                      value={collectNotes}
                      onChange={(e) => setCollectNotes(e.target.value)}
                      disabled={busy}
                      rows={3}
                      maxLength={2000}
                      placeholder="e.g. UPI ref XYZ · collected by school admin"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#050505] border border-neutral-500/50 text-sm text-white outline-none focus:border-cyan-500 resize-y placeholder:text-neutral-600"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={openCollectConfirm}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-emerald-500/40 text-emerald-300 text-sm font-bold hover:bg-emerald-500/10 disabled:opacity-50"
                  >
                    Mark paid & unlock tax invoice
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-neutral-300">
                    Method:{' '}
                    <span className="text-white font-semibold">{order.bulk_payment_method || '—'}</span>
                  </p>
                  {order.paid_at && (
                    <p className="text-neutral-500 text-xs">Paid at {formatDate(order.paid_at)}</p>
                  )}
                  <p className="text-xs text-emerald-400/90">
                    Payment recorded. Download the tax invoice for the buyer.
                  </p>
                </div>
              )}

              {payments[0] && (
                <p className="text-neutral-500 text-xs">
                  Payment record: {payments[0].provider} · {payments[0].status}
                </p>
              )}
              {created_by && (
                <p className="text-neutral-500 text-xs">
                  Created by {created_by.full_name || created_by.email}
                </p>
              )}
              {order.bulk_notes && (
                <p className="text-neutral-400 text-xs pt-2 border-t border-neutral-500/30">
                  Notes: {order.bulk_notes}
                </p>
              )}
              <p className="text-[11px] text-neutral-600 pt-2">
                No Delhivery waybill, pickup, label, or tracking for this order. Appears in All Orders
                and Overview revenue when paid.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bulk-mark-paid-title"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
              aria-label="Close dialog"
              disabled={busy}
              onClick={closeConfirm}
            />

            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-neutral-500/55 bg-[#0A0A0A] shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_24px_48px_-12px_rgba(0,0,0,0.7)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

              <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400/90 mb-1.5">
                    Confirm collection
                  </p>
                  <h2
                    id="bulk-mark-paid-title"
                    className="text-lg font-black text-white tracking-tight"
                  >
                    {paidSuccess ? 'Payment recorded' : 'Mark order paid?'}
                  </h2>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={closeConfirm}
                  className="p-2 rounded-xl border border-neutral-500/40 text-neutral-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-40"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-5 pb-5 space-y-4">
                {paidSuccess ? (
                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">
                        {collectMethod} · {inrFromPaise(order.total_paise)}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        Tax invoice is unlocked. You can download it now.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border border-neutral-500/40 bg-[#050505] p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                          Amount
                        </span>
                        <span className="text-base font-black text-white tabular-nums">
                          {inrFromPaise(order.total_paise)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                          Method
                        </span>
                        <span className="text-sm font-bold text-emerald-300">{collectMethod}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                          Order
                        </span>
                        <span className="text-sm font-bold text-neutral-200 truncate">
                          {order.order_number}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      This records offline collection and unlocks the{' '}
                      <span className="text-white font-semibold">tax invoice</span>. No Delhivery
                      shipment is created.
                    </p>
                    {confirmError && (
                      <p className="text-xs font-medium text-red-400 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {confirmError}
                      </p>
                    )}
                  </>
                )}

                <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
                  {paidSuccess ? (
                    <>
                      <button
                        type="button"
                        onClick={closeConfirm}
                        className="sm:flex-1 px-4 py-2.5 rounded-xl border border-neutral-500/60 text-sm font-bold text-neutral-300 hover:bg-white/[0.04]"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setConfirmOpen(false);
                          setPaidSuccess(false);
                          void downloadDoc('invoice', detail);
                        }}
                        className="sm:flex-[1.35] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-black hover:bg-cyan-400 disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        Download tax invoice
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={closeConfirm}
                        className="sm:flex-1 px-4 py-2.5 rounded-xl border border-neutral-500/60 text-sm font-bold text-neutral-300 hover:bg-white/[0.04] disabled:opacity-40"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void onCollectPayment()}
                        className="sm:flex-[1.35] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-neutral-950 text-sm font-black hover:bg-emerald-400 disabled:opacity-50"
                      >
                        {busy ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        {busy ? 'Recording…' : 'Confirm & mark paid'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
