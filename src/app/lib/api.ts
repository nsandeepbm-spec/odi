import type { User } from 'firebase/auth';
import { auth } from './firebase';

/**
 * Backend base URL — set in odinew/.env:
 *   VITE_API_URL=http://localhost:5000
 * For ngrok sharing, use the API tunnel HTTPS URL.
 */
export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000';

/** Free ngrok injects an interstitial unless this header is present. Harmless on localhost. */
const DEFAULT_API_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

/** Clean route paths (no /api/v1 prefix). */
export const API = {
  auth: {
    sync: '/auth/sync',
  },
  user: {
    me: '/user/me',
    addresses: '/user/addresses',
    favorites: '/user/favorites',
    notifyMe: '/user/notify-me',
    notifications: '/user/notifications',
    supportTickets: '/user/support-tickets',
    reviews: '/user/reviews',
  },
  users: {
    list: '/users',
  },
  checkout: {
    sessions: '/checkout/sessions',
  },
  coupons: {
    validate: '/coupons/validate',
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
    supportTickets: '/admin/support-tickets',
  },
  orders: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
  },
  public: {
    products: '/products',
  },
  shipping: {
    pincode: (pincode: string) => `/shipping/pincode/${pincode}`,
    tat: (destinationPin: string, mot?: 'E' | 'S') =>
      mot ? `/shipping/tat/${destinationPin}?mot=${mot}` : `/shipping/tat/${destinationPin}`,
    charges: (destinationPin: string, slug: string, quantity: number) => {
      const qs = new URLSearchParams({ slug, quantity: String(quantity) });
      return `/shipping/charges/${destinationPin}?${qs.toString()}`;
    },
  },
  reviews: {
    item: (id: string) => `/reviews/${id}`,
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
  is_super_admin: boolean;
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
      ...DEFAULT_API_HEADERS,
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  return parseResponse<T>(res);
}

/** Public fetch wrapper without authentication. */
export async function publicFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...DEFAULT_API_HEADERS,
      ...options.headers,
    },
  });

  return parseResponse<T>(res);
}

// ---------------------------------------------------------------------------
// Module-level in-memory cache for public read-only API calls.
// Prevents redundant network requests when navigating back to a page or
// between checkout steps. TTL = 5 minutes.
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const _apiCache = new Map<string, CacheEntry<unknown>>();

function cacheGet<T>(key: string): T | null {
  const entry = _apiCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    _apiCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet<T>(key: string, data: T): void {
  _apiCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

/** Force-expire a cache entry (call after mutations like product create/update). */
export function invalidatePublicCache(keyPrefix: string) {
  for (const key of _apiCache.keys()) {
    if (key.startsWith(keyPrefix)) _apiCache.delete(key);
  }
}

/**
 * Synchronous cache peek for the default products list (page 1, 50 items).
 * Use to seed component state before the first paint so no skeleton flash occurs.
 */
export function peekPublicProductsCache(): AdminProduct[] | null {
  const qs = new URLSearchParams({ page: '1', perPage: '50' });
  const cached = cacheGet<{
    products: AdminProduct[];
    meta: { total: number; page: number; perPage: number; totalPages: number };
  }>(`public:products:${qs.toString()}`);
  return cached?.products ?? null;
}

/**
 * Synchronous cache peek for a single product slug.
 */
export function peekPublicProductCache(slug: string): AdminProduct | null {
  return cacheGet<AdminProduct>(`public:product:${slug}`);
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
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
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
  /** null for COD orders — no Razorpay payment gateway involved. */
  razorpayOrderId: string | null;
  amount: number;
  currency: string;
  /** null for COD orders. */
  keyId: string | null;
  /** true when the request was replayed (idempotency hit). */
  reused: boolean;
  /** true when payment method is Cash on Delivery. */
  isCod?: boolean;
}

export interface CheckoutSessionInput {
  /** Prefer saved address UUID from user_addresses when available. */
  addressId?: string;
  shippingAddress?: {
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
  /** 'razorpay' (default) opens Razorpay modal; 'cod' creates order without gateway. */
  paymentMethod?: 'razorpay' | 'cod';
}

/** POST /checkout/sessions — create pending order + optional Razorpay order. */
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

// ─── Coupons (customer) ───────────────────────────────────────────────────────

export interface CouponValidation {
  valid: true;
  code: string;
  type: 'percent' | 'fixed_paise';
  value: number;
  subtotal_paise: number;
  discount_paise: number;
  total_paise: number;
  currency: string;
}

// ─── Shipping (Delhivery pincode) ─────────────────────────────────────────────

export interface PincodeServiceability {
  pincode: string;
  serviceable: boolean;
  prepaid: boolean;
  cod: boolean;
  /** Original JSON from Delhivery (`delivery_codes`, etc.). */
  delhivery?: {
    delivery_codes?: Array<{ postal_code?: Record<string, unknown> }>;
  };
  requestUrl?: string;
  provider: string;
  environment: string;
  baseUrl?: string;
}

/** GET /shipping/pincode/:pincode — Delhivery serviceability (public, read-only). */
export async function checkPincodeServiceability(pincode: string): Promise<PincodeServiceability> {
  const digits = pincode.replace(/\D/g, '');
  if (digits.length !== 6) {
    throw new Error('Enter a valid 6-digit PIN code');
  }
  const body = await publicFetch<ApiSuccess<PincodeServiceability>>(API.shipping.pincode(digits));
  return body.data;
}

export interface ExpectedTat {
  originPin: string;
  destinationPin: string;
  mot: 'E' | 'S';
  pdt: string;
  days: number | null;
  label: string;
  delhivery?: Record<string, unknown>;
  requestUrl?: string;
  provider: string;
  environment: string;
  baseUrl?: string;
}

/** GET /shipping/tat/:destinationPin — Delhivery expected TAT (public, read-only). */
export async function getExpectedTat(
  destinationPin: string,
  mot?: 'E' | 'S'
): Promise<ExpectedTat> {
  const digits = destinationPin.replace(/\D/g, '');
  if (digits.length !== 6) {
    throw new Error('Enter a valid 6-digit PIN code');
  }
  const body = await publicFetch<ApiSuccess<ExpectedTat>>(API.shipping.tat(digits, mot));
  return body.data;
}

export interface ShippingQuote {
  originPin: string;
  destinationPin: string;
  mot: 'E' | 'S';
  pt: string;
  chargeableGrams: number;
  shippingPaise: number;
  delhivery?: Record<string, unknown> | Array<Record<string, unknown>>;
  requestUrl?: string;
  provider: string;
  environment: string;
  baseUrl?: string;
}

/** GET /shipping/charges/:destinationPin — Delhivery shipping cost (public, read-only). */
export async function getShippingQuote(input: {
  destinationPin: string;
  slug: string;
  quantity: number;
}): Promise<ShippingQuote> {
  const digits = input.destinationPin.replace(/\D/g, '');
  if (digits.length !== 6) {
    throw new Error('Enter a valid 6-digit PIN code');
  }
  const body = await publicFetch<ApiSuccess<ShippingQuote>>(
    API.shipping.charges(digits, input.slug, input.quantity)
  );
  return body.data;
}

/** POST /coupons/validate — preview discount for a code (auth required). */
export async function validateCoupon(input: {
  code: string;
  items?: Array<{ productId: string; quantity: number }>;
}): Promise<CouponValidation> {
  const body = await authFetch<ApiSuccess<CouponValidation>>(API.coupons.validate, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return body.data;
}

// ─── User addresses ───────────────────────────────────────────────────────────

export interface UserAddress {
  id: string;
  user_id: string;
  label: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  street: string;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateAddressInput = {
  label?: string | null;
  first_name: string;
  last_name?: string;
  phone: string;
  email?: string | null;
  street: string;
  city: string;
  state?: string | null;
  postal_code: string;
  country?: string;
  is_default?: boolean;
};

export async function listAddresses(): Promise<UserAddress[]> {
  const body = await authFetch<ApiSuccess<{ addresses: UserAddress[] }>>(API.user.addresses);
  return body.data.addresses;
}

export async function createAddress(input: CreateAddressInput): Promise<UserAddress> {
  const body = await authFetch<ApiSuccess<{ address: UserAddress }>>(API.user.addresses, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return body.data.address;
}

export async function updateAddress(id: string, patch: Partial<CreateAddressInput>): Promise<UserAddress> {
  const body = await authFetch<ApiSuccess<{ address: UserAddress }>>(`${API.user.addresses}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return body.data.address;
}

export async function deleteAddress(id: string): Promise<void> {
  await authFetch<ApiSuccess<{ deleted: boolean }>>(`${API.user.addresses}/${id}`, {
    method: 'DELETE',
  });
}

// ─── User favorites ───────────────────────────────────────────────────────────

export interface UserFavorite {
  id: string;
  product_id: string;
  slug: string | null;
  name: string | null;
  price_paise: number | null;
  status: string | null;
  tag: string | null;
  image_url: string | null;
  created_at: string;
}

export async function listFavorites(): Promise<UserFavorite[]> {
  const body = await authFetch<ApiSuccess<{ favorites: UserFavorite[] }>>(API.user.favorites);
  return body.data.favorites;
}

export async function addFavorite(slug: string): Promise<void> {
  await authFetch<ApiSuccess<{ favorite: unknown }>>(API.user.favorites, {
    method: 'POST',
    body: JSON.stringify({ slug }),
  });
}

export async function removeFavorite(slug: string): Promise<void> {
  await authFetch<ApiSuccess<{ deleted: boolean }>>(`${API.user.favorites}/${slug}`, {
    method: 'DELETE',
  });
}

// ─── Notify Me (product launch waitlist) ─────────────────────────────────────

export interface NotifyMeRequest {
  id: string;
  product_id: string;
  slug: string | null;
  name: string | null;
  price_paise: number | null;
  status: string | null;
  is_live: boolean;
  tag: string | null;
  image_url: string | null;
  notified_at: string | null;
  created_at: string;
}

export async function listNotifyMe(): Promise<NotifyMeRequest[]> {
  const body = await authFetch<ApiSuccess<{ requests: NotifyMeRequest[] }>>(API.user.notifyMe);
  return body.data.requests;
}

export async function subscribeNotifyMe(slug: string): Promise<{ alreadySubscribed: boolean }> {
  const body = await authFetch<ApiSuccess<{ request: { alreadySubscribed?: boolean } }>>(
    API.user.notifyMe,
    {
      method: 'POST',
      body: JSON.stringify({ slug }),
    }
  );
  return { alreadySubscribed: Boolean(body.data.request.alreadySubscribed) };
}

export async function unsubscribeNotifyMe(slug: string): Promise<void> {
  await authFetch<ApiSuccess<{ deleted: boolean }>>(`${API.user.notifyMe}/${slug}`, {
    method: 'DELETE',
  });
}

// ─── In-app notifications ────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  cleared_at?: string | null;
  created_at: string;
  is_read: boolean;
  is_cleared?: boolean;
}

export async function listNotifications(opts?: {
  unreadOnly?: boolean;
  includeCleared?: boolean;
  page?: number;
  perPage?: number;
}): Promise<{
  notifications: AppNotification[];
  meta: { total: number; page: number; perPage: number; totalPages: number };
}> {
  const qs = new URLSearchParams();
  if (opts?.unreadOnly) qs.set('unreadOnly', 'true');
  if (opts?.includeCleared) qs.set('includeCleared', 'true');
  if (opts?.page) qs.set('page', String(opts.page));
  if (opts?.perPage) qs.set('perPage', String(opts.perPage));
  const q = qs.toString();
  const body = await authFetch<
    ApiSuccess<{
      notifications: AppNotification[];
      meta: { total: number; page: number; perPage: number; totalPages: number };
    }>
  >(`${API.user.notifications}${q ? `?${q}` : ''}`);
  return body.data;
}

export async function previewNotifications(limit = 4): Promise<{
  notifications: AppNotification[];
  unreadCount: number;
}> {
  const body = await authFetch<
    ApiSuccess<{ notifications: AppNotification[]; unreadCount: number }>
  >(`${API.user.notifications}/preview?limit=${limit}`);
  return body.data;
}

export async function getUnreadNotificationCount(): Promise<number> {
  const body = await authFetch<ApiSuccess<{ count: number }>>(
    `${API.user.notifications}/unread-count`
  );
  return body.data.count;
}

export async function markNotificationRead(id: string): Promise<AppNotification> {
  const body = await authFetch<ApiSuccess<{ notification: AppNotification }>>(
    `${API.user.notifications}/${id}/read`,
    { method: 'PATCH' }
  );
  return body.data.notification;
}

export async function markAllNotificationsRead(): Promise<void> {
  await authFetch<ApiSuccess<{ updated: boolean }>>(`${API.user.notifications}/read-all`, {
    method: 'POST',
  });
}

/** Clear bell preview — history page still shows them. */
export async function clearBellNotifications(): Promise<void> {
  await authFetch<ApiSuccess<{ cleared: boolean }>>(`${API.user.notifications}/clear`, {
    method: 'POST',
  });
}

// ─── Support tickets ─────────────────────────────────────────────────────────

export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  user_email?: string | null;
  user_name?: string | null;
}

export async function listMySupportTickets(page = 1, perPage = 20) {
  const qs = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  const body = await authFetch<
    ApiSuccess<{
      tickets: SupportTicket[];
      meta: { total: number; page: number; perPage: number; totalPages: number };
    }>
  >(`${API.user.supportTickets}?${qs}`);
  return body.data;
}

export async function createSupportTicket(input: {
  subject: string;
  message: string;
}): Promise<SupportTicket> {
  const body = await authFetch<ApiSuccess<{ ticket: SupportTicket }>>(API.user.supportTickets, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return body.data.ticket;
}

export async function listAdminSupportTickets(page = 1, perPage = 20, status?: string) {
  const qs = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (status) qs.set('status', status);
  const body = await authFetch<
    ApiSuccess<{
      tickets: SupportTicket[];
      meta: { total: number; page: number; perPage: number; totalPages: number };
    }>
  >(`${API.admin.supportTickets}?${qs}`);
  return body.data;
}

export async function updateAdminSupportTicket(
  id: string,
  patch: { status?: SupportTicketStatus; admin_note?: string | null }
): Promise<SupportTicket> {
  const body = await authFetch<ApiSuccess<{ ticket: SupportTicket }>>(
    `${API.admin.supportTickets}/${id}`,
    { method: 'PATCH', body: JSON.stringify(patch) }
  );
  return body.data.ticket;
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
  kind?: 'card' | 'gallery';
}

export interface AdminProductMedia {
  card: Pick<AdminProductImage, 'id' | 'url' | 'alt' | 'sort_order' | 'kind'> | null;
  gallery: Array<Pick<AdminProductImage, 'id' | 'url' | 'alt' | 'sort_order' | 'kind'>>;
  all: Array<Pick<AdminProductImage, 'id' | 'url' | 'alt' | 'sort_order' | 'kind'>>;
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
  publisher_bio: string | null;
  author_bio: string | null;
  editorial_review: string | null;
  editorial_review_author: string | null;
  editorial_review_rating: number | null;
  language: string | null;
  age_range: string | null;
  pages: number | null;
  weight_grams: number | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  price_paise: number;
  compare_at_paise: number | null;
  stock_qty: number;
  status: AdminProductStatus;
  tag: string | null;
  /** Featured Immersive Series on /products (live or coming_soon). */
  is_featured: boolean;
  features: string[];
  categories: string[];
  kit_contents: Array<{ name: string; qty: number; detail: string }>;
  sort_order: number;
  images: AdminProductImage[];
  media: AdminProductMedia;
  rating_avg: number;
  rating_count: number;
  rating?: { avg: number; count: number };
  available?: boolean;
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
  publisher_bio?: string | null;
  author_bio?: string | null;
  editorial_review?: string | null;
  editorial_review_author?: string | null;
  editorial_review_rating?: number | null;
  language?: string | null;
  age_range?: string | null;
  pages?: number | null;
  weight_grams?: number | null;
  length_cm?: number | null;
  width_cm?: number | null;
  height_cm?: number | null;
  price_paise: number;
  compare_at_paise?: number | null;
  stock_qty?: number;
  status?: AdminProductStatus;
  tag?: string | null;
  is_featured?: boolean;
  features?: string[];
  categories?: string[];
  kit_contents?: Array<{ name: string; qty: number; detail?: string }>;
  sort_order?: number;
  images?: Array<{
    url: string;
    alt?: string | null;
    sort_order?: number;
    kind?: 'card' | 'gallery';
    is_primary?: boolean;
  }>;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const body = await authFetch<ApiSuccess<AdminOverview>>(API.admin.overview);
  return body.data;
}

export async function listAdminProducts(page = 1, perPage = 50, status?: string, q?: string) {
  const qs = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (status) qs.set('status', status);
  if (q?.trim()) qs.set('q', q.trim());
  const body = await authFetch<
    ApiSuccess<{
      products: AdminProduct[];
      meta: { total: number; page: number; perPage: number; totalPages: number };
    }>
  >(`${API.admin.products}?${qs}`);
  return body.data;
}

export async function listPublicProducts(page = 1, perPage = 50, status?: string, q?: string) {
  const qs = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (status) qs.set('status', status);
  if (q?.trim()) qs.set('q', q.trim());
  const cacheKey = `public:products:${qs.toString()}`;
  const cached = cacheGet<{
    products: AdminProduct[];
    meta: { total: number; page: number; perPage: number; totalPages: number };
  }>(cacheKey);
  if (cached) return cached;
  const body = await publicFetch<
    ApiSuccess<{
      products: AdminProduct[];
      meta: { total: number; page: number; perPage: number; totalPages: number };
    }>
  >(`${API.public.products}?${qs}`);
  cacheSet(cacheKey, body.data);
  return body.data;
}

export async function getPublicProduct(slug: string): Promise<AdminProduct> {
  const cacheKey = `public:product:${slug}`;
  const cached = cacheGet<AdminProduct>(cacheKey);
  if (cached) return cached;
  const body = await publicFetch<ApiSuccess<{ product: AdminProduct }>>(`${API.public.products}/${slug}`);
  cacheSet(cacheKey, body.data.product);
  return body.data.product;
}

export interface PublicReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
  updated_at: string;
  author_name: string;
  author_avatar_url: string | null;
}

export interface PublicReviewsResult {
  reviews: PublicReview[];
  meta: { total: number; page: number; perPage: number; totalPages: number };
}

/** GET /products/:slug/reviews — public list of reviews for a product. */
export async function getPublicProductReviews(
  slug: string,
  page = 1,
  perPage = 20
): Promise<PublicReviewsResult> {
  const body = await publicFetch<ApiSuccess<PublicReviewsResult>>(
    `${API.public.products}/${slug}/reviews?page=${page}&perPage=${perPage}`
  );
  return body.data;
}

export interface MyReview extends PublicReview {
  product_slug: string | null;
  product_name: string | null;
}

/** GET /user/reviews — signed-in user's reviews. */
export async function listMyReviews(): Promise<MyReview[]> {
  const body = await authFetch<ApiSuccess<{ reviews: MyReview[] }>>(API.user.reviews);
  return body.data.reviews;
}

/** POST /products/:slug/reviews — create a product review. */
export async function createProductReview(
  slug: string,
  input: { rating: number; body: string; title?: string | null }
): Promise<PublicReview> {
  const body = await authFetch<ApiSuccess<{ review: PublicReview }>>(
    `${API.public.products}/${slug}/reviews`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  );
  return body.data.review;
}

/** PATCH /reviews/:id — update own review. */
export async function updateProductReview(
  id: string,
  input: { rating?: number; body?: string; title?: string | null }
): Promise<PublicReview> {
  const body = await authFetch<ApiSuccess<{ review: PublicReview }>>(API.reviews.item(id), {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  return body.data.review;
}

/** DELETE /reviews/:id — delete own review. */
export async function deleteProductReview(id: string): Promise<void> {
  await authFetch<ApiSuccess<{ deleted: boolean }>>(API.reviews.item(id), {
    method: 'DELETE',
  });
}

export async function getAdminProduct(id: string): Promise<AdminProduct> {
  const body = await authFetch<ApiSuccess<{ product: AdminProduct }>>(`${API.admin.products}/${id}`);
  return body.data.product;
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
      'ngrok-skip-browser-warning': 'true',
    },
    body: formData,
  });

  const body = await parseResponse<ApiSuccess<{ url: string }>>(res);
  return body.data;
}

export interface AdminOrderShippingAddress {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface AdminOrderItem {
  id: string;
  snapshot_name: string;
  snapshot_slug?: string;
  snapshot_image_url?: string;
  quantity: number;
  unit_price_paise: number;
  line_total_paise: number;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  status: string;
  subtotal_paise: number;
  discount_paise: number;
  shipping_paise: number;
  total_paise: number;
  coupon_code?: string | null;
  shipping_address: AdminOrderShippingAddress;
  user_id: string;
  created_at: string;
  paid_at?: string | null;
  delhivery_waybill?: string | null;
  delhivery_status?: string | null;
  delhivery_pickup_token?: string | null;
  order_items?: AdminOrderItem[];
  payments?: Array<{
    id: string;
    provider: string;
    provider_payment_id?: string;
    amount_paise: number;
    status: string;
    created_at: string;
  }>;
}

export interface AdminOrderDetail {
  order: AdminOrder;
  items: AdminOrderItem[];
  payments: Array<{
    id: string;
    provider: string;
    provider_order_id?: string;
    provider_payment_id?: string;
    amount_paise: number;
    status: string;
    created_at: string;
  }>;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    role: string;
    status: string;
  } | null;
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

export async function createAdminOrderShipment(id: string) {
  const body = await authFetch<ApiSuccess<{ order: AdminOrder }>>(`${API.admin.orders}/${id}/shipment`, {
    method: 'POST',
  });
  return body.data.order;
}

export async function createAdminOrderPickup(id: string) {
  const body = await authFetch<ApiSuccess<{ order: AdminOrder }>>(`${API.admin.orders}/${id}/pickup`, {
    method: 'POST',
  });
  return body.data.order;
}

export async function getAdminOrderDetail(id: string): Promise<AdminOrderDetail> {
  const body = await authFetch<ApiSuccess<AdminOrderDetail>>(`${API.admin.orders}/${id}`);
  return body.data;
}

export async function adminUpdateUser(
  id: string,
  patch: { role?: 'user' | 'admin'; status?: 'active' | 'inactive' | 'banned' }
): Promise<AppUser> {
  const body = await authFetch<ApiSuccess<{ user: AppUser }>>(`${API.users.list}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return body.data.user;
}

export interface AdminPayment {
  id: string;
  order_id: string;
  provider: string;
  provider_order_id?: string | null;
  provider_payment_id?: string | null;
  amount_paise: number;
  currency?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  orders?: {
    order_number: string;
    shipping_address?: { first_name?: string; last_name?: string; email?: string; phone?: string };
    user_id: string;
  };
}

export interface AdminPaymentDetail {
  payment: {
    id: string;
    order_id: string;
    provider: string;
    provider_order_id?: string | null;
    provider_payment_id?: string | null;
    amount_paise: number;
    currency: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  order: {
    id: string;
    order_number: string;
    status: string;
    total_paise: number;
    subtotal_paise: number;
    discount_paise: number;
    coupon_code?: string | null;
    shipping_address?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      street?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
    user_id: string;
    created_at: string;
    paid_at?: string | null;
  } | null;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    role: string;
    status: string;
  } | null;
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

export async function getAdminPaymentDetail(id: string): Promise<AdminPaymentDetail> {
  const body = await authFetch<ApiSuccess<AdminPaymentDetail>>(`${API.admin.payments}/${id}`);
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

// ---------------------------------------------------------------------------
// User-facing order types & API helpers (GET /orders, GET /orders/:id)
// ---------------------------------------------------------------------------

export type UserOrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type UserPaymentStatus = 'pending' | 'captured' | 'failed' | 'refunded';

export interface UserOrderItem {
  id: string;
  product_id: string | null;
  snapshot_name: string;
  snapshot_slug?: string | null;
  snapshot_image_url: string | null;
  quantity: number;
  unit_price_paise: number;
  line_total_paise?: number;
}

export interface UserOrderPayment {
  id: string;
  provider: string;
  provider_order_id: string | null;
  provider_payment_id: string | null;
  amount_paise: number;
  status: UserPaymentStatus;
  created_at: string;
}

export interface UserOrder {
  id: string;
  order_number: string;
  status: UserOrderStatus;
  subtotal_paise: number;
  discount_paise: number;
  shipping_paise: number;
  total_paise: number;
  coupon_code: string | null;
  shipping_address: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  /**
   * Set for online (Razorpay) orders. null for COD.
   * If status is 'pending' and this is non-null, the user started payment but
   * did not complete it — show as "Awaiting Payment" in the dashboard.
   */
  razorpay_order_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at?: string;
  /** Included in list and detail responses. */
  order_items?: UserOrderItem[];
}

export interface UserOrderDetail extends UserOrder {
  items: UserOrderItem[];
  payments: UserOrderPayment[];
}

/** GET /orders — paginated list for the signed-in user. */
export async function listMyOrders(page = 1, perPage = 20) {
  const qs = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  const body = await authFetch<
    ApiSuccess<{
      orders: UserOrder[];
      meta: { total: number; page: number; perPage: number; totalPages: number };
    }>
  >(`${API.orders.list}?${qs}`);
  return body.data;
}

/** GET /orders/:id — single order with items + payments for the signed-in user. */
export async function getMyOrder(id: string) {
  const body = await authFetch<
    ApiSuccess<{ order: UserOrder; items: UserOrderItem[]; payments: UserOrderPayment[] }>
  >(API.orders.detail(id));
  return body.data;
}
