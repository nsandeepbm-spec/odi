import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Pencil, Loader2, AlertCircle, Package } from 'lucide-react';
import { Link } from 'react-router';
import { PageHeader, EmptyState, inrFromPaise } from '../../../components/dashboard/shared';
import {
  listAdminProducts,
  type AdminProduct,
  type AdminProductStatus,
} from '../../../lib/api';

function statusChip(status: AdminProductStatus) {
  switch (status) {
    case 'live':
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-600">
          Live
        </span>
      );
    case 'coming_soon':
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-600">
          Coming Soon
        </span>
      );
    case 'archived':
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-neutral-100 text-neutral-500">
          Archived
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-50 text-amber-600">
          Draft
        </span>
      );
  }
}

function primaryImage(p: AdminProduct) {
  const img = p.images?.find((i) => i.is_primary) ?? p.images?.[0];
  return img?.url ?? null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listAdminProducts(1, 50);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">Loading catalog…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200/60 p-10 flex flex-col items-center text-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="font-bold text-sm">Could not load products</p>
        <p className="text-xs text-neutral-500 max-w-sm">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-2 px-4 py-2 text-sm font-bold rounded-xl bg-neutral-900 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Product"
        accent="Catalog."
        subtitle="Create and edit kits stored in Supabase (price, stock, status, images)."
        action={
          <Link
            to="/dashboard/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide bg-neutral-900 text-white hover:-translate-y-0.5 transition-transform rounded-xl"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        }
      />

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200/60 mt-4">
          <EmptyState
            icon={Package}
            title="Catalog is empty"
            subtitle="Add your first 3D book kit. Use status Live when it is ready to sell."
          />
          <div className="pb-10 flex justify-center">
            <Link
              to="/dashboard/admin/products/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-neutral-900 text-white"
            >
              <Plus className="w-4 h-4" /> Add first product
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
          {products.map((p, i) => {
            const img = primaryImage(p);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
                className="group bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <div className="relative w-full aspect-[16/9] bg-neutral-50 border-b border-neutral-100 overflow-hidden">
                  {img ? (
                    <img
                      src={img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-neutral-200" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">{statusChip(p.status)}</div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <h3 className="font-black tracking-tight text-lg leading-tight">{p.name}</h3>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mt-0.5">
                        {p.volume || p.slug}
                      </p>
                    </div>
                    <span className="font-black text-lg shrink-0">{inrFromPaise(p.price_paise)}</span>
                  </div>
                  <div className="flex gap-6 mt-4 pt-4 border-t border-neutral-100">
                    <div>
                      <p className="text-sm font-black">{p.stock_qty}</p>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                        In Stock
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-black truncate max-w-[80px]">{p.tag || '—'}</p>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                        Tag
                      </p>
                    </div>
                    <Link
                      to={`/dashboard/admin/products/${p.id}`}
                      state={{ product: p }}
                      className="ml-auto self-center inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
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
