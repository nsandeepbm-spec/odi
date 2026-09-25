import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminProductStatus } from '../lib/api';

export const CART_MAX_QTY = 10;

export interface CartItem {
  id: string; // product slug
  name: string;
  pricePaise: number;
  quantity: number;
  imageUrl: string;
  status?: AdminProductStatus;
}

interface CartState {
  items: CartItem[];
  /** Checkout coupon preview — shared with product page + cart drawer. */
  couponCode: string | null;
  couponDiscountPaise: number;
  addItem: (item: CartItem) => void;
  /** Set absolute quantity for an existing line, or insert if missing (Buy Now). */
  upsertItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setAppliedCoupon: (code: string, discountPaise: number) => void;
  clearAppliedCoupon: () => void;
  getTotal: () => number;
  getDiscountedTotal: () => number;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  closeDrawer: () => void;
}

function isLive(item: CartItem) {
  return !item.status || item.status === 'live';
}

function clampQty(quantity: number) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(CART_MAX_QTY, Math.max(1, Math.floor(quantity)));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscountPaise: 0,
      addItem: (newItem) =>
        set((state) => {
          if (!isLive(newItem)) return state;
          const qty = clampQty(newItem.quantity);
          const existingItem = state.items.find((item) => item.id === newItem.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: clampQty(item.quantity + qty) }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: qty }] };
        }),
      upsertItem: (newItem) =>
        set((state) => {
          if (!isLive(newItem)) return state;
          const next = { ...newItem, quantity: clampQty(newItem.quantity) };
          const exists = state.items.some((item) => item.id === newItem.id);
          if (exists) {
            return {
              items: state.items.map((item) => (item.id === newItem.id ? { ...item, ...next } : item)),
            };
          }
          return { items: [...state.items, next] };
        }),
      removeItem: (id) =>
        set((state) => {
          const items = state.items.filter((item) => item.id !== id);
          if (items.length === 0) {
            return { items, couponCode: null, couponDiscountPaise: 0 };
          }
          return { items };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: clampQty(quantity) } : item
          ),
        })),
      clearCart: () => set({ items: [], couponCode: null, couponDiscountPaise: 0 }),
      setAppliedCoupon: (code, discountPaise) =>
        set({
          couponCode: code.trim().toUpperCase(),
          couponDiscountPaise: Math.max(0, Math.floor(discountPaise)),
        }),
      clearAppliedCoupon: () => set({ couponCode: null, couponDiscountPaise: 0 }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.pricePaise * item.quantity, 0);
      },
      getDiscountedTotal: () => {
        const subtotal = get().getTotal();
        const discount =
          get().couponCode && get().couponDiscountPaise > 0
            ? Math.min(get().couponDiscountPaise, subtotal)
            : 0;
        return Math.max(0, subtotal - discount);
      },
      isDrawerOpen: false,
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      closeDrawer: () => set({ isDrawerOpen: false }),
    }),
    {
      name: 'odi-cart',
      // Drawer UI state is session-only; persist line items + coupon for refresh-safe cart.
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscountPaise: state.couponDiscountPaise,
      }),
    }
  )
);
