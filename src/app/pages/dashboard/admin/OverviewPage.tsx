import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  IndianRupee,
  CalendarCheck,
  Users,
  Package,
  ArrowUpRight,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  PageHeader,
  StatCard,
  Card,
  OrderBadge,
  EmptyState,
  inrFromPaise,
  DashboardSkeleton,
} from '../../../components/dashboard/shared';
import { getAdminOverview, type AdminOverview } from '../../../lib/api';
import { isLowStock, getAdminStoreSettings } from '../../../lib/adminSettings';

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

  if (loading) return <DashboardSkeleton cols={4} rows={8} />;

  if (error || !data) {
    return (
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <p className="font-bold text-sm text-white">Could not load admin overview</p>
        <p className="text-xs text-neutral-400 max-w-sm">{error ?? 'Unknown error'}</p>
        <p className="text-xs text-neutral-500">
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
  const stockThreshold = getAdminStoreSettings().lowStockThreshold;
  const lowStockCount = catalog.filter(
    (p) => p.status === 'live' && isLowStock(p.stockQty, stockThreshold)
  ).length;

  return (
    <div className="min-w-0">
      <PageHeader
        title="Admin"
        accent="Overview."
        subtitle="Live store metrics from orders and catalog."
        action={
          <Link
            to="/dashboard/admin/products"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-6 py-3 text-sm font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all rounded-xl"
          >
            Manage products <ArrowUpRight className="w-4 h-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 relative z-10">
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 relative z-10">
        <Card
          title="Revenue"
          className="xl:col-span-2"
          action={
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500">
              Last 7 months
            </span>
          }
        >
          <div className="px-3 sm:px-4 pt-6 pb-4 h-[240px] sm:h-[320px]">
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
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#71717a', fontWeight: 600 }}
                    dy={12}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#71717a', fontWeight: 600 }}
                    tickFormatter={(v: number) => (v >= 1000 ? `₹${v / 1000}k` : `₹${v}`)}
                    width={52}
                  />
                  <Tooltip
                    formatter={(value: number) => [inrFromPaise(value * 100), 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      fontSize: 12,
                      color: '#fafafa',
                      fontWeight: 'bold',
                    }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    fill="url(#revGradient)"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(56,189,248,0.5))' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card
          title="Catalog Snapshot"
          action={
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              {lowStockCount > 0 && (
                <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded border bg-amber-500/10 text-amber-300 border-amber-500/25">
                  {lowStockCount} low stock
                </span>
              )}
              <Link
                to="/dashboard/admin/products"
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Manage
              </Link>
            </div>
          }
        >
          {catalog.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products yet"
              subtitle="Add your first kit from the Products page."
            />
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {catalog.map((p) => {
                const low = p.status === 'live' && isLowStock(p.stockQty, stockThreshold);
                return (
                <div key={p.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] overflow-hidden shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-neutral-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate text-white">{p.name}</p>
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mt-0.5">
                      {p.volume || p.slug}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {p.status === 'live' ? (
                      <>
                        <p className={`text-sm font-black ${low ? 'text-amber-300' : 'text-white'}`}>{p.stockQty}</p>
                        <p className={`text-[10px] font-bold tracking-[0.2em] uppercase ${low ? 'text-amber-400/80' : 'text-neutral-500'}`}>
                          {low ? 'low stock' : 'stock'}
                        </p>
                      </>
                    ) : (
                      <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </Card>
      </div>

      <Card
        className="relative z-10"
        title="Recent Orders"
        action={
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            {kpis.attentionCount > 0 && (
              <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded border bg-amber-500/10 text-amber-300 border-amber-500/25">
                {kpis.attentionCount} need attention
              </span>
            )}
            <Link
              to="/dashboard/admin/orders"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View All
            </Link>
          </div>
        }
      >
        {recentOrders.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No orders yet"
            subtitle="Orders will appear here after customers complete checkout."
          />
        ) : (
          <>
            {/* Mobile / tablet cards */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  to={`/dashboard/admin/orders/${o.id}`}
                  className="flex items-center gap-3 px-4 py-4 active:bg-white/[0.02] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-sm text-cyan-400 truncate">{o.orderNumber}</span>
                      <span className="font-black text-sm text-white shrink-0">
                        {inrFromPaise(o.totalPaise)}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white truncate mt-1">{o.customerName}</p>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <span className="text-xs text-neutral-500 font-medium truncate">
                        {formatDate(o.createdAt)}
                      </span>
                      <span className="shrink-0">
                        <OrderBadge status={o.status} />
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
                </Link>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[640px]">
                <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                  <tr>
                    <th className="px-4 lg:px-6 py-4">Order</th>
                    <th className="px-4 lg:px-6 py-4">Customer</th>
                    <th className="px-4 lg:px-6 py-4">Date</th>
                    <th className="px-4 lg:px-6 py-4">Status</th>
                    <th className="px-4 lg:px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 lg:px-6 py-4">
                        <Link
                          to={`/dashboard/admin/orders/${o.id}`}
                          className="font-black text-cyan-400 group-hover:text-cyan-300 transition-colors hover:underline"
                        >
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="font-bold text-white">{o.customerName}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{o.customerEmail ?? '—'}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-neutral-400 font-medium">
                        {formatDate(o.createdAt)}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <OrderBadge status={o.status} />
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right font-black text-white">
                        {inrFromPaise(o.totalPaise)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
