import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import {
  getPublicProduct,
  peekPublicProductCache,
  listAddresses,
  createAddress,
  updateAddress,
  validateCoupon,
  getShippingQuote,
} from './api';
import type { UserAddress } from './api';
import type { StoreProduct } from '../data/products';
import { auth } from './firebase';
import { useCartStore } from '../store/cartStore';

export interface ShippingDetails {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
}

export interface SavedAddress extends ShippingDetails {
  id: string;
  label: string;
}

const EMPTY_SHIPPING: ShippingDetails = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  postalCode: '',
};

const STORAGE_KEY = 'odi-checkout';
const IKEY_STORAGE_KEY = 'odi-checkout-ikey';
const LEGACY_ADDRESSES_KEY = 'odi-saved-addresses';

function loadIdempotencyKey(): string | null {
  try { return sessionStorage.getItem(IKEY_STORAGE_KEY); } catch { return null; }
}

function makeIdempotencyKey(): string {
  const key = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `odi_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  try { sessionStorage.setItem(IKEY_STORAGE_KEY, key); } catch { /* noop */ }
  return key;
}

function clearIdempotencyKey() {
  try { sessionStorage.removeItem(IKEY_STORAGE_KEY); } catch { /* noop */ }
}

try {
  localStorage.removeItem(LEGACY_ADDRESSES_KEY);
} catch {
  /* ignore */
}

/** Convert a DB UserAddress row to the local SavedAddress shape. */
function dbToSaved(a: UserAddress): SavedAddress {
  return {
    id: a.id,
    label: a.label ?? 'Address',
    email: a.email ?? '',
    phone: a.phone,
    firstName: a.first_name,
    lastName: a.last_name,
    street: a.street,
    city: a.city,
    postalCode: a.postal_code,
  };
}

/** Convert local ShippingDetails + label to the DB create/update shape. */
function shippingToDbInput(
  s: ShippingDetails,
  label: string,
): Parameters<typeof createAddress>[0] {
  return {
    label,
    first_name: s.firstName,
    last_name: s.lastName,
    phone: s.phone,
    email: s.email || null,
    street: s.street,
    city: s.city,
    postal_code: s.postalCode,
    country: 'IN',
  };
}

function addressKey(a: ShippingDetails) {
  return `${a.email}|${a.phone}|${a.street}|${a.city}|${a.postalCode}`.toLowerCase();
}

interface PersistedCheckout {
  productSlug: string;
  quantity: number;
  shipping: ShippingDetails;
  selectedAddressId?: string;
  /** Slug of the product this idempotency key was generated for. */
  ikeySlug?: string;
  couponCode?: string | null;
  couponDiscountPaise?: number;
}

export type ShippingQuoteStatus = 'idle' | 'loading' | 'ready' | 'error';

interface CheckoutContextValue {
  product: StoreProduct | null;
  isLoadingProduct: boolean;
  quantity: number;
  setQuantity: (qty: number) => void;
  shipping: ShippingDetails;
  setShipping: (patch: Partial<ShippingDetails>) => void;
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null;
  selectSavedAddress: (id: string) => void;
  /** Persist address to user_addresses (auth required). Returns saved address id. */
  saveCurrentAddress: (label: string, existingId?: string | null) => Promise<string>;
  refreshSavedAddresses: () => Promise<void>;
  subtotalPaise: number;
  /** Coupon discount in paise (server-validated). */
  discountPaise: number;
  totalPaise: number;
  shippingPaise: number;
  shippingQuoteStatus: ShippingQuoteStatus;
  /** Delhivery quote error message (when status is error). */
  shippingQuoteError: string | null;
  /** Fetch Delhivery shipping cost for destination PIN (after address is serviceable). */
  refreshShippingQuote: (destinationPin: string) => Promise<void>;
  clearShippingQuote: () => void;
  couponCode: string | null;
  couponInput: string;
  setCouponInput: (value: string) => void;
  couponMessage: string | null;
  couponApplying: boolean;
  applyCoupon: () => Promise<void>;
  clearCoupon: () => void;
  productQuery: string;
  goToReview: () => void;
  goToPayment: () => void;
  /** Call with the real order number from the API after payment succeeds. */
  completeOrder: (realOrderNumber: string) => void;
  lastOrderId: string | null;
  /**
   * Stable idempotency key for the current checkout attempt.
   * Reuse on every Pay click so re-clicking never creates a second pending order.
   * Cleared automatically when completeOrder() is called.
   */
  idempotencyKey: string;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

function loadPersisted(): Partial<PersistedCheckout> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedCheckout) : {};
  } catch {
    return {};
  }
}

function savePersisted(data: PersistedCheckout) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Sync checkout session from cart before navigating to review/payment. */
export function persistCheckoutProduct(slug: string, quantity: number) {
  const persisted = loadPersisted();
  savePersisted({
    productSlug: slug,
    quantity,
    shipping: { ...EMPTY_SHIPPING, ...persisted.shipping },
    couponCode: persisted.couponCode ?? null,
    couponDiscountPaise: persisted.couponDiscountPaise ?? 0,
  });
}

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const productFromUrl = searchParams.get('product');

  const persisted = loadPersisted();
  const slug = productFromUrl ?? persisted.productSlug ?? 'space-explorer';

  // Seed synchronously from cache when available — no flicker when the user
  // arrived via the /products page that already fetched all products.
  const [product, setProduct] = useState<StoreProduct | null>(() => peekPublicProductCache(slug));
  const [isLoadingProduct, setIsLoadingProduct] = useState(() => peekPublicProductCache(slug) === null);

  const [quantity, setQuantityState] = useState(persisted.quantity ?? 1);
  const [shipping, setShippingState] = useState<ShippingDetails>({
    ...EMPTY_SHIPPING,
    ...persisted.shipping,
  });
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    persisted.selectedAddressId ?? null
  );
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const [couponInput, setCouponInput] = useState(persisted.couponCode ?? '');
  const [couponCode, setCouponCode] = useState<string | null>(persisted.couponCode ?? null);
  const [couponDiscountPaise, setCouponDiscountPaise] = useState(persisted.couponDiscountPaise ?? 0);
  const [couponMessage, setCouponMessage] = useState<string | null>(
    persisted.couponCode ? `Offer ${persisted.couponCode} applied` : null
  );
  const [couponApplying, setCouponApplying] = useState(false);
  const [shippingPaise, setShippingPaise] = useState(0);
  const [shippingQuoteStatus, setShippingQuoteStatus] = useState<ShippingQuoteStatus>('idle');
  const [shippingQuoteError, setShippingQuoteError] = useState<string | null>(null);
  /** Bumped on clear/remove so in-flight validate responses are ignored. */
  const couponEpochRef = useRef(0);

  // Stable idempotency key — one per checkout attempt.
  // If the key was saved for the same slug, reuse it; otherwise generate fresh.
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => {
    const saved = loadIdempotencyKey();
    const p = loadPersisted();
    if (saved && p.ikeySlug === slug) return saved;
    return makeIdempotencyKey();
  });

  useEffect(() => {
    if (!productFromUrl) return;
    const p = loadPersisted();
    if (p.productSlug !== productFromUrl) {
      setQuantityState(1);
      // New product = new checkout attempt = new idempotency key
      const newKey = makeIdempotencyKey();
      setIdempotencyKey(newKey);
      setCouponInput('');
      setCouponCode(null);
      setCouponDiscountPaise(0);
      setCouponMessage(null);
      couponEpochRef.current += 1;
      savePersisted({
        productSlug: productFromUrl,
        quantity: 1,
        shipping: { ...EMPTY_SHIPPING, ...p.shipping },
        selectedAddressId: p.selectedAddressId,
        ikeySlug: productFromUrl,
        couponCode: null,
        couponDiscountPaise: 0,
      });
    }
  }, [productFromUrl]);

  useEffect(() => {
    if (!productFromUrl && slug && location.pathname === '/checkout') {
      navigate(`/checkout?product=${slug}`, { replace: true });
    }
  }, [productFromUrl, slug, navigate, location.pathname]);

  useEffect(() => {
    const p = loadPersisted();
    if (p.productSlug === slug && p.quantity != null) {
      setQuantityState(Math.min(10, Math.max(1, p.quantity)));
    }
  }, [slug, location.pathname]);

  useEffect(() => {
    let cancelled = false;
    if (!slug) return;
    // Already have this product — skip the fetch to avoid reload flicker when
    // navigating between checkout steps (review → payment → success).
    if (product?.slug === slug) return;

    // Only show spinner on a genuine first load; cache hits resolve instantly.
    setIsLoadingProduct(true);
    getPublicProduct(slug)
      .then((p) => {
        if (!cancelled) setProduct(p);
      })
      .catch((err) => {
        console.error('Failed to load product for checkout', err);
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingProduct(false);
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    savePersisted({
      productSlug: product.slug,
      quantity,
      shipping,
      selectedAddressId: selectedAddressId ?? undefined,
      ikeySlug: product.slug,
      couponCode,
      couponDiscountPaise,
    });
  }, [product, quantity, shipping, selectedAddressId, couponCode, couponDiscountPaise]);

  const clearCoupon = useCallback(() => {
    couponEpochRef.current += 1;
    setCouponCode(null);
    setCouponDiscountPaise(0);
    setCouponMessage(null);
    setCouponInput('');
    setCouponApplying(false);
  }, []);

  const applyCoupon = useCallback(async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponMessage('Enter a coupon code');
      return;
    }
    if (!product?.id) {
      setCouponMessage('Product not loaded yet');
      return;
    }
    if (!auth.currentUser) {
      setCouponMessage('Sign in to apply a coupon offer');
      return;
    }

    const epoch = couponEpochRef.current;
    setCouponApplying(true);
    setCouponMessage(null);
    try {
      const result = await validateCoupon({
        code,
        items: [{ productId: product.id, quantity }],
      });
      if (epoch !== couponEpochRef.current) return;
      setCouponCode(result.code);
      setCouponDiscountPaise(result.discount_paise);
      setCouponInput(result.code);
      setCouponMessage(
        result.discount_paise > 0
          ? `Offer ${result.code} applied — you save ₹${(result.discount_paise / 100).toFixed(0)}`
          : `Offer ${result.code} applied`
      );
    } catch (err) {
      if (epoch !== couponEpochRef.current) return;
      setCouponCode(null);
      setCouponDiscountPaise(0);
      setCouponMessage(err instanceof Error ? err.message : 'Invalid or expired coupon');
    } finally {
      if (epoch === couponEpochRef.current) setCouponApplying(false);
    }
  }, [couponInput, product?.id, quantity]);

  // Re-validate applied coupon when quantity changes (ignore if user already removed it)
  useEffect(() => {
    if (!couponCode || !product?.id || !auth.currentUser) return;
    const epoch = couponEpochRef.current;
    const code = couponCode;
    let cancelled = false;
    (async () => {
      try {
        const result = await validateCoupon({
          code,
          items: [{ productId: product.id, quantity }],
        });
        if (cancelled || epoch !== couponEpochRef.current) return;
        setCouponCode(result.code);
        setCouponDiscountPaise(result.discount_paise);
        setCouponMessage(
          result.discount_paise > 0
            ? `Offer ${result.code} applied — you save ₹${(result.discount_paise / 100).toFixed(0)}`
            : `Offer ${result.code} applied`
        );
      } catch (err) {
        if (cancelled || epoch !== couponEpochRef.current) return;
        setCouponCode(null);
        setCouponDiscountPaise(0);
        setCouponMessage(err instanceof Error ? err.message : 'Coupon no longer valid');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [quantity, product?.id, couponCode]);

  const setQuantity = useCallback((qty: number) => {
    setQuantityState(Math.min(10, Math.max(1, qty)));
  }, []);

  const setShipping = useCallback((patch: Partial<ShippingDetails>) => {
    setShippingState((prev) => ({ ...prev, ...patch }));
    setSelectedAddressId(null);
  }, []);

  const selectSavedAddress = useCallback((id: string) => {
    const found = savedAddresses.find((a) => a.id === id);
    if (!found) return;
    const { id: _id, label: _label, ...details } = found;
    setShippingState(details);
    setSelectedAddressId(id);
  }, [savedAddresses]);

  const saveCurrentAddress = useCallback(
    async (label: string, existingId?: string | null): Promise<string> => {
      if (!isShippingComplete(shipping)) {
        throw new Error('Fill in all required address fields');
      }
      if (!auth.currentUser) {
        throw new Error('Sign in to save your address');
      }

      const trimmed = label.trim() || 'Address';
      const dbInput = shippingToDbInput(shipping, trimmed);

      const applySaved = (saved: SavedAddress) => {
        const next = savedAddresses.some((a) => a.id === saved.id)
          ? savedAddresses.map((a) => (a.id === saved.id ? saved : a))
          : [...savedAddresses.filter((a) => a.id !== existingId), saved];
        setSavedAddresses(next);
        setShippingState({
          email: saved.email,
          phone: saved.phone,
          firstName: saved.firstName,
          lastName: saved.lastName,
          street: saved.street,
          city: saved.city,
          postalCode: saved.postalCode,
        });
        setSelectedAddressId(saved.id);
        return saved.id;
      };

      if (existingId && !existingId.startsWith('addr-')) {
        const updated = await updateAddress(existingId, dbInput);
        return applySaved(dbToSaved(updated));
      }

      const key = addressKey(shipping);
      const duplicate = savedAddresses.find((a) => addressKey(a) === key && !a.id.startsWith('addr-'));
      if (duplicate) {
        const updated = await updateAddress(duplicate.id, dbInput);
        return applySaved(dbToSaved(updated));
      }

      const created = await createAddress(dbInput);
      return applySaved(dbToSaved(created));
    },
    [shipping, savedAddresses]
  );

  const refreshSavedAddresses = useCallback(async () => {
    if (!auth.currentUser) return;
    const rows = await listAddresses();
    const mapped = rows.map(dbToSaved);
    setSavedAddresses((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(mapped)) return prev;
      return mapped;
    });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return;
      refreshSavedAddresses().catch(() => {
        /* keep in-memory list; next visit refetches from API */
      });
    });
    return unsubscribe;
  }, [refreshSavedAddresses]);

  const subtotalPaise = product ? product.price_paise * quantity : 0;
  // Only apply discount while a coupon is actively applied (guards against stale async responses)
  const discountPaise =
    couponCode && couponDiscountPaise > 0
      ? Math.min(couponDiscountPaise, subtotalPaise)
      : 0;
  const clearShippingQuote = useCallback(() => {
    setShippingPaise(0);
    setShippingQuoteStatus('idle');
    setShippingQuoteError(null);
  }, []);

  const refreshShippingQuote = useCallback(
    async (destinationPin: string) => {
      if (!product) return;
      const pin = destinationPin.replace(/\D/g, '').slice(0, 6);
      if (pin.length !== 6) {
        clearShippingQuote();
        return;
      }

      setShippingQuoteStatus('loading');
      setShippingQuoteError(null);
      try {
        const quote = await getShippingQuote({
          destinationPin: pin,
          slug: product.slug,
          quantity,
        });
        setShippingPaise(quote.shippingPaise);
        setShippingQuoteStatus('ready');
      } catch (err) {
        setShippingPaise(0);
        setShippingQuoteStatus('error');
        setShippingQuoteError(err instanceof Error ? err.message : 'Could not calculate shipping');
      }
    },
    [product, quantity, clearShippingQuote]
  );

  const shippingIncludedPaise = shippingQuoteStatus === 'ready' ? shippingPaise : 0;
  const totalPaise = Math.max(0, subtotalPaise - discountPaise + shippingIncludedPaise);

  const productQuery = product ? `?product=${product.slug}` : '';

  const goToReview = useCallback(() => {
    if (!product?.available) return;
    navigate(`/checkout/review${productQuery}`);
  }, [navigate, product, productQuery]);

  const goToPayment = useCallback(() => {
    navigate(`/checkout/payment${productQuery}`);
  }, [navigate, productQuery]);

  const completeOrder = useCallback((realOrderNumber: string) => {
    setLastOrderId(realOrderNumber);
    useCartStore.getState().clearCart();
    sessionStorage.removeItem(STORAGE_KEY);
    clearIdempotencyKey();
    couponEpochRef.current += 1;
    setCouponCode(null);
    setCouponDiscountPaise(0);
    setCouponInput('');
    setCouponMessage(null);
    setShippingPaise(0);
    setShippingQuoteStatus('idle');
    setShippingQuoteError(null);
    // Generate a fresh key so if the user somehow starts another checkout
    // in the same tab after success, they get a new session.
    setIdempotencyKey(makeIdempotencyKey());
  }, []);

  const value = useMemo<CheckoutContextValue>(
    () => ({
      product,
      isLoadingProduct,
      quantity,
      setQuantity,
      shipping,
      setShipping,
      savedAddresses,
      selectedAddressId,
      selectSavedAddress,
      saveCurrentAddress,
      refreshSavedAddresses,
      subtotalPaise,
      discountPaise,
      totalPaise,
      shippingPaise,
      shippingQuoteStatus,
      shippingQuoteError,
      refreshShippingQuote,
      clearShippingQuote,
      couponCode,
      couponInput,
      setCouponInput,
      couponMessage,
      couponApplying,
      applyCoupon,
      clearCoupon,
      productQuery,
      goToReview,
      goToPayment,
      completeOrder,
      lastOrderId,
      idempotencyKey,
    }),
    [
      product,
      isLoadingProduct,
      quantity,
      setQuantity,
      shipping,
      setShipping,
      savedAddresses,
      selectedAddressId,
      selectSavedAddress,
      saveCurrentAddress,
      refreshSavedAddresses,
      subtotalPaise,
      discountPaise,
      totalPaise,
      shippingPaise,
      shippingQuoteStatus,
      shippingQuoteError,
      refreshShippingQuote,
      clearShippingQuote,
      couponCode,
      couponInput,
      couponMessage,
      couponApplying,
      applyCoupon,
      clearCoupon,
      productQuery,
      goToReview,
      goToPayment,
      completeOrder,
      lastOrderId,
      idempotencyKey,
    ]
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used inside <CheckoutProvider>');
  return ctx;
}

export function isShippingComplete(s: ShippingDetails): boolean {
  return (
    s.email.trim() !== '' &&
    s.phone.trim() !== '' &&
    s.firstName.trim() !== '' &&
    s.street.trim() !== '' &&
    s.city.trim() !== '' &&
    s.postalCode.trim() !== ''
  );
}

/** True when id is a persisted user_addresses UUID (not a local temp id). */
export function isDbAddressId(id: string | null | undefined): id is string {
  return Boolean(id && !id.startsWith('addr-') && /^[0-9a-f-]{36}$/i.test(id));
}
