import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  Check,
  Package,
  Save,
  Store,
  Mail,
  Phone,
  AlertTriangle,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { PageHeader, Card, StatCard } from '../../../components/dashboard/shared';
import { ODIColorLogo } from '../../../components/ODIColorLogo';
import {
  getAdminStoreSettings,
  saveAdminStoreSettings,
  isLowStock,
  type AdminStoreSettings,
} from '../../../lib/adminSettings';
import { listAdminProducts } from '../../../lib/api';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-white/[0.1] bg-[#050505] text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-sm placeholder:text-neutral-500 shadow-inner hover:border-white/[0.2]';
const labelCls = 'text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-2 block';

export default function SettingsPage() {
  const [form, setForm] = useState<AdminStoreSettings>(() => getAdminStoreSettings());
  const [saved, setSaved] = useState(false);
  const [lowStockCount, setLowStockCount] = useState<number | null>(null);
  const [loadingStock, setLoadingStock] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await listAdminProducts(1, 100);
        if (cancelled) return;
        const threshold = form.lowStockThreshold;
        const count = result.products.filter(
          (p) => p.status === 'live' && isLowStock(p.stock_qty, threshold)
        ).length;
        setLowStockCount(count);
      } catch {
        if (!cancelled) setLowStockCount(null);
      } finally {
        if (!cancelled) setLoadingStock(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [form.lowStockThreshold, saved]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const next = saveAdminStoreSettings(form);
    setForm(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader
        title="Platform"
        accent="Settings."
        subtitle="Store identity for invoices and inventory alert threshold."
        action={
          <button
            type="submit"
            form="admin-settings-form"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all rounded-xl relative z-10"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved' : 'Save settings'}
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
        <StatCard
          label="Low-stock live kits"
          value={loadingStock ? '…' : String(lowStockCount ?? '—')}
          icon={AlertTriangle}
          delay={0}
        />
        <StatCard
          label="Alert threshold"
          value={`≤ ${form.lowStockThreshold}`}
          icon={Package}
          delay={0.06}
        />
        <StatCard
          label="Invoice brand"
          value={form.storeName.length > 18 ? `${form.storeName.slice(0, 16)}…` : form.storeName}
          icon={Store}
          delay={0.12}
        />
      </div>

      <form
        id="admin-settings-form"
        onSubmit={handleSave}
        className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10 items-start"
      >
        {/* Main column */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <Card title="Store details">
            <div className="p-6 md:p-7 space-y-6">
              <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">
                Shown on printed invoices. Saved in this browser for the admin panel — not a shared
                server setting yet.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="md:col-span-2">
                  <label className={labelCls}>
                    <span className="inline-flex items-center gap-1.5">
                      <Store className="w-3 h-3" /> Store name
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.storeName}
                    onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))}
                    className={inputCls}
                    placeholder="ODI Kids Store"
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> Support email
                    </span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.supportEmail}
                    onChange={(e) => setForm((f) => ({ ...f, supportEmail: e.target.value }))}
                    className={inputCls}
                    placeholder="support@odi.com"
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> Support phone
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={form.supportPhone}
                    onChange={(e) => setForm((f) => ({ ...f, supportPhone: e.target.value }))}
                    className={inputCls}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 md:p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3">
                  Invoice preview
                </p>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                  <div>
                    <p className="text-lg font-black text-white tracking-tight">{form.storeName || '—'}</p>
                    <p className="text-sm text-neutral-400 mt-1">
                      {[form.supportEmail, form.supportPhone].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </div>
                  <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                    Currency · INR
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Inventory alerts">
            <div className="p-6 md:p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                <div className="space-y-4">
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Live products at or below this quantity show a low-stock warning on Products and
                    Overview.
                  </p>
                  <div>
                    <label className={labelCls}>Low-stock threshold (units)</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={form.lowStockThreshold}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          lowStockThreshold: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                      className={`${inputCls} max-w-[200px]`}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <p className="text-xs font-black uppercase tracking-widest text-amber-300">
                      Current alert
                    </p>
                  </div>
                  <p className="text-2xl font-black text-white tracking-tight">
                    {loadingStock ? (
                      <span className="inline-flex align-middle">
                        <ODIColorLogo className="w-10 h-auto odi-loader-breathe" />
                      </span>
                    ) : (
                      <>
                        {lowStockCount ?? '—'}{' '}
                        <span className="text-sm font-bold text-neutral-400">
                          kit{(lowStockCount ?? 0) === 1 ? '' : 's'} ≤ {form.lowStockThreshold}
                        </span>
                      </>
                    )}
                  </p>
                  <Link
                    to="/dashboard/admin/products"
                    className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Review product stock <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Side column */}
        <div className="xl:col-span-4 flex flex-col gap-6 xl:sticky xl:top-28">
          <Card title="Quick links">
            <div className="p-2">
              {[
                {
                  to: '/dashboard/admin/products',
                  icon: Package,
                  label: 'Products',
                  desc: 'Edit stock & catalog',
                },
                {
                  to: '/dashboard/admin/customers',
                  icon: Users,
                  label: 'Customers',
                  desc: 'Roles & permissions',
                },
                {
                  to: '/dashboard/admin/orders',
                  icon: Store,
                  label: 'Orders',
                  desc: 'Export & invoices',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/[0.03] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:border-cyan-500/30 transition-colors">
                      <Icon className="w-4 h-4 text-neutral-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-cyan-400 transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card title="Coming later">
            <div className="p-5 md:p-6 space-y-3 text-sm text-neutral-400 leading-relaxed">
              <p>
                Shipping / tracking and refunds will use third-party tools. Team invites stay under
                Customers (promote to admin).
              </p>
              <ul className="space-y-2 text-xs text-neutral-500">
                <li className="flex gap-2">
                  <span className="text-neutral-600">·</span> Courier tracking APIs
                </li>
                <li className="flex gap-2">
                  <span className="text-neutral-600">·</span> Provider-backed refunds
                </li>
                <li className="flex gap-2">
                  <span className="text-neutral-600">·</span> Shared server store config
                </li>
              </ul>
            </div>
          </Card>

          <button
            type="submit"
            className="xl:hidden w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.3)]"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
