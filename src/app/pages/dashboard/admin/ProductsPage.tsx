import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Pencil, AlertCircle, Package, Search } from 'lucide-react';
import { Link } from 'react-router';
import { PageHeader, EmptyState, inrFromPaise, Card, DashboardSkeleton } from '../../../components/dashboard/shared';
import {
  listAdminProducts,
  type AdminProduct,
  type AdminProductStatus,
} from '../../../lib/api';
import { cardImageUrl } from '../../../lib/productImages';
import { discountPercent } from '../../../data/products';
import { getAdminStoreSettings, isLowStock } from '../../../lib/adminSettings';
import { inDateRange } from '../../../lib/csv';

const STATUS_FILTERS: { label: string; value: 'all' | AdminProductStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Live', value: 'live' },
  { label: 'Coming Soon', value: 'coming_soon' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const chipBase =
  'px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border shadow-lg shadow-black/40';

function statusChip(status: AdminProductStatus) {
  switch (status) {
    case 'live':
      return (
        <span className={`${chipBase} bg-emerald-950 text-emerald-300 border-emerald-500/50`}>
          Live
        </span>
      );
    case 'coming_soon':
      return (
        <span className={`${chipBase} bg-indigo-950 text-indigo-200 border-indigo-400/50`}>
          Coming Soon
        </span>
      );
    case 'archived':
      return (
        <span className={`${chipBase} bg-neutral-950 text-neutral-200 border-neutral-500/50`}>
          Archived
        </span>
      );
    default:
      return (
        <span className={`${chipBase} bg-amber-950 text-amber-300 border-amber-500/50`}>
          Draft
        </span>
      );
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AdminProductStatus>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listAdminProducts(1, 100);
      setProducts(result.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (!inDateRange(p.created_at, dateFrom, dateTo)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.volume ?? '').toLowerCase().includes(q) ||
        (p.tag ?? '').toLowerCase().includes(q)
      );
    });
  }, [products, statusFilter, dateFrom, dateTo, query]);

  if (loading) return <DashboardSkeleton cols={6} rows={6} />;

  if (error) {
    return (
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center text-center gap-3 relative z-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]">
        <AlertCircle className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <p className="font-bold text-sm text-white">Could not load products</p>
        <p className="text-xs text-neutral-400 max-w-sm">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-2 px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const threshold = getAdminStoreSettings().lowStockThreshold;
  const lowStockLive = products.filter((p) => p.status === 'live' && isLowStock(p.stock_qty, threshold));
  const filtersActive =
    statusFilter !== 'all' || Boolean(dateFrom) || Boolean(dateTo) || Boolean(query.trim());

  return (
    <div className="min-w-0">
      <PageHeader
        title="Product"
        accent="Catalog."
        subtitle="Create and edit kits stored in Supabase (price, stock, status, images)."
        action={
          <Link
            to="/dashboard/admin/products/new"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-6 py-3 text-sm font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all rounded-xl relative z-10"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        }
      />

      {lowStockLive.length > 0 && (
        <div className="mb-6 relative z-10 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-amber-200">
              {lowStockLive.length} live kit{lowStockLive.length === 1 ? '' : 's'} at or below {threshold} units
            </p>
            <p className="text-xs text-amber-200/70 mt-0.5 truncate">
              {lowStockLive.map((p) => `${p.name} (${p.stock_qty})`).join(' · ')}
            </p>
          </div>
          <Link
            to="/dashboard/admin/settings"
            className="text-xs font-bold text-amber-300 hover:text-amber-200 shrink-0"
          >
            Adjust threshold
          </Link>
        </div>
      )}

      <Card className="relative z-10 mb-6">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/[0.04] flex flex-col gap-4 bg-[#0d0d0d]">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center gap-3 w-full lg:flex-1 lg:max-w-md px-4 py-2.5 rounded-xl bg-[#050505] border border-white/[0.06] shadow-inner focus-within:border-white/[0.2] transition-colors">
              <Search className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, slug, volume, tag…"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-neutral-500 text-white"
              />
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-end gap-2">
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full min-w-0 px-2.5 sm:px-3 py-2 rounded-xl bg-[#050505] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500 [color-scheme:dark]"
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">To</label>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full min-w-0 px-2.5 sm:px-3 py-2 rounded-xl bg-[#050505] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500 [color-scheme:dark]"
                />
              </div>
              {(dateFrom || dateTo) && (
                <button
                  type="button"
                  onClick={() => {
                    setDateFrom('');
                    setDateTo('');
                  }}
                  className="col-span-2 sm:col-auto px-3 py-2 text-xs font-bold rounded-xl text-neutral-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  Clear dates
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-xl transition-all ${
                  statusFilter === f.value
                    ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                    : 'bg-white/[0.03] text-neutral-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 sm:px-6 py-3 text-xs text-neutral-500 break-words">
          Showing {filtered.length} of {products.length} product{products.length === 1 ? '' : 's'}
          {statusFilter !== 'all' && ` · ${STATUS_FILTERS.find((f) => f.value === statusFilter)?.label}`}
          {(dateFrom || dateTo) &&
            ` · ${dateFrom || '…'} → ${dateTo || '…'}`}
        </div>
      </Card>

      {products.length === 0 ? (
        <Card className="mt-2 relative z-10">
          <EmptyState
            icon={Package}
            title="Catalog is empty"
            subtitle="Add your first 3D book kit. Use status Live when it is ready to sell."
          />
          <div className="pb-10 flex justify-center">
            <Link
              to="/dashboard/admin/products/new"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Plus className="w-4 h-4" /> Add first product
            </Link>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="mt-2 relative z-10">
          <EmptyState
            icon={Package}
            title="No products match"
            subtitle="Try a different status, date range, or search."
          />
          {filtersActive && (
            <div className="pb-10 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setDateFrom('');
                  setDateTo('');
                  setQuery('');
                }}
                className="px-4 py-2 text-sm font-bold rounded-xl border border-white/[0.1] text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-2 relative z-10">
          {filtered.map((p, i) => {
            const img = cardImageUrl(p);
            const off = discountPercent(p.price_paise, p.compare_at_paise);
            const low = p.status === 'live' && isLowStock(p.stock_qty, threshold);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
                className={`group bg-[#0A0A0A] rounded-2xl border shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-black transition-all duration-300 ${
                  low ? 'border-amber-500/30 hover:border-amber-500/40' : 'border-white/[0.06] hover:border-white/[0.1]'
                }`}
              >
                <div className="relative w-full aspect-[16/9] bg-white/[0.02] border-b border-white/[0.04] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  {img ? (
                    <img
                      src={img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-neutral-500" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                    {statusChip(p.status)}
                    {p.is_featured && (
                      <span className={`${chipBase} bg-cyan-950 text-cyan-200 border-cyan-400/50`}>
                        Featured
                      </span>
                    )}
                    {low && (
                      <span className={`${chipBase} bg-amber-950 text-amber-300 border-amber-500/50`}>
                        Low stock
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 sm:p-6 flex flex-col flex-1 relative z-10 bg-gradient-to-b from-[#0A0A0A]/50 to-[#0A0A0A]">
                  <div className="flex items-start justify-between gap-3 mb-1 min-w-0">
                    <div className="min-w-0">
                      <h3 className="font-black tracking-tight text-base sm:text-lg leading-tight text-white break-words">
                        {p.name}
                      </h3>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mt-1 truncate">
                        {p.volume || p.slug}
                      </p>
                      <p className="text-[10px] text-neutral-600 mt-1">Added {formatDate(p.created_at)}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="font-black text-base sm:text-lg text-white drop-shadow-sm block">
                        {inrFromPaise(p.price_paise)}
                      </span>
                      {p.compare_at_paise != null && p.compare_at_paise > p.price_paise && (
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <span className="text-[10px] text-neutral-500 line-through">
                            {inrFromPaise(p.compare_at_paise)}
                          </span>
                          {off != null && (
                            <span className="text-[9px] font-bold text-emerald-400">{off}% off</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-5 pt-5 border-t border-white/[0.04]">
                    <div className="flex gap-6 min-w-0">
                      <div>
                        <p className={`text-sm font-black ${low ? 'text-amber-300' : 'text-white'}`}>{p.stock_qty}</p>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                          {low ? 'Low stock' : 'In Stock'}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-white truncate max-w-[120px]">{p.tag || '—'}</p>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                          Tag
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/dashboard/admin/products/${p.id}`}
                      state={{ product: p }}
                      className="w-full sm:w-auto sm:ml-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-bold border border-white/[0.1] rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
