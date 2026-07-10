import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { IndianRupee, CalendarCheck, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageHeader, StatCard, Card, BookingBadge, inr } from '../../../components/dashboard/shared';
import { bookings, revenueSeries, products } from '../../../data/mock';
import { listUsers } from '../../../lib/api';

export default function OverviewPage() {
  const recent = bookings.slice(0, 5);
  const attention = bookings.filter((b) => b.status === 'processing' || b.payment === 'pending').length;
  const [activeCustomers, setActiveCustomers] = useState<string>('—');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await listUsers(1, 100);
        if (cancelled) return;
        const activeOnPage = result.users.filter((u) => u.status === 'active').length;
        // Full list fits in one page → show exact active count; otherwise show total users.
        setActiveCustomers(
          String(result.users.length >= result.total ? activeOnPage : result.total)
        );
      } catch {
        if (!cancelled) setActiveCustomers('—');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <PageHeader
        title="Admin"
        accent="Overview."
        subtitle="Everything happening across the store, at a glance."
        action={
          <Link
            to="/dashboard/admin/bookings"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide bg-neutral-900 text-white hover:-translate-y-0.5 transition-transform rounded-xl"
          >
            View Bookings <ArrowUpRight className="w-4 h-4" />
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" value={inr(145850)} icon={IndianRupee} trend="+12.5%" delay={0} />
        <StatCard label="Total Bookings" value="412" icon={CalendarCheck} trend="+5.2%" delay={0.06} />
        <StatCard label="Active Customers" value={activeCustomers} icon={Users} delay={0.12} />
        <StatCard label="Conversion Rate" value="3.4%" icon={TrendingUp} trend="+1.2%" delay={0.18} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Revenue chart */}
        <Card
          title="Revenue"
          className="xl:col-span-2"
          action={<span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">Last 7 months</span>}
        >
          <div className="px-4 pt-6 pb-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EE" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A3A3A3' }} dy={8} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#A3A3A3' }}
                  tickFormatter={(v: number) => `₹${v / 1000}k`}
                  width={52}
                />
                <Tooltip
                  formatter={(value: number) => [inr(value), 'Revenue']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E8E8E8', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#revGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top products */}
        <Card title="Catalog Snapshot" action={
          <Link to="/dashboard/admin/products" className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors">
            Manage
          </Link>
        }>
          <div className="divide-y divide-neutral-100">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-11 h-11 rounded-xl bg-neutral-50 border border-neutral-100 overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate">{p.name}</p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">{p.volume}</p>
                </div>
                <div className="text-right shrink-0">
                  {p.status === 'live' ? (
                    <>
                      <p className="text-sm font-black">{p.sold}</p>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">sold</p>
                    </>
                  ) : (
                    <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded bg-indigo-50 text-indigo-600">Soon</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent bookings */}
      <Card
        title={`Recent Bookings${attention ? ` · ${attention} need attention` : ''}`}
        action={
          <Link to="/dashboard/admin/bookings" className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors">
            View All
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[640px]">
            <thead className="bg-neutral-50/80 text-neutral-400 text-[10px] uppercase tracking-[0.15em] font-bold">
              <tr>
                <th className="px-6 py-3.5">Booking</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recent.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-6 py-4 font-bold text-indigo-600">#{b.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{b.customer}</div>
                    <div className="text-xs text-neutral-400">{b.date}</div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">{b.product}</td>
                  <td className="px-6 py-4"><BookingBadge status={b.status} /></td>
                  <td className="px-6 py-4 text-right font-black">{inr(b.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
