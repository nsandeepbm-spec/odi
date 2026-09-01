import React from 'react';
import { motion } from 'motion/react';
import { type LucideIcon } from 'lucide-react';
import type { BookingStatus, PaymentStatus } from '../../data/mock';
import { ODILoader } from '../ODILoader';

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
export function PageHeader({
  title,
  accent,
  eyebrow,
  subtitle,
  action,
}: {
  title: string;
  /** Gradient-coloured word after the title (text only — no emoji). */
  accent?: string;
  /** Small label rendered above the title, plain text. */
  eyebrow?: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 relative z-10">
      <div>
        {eyebrow && (
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-500 mb-2">{eyebrow}</p>
        )}
        <h1
          className="font-black tracking-tight leading-none mb-3 text-white drop-shadow-sm"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em' }}
        >
          {title}{' '}
          {accent && (
            <span className="bg-gradient-to-br from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              {accent}
            </span>
          )}
        </h1>
        <p className="text-sm font-medium text-neutral-400 tracking-wide">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  delay = 0,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden bg-[#0A0A0A] p-4 sm:p-5 md:p-6 rounded-2xl border border-white/[0.04] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] flex flex-col gap-4 min-w-0 group hover:border-white/[0.08] transition-colors"
    >
      <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-center justify-between relative z-10">
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <Icon className="w-5 h-5 text-neutral-300 group-hover:text-cyan-400 transition-colors" />
        </div>
        {trend && (
          <span
            className={`text-[11px] font-black tracking-wider px-2.5 py-1.5 rounded-lg border backdrop-blur-md ${
              trendUp ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="relative z-10 mt-1">
        <p className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm break-words">
          {value}
        </p>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mt-2 break-words">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

// ─── STATUS BADGES ────────────────────────────────────────────────────────────
const bookingStyles: Record<BookingStatus, string> = {
  confirmed: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  processing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  shipped: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function BookingBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded border ${bookingStyles[status]}`}>
      {status}
    </span>
  );
}

/** Real order statuses from backend (`orders.status`). */
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

const orderStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  paid: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  processing: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  shipped: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  refunded: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
};

export function OrderBadge({ status, label }: { status: string; label?: string }) {
  const style = orderStyles[status as OrderStatus] ?? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
  return (
    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded border ${style}`}>
      {(label ?? status).replace(/_/g, ' ')}
    </span>
  );
}

/** Customer-facing copy after a cancel queues a refund. */
export function userOrderStatusDisplay(order: {
  status: string;
  refund_status?: string | null;
  razorpay_order_id?: string | null;
}): { badgeStatus: OrderStatus | string; label: string } {
  const rs = order.refund_status ?? null;
  if (rs === 'pending' || rs === 'approved') {
    return { badgeStatus: 'pending', label: 'Refund in progress' };
  }
  if (rs === 'rejected') {
    return { badgeStatus: 'cancelled', label: 'Refund not possible' };
  }
  if (rs === 'completed' || order.status === 'refunded') {
    return { badgeStatus: 'refunded', label: 'Refunded' };
  }
  if (order.status === 'pending' && !order.razorpay_order_id) {
    return { badgeStatus: 'pending', label: 'Cash on delivery' };
  }
  if (order.status === 'pending' && order.razorpay_order_id) {
    return { badgeStatus: 'pending', label: 'Awaiting payment' };
  }
  return { badgeStatus: order.status, label: order.status.replace(/_/g, ' ') };
}

const paymentStyles: Record<PaymentStatus, string> = {
  paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  refunded: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded border ${paymentStyles[status]}`}>
      {status}
    </span>
  );
}

// ─── CARD SHELL (table wrapper) ───────────────────────────────────────────────
export function Card({
  title,
  action,
  children,
  className = '',
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[#0A0A0A] rounded-2xl border border-white/[0.06] shadow-xl shadow-black/40 overflow-hidden relative ${className}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent opacity-50" />
      {(title || action) && (
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-white/[0.04] flex flex-wrap items-center justify-between gap-2 sm:gap-4 bg-[#0d0d0d]">
          {title && (
            <h2 className="text-sm font-bold tracking-wide text-white min-w-0 break-words">{title}</h2>
          )}
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// ─── LIST PAGER (inbox / tables) ──────────────────────────────────────────────
export function ListPager({
  page,
  totalPages,
  total,
  onPageChange,
  disabled,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="px-4 sm:px-8 py-4 border-t border-white/[0.04] flex items-center justify-between gap-3 min-w-0">
      <p className="text-[10px] text-neutral-500">
        Page {page} of {totalPages}
        {total > 0 ? ` · ${total} total` : ''}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 text-[11px] font-bold rounded-lg border border-white/[0.08] text-neutral-300 hover:bg-white/[0.04] disabled:opacity-40 disabled:pointer-events-none"
        >
          Prev
        </button>
        <button
          type="button"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 text-[11px] font-bold rounded-lg border border-white/[0.08] text-neutral-300 hover:bg-white/[0.04] disabled:opacity-40 disabled:pointer-events-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-inner flex items-center justify-center mb-5 ring-1 ring-white/[0.02]">
        <Icon className="w-6 h-6 text-neutral-500" />
      </div>
      <p className="font-bold text-sm mb-2 text-white">{title}</p>
      <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">{subtitle}</p>
    </div>
  );
}

// ─── TABLE SKELETON ───────────────────────────────────────────────────────────
/**
 * Animated skeleton that mimics a data table.
 * @param cols  number of columns
 * @param rows  number of skeleton rows (default 6)
 */
export function TableSkeleton({ cols = 5, rows = 6 }: { cols?: number; rows?: number }) {
  void cols;
  void rows;
  return <ODILoader size="sm" label="Loading…" className="py-16" />;
}

// ─── DASHBOARD PAGE SKELETON ─────────────────────────────────────────────────
/**
 * Full-page loading: branded colour ODI logo.
 * Drop-in replacement for the early-return loading spinner.
 */
export function DashboardSkeleton({
  cols = 5,
  rows = 7,
}: {
  cols?: number;
  rows?: number;
}) {
  void cols;
  void rows;
  return <ODILoader size="md" label="Loading…" className="py-28" />;
}

// ─── INR FORMAT ───────────────────────────────────────────────────────────────
/** Format rupees (whole currency units). */
export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** Format integer paise as INR. */
export const inrFromPaise = (paise: number) =>
  `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
