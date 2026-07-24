import type { User } from 'firebase/auth';
import { auth } from './firebase';

/**
 * Backend base URL — set in odinew/.env:
 *   VITE_API_URL=http://localhost:5000
 */
export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000';

/** Clean route paths (no /api/v1 prefix). */
export const API = {
  auth: {
    sync: '/auth/sync',
  },
  user: {
    me: '/user/me',
  },
  users: {
    list: '/users',
  },
  checkout: {
    sessions: '/checkout/sessions',
  },
  payments: {
    verify: '/payments/verify',
  },
  admin: {
    overview: '/admin/overview',
    products: '/admin/products',
    orders: '/admin/orders',
    payments: '/admin/payments',
    coupons: '/admin/coupons',
  },
} as const;

export interface AppUser {
  id: string;
  firebase_uid: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: 'user' | 'admin';
  provider: string;
  status: 'active' | 'inactive' | 'banned';
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  error: { message: string; details?: unknown };
}

async function parseResponse<T>(res: Response): Promise<T> {
  const body = (await res.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;
  if (!res.ok) {
    throw new Error(body && 'error' in body ? body.error.message : `Request failed (${res.status})`);
  }
  return body as T;
}

/** Fetch wrapper that attaches the current Firebase ID token. */
export async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');

  const token = await user.getIdToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  return parseResponse<T>(res);
}

/**
 * Creates/updates the user's profile row in Supabase.
 * Call right after every Firebase sign-in (email or Google).
 */
export async function syncUserWithBackend(user: User): Promise<AppUser | null> {
  try {
    const token = await user.getIdToken();
    const res = await fetch(`${API_URL}${API.auth.sync}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await parseResponse<ApiSuccess<{ user: AppUser }>>(res);
    return body.data.user;
  } catch (err) {
    console.warn('[api] Could not sync user with backend:', err);
    return null;
  }
}

/** GET /user/me — fetch the signed-in user's profile from the backend. */
export async function getCurrentUser(): Promise<AppUser> {
  const body = await authFetch<ApiSuccess<{ user: AppUser }>>(API.user.me);
  return body.data.user;
}

/** PATCH /user/me — update profile fields. */
export async function updateCurrentUser(patch: {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}): Promise<AppUser> {
  const body = await authFetch<ApiSuccess<{ user: AppUser }>>(API.user.me, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return body.data.user;
}

export interface ListUsersResult {
  users: AppUser[];
  total: number;
  page: number;
  perPage: number;
}

/** GET /users — admin-only paginated list of all users from the database. */
export async function listUsers(page = 1, perPage = 50): Promise<ListUsersResult> {
  const body = await authFetch<ApiSuccess<ListUsersResult>>(
    `${API.users.list}?page=${page}&perPage=${perPage}`
  );
  return body.data;
}

export interface CheckoutSession {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  reused: boolean;
}

export interface CheckoutSessionInput {
  shippingAddress: {
    first_name: string;
    last_name: string;
    phone: string;
    email?: string | null;
    street: string;
    city: string;
    state?: string | null;
    postal_code: string;
    country?: string;
  };
  items: Array<{ slug: string; quantity: number } | { productId: string; quantity: number }>;
  couponCode?: string | null;
}

/** POST /checkout/sessions — create pending order + Razorpay order. */
export async function createCheckoutSession(
  input: CheckoutSessionInput,
  idempotencyKey: string
): Promise<CheckoutSession> {
  const body = await authFetch<ApiSuccess<CheckoutSession>>(API.checkout.sessions, {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(input),
  });
  return body.data;
}

/** POST /payments/verify — confirm Razorpay Checkout payment. */
export async function verifyPayment(payload: {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ alreadyPaid: boolean }> {
  const body = await authFetch<ApiSuccess<{ alreadyPaid: boolean }>>(API.payments.verify, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return body.data;
}

// ─── Admin commerce ───────────────────────────────────────────────────────────

export type AdminProductStatus = 'draft' | 'live' | 'coming_soon' | 'archived';

export interface AdminProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  volume: string | null;
  description: string | null;
  long_description: string | null;
  author: string | null;
  publisher: string | null;
  language: string | null;
  age_range: string | null;
  pages: number | null;
  price_paise: number;
  compare_at_paise: number | null;
  stock_qty: number;
  status: AdminProductStatus;
  tag: string | null;
  features: string[];
  categories: string[];
  kit_contents: unknown;
  sort_order: number;
  images: AdminProductImage[];
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminOverview {
  kpis: {
    revenuePaise: number;
    orderCount: number;
    paidOrderCount: number;
    attentionCount: number;
    customerCount: number;
    liveProductCount: number;
    productCount: number;
  };
  revenueSeries: { month: string; revenuePaise: number }[];
  catalog: {
    id: string;
    slug: string;
    name: string;
    volume: string | null;
    status: string;
    stockQty: number;
    pricePaise: number;
    imageUrl: string | null;
  }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    totalPaise: number;
    createdAt: string;
    customerName: string;
    customerEmail: string | null;
  }[];
}

export interface AdminProductInput {
  slug?: string;
  name: string;
  volume?: string | null;
  description?: string | null;
  long_description?: string | null;
  author?: string | null;
  publisher?: string | null;
  language?: string | null;
  age_range?: string | null;
  pages?: number | null;
  price_paise: number;
  compare_at_paise?: number | null;
  stock_qty?: number;
  status?: AdminProductStatus;
  tag?: string | null;
  features?: string[];
  categories?: string[];
  kit_contents?: Array<{ name: string; qty: number; detail?: string }>;
  sort_order?: number;
  images?: Array<{
    url: string;
    alt?: string | null;
    sort_order?: number;
    is_primary?: boolean;
  }>;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const body = await authFetch<ApiSuccess<AdminOverview>>(API.admin.overview);
  return body.data;
}

export async function listAdminProducts(page = 1, perPage = 50, status?: string) {
  const qs = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (status) qs.set('status', status);
  const body = await authFetch<
    ApiSuccess<{ products: AdminProduct[]; meta: { total: number; page: number; perPage: number } }>
  >(`${API.admin.products}?${qs}`);
  return body.data;
}

export async function createAdminProduct(input: AdminProductInput & { slug: string }) {
  const body = await authFetch<ApiSuccess<{ product: AdminProduct }>>(API.admin.products, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return body.data.product;
}

export async function updateAdminProduct(id: string, updates: Partial<AdminProductInput>): Promise<AdminProduct> {
  const body = await authFetch<ApiSuccess<{ product: AdminProduct }>>(`${API.admin.products}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return body.data.product;
}

export async function uploadAdminProductImage(file: File): Promise<{ url: string }> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');

  const token = await user.getIdToken();
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/admin/products/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const body = await parseResponse<ApiSuccess<{ url: string }>>(res);
  return body.data;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  status: string;
  total_paise: number;
  shipping_address: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  user_id: string;
  created_at: string;
  order_items?: Array<{
    id: string;
    product_id: string | null;
    snapshot_name: string;
    quantity: number;
  }>;
  payments?: Array<{
    status: string;
  }>;
}

export async function listAdminOrders(page = 1, perPage = 20, status?: string) {
  const qs = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (status && status !== 'all') qs.set('status', status);
  const body = await authFetch<
    ApiSuccess<{ orders: AdminOrder[]; meta: { total: number; page: number; perPage: number } }>
  >(`${API.admin.orders}?${qs}`);
  return body.data;
}

export async function updateAdminOrderStatus(id: string, status: string) {
  const body = await authFetch<ApiSuccess<{ order: AdminOrder }>>(`${API.admin.orders}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return body.data.order;
}

export interface AdminPayment {
  id: string;
  order_id: string;
  provider: string;
  amount_paise: number;
  status: string;
  created_at: string;
  orders?: {
    order_number: string;
    shipping_address?: { first_name?: string; last_name?: string };
    user_id: string;
  };
}

export async function listAdminPayments(page = 1, perPage = 50) {
  const qs = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  const body = await authFetch<
    ApiSuccess<{
      payments: AdminPayment[];
      kpis: { collectedPaise: number; pendingPaise: number; refundedPaise: number };
      meta: { total: number; page: number; perPage: number };
    }>
  >(`${API.admin.payments}?${qs}`);
  return body.data;
}

export interface AdminCoupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed_paise';
  value: number;
  min_subtotal_paise: number;
  max_discount_paise: number | null;
  max_uses: number | null;
  per_user_limit: number;
  used_count: number;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  created_at: string;
}

export async function listAdminCoupons(page = 1, perPage = 20) {
  const qs = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  const body = await authFetch<
    ApiSuccess<{ coupons: AdminCoupon[]; meta: { total: number; page: number; perPage: number } }>
  >(`${API.admin.coupons}?${qs}`);
  return body.data;
}

export async function createAdminCoupon(input: Partial<AdminCoupon>) {
  const body = await authFetch<ApiSuccess<{ coupon: AdminCoupon }>>(API.admin.coupons, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return body.data.coupon;
}

export async function updateAdminCoupon(id: string, updates: Partial<AdminCoupon>) {
  const body = await authFetch<ApiSuccess<{ coupon: AdminCoupon }>>(`${API.admin.coupons}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return body.data.coupon;
}
