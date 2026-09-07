import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  MapPin,
  Plus,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  useCheckout,
  isShippingComplete,
  type SavedAddress,
} from '../../lib/checkout';
import { checkPincodeServiceability, getExpectedTat } from '../../lib/api';
import { auth } from '../../lib/firebase';
import { CheckoutOrderSummary } from '../../components/checkout/CheckoutOrderSummary';
import { checkoutInput, checkoutLabel } from '../../components/checkout/CheckoutShell';

function formatAddressLine(a: SavedAddress) {
  return [a.street, a.city, a.postalCode].filter(Boolean).join(', ');
}

function formatName(a: SavedAddress) {
  return [a.firstName, a.lastName].filter(Boolean).join(' ');
}

function normalizePin(input: string) {
  return input.replace(/\D/g, '').slice(0, 6);
}

type PinStatus = 'idle' | 'checking' | 'ok' | 'fail';

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
    quantity,
    refreshShippingQuote,
    clearShippingQuote,
  } = useCheckout();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'pick' | 'form'>(() =>
    savedAddresses.length > 0 ? 'pick' : 'form'
  );
  const [addressLabel, setAddressLabel] = useState('Home');
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [pinStatus, setPinStatus] = useState<PinStatus>('idle');
  const [pinMessage, setPinMessage] = useState<string | null>(null);
  const [tatLabel, setTatLabel] = useState<string | null>(null);
  const [tatLoading, setTatLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const pinEpochRef = useRef(0);
  const lastCheckedPinRef = useRef<string | null>(null);
  const selectedPostalCode =
    savedAddresses.find((a) => a.id === selectedAddressId)?.postalCode ?? '';

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

  const runPincodeCheck = useCallback(async (postalCode: string) => {
    const pin = normalizePin(postalCode);
    if (pin.length !== 6) {
      lastCheckedPinRef.current = null;
      setPinStatus('idle');
      setPinMessage(null);
      setTatLabel(null);
      clearShippingQuote();
      return;
    }

    if (lastCheckedPinRef.current === pin) return;
    lastCheckedPinRef.current = pin;

    const epoch = ++pinEpochRef.current;
    setPinStatus('checking');
    setPinMessage(null);
    setTatLabel(null);
    setTatLoading(false);

    try {
      const result = await checkPincodeServiceability(pin);
      if (epoch !== pinEpochRef.current) return;

      if (result.serviceable) {
        setPinStatus('ok');
        setPinMessage('Delivery available to this PIN');
        setTatLoading(true);
        try {
          const tat = await getExpectedTat(pin);
          if (epoch !== pinEpochRef.current) return;
          setTatLabel(tat.label);
        } catch {
          if (epoch !== pinEpochRef.current) return;
          setTatLabel(null);
        } finally {
          if (epoch === pinEpochRef.current) setTatLoading(false);
        }
      } else {
        setPinStatus('fail');
        setPinMessage(`We don't deliver to PIN ${pin} yet. Please use a different address.`);
        setTatLabel(null);
        clearShippingQuote();
      }
    } catch (err) {
      if (epoch !== pinEpochRef.current) return;
      lastCheckedPinRef.current = null;
      setPinStatus('fail');
      setPinMessage(err instanceof Error ? err.message : 'Could not verify PIN code');
      setTatLabel(null);
      clearShippingQuote();
    }
  }, [clearShippingQuote]);

  // Delhivery check only when the selected address PIN changes — not on every address-list refresh.
  useEffect(() => {
    if (mode !== 'pick' || !selectedAddressId) {
      pinEpochRef.current += 1;
      lastCheckedPinRef.current = null;
      setPinStatus('idle');
      setPinMessage(null);
      setTatLabel(null);
      setTatLoading(false);
      clearShippingQuote();
      return;
    }

    const pin = normalizePin(selectedPostalCode);
    if (pin.length !== 6) return;

    void runPincodeCheck(pin);
  }, [mode, selectedAddressId, selectedPostalCode, runPincodeCheck]);

  // Delhivery shipping cost after PIN is serviceable.
  useEffect(() => {
    if (pinStatus !== 'ok') {
      clearShippingQuote();
      return;
    }
    const pin = normalizePin(selectedPostalCode);
    if (pin.length !== 6) return;
    void refreshShippingQuote(pin);
  }, [pinStatus, selectedPostalCode, product?.slug, quantity, refreshShippingQuote, clearShippingQuote]);

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

  const pinVerified = pinStatus === 'ok';
  const canContinue =
    mode === 'pick' &&
    Boolean(selectedAddressId) &&
    pinVerified &&
    !submitting;

  const handleSaveAddress = async () => {
    setSaveError(null);

    if (!isShippingComplete(shipping)) {
      setSaveError('Fill in all required address fields');
      return;
    }

    if (!auth.currentUser) {
      navigate(`/login?redirect=${encodeURIComponent(`/checkout/review${productQuery}`)}`);
      return;
    }

    setSaving(true);
    try {
      await saveCurrentAddress(addressLabel, editingAddressId);
      setEditingAddressId(null);
      setMode('pick');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save address');
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue || !selectedAddressId) return;

    const selected = savedAddresses.find((a) => a.id === selectedAddressId);
    if (!selected) return;

    setSubmitting(true);
    try {
      const result = await checkPincodeServiceability(normalizePin(selected.postalCode));
      if (!result.serviceable) {
        setPinStatus('fail');
        setPinMessage(`We don't deliver to PIN ${result.pincode} yet. Please use a different address.`);
        return;
      }
      goToPayment();
    } catch (err) {
      setPinStatus('fail');
      setPinMessage(err instanceof Error ? err.message : 'Could not verify PIN code');
    } finally {
      setSubmitting(false);
    }
  };

  const startNewAddress = () => {
    pinEpochRef.current += 1;
    setPinStatus('idle');
    setPinMessage(null);
    setSaveError(null);
    setEditingAddressId(null);
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
    if (!selected) return;
    setAddressLabel(selected.label);
    setEditingAddressId(selected.id);
    setSaveError(null);
    setMode('form');
  };

  const deliveryLabel =
    pinStatus === 'ok'
      ? 'Delivery available'
      : pinStatus === 'checking'
        ? 'Checking delivery…'
        : pinStatus === 'fail'
          ? 'Not deliverable'
          : mode === 'pick'
            ? 'Select an address'
            : 'Save address first';

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 items-start">
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
                  ? 'Choose a saved address — we check delivery when you select one.'
                  : 'Add your delivery address, then save it to your account.'}
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
                onClick={() => {
                  setEditingAddressId(null);
                  setSaveError(null);
                  setMode('pick');
                }}
                className="shrink-0 text-xs font-bold text-indigo-600 hover:underline whitespace-nowrap pt-1"
              >
                Back to saved addresses
              </button>
            ) : null}
          </div>

          <form onSubmit={handleContinue} className="flex flex-col gap-5">
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
                      inputMode="numeric"
                      required
                      placeholder="400001"
                      maxLength={6}
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ postalCode: normalizePin(e.target.value) })}
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

                {saveError && (
                  <p className="text-sm text-red-600 font-medium">{saveError}</p>
                )}

                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={saving || !isShippingComplete(shipping)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 text-white font-bold tracking-wide hover:bg-neutral-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving…' : editingAddressId ? 'Update address' : 'Save address'}
                </button>
              </>
            )}

            {mode === 'pick' && selectedAddressId && (
              <div
                className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
                  pinStatus === 'ok'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : pinStatus === 'fail'
                      ? 'border-red-200 bg-red-50 text-red-800'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                }`}
              >
                {pinStatus === 'checking' ? (
                  <Loader2 className="w-4 h-4 shrink-0 mt-0.5 animate-spin" />
                ) : pinStatus === 'fail' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : pinStatus === 'ok' ? (
                  <Check className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={3} />
                ) : (
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <p className="leading-relaxed">
                  {pinStatus === 'checking'
                    ? 'Checking delivery availability with Delhivery…'
                    : pinMessage ?? 'Select an address to check delivery'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 py-4 border-y border-neutral-100">
              <div
                className={`flex items-center gap-2.5 text-xs font-bold ${
                  pinStatus === 'ok' ? 'text-emerald-700' : 'text-neutral-600'
                }`}
              >
                <Truck className="w-4 h-4 shrink-0" />
                {deliveryLabel}
              </div>
              <div
                className={`flex items-center gap-2.5 text-xs font-bold ${
                  pinStatus === 'ok' && tatLabel ? 'text-emerald-700' : 'text-neutral-600'
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                {tatLoading
                  ? 'Calculating delivery time…'
                  : tatLabel ?? (pinStatus === 'ok' ? 'Delivery estimate unavailable' : 'Select an address for delivery time')}
              </div>
            </div>

            {mode === 'pick' && (
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
                  disabled={!canContinue}
                  className="px-8 py-3.5 rounded-xl bg-[#f05a13] text-white font-bold tracking-wide hover:bg-[#e0500e] transition-colors shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? 'Verifying…'
                    : pinStatus === 'checking'
                      ? 'Checking delivery…'
                      : 'Continue to payment'}
                </button>
              </div>
            )}
          </form>

          <div className="flex items-center justify-center gap-2 mt-5 text-[10px] font-bold text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Saved addresses are stored securely in your account</span>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2 lg:col-span-4 lg:sticky lg:top-28">
        <CheckoutOrderSummary />
      </div>
    </div>
  );
}
