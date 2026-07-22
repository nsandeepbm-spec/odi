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
