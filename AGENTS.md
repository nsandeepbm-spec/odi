# ODI Frontend — Agent Guide (`odinew`)

React 19 + Vite + React Router + Tailwind + Motion + Firebase Auth + MUI/Radix UI primitives.

---

## App structure

```
src/app/
├── routes.tsx           # all routes — add new pages here
├── lib/
│   ├── api.ts           # backend fetch + AppUser types
│   ├── auth.tsx         # AuthProvider, useAuth
│   └── firebase.ts      # sign-in helpers
├── data/mock.ts         # TEMP mock data — replace with API as backend grows
├── pages/               # route-level screens
├── components/          # shared UI (Navbar, Layout, dashboard, checkout)
└── components/ui/       # shadcn-style primitives — reuse before creating new
```

---

## Visual design system (match this on every new screen)

### Brand feel

- Premium, minimal, bold typography — **not** generic SaaS gray boxes.
- Headlines: `font-black`, tight tracking (`letterSpacing: -0.03em`), large clamp sizes.
- Accent words: gradient text `from-cyan-400 via-indigo-500 to-purple-600`.
- Body/subtext: `text-neutral-500` / `#666666`.
- Primary CTA: `bg-neutral-900 text-white`, rounded-xl or rounded-full, subtle hover lift.

### Core tokens (reuse these)

```ts
const T = {
  bg: '#FFFFFF',
  bgAlt: '#F7F7F5',
  text: '#111111',
  sub: '#666666',
  border: '#E8E8E8',
};
```

### Layout patterns

| Surface | Pattern |
| --- | --- |
| Marketing pages | `max-w-7xl mx-auto px-6 lg:px-12`, generous vertical spacing |
| Auth | `AuthShell` split layout — brand panel left, form right |
| Dashboard | `PageHeader` + `Card` / `StatCard` from `components/dashboard/shared.tsx` |
| Checkout | `CheckoutLayout` — form left (3/5), order summary right (2/5), `rounded-3xl` card |

### Motion

- Use `motion/react` for entrance animations.
- Standard: `initial={{ opacity: 0, y: 14 }}`, `duration: 0.45`, ease `[0.25, 0.1, 0.25, 1]`.
- Hover on cards: `-translate-y-1`, `shadow-md` — keep subtle.

### Typography scale

- Section labels: `text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400`
- Dashboard values: `text-2xl font-black`
- Currency: use `inr()` helper from `components/dashboard/shared.tsx`

### Components to reuse (do not reinvent)

- `PageHeader`, `StatCard`, `Card`, `BookingBadge`, `PaymentBadge`, `EmptyState`
- `AuthShell`, `authInput`
- `Navbar`, `Layout`, `DashboardShell`, `UserLayout`, `AdminLayout`
- `components/ui/*` for buttons, dialogs, forms

---

## Routing conventions

- Public site under `/` with `Layout`.
- Auth: `/login`, `/register` (standalone, no main navbar).
- Checkout: `/checkout` → `/checkout/payment` → `/checkout/success`.
- User dashboard: `/dashboard/*` — guarded by `RequireAuth`.
- Admin dashboard: `/dashboard/admin/*` — guarded by `RequireAdmin`.

When adding routes, register in `routes.tsx` and add nav links only where appropriate (admin vs public).

---

## Data & API rules

### Live API (use these)

```ts
// src/app/lib/api.ts
syncUserWithBackend()   // POST /auth/sync
getCurrentUser()        // GET /user/me
updateCurrentUser()     // PATCH /user/me
listUsers()             // GET /users (admin)
submitContactInquiry()  // POST /contact (public)
submitCareerApplication() // POST /careers (public)
listAdminContactInquiries() // GET /admin/contact-inquiries
listAdminCareerApplications() // GET /admin/career-applications
```

All authenticated calls use `Authorization: Bearer <firebase-id-token>` via `authFetch()`.

### Mock data (replace, do not extend blindly)

`src/app/data/mock.ts` holds bookings, products, transactions. When backend endpoints exist:

1. Add typed functions to `api.ts`.
2. Replace mock imports in dashboard pages.
3. Remove or shrink mock exports — avoid mixed live/mock on the same screen.

---

## Auth UX rules

- Use `useAuth()` for `user`, `isAdmin`, `loading`, `signOut`, `updateProfile`.
- Do not store tokens manually — Firebase SDK handles refresh.
- After sign-in, call `syncUserWithBackend()` before navigating to dashboard.
- If sync fails, show an error — do not silently navigate (current gap to fix).
- Admin pages must check `user.role === 'admin'` via `RequireAdmin`.

---

## E-commerce UI rules (when wiring real checkout)

- Product images live in `public/` (e.g. `public/product-image/`).
- Show prices in INR with `₹` prefix; backend stores paise, frontend displays rupees.
- Checkout must collect shipping into controlled state and POST to backend — not uncontrolled inputs that navigate away.
- Payment UI must use Razorpay/Stripe embed — **never** collect raw card number/CVV in React forms for production.
- Order success page must show real order ID from API response, not hard-coded `#ORD-0924`.

---

## Code style

- Functional components + hooks only.
- Colocate page-specific components under `pages/`; shared under `components/`.
- Prefer Tailwind utility classes matching existing screens; inline `style={{}}` only for token colors already used.
- TypeScript strict — define interfaces for API responses alongside `api.ts`.
- Use `lucide-react` for icons (consistent with existing pages).
- Do not add new global state libraries unless necessary — `AuthProvider` + local state is the current pattern.

### Do not

- Hard-code product catalogs in page files when they should come from API.
- Create a second auth system alongside Firebase.
- Break the gradient accent / neutral-900 CTA visual language.
- Add `/api/v1` prefix — backend uses clean paths (`/user/me`, not `/api/v1/user/me`).

---

## File naming

- Pages: `PascalCase` + `Page.tsx` suffix (e.g. `ProductsPage.tsx`).
- Components: `PascalCase.tsx`.
- Lib/utils: `camelCase.ts` / `camelCase.tsx`.

---

## Documentation maintenance (required)

**Always update docs** in the same change when you:

- Add or change routes (`routes.tsx`)
- Add env vars (e.g. `VITE_API_URL`)
- Change how to run, build, or deploy the app
- Wire a new backend API in `lib/api.ts` → also update root **[`../api.md`](../api.md)**
- Replace mock data with live API integration

**API rules:** use endpoints documented in `api.md`; do not invent duplicate paths for the same job; keep helpers in `lib/api.ts`.

Also update root `AGENTS.md` if you introduce a new frontend convention that future agents should follow.

Docs are not optional — outdated `api.md` / README is a bug.
