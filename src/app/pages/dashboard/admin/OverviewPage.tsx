import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  IndianRupee,
  CalendarCheck,
  Users,
  Package,
  ArrowUpRight,
  AlertCircle,
  ChevronRight,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  StatCard,
  Card,
  OrderBadge,
  EmptyState,
  inrFromPaise,
  DashboardSkeleton,
} from '../../../components/dashboard/shared';
import { getAdminOverview, type AdminOverview } from '../../../lib/api';
import { isLowStock, getAdminStoreSettings } from '../../../lib/adminSettings';

const panel =
  '!border-neutral-500/55 shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]';

const REVENUE_COLORS = ['#22d3ee', '#818cf8', '#c084fc', '#34d399', '#fbbf24', '#fb7185', '#60a5fa'];

type ChartType = 'area' | 'bar' | 'line' | 'combo';
type PeriodType = 'day' | 'week' | 'month';

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'area', label: 'Area' },
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'combo', label: 'Combo' },
];

const PERIODS: { value: PeriodType; label: string; hint: string }[] = [
  { value: 'day', label: 'Day', hint: 'Last 14 days' },
  { value: 'week', label: 'Week', hint: 'Last 8 weeks' },
  { value: 'month', label: 'Month', hint: 'Last 7 months' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Compact INR axis ticks: ₹999 · ₹1.2k · ₹1.5L · ₹2.1Cr */
function formatInrAxis(rupees: number): string {
  const n = Math.abs(rupees);
  if (n >= 1_00_00_000) return `₹${(rupees / 1_00_00_000).toFixed(1)}Cr`;
  if (n >= 1_00_000) return `₹${(rupees / 1_00_000).toFixed(n >= 10_00_000 ? 1 : 2)}L`;
  if (n >= 1000) return `₹${(rupees / 1000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return `₹${Math.round(rupees)}`;
}

function ChartTooltipShell({
  active,
  label,
  children,
}: {
  active?: boolean;
  label?: string;
  children: React.ReactNode;
}) {
  if (!active) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0c0c0c]/95 px-3.5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md">
      {label && (
        <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500">
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

const PIE_COLORS = ['#22d3ee', '#34d399', '#a78bfa', '#fbbf24', '#fb7185', '#60a5fa', '#2dd4bf'];

/** Visual-first donut — large chart, short legend, minimal copy. */
function PieInsightCard({
  title,
  subtitle,
  centerValue,
  centerHint,
  data,
  colors = PIE_COLORS,
  formatValue,
  emptyTitle,
  emptySubtitle,
}: {
  title: string;
  subtitle: string;
  centerValue: string;
  centerHint: string;
  data: { name: string; value: number }[];
  colors?: string[];
  formatValue?: (v: number) => string;
  emptyTitle: string;
  emptySubtitle: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const fmt = formatValue ?? ((v: number) => String(v));

  return (
    <Card
      title={title}
      className={panel}
      action={
        <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-neutral-500">
          {subtitle}
        </span>
      }
    >
      <div className="px-4 sm:px-5 pt-2 pb-5">
        {total <= 0 ? (
          <EmptyState icon={Package} title={emptyTitle} subtitle={emptySubtitle} />
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-[180px] h-[180px] sm:w-[190px] sm:h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={data.length > 1 ? 3 : 0}
                    cornerRadius={4}
                    stroke="#0A0A0A"
                    strokeWidth={2}
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => (
                      <ChartTooltipShell active={active}>
                        {payload?.[0] && (
                          <p className="text-sm font-semibold text-white">
                            {payload[0].name}
                            <span className="text-neutral-500"> · </span>
                            {fmt(Number(payload[0].value))}
                          </p>
                        )}
                      </ChartTooltipShell>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                <p className="text-xl font-black text-white tracking-tight leading-none tabular-nums truncate max-w-[110px]">
                  {centerValue}
                </p>
                <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                  {centerHint}
                </p>
              </div>
            </div>

            <ul className="mt-5 w-full flex flex-wrap justify-center gap-x-4 gap-y-2">
              {data.map((d, i) => {
                const pct = Math.round((d.value / total) * 100);
                return (
                  <li key={d.name} className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: colors[i % colors.length] }}
                    />
                    <span className="font-medium text-neutral-300">{d.name}</span>
                    <span className="font-semibold text-white tabular-nums">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}

function RevenueChartDefs() {
  return (
    <defs>
      <linearGradient id="revAreaFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
        <stop offset="70%" stopColor="#0ea5e9" stopOpacity={0.08} />
        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="revBarFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.95} />
        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.45} />
      </linearGradient>
    </defs>
  );
}

function revenueAxisProps(peakRevenue: number) {
  const niceMax =
    peakRevenue <= 0
      ? 1000
      : peakRevenue < 2000
        ? Math.max(peakRevenue * 1.5, 1500)
        : peakRevenue < 10000
          ? peakRevenue * 1.3
          : peakRevenue * 1.15;
  return {
    axisLine: false as const,
    tickLine: false as const,
    tick: { fontSize: 11, fill: '#71717a', fontWeight: 600 },
    tickFormatter: formatInrAxis,
    width: 52,
    domain: [0, Math.ceil(niceMax)] as [number, number],
    allowDecimals: false as const,
  };
}

function revenueXAxisProps(dense: boolean) {
  return {
    dataKey: 'month' as const,
    axisLine: false as const,
    tickLine: false as const,
    tick: { fontSize: dense ? 10 : 11, fill: '#a1a1aa', fontWeight: 700 },
    dy: 10,
    interval: dense ? 'preserveStartEnd' as const : 0,
    minTickGap: dense ? 12 : 4,
  };
}

function RevenueTooltip() {
  return (
    <Tooltip
      cursor={{ stroke: 'rgba(255,255,255,0.35)', strokeWidth: 1 }}
      content={({ active, label, payload }) => (
        <ChartTooltipShell active={active} label={label ? String(label) : undefined}>
          {payload?.[0] && (
            <p className="text-sm font-bold text-sky-400">
              Revenue : {inrFromPaise(Number(payload[0].value) * 100)}
            </p>
          )}
        </ChartTooltipShell>
      )}
    />
  );
}

export default function OverviewPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<ChartType>('area');
  const [period, setPeriod] = useState<PeriodType>('day');
  const periodSeeded = React.useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const overview = await getAdminOverview();
        if (!cancelled) {
          setData(overview);
          setError(null);
          if (!periodSeeded.current) {
            periodSeeded.current = true;
            setPeriod(overview.revenueGranularity ?? 'day');
          }
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

  const rawSeries = useMemo(() => {
    if (!data) return [];
    const by = data.revenueSeriesBy;
    if (by?.[period]) return by[period];
    return data.revenueSeries;
  }, [data, period]);

  const chartData = useMemo(() => {
    const all = rawSeries.map((r) => ({
      month: r.month,
      revenue: Math.round(r.revenuePaise / 100),
      revenuePaise: r.revenuePaise,
    }));
    if (all.every((d) => d.revenue === 0)) return all;

    // Day view: keep continuous 14-day area (like the classic chart), but drop
    // long leading zeros so the curve isn't stuck on the floor.
    if (period === 'day') {
      const first = all.findIndex((d) => d.revenue > 0);
      if (first <= 0) return all;
      return all.slice(Math.max(0, first - 1));
    }

    const first = all.findIndex((d) => d.revenue > 0);
    const last = all.length - 1 - [...all].reverse().findIndex((d) => d.revenue > 0);
    return all.slice(Math.max(0, first), last + 1);
  }, [rawSeries, period]);

  const revenuePie = useMemo(() => {
    const rows = rawSeries
      .filter((r) => r.revenuePaise > 0)
      .map((r) => ({
        name: r.month,
        value: Math.round(r.revenuePaise / 100),
      }));
    if (rows.length <= 6) return rows;
    const sorted = [...rows].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, 5);
    const other = sorted.slice(5).reduce((s, r) => s + r.value, 0);
    return other > 0 ? [...top, { name: 'Other', value: other }] : top;
  }, [rawSeries]);

  const chartPeriodLabel = PERIODS.find((p) => p.value === period)?.hint ?? 'Revenue';
  const denseAxis = period === 'day';

  const ordersPie = useMemo(() => {
    if (!data) return [];
    const paid = data.kpis.paidOrderCount;
    const open = Math.max(0, data.kpis.orderCount - paid);
    const rows = [
      { name: 'Paid', value: paid },
      { name: 'Open', value: open },
    ].filter((r) => r.value > 0);
    // Prefer recent status mix when we have variety (better pie).
    const statusMap = new Map<string, number>();
    for (const o of data.recentOrders) {
      const key = o.status.replace(/_/g, ' ');
      statusMap.set(key, (statusMap.get(key) ?? 0) + 1);
    }
    if (statusMap.size >= 2) {
      return [...statusMap.entries()].map(([name, value]) => ({ name, value }));
    }
    return rows;
  }, [data]);

  const customersPie = useMemo(() => {
    if (!data) return [];
    const active = data.kpis.customerCount;
    const total = data.kpis.totalCustomerCount ?? active;
    const other = Math.max(0, total - active);
    if (active <= 0 && other <= 0) return [];
    if (other > 0) {
      return [
        { name: 'Active', value: active },
        { name: 'Inactive', value: other },
      ];
    }
    return [{ name: 'Active', value: active }];
  }, [data]);

  if (loading) return <DashboardSkeleton cols={4} rows={8} />;

  if (error || !data) {
    return (
      <div className={`bg-[#0A0A0A] rounded-2xl border border-neutral-500/55 p-10 flex flex-col items-center text-center gap-3 ${panel}`}>
        <AlertCircle className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <p className="font-bold text-sm text-white">Could not load admin overview</p>
        <p className="text-xs text-neutral-400 max-w-sm">{error ?? 'Unknown error'}</p>
        <p className="text-xs text-neutral-500">
          Sign in as an admin and ensure the API is running with Supabase connected.
        </p>
      </div>
    );
  }

  const { kpis, catalog, recentOrders } = data;
  const stockThreshold = getAdminStoreSettings().lowStockThreshold;
  const lowStockCount = catalog.filter(
    (p) => p.status === 'live' && isLowStock(p.stockQty, stockThreshold)
  ).length;
  const peakRevenue = chartData.reduce((m, d) => Math.max(m, d.revenue), 0);
  const yAxis = revenueAxisProps(peakRevenue);
  const xAxis = revenueXAxisProps(denseAxis);

  return (
    <div className="min-w-0">
      <header className="relative z-10 mb-8 overflow-hidden rounded-2xl border border-neutral-500/55 bg-[#0A0A0A] shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-500/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-500/[0.05] blur-3xl pointer-events-none" />

        <div className="relative px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-cyan-400/25 bg-cyan-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
                <LayoutDashboard className="w-3 h-3" />
                Dashboard
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                Live metrics
              </span>
            </div>
            <h1
              className="font-black tracking-tight text-white leading-none"
              style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)', letterSpacing: '-0.03em' }}
            >
              Admin{' '}
              <span className="bg-gradient-to-br from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Overview.
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-neutral-400 leading-relaxed">
              Live store metrics from orders and catalog.
            </p>
          </div>

          <Link
            to="/dashboard/admin/products"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-5 py-2.5 text-sm font-bold tracking-wide bg-cyan-500 text-white hover:bg-cyan-400 transition-all rounded-xl"
          >
            Manage products <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 relative z-10">
        <StatCard
          label="Total Revenue"
          value={inrFromPaise(kpis.revenuePaise)}
          icon={IndianRupee}
          delay={0}
          className={panel}
        />
        <StatCard
          label="Orders"
          value={String(kpis.orderCount)}
          icon={CalendarCheck}
          delay={0.06}
          className={panel}
        />
        <StatCard
          label="Active Customers"
          value={String(kpis.customerCount)}
          icon={Users}
          delay={0.12}
          className={panel}
        />
        <StatCard
          label="Live Products"
          value={`${kpis.liveProductCount}/${kpis.productCount}`}
          icon={Package}
          delay={0.18}
          className={panel}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 relative z-10">
        <PieInsightCard
          title="Revenue mix"
          subtitle={chartPeriodLabel}
          centerValue={formatInrAxis(Math.round(kpis.revenuePaise / 100))}
          centerHint="Total"
          data={revenuePie}
          formatValue={(v) => formatInrAxis(v)}
          emptyTitle="No paid orders yet"
          emptySubtitle="Share appears after successful payments."
        />
        <PieInsightCard
          title="Orders"
          subtitle="Status"
          centerValue={String(kpis.orderCount)}
          centerHint="Orders"
          data={ordersPie}
          colors={['#34d399', '#fbbf24', '#38bdf8', '#a78bfa', '#fb7185']}
          emptyTitle="No orders yet"
          emptySubtitle="Order mix appears once customers place orders."
        />
        <PieInsightCard
          title="Customers"
          subtitle="Base"
          centerValue={String(kpis.customerCount)}
          centerHint="Active"
          data={customersPie}
          colors={['#22d3ee', '#52525b']}
          emptyTitle="No customers yet"
          emptySubtitle="Appears after sign-ups."
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 relative z-10">
        <Card
          title="Revenue"
          className={`xl:col-span-2 ${panel}`}
          action={
            <div className="flex flex-wrap items-center justify-end gap-2">
              <div className="inline-flex rounded-lg border border-neutral-500/45 bg-black/40 p-0.5">
                {PERIODS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPeriod(p.value)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-colors ${
                      period === p.value
                        ? 'bg-cyan-500 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as ChartType)}
                  aria-label="Chart type"
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-neutral-500/50 bg-black/40 text-xs font-bold text-neutral-200 hover:border-neutral-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 cursor-pointer"
                >
                  {CHART_TYPES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-[#0a0a0a] text-white">
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              </div>
            </div>
          }
        >
          <div className="px-3 sm:px-4 pt-2 pb-1 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 pl-1">
              {chartPeriodLabel}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-600 pl-1">
              ₹ INR
            </p>
          </div>
          <div className="px-3 sm:px-4 pt-1 pb-4 h-[260px] sm:h-[340px]">
            {chartData.every((d) => d.revenue === 0) ? (
              <EmptyState
                icon={IndianRupee}
                title="No paid revenue yet"
                subtitle={
                  kpis.orderCount > 0
                    ? `${kpis.orderCount} order${kpis.orderCount === 1 ? '' : 's'} placed — chart fills after payment / COD fulfillment.`
                    : 'Revenue appears here after successful payments.'
                }
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={chartData} margin={{ top: 28, right: 16, left: 4, bottom: 8 }}>
                    <RevenueChartDefs />
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis {...xAxis} />
                    <YAxis {...yAxis} />
                    <RevenueTooltip />
                    <Bar
                      dataKey="revenue"
                      radius={[10, 10, 4, 4]}
                      barSize={chartData.length <= 5 ? 56 : chartData.length <= 8 ? 40 : 28}
                      name="Revenue"
                      minPointSize={6}
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={REVENUE_COLORS[i % REVENUE_COLORS.length]} fillOpacity={0.9} />
                      ))}
                      <LabelList
                        dataKey="revenue"
                        position="top"
                        formatter={(v: number) => (v > 0 ? formatInrAxis(v) : '')}
                        style={{ fill: '#d4d4d8', fontSize: 11, fontWeight: 800 }}
                      />
                    </Bar>
                  </BarChart>
                ) : chartType === 'line' ? (
                  <LineChart data={chartData} margin={{ top: 16, right: 16, left: 4, bottom: 8 }}>
                    <RevenueChartDefs />
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis {...xAxis} />
                    <YAxis {...yAxis} />
                    <RevenueTooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      connectNulls
                      dot={{ r: 4, fill: '#0a0a0a', stroke: '#22d3ee', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#22d3ee', stroke: '#fff', strokeWidth: 2 }}
                      name="Revenue"
                    />
                  </LineChart>
                ) : chartType === 'combo' ? (
                  <ComposedChart data={chartData} margin={{ top: 28, right: 16, left: 4, bottom: 8 }}>
                    <RevenueChartDefs />
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis {...xAxis} />
                    <YAxis {...yAxis} />
                    <RevenueTooltip />
                    <Bar
                      dataKey="revenue"
                      radius={[10, 10, 4, 4]}
                      barSize={chartData.length <= 5 ? 48 : 28}
                      opacity={0.85}
                      name="Revenue"
                      minPointSize={6}
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={REVENUE_COLORS[i % REVENUE_COLORS.length]} />
                      ))}
                    </Bar>
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22d3ee"
                      strokeWidth={2.5}
                      fill="url(#revAreaFill)"
                      dot={false}
                      name="Revenue"
                    />
                  </ComposedChart>
                ) : (
                  <AreaChart data={chartData} margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
                    <RevenueChartDefs />
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis {...xAxis} />
                    <YAxis {...yAxis} />
                    <RevenueTooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      fill="url(#revAreaFill)"
                      dot={{ r: 4, fill: '#0a0a0a', stroke: '#22d3ee', strokeWidth: 2 }}
                      activeDot={{
                        r: 6,
                        fill: '#22d3ee',
                        stroke: '#ffffff',
                        strokeWidth: 2,
                      }}
                      name="Revenue"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card
          title="Catalog Snapshot"
          className={panel}
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
            <div className="divide-y divide-white/[0.06]">
              {catalog.map((p) => {
                const low = p.status === 'live' && isLowStock(p.stockQty, stockThreshold);
                return (
                <div key={p.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-neutral-500/40 overflow-hidden shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
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
        className={`relative z-10 ${panel}`}
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
            <div className="md:hidden divide-y divide-white/[0.06]">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  to={
                    o.channel === 'BULK_OFFLINE'
                      ? `/dashboard/admin/bulk-orders/${o.id}`
                      : `/dashboard/admin/orders/${o.id}`
                  }
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
                        {o.channel === 'BULK_OFFLINE' ? ' · Bulk' : ''}
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

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[640px]">
                <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-neutral-500/40">
                  <tr>
                    <th className="px-4 lg:px-6 py-4">Order</th>
                    <th className="px-4 lg:px-6 py-4">Customer</th>
                    <th className="px-4 lg:px-6 py-4">Date</th>
                    <th className="px-4 lg:px-6 py-4">Status</th>
                    <th className="px-4 lg:px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 lg:px-6 py-4">
                        <Link
                          to={
                            o.channel === 'BULK_OFFLINE'
                              ? `/dashboard/admin/bulk-orders/${o.id}`
                              : `/dashboard/admin/orders/${o.id}`
                          }
                          className="font-black text-cyan-400 group-hover:text-cyan-300 transition-colors hover:underline"
                        >
                          {o.orderNumber}
                        </Link>
                        {o.channel === 'BULK_OFFLINE' && (
                          <div className="mt-0.5">
                            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border border-violet-500/30 text-violet-300 bg-violet-500/10">
                              Bulk
                            </span>
                          </div>
                        )}
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
