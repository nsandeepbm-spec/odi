import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Search, Truck, Loader2, CalendarX, CheckCircle2, CalendarClock, FileDown } from 'lucide-react';
import { PageHeader, Card, EmptyState, TableSkeleton } from '../../../components/dashboard/shared';
import {
  listAdminOrders,
  createAdminOrderShipment,
  type AdminOrder,
} from '../../../lib/api';
import { inDateRange } from '../../../lib/csv';
import { downloadShippingLabelForOrder } from '../../../lib/shippingLabel';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function customerName(order: AdminOrder) {
  return (
    [order.shipping_address?.first_name, order.shipping_address?.last_name]
      .filter(Boolean)
      .join(' ') || 'Customer'
  );
}

function shipmentStatus(order: AdminOrder) {
  if (order.delhivery_pickup_token) {
    return { label: 'Pickup scheduled', short: 'Scheduled', className: 'text-emerald-400' };
  }
  if (order.delhivery_waybill) {
    return { label: 'Manifested · needs pickup', short: 'Needs pickup', className: 'text-amber-400' };
  }
  return { label: 'Awaiting manifestation', short: 'Awaiting AWB', className: 'text-neutral-500' };
}

function ShipmentRowActions({
  order,
  processingId,
  onRetry,
  fullWidth = false,
}: {
  order: AdminOrder;
  processingId: string | null;
  onRetry: (id: string) => void;
  fullWidth?: boolean;
}) {
  const btn = fullWidth
    ? 'inline-flex items-center justify-center gap-1.5 w-full px-3 py-2.5 text-xs font-bold rounded-lg'
    : 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg';

  if (!order.delhivery_waybill) {
    return (
      <button
        type="button"
        onClick={() => onRetry(order.id)}
        disabled={processingId !== null}
        className={`${btn} bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-50`}
      >
        {processingId === order.id ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Truck className="w-3.5 h-3.5" />
        )}
        Retry Shipment
      </button>
    );
  }

  return (
    <div className={fullWidth ? 'flex flex-col gap-2' : 'inline-flex flex-wrap items-center justify-end gap-2'}>
      <button
        type="button"
        onClick={() => {
          void downloadShippingLabelForOrder(order.id, order).catch((err) => {
            alert(err instanceof Error ? err.message : 'Could not download label');
          });
        }}
        className={`${btn} bg-white/5 text-white border border-white/10 hover:bg-white/10`}
        title="Delhivery 4R (4×6″) shipping label"
      >
        <FileDown className="w-3.5 h-3.5" />
        Label PDF (4R)
      </button>
      {order.delhivery_pickup_token ? (
        <span className="text-xs text-neutral-500 text-center">Done</span>
      ) : (
        <Link
          to="/dashboard/admin/pickups"
          className={
            fullWidth
              ? 'inline-flex items-center justify-center w-full px-3 py-2.5 text-xs font-bold rounded-lg text-cyan-400 border border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-500/20'
              : 'text-xs font-bold text-cyan-400 hover:underline'
          }
        >
          Pickups →
        </Link>
      )}
    </div>
  );
}

/** Waybill / manifestation only. Pickup lives on /dashboard/admin/pickups. */
export default function ShipmentsPage() {
  const [query, setQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const [paidRes, processingRes, pendingRes] = await Promise.all([
        listAdminOrders(1, 50, 'paid'),
        listAdminOrders(1, 50, 'processing'),
        listAdminOrders(1, 50, 'pending'),
      ]);
      const combined = [...paidRes.orders, ...processingRes.orders, ...pendingRes.orders];
      const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
      unique.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setOrders(unique);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shipments');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  const handleRetryShipment = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      const updated = await createAdminOrderShipment(orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...updated } : o)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create shipment');
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (!inDateRange(o.created_at, dateFrom, dateTo)) return false;
      if (!q) return true;
      const customer = [o.shipping_address?.first_name, o.shipping_address?.last_name]
        .join(' ')
        .toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        customer.includes(q) ||
        (o.delhivery_waybill || '').toLowerCase().includes(q)
      );
    });
  }, [query, orders, dateFrom, dateTo]);

  const missingWaybill = filtered.filter((o) => !o.delhivery_waybill).length;
  const readyForPickup = filtered.filter(
    (o) => o.delhivery_waybill && !o.delhivery_pickup_token
  ).length;

  return (
    <div className="min-w-0">
      <PageHeader
        title="Pending"
        accent="Shipments."
        subtitle="Waybills are created automatically after payment. Download the packing label for the box, then schedule pickup on Pickups."
        action={
          <Link
            to="/dashboard/admin/pickups"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-4 sm:px-5 py-2.5 text-sm font-bold tracking-wide border border-white/[0.1] text-white bg-black/40 hover:bg-white/[0.04] rounded-xl"
          >
            <CalendarClock className="w-4 h-4" />
            Go to Pickups
            {readyForPickup > 0 ? ` (${readyForPickup})` : ''}
          </Link>
        }
      />

      <Card className="relative z-10">
        <div className="px-4 sm:px-6 py-4 border-b border-white/[0.04] flex flex-col gap-3 bg-[#0d0d0d]">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex items-center gap-3 w-full lg:flex-1 lg:max-w-md px-4 py-2 rounded-xl bg-[#050505] border border-white/[0.06]">
              <Search className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders / waybill…"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-neutral-500 text-white"
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
              <span>{missingWaybill} missing AWB</span>
              <span className="text-neutral-700">·</span>
              <span>{readyForPickup} ready for pickup</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-end gap-2">
            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full min-w-0 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#050505] border border-white/[0.08] text-sm text-white [color-scheme:dark]"
              />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                To
              </label>
              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full min-w-0 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#050505] border border-white/[0.08] text-sm text-white [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <TableSkeleton cols={5} rows={5} />
        ) : error ? (
          <EmptyState icon={CalendarX} title="Couldn't load shipments" subtitle={error} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No open shipments"
            subtitle="No pending / paid / processing orders needing a waybill."
          />
        ) : (
          <>
            {/* Mobile / tablet cards */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {filtered.map((o) => {
                const status = shipmentStatus(o);
                return (
                  <div key={o.id} className="px-4 py-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/dashboard/admin/orders/${o.id}`}
                          className="font-black text-cyan-400 hover:underline break-all"
                        >
                          {o.order_number}
                        </Link>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {formatDate(o.created_at)} · {o.status}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider text-right shrink-0 max-w-[40%] ${status.className}`}
                      >
                        {status.short}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{customerName(o)}</div>
                      <div className="text-xs text-neutral-500">{o.shipping_address?.city || '—'}</div>
                    </div>

                    <div className="min-w-0">
                      {o.delhivery_waybill ? (
                        <span className="inline-block max-w-full font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20 text-xs break-all">
                          {o.delhivery_waybill}
                        </span>
                      ) : (
                        <span className="text-amber-500/90 text-xs font-medium">No AWB yet</span>
                      )}
                    </div>

                    <ShipmentRowActions
                      order={o}
                      processingId={processingId}
                      onRetry={(id) => void handleRetryShipment(id)}
                      fullWidth
                    />
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[720px]">
                <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                  <tr>
                    <th className="px-4 lg:px-6 py-3">Order</th>
                    <th className="px-4 lg:px-6 py-3">Customer</th>
                    <th className="px-4 lg:px-6 py-3">Waybill (AWB)</th>
                    <th className="px-4 lg:px-6 py-3">Status</th>
                    <th className="px-4 lg:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map((o) => {
                    const status = shipmentStatus(o);
                    return (
                      <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 lg:px-6 py-3">
                          <Link
                            to={`/dashboard/admin/orders/${o.id}`}
                            className="font-black text-cyan-400 hover:underline"
                          >
                            {o.order_number}
                          </Link>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            {formatDate(o.created_at)} · {o.status}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3">
                          <div className="font-bold text-white">{customerName(o)}</div>
                          <div className="text-xs text-neutral-500">{o.shipping_address?.city || '—'}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-3">
                          {o.delhivery_waybill ? (
                            <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">
                              {o.delhivery_waybill}
                            </span>
                          ) : (
                            <span className="text-amber-500/90 text-xs font-medium">No AWB yet</span>
                          )}
                        </td>
                        <td className={`px-4 lg:px-6 py-3 text-xs font-bold ${status.className}`}>
                          {status.label}
                        </td>
                        <td className="px-4 lg:px-6 py-3 text-right">
                          <ShipmentRowActions
                            order={o}
                            processingId={processingId}
                            onRetry={(id) => void handleRetryShipment(id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
