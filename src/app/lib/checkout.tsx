import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { getProductBySlug, type StoreProduct } from '../data/products';

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
const ADDRESSES_KEY = 'odi-saved-addresses';

function loadSavedAddresses(): SavedAddress[] {
  try {
    const raw = localStorage.getItem(ADDRESSES_KEY);
    return raw ? (JSON.parse(raw) as SavedAddress[]) : [];
  } catch {
    return [];
  }
}

function persistSavedAddresses(addresses: SavedAddress[]) {
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
}

function addressKey(a: ShippingDetails) {
  return `${a.email}|${a.phone}|${a.street}|${a.city}|${a.postalCode}`.toLowerCase();
}

interface PersistedCheckout {
  productSlug: string;
  quantity: number;
  shipping: ShippingDetails;
  selectedAddressId?: string;
}

interface CheckoutContextValue {
  product: StoreProduct | null;
  quantity: number;
  setQuantity: (qty: number) => void;
  shipping: ShippingDetails;
  setShipping: (patch: Partial<ShippingDetails>) => void;
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null;
  selectSavedAddress: (id: string) => void;
  saveCurrentAddress: (label: string) => void;
  subtotalPaise: number;
  discountPaise: number;
  totalPaise: number;
  shippingFree: boolean;
  productQuery: string;
  goToReview: () => void;
  goToPayment: () => void;
  completeOrder: () => string;
  lastOrderId: string | null;
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
  });
}

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const productFromUrl = searchParams.get('product');

  const persisted = loadPersisted();
  const slug = productFromUrl ?? persisted.productSlug ?? 'space-explorer';
  const product = getProductBySlug(slug) ?? null;

  const [quantity, setQuantityState] = useState(persisted.quantity ?? 1);
  const [shipping, setShippingState] = useState<ShippingDetails>({
    ...EMPTY_SHIPPING,
    ...persisted.shipping,
  });
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(loadSavedAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    persisted.selectedAddressId ?? null
  );
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!productFromUrl) return;
    const p = loadPersisted();
    if (p.productSlug !== productFromUrl) {
      setQuantityState(1);
      savePersisted({
        productSlug: productFromUrl,
        quantity: 1,
        shipping: { ...EMPTY_SHIPPING, ...p.shipping },
        selectedAddressId: p.selectedAddressId,
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
    if (!product) return;
    savePersisted({ productSlug: product.slug, quantity, shipping, selectedAddressId: selectedAddressId ?? undefined });
  }, [product, quantity, shipping, selectedAddressId]);

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

  const saveCurrentAddress = useCallback((label: string) => {
    const trimmed = label.trim() || 'Address';
    const key = addressKey(shipping);
    const existing = savedAddresses.find((a) => addressKey(a) === key);

    if (existing) {
      const updated = savedAddresses.map((a) =>
        a.id === existing.id ? { ...a, ...shipping, label: trimmed } : a
      );
      setSavedAddresses(updated);
      persistSavedAddresses(updated);
      setSelectedAddressId(existing.id);
      return;
    }

    const entry: SavedAddress = {
      id: `addr-${Date.now().toString(36)}`,
      label: trimmed,
      ...shipping,
    };
    const next = [...savedAddresses, entry];
    setSavedAddresses(next);
    persistSavedAddresses(next);
    setSelectedAddressId(entry.id);
  }, [shipping, savedAddresses]);

  const subtotalPaise = product ? product.pricePaise * quantity : 0;
  const discountPaise =
    product?.compareAtPaise && product.compareAtPaise > product.pricePaise
      ? (product.compareAtPaise - product.pricePaise) * quantity
      : 0;
  const shippingFree = true;
  const totalPaise = subtotalPaise;

  const productQuery = product ? `?product=${product.slug}` : '';

  const goToReview = useCallback(() => {
    if (!product?.available) return;
    navigate(`/checkout/review${productQuery}`);
  }, [navigate, product, productQuery]);

  const goToPayment = useCallback(() => {
    navigate(`/checkout/payment${productQuery}`);
  }, [navigate, productQuery]);

  const completeOrder = useCallback(() => {
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setLastOrderId(id);
    sessionStorage.removeItem(STORAGE_KEY);
    return id;
  }, []);

  const value = useMemo<CheckoutContextValue>(
    () => ({
      product,
      quantity,
      setQuantity,
      shipping,
      setShipping,
      savedAddresses,
      selectedAddressId,
      selectSavedAddress,
      saveCurrentAddress,
      subtotalPaise,
      discountPaise,
      totalPaise,
      shippingFree,
      productQuery,
      goToReview,
      goToPayment,
      completeOrder,
      lastOrderId,
    }),
    [
      product,
      quantity,
      setQuantity,
      shipping,
      savedAddresses,
      selectedAddressId,
      selectSavedAddress,
      saveCurrentAddress,
      subtotalPaise,
      discountPaise,
      totalPaise,
      productQuery,
      goToReview,
      goToPayment,
      completeOrder,
      lastOrderId,
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
