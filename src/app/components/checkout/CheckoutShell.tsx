import React from 'react';

/** Shared card wrapper — main column + optional sticky summary. */
export function CheckoutShell({
  children,
  summary,
}: {
  children: React.ReactNode;
  summary?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-sm p-6 md:p-10">
        {children}
      </div>
      {summary && (
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-28">{summary}</div>
        </div>
      )}
    </div>
  );
}

export const checkoutInput =
  'w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none transition-colors bg-white placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900';

export const checkoutLabel =
  'text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500';
