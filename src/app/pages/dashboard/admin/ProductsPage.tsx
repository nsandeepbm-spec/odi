import React from 'react';
import { motion } from 'motion/react';
import { Plus, Pencil } from 'lucide-react';
import { PageHeader, inr } from '../../../components/dashboard/shared';
import { products, type Product } from '../../../data/mock';

function statusChip(status: Product['status']) {
  switch (status) {
    case 'live':
      return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-600">Live</span>;
    case 'coming-soon':
      return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-600">Coming Soon</span>;
    case 'out-of-stock':
      return <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-red-50 text-red-500">Out of Stock</span>;
  }
}

export default function ProductsPage() {
  return (
    <div>
      <PageHeader
        title="Product"
        accent="Catalog."
        subtitle="Manage the 3D book collection, pricing and stock."
        action={
          <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide bg-neutral-900 text-white hover:-translate-y-0.5 transition-transform rounded-xl">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
            className="group bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300"
          >
            <div className="relative w-full aspect-[16/9] bg-neutral-50 border-b border-neutral-100 overflow-hidden">
              <img
                src={p.img}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">{statusChip(p.status)}</div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <h3 className="font-black tracking-tight text-lg leading-tight">{p.name}</h3>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mt-0.5">{p.volume}</p>
                </div>
                <span className="font-black text-lg shrink-0">{inr(p.price)}</span>
              </div>
              <div className="flex gap-6 mt-4 pt-4 border-t border-neutral-100">
                <div>
                  <p className="text-sm font-black">{p.status === 'live' ? p.stock : '—'}</p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">In Stock</p>
                </div>
                <div>
                  <p className="text-sm font-black">{p.status === 'live' ? p.sold : '—'}</p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">Sold</p>
                </div>
                <button className="ml-auto self-center inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
