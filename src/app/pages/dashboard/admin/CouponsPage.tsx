import React, { useEffect, useMemo, useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  Loader2,
  AlertCircle,
  Percent,
  Sparkles,
  Ban,
  Pencil,
  X,
} from 'lucide-react';
import {
  StatCard,
  Card,
  EmptyState,
  inrFromPaise,
  DashboardSkeleton,
} from '../../../components/dashboard/shared';
import {
  listAdminCoupons,
  updateAdminCoupon,
  createAdminCoupon,
  listAdminProducts,
  type AdminCoupon,
  type AdminProduct,
} from '../../../lib/api';

const panel =
  '!border-neutral-500/55 shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]';

type CouponType = 'percent' | 'fixed_paise';

type CouponFormState = {
  code: string;
  type: CouponType;
  value: number;
  minSubtotal: number;
  maxDiscount: string;
  maxUses: string;
  perUserLimit: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
  isPublic: boolean;
  title: string;
  description: string;
  productIds: string[];
};

/** Ready-to-use ODI Kids promo templates — fill the create form in one click. */
const PROMO_TEMPLATES: {
  id: string;
  label: string;
  blurb: string;
  form: CouponFormState;
}[] = [
  {
    id: 'odi10',
    label: 'ODI10',
    blurb: '10% off · min ₹500 · save up to ₹500',
    form: {
      code: 'ODI10',
      type: 'percent',
      value: 10,
      minSubtotal: 500,
      maxDiscount: '500',
      maxUses: '',
      perUserLimit: 5,
      startsAt: '',
      endsAt: '',
      active: true,
      isPublic: true,
      title: '10% off ODI Kids',
      description: 'Min order ₹500 · save up to ₹500',
      productIds: [],
    },
  },
  {
    id: 'odi100',
    label: 'ODI100',
    blurb: '₹100 off · min ₹999 · once per customer',
    form: {
      code: 'ODI100',
      type: 'fixed_paise',
      value: 100,
      minSubtotal: 999,
      maxDiscount: '',
      maxUses: '',
      perUserLimit: 1,
      startsAt: '',
      endsAt: '',
      active: true,
      isPublic: true,
      title: 'Flat ₹100 off',
      description: 'Min order ₹999 · once per customer',
      productIds: [],
    },
  },
  {
    id: 'space50',
    label: 'SPACE50',
    blurb: '₹50 off Space Explorer · min ₹500 · 500 uses',
    form: {
      code: 'SPACE50',
      type: 'fixed_paise',
      value: 50,
      minSubtotal: 500,
      maxDiscount: '',
      maxUses: '500',
      perUserLimit: 1,
      startsAt: '',
      endsAt: '',
      active: true,
      isPublic: true,
      title: 'Save ₹50 on Space Explorer',
      description: 'Min order ₹500',
      productIds: [],
    },
  },
  {
    id: 'welcome',
    label: 'WELCOME',
    blurb: '15% welcome · no min · cap ₹200 · once',
    form: {
      code: 'WELCOME',
      type: 'percent',
      value: 15,
      minSubtotal: 0,
      maxDiscount: '200',
      maxUses: '',
      perUserLimit: 1,
      startsAt: '',
      endsAt: '',
      active: true,
      isPublic: true,
      title: 'Welcome 15% off',
      description: 'First order · max ₹200 off',
      productIds: [],
    },
  },
];

const emptyForm = (): CouponFormState => ({
  code: '',
  type: 'percent',
  value: 10,
  minSubtotal: 0,
  maxDiscount: '',
  maxUses: '',
  perUserLimit: 1,
  startsAt: '',
  endsAt: '',
  active: true,
  isPublic: false,
  title: '',
  description: '',
  productIds: [],
});

const inputClass =
  'w-full bg-[#050505] border border-white/[0.06] text-white text-sm rounded-xl focus:border-white/[0.2] block p-3 outline-none placeholder:text-neutral-600 transition-colors';
const labelClass =
  'block text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-2';
const hintClass = 'mt-1.5 text-[11px] text-neutral-600 leading-snug';

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function isoToDateInput(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function dateToIsoStart(date: string): string | null {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toISOString();
}

function dateToIsoEnd(date: string): string | null {
  if (!date) return null;
  return new Date(`${date}T23:59:59.999`).toISOString();
}

function formFromCoupon(c: AdminCoupon): CouponFormState {
  return {
    code: c.code,
    type: c.type,
    value: c.type === 'fixed_paise' ? Math.round(c.value / 100) : c.value,
    minSubtotal: Math.round(c.min_subtotal_paise / 100),
    maxDiscount:
      c.max_discount_paise != null ? String(Math.round(c.max_discount_paise / 100)) : '',
    maxUses: c.max_uses != null ? String(c.max_uses) : '',
    perUserLimit: c.per_user_limit,
    startsAt: isoToDateInput(c.starts_at),
    endsAt: isoToDateInput(c.ends_at),
    active: c.active,
    isPublic: !!c.is_public,
    title: c.title ?? '',
    description: c.description ?? '',
    productIds: c.product_ids ?? [],
  };
}

function buildPayload(form: CouponFormState) {
  const maxDiscountNum = form.maxDiscount.trim() === '' ? null : Number(form.maxDiscount);
  const maxUsesNum = form.maxUses.trim() === '' ? null : Number(form.maxUses);

  return {
    code: form.code.trim().toUpperCase(),
    type: form.type,
    value: form.type === 'fixed_paise' ? Math.round(form.value * 100) : Math.round(form.value),
    min_subtotal_paise: Math.round(Math.max(0, form.minSubtotal) * 100),
    max_discount_paise:
      maxDiscountNum != null && !Number.isNaN(maxDiscountNum) && maxDiscountNum > 0
        ? Math.round(maxDiscountNum * 100)
        : null,
    max_uses:
      maxUsesNum != null && !Number.isNaN(maxUsesNum) && maxUsesNum > 0
        ? Math.round(maxUsesNum)
        : null,
    per_user_limit: Math.max(1, Math.round(form.perUserLimit) || 1),
    starts_at: dateToIsoStart(form.startsAt),
    ends_at: dateToIsoEnd(form.endsAt),
    active: form.active,
    is_public: form.isPublic,
    title: form.title.trim() || null,
    description: form.description.trim() || null,
    productIds: form.productIds,
  };
}

function discountLabel(c: AdminCoupon) {
  return c.type === 'percent' ? `${c.value}% OFF` : `${inrFromPaise(c.value)} OFF`;
}

function isExhausted(c: AdminCoupon) {
  return c.max_uses != null && c.used_count >= c.max_uses;
}

function isExpired(c: AdminCoupon) {
  return !!c.ends_at && new Date(c.ends_at).getTime() < Date.now();
}

function isScheduled(c: AdminCoupon) {
  return !!c.starts_at && new Date(c.starts_at).getTime() > Date.now();
}

function couponStatus(c: AdminCoupon) {
  if (isExpired(c)) {
    return {
      label: 'Expired',
      className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };
  }
  if (isExhausted(c)) {
    return {
      label: 'Exhausted',
      className: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
  }
  if (isScheduled(c)) {
    return {
      label: 'Scheduled',
      className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    };
  }
  if (c.active) {
    return {
      label: 'Active',
      className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
  }
  return {
    label: 'Inactive',
    className: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  };
}

function StatusBadge({ coupon }: { coupon: AdminCoupon }) {
  const s = couponStatus(coupon);
  return (
    <span
      className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded border ${s.className}`}
    >
      {s.label}
    </span>
  );
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const liveProducts = useMemo(
    () => products.filter((p) => p.status === 'live'),
    [products]
  );

  const productSearchResults = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    const available = liveProducts.filter((p) => !form.productIds.includes(p.id));
    if (!q) return available.slice(0, 8);
    return available
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [liveProducts, form.productIds, productSearch]);

  const selectedProducts = useMemo(
    () =>
      form.productIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is AdminProduct => Boolean(p)),
    [products, form.productIds]
  );

  function offerCopyForProduct(product: AdminProduct, f: CouponFormState) {
    const discount =
      f.type === 'percent' ? `${f.value}% off` : `₹${Math.round(f.value)} off`;
    const title = `${discount} on ${product.name}`.slice(0, 80);
    const bits: string[] = [];
    if (f.minSubtotal > 0) bits.push(`Min order ₹${f.minSubtotal}`);
    if (f.type === 'percent' && f.maxDiscount.trim()) {
      bits.push(`Cap ₹${f.maxDiscount.trim()}`);
    }
    return { title, description: bits.join(' · ').slice(0, 240) };
  }

  function addProduct(product: AdminProduct) {
    setForm((f) => {
      if (f.productIds.includes(product.id)) return f;
      const copy = offerCopyForProduct(product, f);
      // Only auto-fill empty fields — never overwrite admin-edited offer copy.
      return {
        ...f,
        productIds: [...f.productIds, product.id],
        title: f.title.trim() ? f.title : copy.title,
        description: f.description.trim() ? f.description : copy.description,
      };
    });
    setProductSearch('');
    setProductDropdownOpen(false);
  }

  function removeProduct(productId: string) {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.filter((id) => id !== productId),
    }));
  }

  async function loadProducts() {
    setProductsLoading(true);
    try {
      const res = await listAdminProducts(1, 100);
      setProducts(res.products);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }

  useEffect(() => {
    if (formOpen && products.length === 0) {
      void loadProducts();
    }
  }, [formOpen, products.length]);

  useEffect(() => {
    if (!formOpen) {
      setProductSearch('');
      setProductDropdownOpen(false);
    }
  }, [formOpen]);

  async function loadCoupons() {
    setLoading(true);
    setError(null);
    try {
      const res = await listAdminCoupons(1, 100);
      setCoupons(res.coupons);
      setTotal(res.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load coupons');
      setCoupons([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await listAdminCoupons(1, 100);
        if (!cancelled) {
          setCoupons(res.coupons);
          setTotal(res.meta.total);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load coupons');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coupons;
    return coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        (c.active ? 'active' : 'inactive').includes(q)
    );
  }, [coupons, query]);

  const kpis = useMemo(() => {
    const active = coupons.filter((c) => c.active && !isExpired(c) && !isExhausted(c)).length;
    const redemptions = coupons.reduce((sum, c) => sum + c.used_count, 0);
    const exhausted = coupons.filter(isExhausted).length;
    return { total: coupons.length, active, redemptions, exhausted };
  }, [coupons]);

  const findByCode = (code: string) =>
    coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setFormError(null);
    setFormOpen(true);
  };

  /** Template already live → edit existing; otherwise start create with template values. */
  const applyTemplate = (template: (typeof PROMO_TEMPLATES)[number]) => {
    const existing = findByCode(template.label);
    if (existing) {
      openEdit(existing);
      return;
    }
    setEditingId(null);
    setForm({ ...template.form });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (c: AdminCoupon) => {
    setEditingId(c.id);
    setForm(formFromCoupon(c));
    setFormError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm());
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      setFormError('Coupon code is required');
      return;
    }
    if (!/^[A-Z0-9_-]+$/i.test(form.code.trim())) {
      setFormError('Code may only use letters, numbers, hyphen, and underscore');
      return;
    }
    if (form.type === 'percent' && (form.value < 1 || form.value > 100)) {
      setFormError('Percent value must be between 1 and 100');
      return;
    }
    if (form.type === 'fixed_paise' && form.value < 1) {
      setFormError('Fixed amount must be at least ₹1');
      return;
    }

    // Creating a code that already exists → switch into edit mode instead of duplicate insert
    if (!editingId) {
      const existing = findByCode(form.code);
      if (existing) {
        setEditingId(existing.id);
        setFormError(
          `Code ${existing.code} already exists. You’re now editing it — click Update Coupon to save changes.`
        );
        return;
      }
    }

    setSaving(true);
    setFormError(null);
    try {
      const payload = buildPayload(form);
      if (editingId) {
        const updated = await updateAdminCoupon(editingId, payload);
        setCoupons((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
      } else {
        await createAdminCoupon(payload);
        await loadCoupons();
      }
      closeForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save coupon';
      const isDuplicate =
        /duplicate key|unique constraint|coupons_code_key|already exists/i.test(message);
      if (isDuplicate && !editingId) {
        const existing = findByCode(form.code);
        if (existing) {
          setEditingId(existing.id);
          setFormError(
            `Code ${form.code.trim().toUpperCase()} already exists. Switched to edit — click Update Coupon.`
          );
        } else {
          setFormError(
            `Code ${form.code.trim().toUpperCase()} already exists. Open it from the table and use Edit.`
          );
        }
      } else {
        setFormError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (c: AdminCoupon) => {
    setTogglingId(c.id);
    try {
      const updated = await updateAdminCoupon(c.id, { active: !c.active });
      setCoupons((prev) => prev.map((row) => (row.id === c.id ? updated : row)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update coupon status');
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) return <DashboardSkeleton cols={5} rows={7} />;

  if (error && coupons.length === 0) {
    return (
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.06] p-10 flex flex-col items-center text-center gap-3 relative z-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]">
        <AlertCircle className="w-8 h-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <p className="font-bold text-sm text-white">Could not load coupons</p>
        <p className="text-xs text-neutral-400 max-w-sm">{error}</p>
        <button
          type="button"
          onClick={() => void loadCoupons()}
          className="mt-2 px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <header className="relative z-10 mb-8 overflow-hidden rounded-2xl border border-neutral-500/55 bg-[#0A0A0A] shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-500/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-500/[0.05] blur-3xl pointer-events-none" />

        <div className="relative px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-400/25 bg-violet-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-violet-300">
                <Tag className="w-3 h-3" />
                Catalog
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                Discount codes
              </span>
            </div>
            <h1
              className="font-black tracking-tight text-white leading-none"
              style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)', letterSpacing: '-0.03em' }}
            >
              Promotions &{' '}
              <span className="bg-gradient-to-br from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Coupons.
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-neutral-400 leading-relaxed">
              Launch ODI Kids discount codes — percent or flat ₹ off — with usage caps and date windows.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-5 py-2.5 text-sm font-bold tracking-wide bg-cyan-500 text-white hover:bg-cyan-400 transition-all rounded-xl"
          >
            <Plus className="w-4 h-4" /> New Coupon
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 relative z-10">
        <StatCard label="Total Coupons" value={String(kpis.total)} icon={Tag} delay={0} className={panel} />
        <StatCard label="Active" value={String(kpis.active)} icon={Sparkles} delay={0.06} className={panel} />
        <StatCard
          label="Redemptions"
          value={String(kpis.redemptions)}
          icon={Percent}
          delay={0.12}
          className={panel}
        />
        <StatCard label="Exhausted" value={String(kpis.exhausted)} icon={Ban} delay={0.18} className={panel} />
      </div>

      {/* Quick promo templates */}
      <Card title="Promo templates" className={`mb-6 relative z-10 ${panel}`}>
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <p className="text-xs text-neutral-500 mb-4 max-w-2xl">
            One-click starters for common ODI Kids offers. If a code is already live, the card opens
            Edit instead of creating a duplicate.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {PROMO_TEMPLATES.map((t) => {
              const existing = coupons.find((c) => c.code === t.label);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="text-left p-4 rounded-xl border border-neutral-500/50 bg-[#050505] hover:border-cyan-400/40 hover:bg-white/[0.02] transition-all group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono font-black text-cyan-400 tracking-wide group-hover:text-cyan-300">
                      {t.label}
                    </span>
                    {existing ? (
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        Edit
                      </span>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-white/[0.03] text-neutral-500 border-white/[0.08]">
                        Create
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">{t.blurb}</p>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {formOpen && (
        <Card
          title={editingId ? `Edit · ${form.code || 'Coupon'}` : 'Create coupon'}
          className={`mb-6 relative z-10 ${panel}`}
          action={
            <button
              type="button"
              onClick={closeForm}
              className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/[0.04] transition-colors"
              aria-label="Close form"
            >
              <X className="w-4 h-4" />
            </button>
          }
        >
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Code</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value.toUpperCase().replace(/\s/g, '') }))
                }
                placeholder="e.g. ODI10"
                maxLength={40}
                className={`${inputClass} uppercase font-mono tracking-wider`}
              />
              <p className={hintClass}>Shown at checkout. Letters, numbers, - and _ only.</p>
            </div>

            <div>
              <label className={labelClass}>Discount Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as CouponType,
                    value: e.target.value === 'percent' ? 10 : 100,
                  }))
                }
                className={inputClass}
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed_paise">Fixed Amount (₹)</option>
              </select>
              <p className={hintClass}>
                Percent scales with cart; fixed subtracts a flat rupee amount.
              </p>
            </div>

            <div>
              <label className={labelClass}>
                Value {form.type === 'percent' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                required
                min={1}
                max={form.type === 'percent' ? 100 : undefined}
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
                className={inputClass}
              />
              <p className={hintClass}>
                {form.type === 'percent'
                  ? '1–100. Example: 10 = ten percent off.'
                  : 'Rupees customers save. Example: 100 = ₹100 off.'}
              </p>
            </div>

            <div>
              <label className={labelClass}>Minimum Order (₹)</label>
              <input
                type="number"
                min={0}
                value={form.minSubtotal}
                onChange={(e) => setForm((f) => ({ ...f, minSubtotal: Number(e.target.value) }))}
                className={inputClass}
              />
              <p className={hintClass}>Cart subtotal must reach this before the code applies.</p>
            </div>

            <div>
              <label className={labelClass}>Max Discount Cap (₹)</label>
              <input
                type="number"
                min={1}
                value={form.maxDiscount}
                onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))}
                placeholder="No cap"
                className={inputClass}
              />
              <p className={hintClass}>Optional ceiling for percent coupons (leave blank for none).</p>
            </div>

            <div>
              <label className={labelClass}>Max Uses (global)</label>
              <input
                type="number"
                min={1}
                value={form.maxUses}
                onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                placeholder="Unlimited"
                className={inputClass}
              />
              <p className={hintClass}>Total redemptions across all customers. Blank = unlimited.</p>
            </div>

            <div>
              <label className={labelClass}>Per-User Limit</label>
              <input
                type="number"
                required
                min={1}
                value={form.perUserLimit}
                onChange={(e) => setForm((f) => ({ ...f, perUserLimit: Number(e.target.value) }))}
                className={inputClass}
              />
              <p className={hintClass}>How many times one signed-in customer may redeem this code.</p>
            </div>

            <div>
              <label className={labelClass}>Starts At</label>
              <input
                type="date"
                value={form.startsAt}
                onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
                className={`${inputClass} [color-scheme:dark]`}
              />
              <p className={hintClass}>Optional. Blank = available immediately.</p>
            </div>

            <div>
              <label className={labelClass}>Ends At</label>
              <input
                type="date"
                value={form.endsAt}
                onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
                className={`${inputClass} [color-scheme:dark]`}
              />
              <p className={hintClass}>Optional. Blank = no expiry date.</p>
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <label className={labelClass}>Products</label>
              {productsLoading ? (
                <p className="text-xs text-neutral-500 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading live products…
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#050505] px-3 focus-within:border-white/[0.2] transition-colors">
                      <Search className="w-4 h-4 text-neutral-500 shrink-0" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value);
                          setProductDropdownOpen(true);
                        }}
                        onFocus={() => setProductDropdownOpen(true)}
                        onBlur={() => {
                          // Delay so click on an option registers
                          window.setTimeout(() => setProductDropdownOpen(false), 150);
                        }}
                        placeholder={
                          liveProducts.length
                            ? 'Search live products to scope this offer…'
                            : 'No live products yet'
                        }
                        disabled={liveProducts.length === 0}
                        className="w-full min-w-0 bg-transparent text-sm outline-none py-3 placeholder:text-neutral-600 text-white"
                        autoComplete="off"
                      />
                    </div>
                    {productDropdownOpen && liveProducts.length > 0 && (
                      <ul className="absolute z-20 mt-1.5 w-full max-h-56 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0A0A0A] shadow-xl">
                        {productSearchResults.length === 0 ? (
                          <li className="px-3 py-3 text-xs text-neutral-500">
                            {productSearch.trim()
                              ? 'No matching live products'
                              : 'All live products already selected'}
                          </li>
                        ) : (
                          productSearchResults.map((p) => (
                            <li key={p.id}>
                              <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => addProduct(p)}
                                className="w-full text-left px-3 py-2.5 hover:bg-white/[0.04] transition-colors"
                              >
                                <span className="block text-sm font-medium text-white truncate">
                                  {p.name}
                                </span>
                                <span className="block text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                                  {p.slug} · live
                                </span>
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>

                  {selectedProducts.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedProducts.map((p) => (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-1.5 max-w-full rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-bold text-cyan-300"
                        >
                          <span className="truncate">{p.name}</span>
                          <button
                            type="button"
                            onClick={() => removeProduct(p.id)}
                            className="shrink-0 p-0.5 rounded text-cyan-400/70 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label={`Remove ${p.name}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-neutral-600">
                      No products selected — offer applies store-wide.
                    </p>
                  )}
                </div>
              )}
              <p className={hintClass}>
                Search and select live products. Offer title & description below are what shoppers see
                in checkout — edit freely, or use “Fill from product”.
              </p>
            </div>

            <div className="md:col-span-2 xl:col-span-3 space-y-4 rounded-xl border border-white/[0.06] bg-[#050505] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500">
                  Checkout offer copy
                </p>
                <button
                  type="button"
                  disabled={selectedProducts.length === 0}
                  onClick={() => {
                    const product = selectedProducts[0];
                    if (!product) return;
                    const copy = offerCopyForProduct(product, form);
                    setForm((f) => ({
                      ...f,
                      title: copy.title,
                      description: copy.description,
                    }));
                  }}
                  className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Fill from product
                </button>
              </div>

              <div>
                <label className={labelClass}>Offer title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value.slice(0, 120) }))}
                  placeholder="e.g. 20% off on Space Explorer"
                  maxLength={120}
                  className={inputClass}
                />
                <p className={hintClass}>Main line in “View offers” at checkout.</p>
              </div>

              <div>
                <label className={labelClass}>Offer description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value.slice(0, 500) }))
                  }
                  placeholder="e.g. Min order ₹999 · once per customer"
                  maxLength={500}
                  className={inputClass}
                />
                <p className={hintClass}>Secondary line under the title (optional).</p>
              </div>

              <div className="rounded-lg border border-white/[0.05] bg-[#0A0A0A] px-3 py-2.5">
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-neutral-600 mb-1.5">
                  Preview
                </p>
                <p className="text-sm font-bold text-white">
                  {form.title.trim() || form.code || 'Offer title'}
                </p>
                {form.description.trim() ? (
                  <p className="text-xs text-neutral-400 mt-1">{form.description}</p>
                ) : (
                  <p className="text-xs text-neutral-600 mt-1">No description</p>
                )}
              </div>
            </div>

            <div className="xl:col-span-3 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4 pt-2">
              <div className="flex flex-col gap-3">
                <label className="inline-flex items-center gap-3 cursor-pointer select-none min-w-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.active}
                    onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                      form.active ? 'bg-emerald-500/80' : 'bg-white/[0.1]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        form.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-bold text-neutral-300 min-w-0">
                    {form.active ? 'Active — customers can redeem' : 'Inactive — hidden from checkout'}
                  </span>
                </label>
                <label className="inline-flex items-center gap-3 cursor-pointer select-none min-w-0">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.isPublic}
                    onClick={() => setForm((f) => ({ ...f, isPublic: !f.isPublic }))}
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                      form.isPublic ? 'bg-cyan-500/80' : 'bg-white/[0.1]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        form.isPublic ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-bold text-neutral-300 min-w-0">
                    {form.isPublic
                      ? 'Show on checkout offers'
                      : 'Hidden code only — customers must type it'}
                  </span>
                </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                {formError && (
                  <p className="text-xs text-red-400 font-medium sm:max-w-xs sm:text-right break-words">
                    {formError}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingId ? 'Update Coupon' : 'Save Coupon'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Card>
      )}

      <Card title="All Coupons" className={`relative z-10 ${panel}`}>
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-500/40 bg-[#0d0d0d]">
          <div className="flex items-center gap-3 w-full lg:max-w-md px-4 py-2.5 rounded-xl bg-[#050505] border border-neutral-500/50 shadow-inner focus-within:border-cyan-400 transition-colors">
            <Search className="w-4 h-4 text-neutral-500 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by code or status…"
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-neutral-500 text-white"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Tag}
            title={query.trim() ? 'No matching coupons' : 'No coupons yet'}
            subtitle={
              query.trim()
                ? 'Try a different code or clear the search.'
                : 'Use a promo template above, or create a custom code to start driving sales.'
            }
          />
        ) : (
          <>
            {/* Mobile / tablet cards */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {filtered.map((c) => (
                <div key={c.id} className="px-4 py-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-black font-mono text-cyan-400 tracking-wide break-all">
                        {c.code}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-600">
                          {c.type === 'percent' ? 'Percent' : 'Fixed'}
                        </p>
                        {c.is_public ? (
                          <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                            Offers
                          </span>
                        ) : null}
                        {(c.product_ids?.length ?? 0) > 0 ? (
                          <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border bg-white/[0.03] text-neutral-500 border-white/[0.08]">
                            {c.product_ids!.length} product{c.product_ids!.length === 1 ? '' : 's'}
                          </span>
                        ) : null}
                      </div>
                      {c.title ? (
                        <p className="text-xs text-neutral-400 mt-1 truncate">{c.title}</p>
                      ) : null}
                    </div>
                    <StatusBadge coupon={c} />
                  </div>
                  <div>
                    <p className="font-bold text-white">{discountLabel(c)}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {c.min_subtotal_paise > 0
                        ? `Min ${inrFromPaise(c.min_subtotal_paise)}`
                        : 'No minimum'}
                      {c.max_discount_paise != null
                        ? ` · Cap ${inrFromPaise(c.max_discount_paise)}`
                        : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-neutral-400">
                    <span>
                      {c.used_count}
                      {c.max_uses != null ? ` / ${c.max_uses}` : ''} uses
                      {' · '}
                      {c.max_uses != null ? `${c.max_uses} global` : 'Unlimited'}
                      {' · '}
                      {c.per_user_limit}/user
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {formatDate(c.starts_at)} → {formatDate(c.ends_at)}
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-white/[0.04] text-neutral-300 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button
                      type="button"
                      disabled={togglingId === c.id}
                      onClick={() => void handleToggleActive(c)}
                      className={`inline-flex items-center justify-center gap-1.5 w-full px-3 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-colors disabled:opacity-50 ${
                        c.active
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      {togglingId === c.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : null}
                      {c.active ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="bg-white/[0.02] text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/[0.04]">
                  <tr>
                    <th className="px-4 lg:px-6 py-4">Code</th>
                    <th className="px-4 lg:px-6 py-4">Discount</th>
                    <th className="px-4 lg:px-6 py-4">Limits</th>
                    <th className="px-4 lg:px-6 py-4">Usage</th>
                    <th className="px-4 lg:px-6 py-4">Window</th>
                    <th className="px-4 lg:px-6 py-4">Status</th>
                    <th className="px-4 lg:px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="font-black font-mono text-cyan-400 tracking-wide group-hover:text-cyan-300 transition-colors">
                          {c.code}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-600">
                            {c.type === 'percent' ? 'Percent' : 'Fixed'}
                          </div>
                          {c.is_public ? (
                            <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                              Offers
                            </span>
                          ) : null}
                        </div>
                        {c.title ? (
                          <div className="text-xs text-neutral-500 mt-1 max-w-[12rem] truncate">
                            {c.title}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="font-bold text-white">{discountLabel(c)}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {c.min_subtotal_paise > 0
                            ? `Min ${inrFromPaise(c.min_subtotal_paise)}`
                            : 'No minimum'}
                          {c.max_discount_paise != null
                            ? ` · Cap ${inrFromPaise(c.max_discount_paise)}`
                            : ''}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-neutral-400 font-medium">
                        <div>{c.max_uses != null ? `${c.max_uses} global` : 'Unlimited'}</div>
                        <div className="text-xs text-neutral-600 mt-0.5">
                          {c.per_user_limit}/user
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 font-black text-white">
                        {c.used_count}
                        {c.max_uses != null ? (
                          <span className="text-neutral-500 font-bold"> / {c.max_uses}</span>
                        ) : null}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-neutral-400 font-medium">
                        <div>
                          {formatDate(c.starts_at)} → {formatDate(c.ends_at)}
                        </div>
                        <div className="text-xs text-neutral-600 mt-0.5">
                          Created {formatDate(c.created_at)}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <StatusBadge coupon={c} />
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-white/[0.04] text-neutral-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-colors"
                          >
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                          <button
                            type="button"
                            disabled={togglingId === c.id}
                            onClick={() => void handleToggleActive(c)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-colors disabled:opacity-50 ${
                              c.active
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                            }`}
                          >
                            {togglingId === c.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : null}
                            {c.active ? 'On' : 'Off'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-white/[0.04] bg-[#0d0d0d] text-xs text-neutral-500 font-bold tracking-wide">
          {filtered.length} coupon{filtered.length === 1 ? '' : 's'}
          {!query.trim() && total > coupons.length ? ` · ${total} total` : ''}
        </div>
      </Card>
    </div>
  );
}
