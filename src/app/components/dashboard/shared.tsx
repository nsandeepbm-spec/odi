import React from 'react';
import { motion } from 'motion/react';
import { type LucideIcon } from 'lucide-react';
import type { BookingStatus, PaymentStatus } from '../../data/mock';

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
export function PageHeader({
  title,
  accent,
  subtitle,
  action,
}: {
  title: string;
  accent?: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="font-black tracking-tight leading-none mb-2" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em' }}>
          {title}{' '}
          {accent && (
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              {accent}
            </span>
          )}
        </h1>
        <p className="text-sm text-neutral-500">{subtitle}</p>
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
      className="bg-white p-5 md:p-6 rounded-2xl border border-neutral-200/60 shadow-sm flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-neutral-700" />
        </div>
        {trend && (
          <span
            className={`text-[11px] font-bold px-2 py-1 rounded-full ${
              trendUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-black tracking-tight text-neutral-900">{value}</p>
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-400 mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── STATUS BADGES ────────────────────────────────────────────────────────────
const bookingStyles: Record<BookingStatus, string> = {
  confirmed: 'bg-sky-50 text-sky-600',
  processing: 'bg-amber-50 text-amber-600',
  shipped: 'bg-indigo-50 text-indigo-600',
  delivered: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-500',
};

export function BookingBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${bookingStyles[status]}`}>
      {status}
    </span>
  );
}

const paymentStyles: Record<PaymentStatus, string> = {
  paid: 'bg-emerald-50 text-emerald-600',
  pending: 'bg-amber-50 text-amber-600',
  refunded: 'bg-neutral-100 text-neutral-500',
  failed: 'bg-red-50 text-red-500',
};

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${paymentStyles[status]}`}>
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
    <div className={`bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between gap-4">
          {title && <h2 className="text-base font-bold tracking-tight">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-neutral-300" />
      </div>
      <p className="font-bold text-sm mb-1">{title}</p>
      <p className="text-xs text-neutral-400 max-w-xs">{subtitle}</p>
    </div>
  );
}

// ─── INR FORMAT ───────────────────────────────────────────────────────────────
export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
