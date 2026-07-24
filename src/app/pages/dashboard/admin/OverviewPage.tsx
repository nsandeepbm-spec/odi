import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  IndianRupee,
  CalendarCheck,
  Users,
  Package,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  PageHeader,
  StatCard,
  Card,
  OrderBadge,
  EmptyState,
  inrFromPaise,
} from '../../../components/dashboard/shared';
import { getAdminOverview, type AdminOverview } from '../../../lib/api';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function OverviewPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const overview = await getAdminOverview();
        if (!cancelled) {
          setData(overview);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load overview');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">Loading overview…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200/60 p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="font-bold text-sm">Could not load admin overview</p>
        <p className="text-xs text-neutral-500 max-w-sm">{error ?? 'Unknown error'}</p>
        <p className="text-xs text-neutral-400">
          Sign in as an admin and ensure the API is running with Supabase connected.
        </p>
      </div>
    );
  }

  const { kpis, revenueSeries, catalog, recentOrders } = data;
  const chartData = revenueSeries.map((r) => ({
    month: r.month,
    revenue: Math.round(r.revenuePaise / 100),
  }));

  return (
    <div>
      <PageHeader
        title="Admin"
        accent="Overview."
        subtitle="Live store metrics from orders and catalog."
        action={
          <Link
            to="/dashboard/admin/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide bg-neutral-900 text-white hover:-translate-y-0.5 transition-transform rounded-xl"
          >
            Manage products <ArrowUpRight className="w-4 h-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={inrFromPaise(kpis.revenuePaise)}
          icon={IndianRupee}
          delay={0}
        />
        <StatCard
          label="Orders"
          value={String(kpis.orderCount)}
          icon={CalendarCheck}
          delay={0.06}
        />
        <StatCard
          label="Active Customers"
          value={String(kpis.customerCount)}
          icon={Users}
          delay={0.12}
        />
        <StatCard
          label="Live Products"
          value={`${kpis.liveProductCount}/${kpis.productCount}`}
          icon={Package}
          delay={0.18}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card
          title="Revenue"
          className="xl:col-span-2"
          action={
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
              Last 7 months
            </span>
          }
        >
          <div className="px-4 pt-6 pb-4 h-[320px]">
            {chartData.every((d) => d.revenue === 0) ? (
              <EmptyState
                icon={IndianRupee}
                title="No paid orders yet"
                subtitle="Revenue appears here after successful Razorpay payments."
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EE" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#A3A3A3' }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#A3A3A3' }}
                    tickFormatter={(v: number) => (v >= 1000 ? `₹${v / 1000}k` : `₹${v}`)}
                    width={52}
                  />
                  <Tooltip
                    formatter={(value: number) => [inrFromPaise(value * 100), 'Revenue']}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #E8E8E8',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    strokeWidth={2.5}
                    fill="url(#revGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card
          title="Catalog Snapshot"
          action={
            <Link
              to="/dashboard/admin/products"
              className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              Manage
            </Link>
          }
        >
          {catalog.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products yet"
              subtitle="Add your first kit from the Products page."
            />
          ) : (
            <div className="divide-y divide-neutral-100">
              {catalog.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-11 h-11 rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-4 h-4 text-neutral-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate">{p.name}</p>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                      {p.volume || p.slug}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {p.status === 'live' ? (
                      <>
                        <p className="text-sm font-black">{p.stockQty}</p>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                          stock
                        </p>
                      </>
                    ) : (
                      <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded bg-indigo-50 text-indigo-600">
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card
        title={`Recent Orders${kpis.attentionCount ? ` · ${kpis.attentionCount} need attention` : ''}`}
        action={
          <Link
            to="/dashboard/admin/bookings"
            className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            View All
          </Link>
        }
      >
        {recentOrders.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No orders yet"
            subtitle="Orders will appear here after customers complete checkout."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[640px]">
              <thead className="bg-neutral-50/80 text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold">
                <tr>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-indigo-600">{o.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{o.customerName}</div>
                      <div className="text-xs text-neutral-400">{o.customerEmail ?? '—'}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{formatDate(o.createdAt)}</td>
                    <td className="px-6 py-4">
                      <OrderBadge status={o.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-black">{inrFromPaise(o.totalPaise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
