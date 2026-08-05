import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, ShieldCheck, Truck, MapPin, Plus, Check } from 'lucide-react';
import { useCheckout, isShippingComplete, type SavedAddress } from '../../lib/checkout';
import { CheckoutOrderSummary } from '../../components/checkout/CheckoutOrderSummary';
import { checkoutInput, checkoutLabel } from '../../components/checkout/CheckoutShell';

function formatAddressLine(a: SavedAddress) {
  return [a.street, a.city, a.postalCode].filter(Boolean).join(', ');
}

function formatName(a: SavedAddress) {
  return [a.firstName, a.lastName].filter(Boolean).join(' ');
}

export default function CheckoutReviewPage() {
  const {
    product,
    productQuery,
    shipping,
    setShipping,
    goToPayment,
    savedAddresses,
    selectedAddressId,
    selectSavedAddress,
    saveCurrentAddress,
  } = useCheckout();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'pick' | 'form'>(() =>
    savedAddresses.length > 0 ? 'pick' : 'form'
  );
  const [addressLabel, setAddressLabel] = useState('Home');

  useEffect(() => {
    if (savedAddresses.length === 0) {
      setMode('form');
      return;
    }
    if (!selectedAddressId) {
      selectSavedAddress(savedAddresses[0].id);
      setMode('pick');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init selection when addresses load
  }, [savedAddresses.length]);

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500 mb-4">Product not found.</p>
        <Link to="/products" className="text-sm font-bold text-indigo-600 hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'form') {
      saveCurrentAddress(addressLabel);
    }
    goToPayment();
  };

  const startNewAddress = () => {
    setShipping({
      email: '',
      phone: '',
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      postalCode: '',
    });
    setAddressLabel(savedAddresses.length === 0 ? 'Home' : 'Office');
    setMode('form');
  };

  const editSelectedAddress = () => {
    const selected = savedAddresses.find((a) => a.id === selectedAddressId);
    if (selected) setAddressLabel(selected.label);
    setMode('form');
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 items-start">
      {/* Shipping form — 2nd on mobile, left column on desktop */}
      <div className="order-2 lg:order-1 lg:col-span-8">
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 md:p-7 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
                  Step 2
                </span>
                <span className="inline-flex px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[10px] font-bold tracking-wide">
                  {product.name}
                </span>
              </div>

              <h1
                className="text-2xl font-black text-neutral-900 leading-tight mb-1"
                style={{ letterSpacing: '-0.03em' }}
              >
                Shipping details
              </h1>
              <p className="text-sm text-neutral-600">
                {mode === 'pick'
                  ? 'Choose a saved address or add a new one.'
                  : 'Enter where we should deliver your kit.'}
              </p>
            </div>

            {mode === 'pick' ? (
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={editSelectedAddress}
                  className="text-xs font-bold text-indigo-600 hover:underline whitespace-nowrap"
                >
                  Edit address
                </button>
                <button
                  type="button"
                  onClick={startNewAddress}
                  className="text-xs font-bold text-neutral-600 hover:text-neutral-900 whitespace-nowrap"
                >
                  + Add address
                </button>
              </div>
            ) : savedAddresses.length > 0 ? (
              <button
                type="button"
                onClick={() => setMode('pick')}
                className="shrink-0 text-xs font-bold text-indigo-600 hover:underline whitespace-nowrap pt-1"
              >
                Change shipping
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {mode === 'pick' ? (
              <div className="space-y-3">
                {savedAddresses.map((addr) => {
                  const selected = selectedAddressId === addr.id;
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => selectSavedAddress(addr.id)}
                      className={`w-full text-left rounded-xl border p-4 transition-all ${
                        selected
                          ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900/10'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400">
                              {addr.label}
                            </span>
                            {selected && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00a680]">
                                <Check className="w-3 h-3" strokeWidth={3} />
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-neutral-900">{formatName(addr)}</p>
                          <p className="text-sm text-neutral-600 mt-0.5">{formatAddressLine(addr)}</p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {addr.phone} · {addr.email}
                          </p>
                        </div>
                        <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                      </div>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={startNewAddress}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 py-4 text-sm font-bold text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add new address
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className={checkoutLabel}>Address label</label>
                  <input
                    type="text"
                    value={addressLabel}
                    onChange={(e) => setAddressLabel(e.target.value)}
                    placeholder="Home, Office, etc."
                    className={checkoutInput}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className={checkoutLabel}>First name</label>
                    <input
                      type="text"
                      required
                      placeholder="Priya"
                      value={shipping.firstName}
                      onChange={(e) => setShipping({ firstName: e.target.value })}
                      className={checkoutInput}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={checkoutLabel}>Last name</label>
                    <input
                      type="text"
                      placeholder="Sharma"
                      value={shipping.lastName}
                      onChange={(e) => setShipping({ lastName: e.target.value })}
                      className={checkoutInput}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className={checkoutLabel}>Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={shipping.email}
                      onChange={(e) => setShipping({ email: e.target.value })}
                      className={checkoutInput}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={checkoutLabel}>Mobile number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ phone: e.target.value })}
                      className={checkoutInput}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={checkoutLabel}>Street address</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat / house no., street, area"
                    value={shipping.street}
                    onChange={(e) => setShipping({ street: e.target.value })}
                    className={checkoutInput}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-2 md:col-span-1">
                    <label className={checkoutLabel}>City</label>
                    <input
                      type="text"
                      required
                      placeholder="Mumbai"
                      value={shipping.city}
                      onChange={(e) => setShipping({ city: e.target.value })}
                      className={checkoutInput}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={checkoutLabel}>PIN code</label>
                    <input
                      type="text"
                      required
                      placeholder="400001"
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ postalCode: e.target.value })}
                      className={checkoutInput}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={checkoutLabel}>Country</label>
                    <select className={`${checkoutInput} appearance-none`} defaultValue="India">
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-3 py-4 border-y border-neutral-100">
              <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-600">
                <Truck className="w-4 h-4 shrink-0" />
                Free shipping across India
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-600">
                <MapPin className="w-4 h-4 shrink-0" />
                Delivered in 5–7 business days
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
              <button
                type="button"
                onClick={() => navigate(`/checkout${productQuery}`)}
                className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-xl border border-neutral-300 text-sm font-bold text-neutral-600 bg-transparent hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to product
              </button>

              <button
                type="submit"
                disabled={mode === 'pick' && !isShippingComplete(shipping)}
                className="px-8 py-3.5 rounded-xl bg-[#f05a13] text-white font-bold tracking-wide hover:bg-[#e0500e] transition-colors shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to payment
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-2 mt-5 text-[10px] font-bold text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Your address is encrypted and never shared</span>
          </div>
        </div>
      </div>

      {/* Order summary — 1st on mobile, right column on desktop */}
      <div className="order-1 lg:order-2 lg:col-span-4 lg:sticky lg:top-28">
        <CheckoutOrderSummary />
      </div>
    </div>
  );
}
