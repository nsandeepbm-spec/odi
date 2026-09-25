import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { AlertCircle, ArrowLeft, Building2, Check, ChevronDown, Package } from 'lucide-react';
import { Card, inrFromPaise } from '../../../components/dashboard/shared';
import {
  BULK_PAYMENT_METHODS,
  createAdminBulkOrder,
  listAdminProducts,
  type AdminProduct,
  type BulkPaymentMethod,
} from '../../../lib/api';

function rupeesToPaise(value: string): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function productThumb(product: AdminProduct): string | null {
  return product.media?.card?.url || product.images?.find((img) => img.is_primary)?.url || product.images?.[0]?.url || null;
}

const field =
  'w-full px-4 py-3 rounded-xl border border-white/[0.1] bg-[#111] text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-cyan-400/60 focus:bg-[#141414]';
const label = 'text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-500 mb-2 block';
const panel =
  '!border-neutral-500/55 shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]';

export default function AdminBulkOrderCreatePage() {
  const navigate = useNavigate();
  const productMenuRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productOpen, setProductOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPriceInr, setUnitPriceInr] = useState('');
  const [discountInr, setDiscountInr] = useState('0');
  const [taxInr, setTaxInr] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<BulkPaymentMethod>('UPI');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('pending');
  const [notes, setNotes] = useState('');

  const [organizationName, setOrganizationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    void (async () => {
      setLoadingProducts(true);
      try {
        const result = await listAdminProducts(1, 100, 'live');
        const live = result.products.filter((p) => p.status === 'live');
        setProducts(live);
        if (live[0]) {
          setProductId(live[0].id);
          setUnitPriceInr(String((live[0].price_paise ?? 0) / 100));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!productOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!productMenuRef.current?.contains(event.target as Node)) setProductOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProductOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [productOpen]);

  const selected = products.find((p) => p.id === productId) ?? null;

  const totals = useMemo(() => {
    const parsedQty = Math.floor(Number(quantity));
    const qty = Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : 0;
    const unit = rupeesToPaise(unitPriceInr);
    const discount = rupeesToPaise(discountInr);
    const tax = rupeesToPaise(taxInr);
    const subtotal = unit * qty;
    const total = Math.max(0, subtotal - discount + tax);
    return { qty, unit, discount, tax, subtotal, total };
  }, [quantity, unitPriceInr, discountInr, taxInr]);

  const stockShort = selected ? Math.max(0, totals.qty - selected.stock_qty) : 0;

  const onProductChange = (id: string) => {
    setProductId(id);
    setProductOpen(false);
    const p = products.find((row) => row.id === id);
    if (p) setUnitPriceInr(String((p.price_paise ?? 0) / 100));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!productId) {
      setError('Select a live product');
      return;
    }
    if (!organizationName.trim() || !contactName.trim() || !phone.trim()) {
      setError('Organization, contact name, and phone are required');
      return;
    }
    if (totals.qty < 1 || totals.unit < 0) {
      setError('Enter a valid quantity and unit price');
      return;
    }
    if (selected && selected.stock_qty < totals.qty) {
      setError(`Insufficient stock. Available: ${selected.stock_qty}`);
      return;
    }

    setSaving(true);
    try {
      const detail = await createAdminBulkOrder({
        productId,
        quantity: totals.qty,
        unitPricePaise: totals.unit,
        discountPaise: totals.discount,
        taxPaise: totals.tax,
        paymentMethod,
        paymentStatus,
        notes: notes.trim() || null,
        customer: {
          organization_name: organizationName.trim(),
          contact_name: contactName.trim(),
          email: email.trim() || null,
          phone: phone.trim(),
          gstin: gstin.trim() || null,
          street: street.trim() || null,
          city: city.trim() || null,
          state: state.trim() || null,
          postal_code: postalCode.trim() || null,
          country: 'India',
        },
      });
      // Pending → bill; already paid → tax invoice (auto-download on detail).
      const doc = paymentStatus === 'paid' ? 'invoice' : 'bill';
      navigate(`/dashboard/admin/bulk-orders/${detail.order.id}?download=${doc}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create bulk order');
    } finally {
      setSaving(false);
    }
  };

  const thumb = selected ? productThumb(selected) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-w-0"
    >
      <header className={`relative z-10 mb-8 overflow-hidden rounded-2xl border border-neutral-500/55 bg-[#0A0A0A] shadow-[0_0_0_1px_rgba(163,163,163,0.12),0_20px_40px_-20px_rgba(0,0,0,0.55)]`}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-500/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet-500/[0.05] blur-3xl pointer-events-none" />

        <div className="relative px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-400/25 bg-violet-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-violet-300">
                <Building2 className="w-3 h-3" />
                Bulk / Offline
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                No Delhivery
              </span>
            </div>
            <h1
              className="font-black tracking-tight text-white leading-none"
              style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.6rem)', letterSpacing: '-0.03em' }}
            >
              Create{' '}
              <span className="bg-gradient-to-br from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Order.
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-neutral-400 leading-relaxed">
              Set custom pricing for a school, store, or institution. Stock deducts when you create the order.
            </p>
          </div>

          <Link
            to="/dashboard/admin/bulk-orders"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 px-5 py-2.5 text-sm font-bold tracking-wide border border-neutral-500/70 text-white bg-black/40 hover:bg-white/[0.04] hover:border-neutral-400 transition-all rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to bulk orders
          </Link>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
        <div className="xl:col-span-8 space-y-6">
          <Card title="Product & pricing" className={panel}>
            <div className="p-4 sm:p-6 space-y-5">
              <div ref={productMenuRef} className="relative">
                <div className="flex items-end justify-between gap-3 mb-2">
                  <label className={`${label} mb-0`}>Product</label>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400/90">
                    Live only
                  </span>
                </div>
                <button
                  type="button"
                  disabled={loadingProducts || products.length === 0}
                  onClick={() => setProductOpen((open) => !open)}
                  aria-expanded={productOpen}
                  aria-haspopup="listbox"
                  className={`${field} flex items-center gap-3 text-left disabled:opacity-60`}
                >
                  {loadingProducts ? (
                    <span className="text-neutral-500">Loading live products…</span>
                  ) : !selected ? (
                    <span className="text-neutral-500">No live products</span>
                  ) : (
                    <>
                      <span className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
                        {thumb ? (
                          <img src={thumb} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-4 h-4 text-neutral-500" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-white truncate">{selected.name}</span>
                        <span className="block text-[11px] text-neutral-500 truncate">
                          {selected.volume ? `${selected.volume} · ` : ''}
                          {selected.stock_qty} in stock · catalog {inrFromPaise(selected.price_paise)}
                        </span>
                      </span>
                    </>
                  )}
                  <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${productOpen ? 'rotate-180' : ''}`} />
                </button>

                {productOpen && products.length > 0 && (
                  <ul
                    role="listbox"
                    className="absolute z-30 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-white/[0.1] bg-[#121212] shadow-2xl shadow-black/50 py-1"
                  >
                    {products.map((p) => {
                      const active = p.id === productId;
                      const image = productThumb(p);
                      return (
                        <li key={p.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => onProductChange(p.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/[0.04] ${
                              active ? 'bg-cyan-500/10' : ''
                            }`}
                          >
                            <span className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
                              {image ? (
                                <img src={image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-4 h-4 text-neutral-500" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold text-white truncate">{p.name}</span>
                              <span className="block text-[11px] text-neutral-500 truncate">
                                {p.volume ? `${p.volume} · ` : ''}
                                {p.stock_qty} in stock · {inrFromPaise(p.price_paise)}
                              </span>
                            </span>
                            {active && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {!loadingProducts && products.length === 0 && (
                  <p className="mt-2 text-xs text-amber-400">
                    No live products yet. Set a product to Live in the catalog before creating a bulk order.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={label}>Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Quantity"
                    className={field}
                    required
                  />
                  {selected && totals.qty > 0 && (
                    <p className={`mt-1.5 text-[11px] ${stockShort > 0 ? 'text-red-400' : 'text-neutral-500'}`}>
                      {stockShort > 0
                        ? `Short by ${stockShort}. Available ${selected.stock_qty}.`
                        : `${Math.max(0, selected.stock_qty - totals.qty)} left after this sale.`}
                    </p>
                  )}
                </div>
                <div>
                  <label className={label}>Unit price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={unitPriceInr}
                    onChange={(e) => setUnitPriceInr(e.target.value)}
                    className={field}
                    required
                  />
                  {selected && (
                    <p className="mt-1.5 text-[11px] text-neutral-500">
                      Catalog {inrFromPaise(selected.price_paise)}. Override for this buyer.
                    </p>
                  )}
                </div>
                <div>
                  <label className={label}>Discount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={discountInr}
                    onChange={(e) => setDiscountInr(e.target.value)}
                    className={field}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Tax (₹, optional)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={taxInr}
                    onChange={(e) => setTaxInr(e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className={label}>Notes (optional)</label>
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="PO number, delivery note…"
                    className={field}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card title="Buyer / institution" className={panel}>
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={label}>Organization / school / store</label>
                <input
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="School or store name"
                  className={field}
                  required
                />
              </div>
              <div>
                <label className={label}>Contact name</label>
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Person placing the order"
                  className={field}
                  required
                />
              </div>
              <div>
                <label className={label}>Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className={field}
                  required
                />
              </div>
              <div>
                <label className={label}>Email (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="accounts@school.edu"
                  className={field}
                />
              </div>
              <div>
                <label className={label}>GSTIN (optional)</label>
                <input
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="For bill / invoice"
                  className={`${field} uppercase`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Address (optional)</label>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street, building"
                  className={field}
                />
              </div>
              <div>
                <label className={label}>City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>State</label>
                <input value={state} onChange={(e) => setState(e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>PIN</label>
                <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={field} />
              </div>
            </div>
          </Card>
        </div>

        <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-6 self-start">
          <Card title="Payment" className={panel}>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className={label}>Payment status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'paid' as const, label: 'Paid', hint: 'Tax invoice now' },
                      { id: 'pending' as const, label: 'Pending', hint: 'Bill now · collect later' },
                    ]
                  ).map((option) => {
                    const active = paymentStatus === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentStatus(option.id)}
                        className={`px-4 py-3 rounded-xl border text-left transition-colors ${
                          active
                            ? 'border-cyan-400/60 bg-cyan-500/10'
                            : 'border-white/[0.1] bg-[#111] hover:border-white/20'
                        }`}
                      >
                        <span className={`block text-sm font-bold ${active ? 'text-white' : 'text-neutral-300'}`}>
                          {option.label}
                        </span>
                        <span className="block text-[11px] text-neutral-500 mt-0.5">{option.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className={label}>Payment method</label>
                <div className="flex flex-wrap gap-2">
                  {BULK_PAYMENT_METHODS.map((method) => {
                    const active = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                          active
                            ? 'bg-white text-black border-white'
                            : 'bg-[#111] text-neutral-300 border-white/[0.1] hover:border-white/25 hover:text-white'
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Summary" className={panel}>
            <div className="p-4 sm:p-6 space-y-4 text-sm">
              {selected ? (
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                  <span className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-neutral-500" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{selected.name}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Qty {totals.qty} · {inrFromPaise(totals.unit)} / unit
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="space-y-2.5">
                <div className="flex justify-between gap-3 text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold tabular-nums">{inrFromPaise(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between gap-3 text-neutral-400">
                  <span>Discount</span>
                  <span className="text-white font-semibold tabular-nums">−{inrFromPaise(totals.discount)}</span>
                </div>
                <div className="flex justify-between gap-3 text-neutral-400">
                  <span>Tax</span>
                  <span className="text-white font-semibold tabular-nums">{inrFromPaise(totals.tax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end gap-3 pt-3 border-t border-white/[0.06]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Total</p>
                  <p className="text-[11px] text-neutral-500 mt-1">{paymentStatus === 'paid' ? 'Paid' : 'Pending'} · {paymentMethod}</p>
                </div>
                <span className="font-black text-white text-2xl tabular-nums">{inrFromPaise(totals.total)}</span>
              </div>

              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Channel <span className="text-violet-300 font-bold">BULK_OFFLINE</span>. Shipping ₹0 · no
                Delhivery.
                {paymentStatus === 'pending' ? (
                  <>
                    {' '}
                    Creates a <span className="text-amber-300 font-semibold">bill</span> now; tax invoice
                    unlocks after you mark paid.
                  </>
                ) : (
                  <>
                    {' '}
                    Creates a <span className="text-cyan-300 font-semibold">tax invoice</span> (payment
                    already collected).
                  </>
                )}
              </p>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving || loadingProducts || products.length === 0}
                className="w-full py-3 rounded-xl bg-cyan-500 text-white text-sm font-black hover:bg-cyan-400 disabled:opacity-60"
              >
                {saving
                  ? 'Creating…'
                  : paymentStatus === 'pending'
                    ? 'Create order & generate bill'
                    : 'Create order & tax invoice'}
              </button>
            </div>
          </Card>
        </div>
      </form>
    </motion.div>
  );
}
