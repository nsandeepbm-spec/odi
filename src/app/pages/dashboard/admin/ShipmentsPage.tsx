import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Search, Truck, Package, Loader2, CalendarX, CheckCircle2 } from 'lucide-react';
import { PageHeader, Card, EmptyState, inrFromPaise, TableSkeleton } from '../../../components/dashboard/shared';
import {
  listAdminOrders,
  createAdminOrderShipment,
  createAdminOrderPickup,
  type AdminOrder,
} from '../../../lib/api';
import { inDateRange } from '../../../lib/csv';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ShipmentsPage() {
  const [query, setQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track loading state for individual action buttons
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [globalActionLoading, setGlobalActionLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both paid and processing to find unshipped orders. 
      // Delhivery shipped ones will have delhivery_waybill.
      const [paidRes, processingRes] = await Promise.all([
        listAdminOrders(1, 50, 'paid'),
        listAdminOrders(1, 50, 'processing')
      ]);
      const combined = [...paidRes.orders, ...processingRes.orders];
      // Deduplicate just in case
      const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
      // Sort by newest first
      unique.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setOrders(unique);
      setTotal(unique.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shipments');
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateShipment = async (orderId: string) => {
    setProcessingId(`shipment-${orderId}`);
    try {
      const updated = await createAdminOrderShipment(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updated } : o));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create shipment. API not implemented yet.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRequestPickup = async (orderId: string) => {
    setProcessingId(`pickup-${orderId}`);
    try {
      const updated = await createAdminOrderPickup(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updated } : o));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to request pickup. API not implemented yet.');
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      // Hide already delivered or shipped if we only care about pending fulfillment
      // but since we query 'paid' and 'processing', we are good.
      if (!inDateRange(o.created_at, dateFrom, dateTo)) return false;
      if (!q) return true;
      const customer = [o.shipping_address?.first_name, o.shipping_address?.last_name].join(' ').toLowerCase();
      const email = (o.shipping_address?.email || '').toLowerCase();
      return (
        o.order_number.toLowerCase().includes(q) ||
        customer.includes(q) ||
        email.includes(q)
      );
    });
  }, [query, orders, dateFrom, dateTo]);

  const readyForPickup = filtered.filter(o => o.delhivery_waybill && !o.delhivery_pickup_token).length;

  return (
    <div>
      <PageHeader
        title="Pending"
        accent="Fulfillments."
        subtitle="Manage pending shipments, generate waybills, and schedule courier pickups."
        action={
          <button
            type="button"
            disabled={globalActionLoading || readyForPickup === 0}
            onClick={() => {
              alert('Bulk pickup will be implemented alongside the API.');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wide bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-[0_0_18px_rgba(52,211,153,0.22)] hover:shadow-[0_0_24px_rgba(20,184,166,0.35)] transition-all rounded-xl relative z-10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Truck className="w-4 h-4" /> 
            Schedule {readyForPickup > 0 ? readyForPickup : 'All'} Pickups
          </button>
        }
      />

      <Card className="relative z-10">
        {/* Toolbar */}
        <div className="px-6 py-5 border-b border-white/[0.04] flex flex-col gap-4 bg-[#0d0d0d]">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md px-4 py-2.5 rounded-xl bg-[#050505] border border-white/[0.06] shadow-inner focus-within:border-white/[0.2] transition-colors">
              <Search className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders to ship…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500 text-white"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <TableSkeleton cols={7} rows={5} />
        ) : error ? (
          <EmptyState icon={CalendarX} title="Couldn't load shipments" subtitle={error} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="All caught up!" subtitle="There are no paid orders waiting to be shipped." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[900px]">
              <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Waybill (AWB)</th>
                  <th className="px-6 py-4">Pickup Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((o) => {
                  const customer = [o.shipping_address?.first_name, o.shipping_address?.last_name].filter(Boolean).join(' ') || 'Customer';
                  const itemStr = o.order_items?.map(i => i.snapshot_name).join(', ') || 'Items';
                  
                  return (
                    <tr key={o.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <Link
                          to={`/dashboard/admin/orders/${o.id}`}
                          className="font-black text-cyan-400 group-hover:text-cyan-300 transition-colors hover:underline"
                        >
                          {o.order_number}
                        </Link>
                        <div className="text-xs text-neutral-500 mt-0.5">{formatDate(o.created_at)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{customer}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{o.shipping_address?.city || 'No City'}</div>
                      </td>
                      <td className="px-6 py-4 text-neutral-300 truncate max-w-[200px] font-medium" title={itemStr}>
                        {itemStr}
                      </td>
                      <td className="px-6 py-4">
                        {o.delhivery_waybill ? (
                          <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">
                            {o.delhivery_waybill}
                          </span>
                        ) : (
                          <span className="text-neutral-500 italic text-xs">Not generated</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {o.delhivery_pickup_token ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Scheduled
                          </div>
                        ) : o.delhivery_waybill ? (
                          <span className="text-amber-500 font-bold text-xs">Needs Pickup</span>
                        ) : (
                          <span className="text-neutral-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!o.delhivery_waybill ? (
                          <button
                            onClick={() => handleCreateShipment(o.id)}
                            disabled={processingId !== null}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-white/[0.1] hover:bg-white/[0.05] transition-colors disabled:opacity-50"
                          >
                            {processingId === `shipment-${o.id}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Package className="w-3.5 h-3.5" />}
                            Create Shipment
                          </button>
                        ) : !o.delhivery_pickup_token ? (
                          <button
                            onClick={() => handleRequestPickup(o.id)}
                            disabled={processingId !== null}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
                          >
                            {processingId === `pickup-${o.id}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />}
                            Request Pickup
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-neutral-500">All Done</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
