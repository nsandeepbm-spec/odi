# ODI Frontend (`odinew`)

React + Vite app for the ODI brand: marketing site, ODI Kids storefront UI, auth, and user/admin dashboards.

## Setup

```bash
npm install
```

Create `odinew/.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev    # http://localhost:5173
npm run build
```

## Checkout flow (frontend)

Multi-step checkout at `/checkout` (standalone layout — no main site navbar):

1. **Product** — `/checkout?product=space-explorer` — gallery, qty, price, discount
2. **Review** — `/checkout/review` — order recap + delivery address
3. **Payment** — `/checkout/payment` — Razorpay Checkout (`POST /checkout/sessions` → modal → `POST /payments/verify`)
4. **Success** — `/checkout/success`

Online pay requires a signed-in Firebase user. The backend returns `keyId` (public) with the session — never put `RAZORPAY_KEY_SECRET` in the frontend.

Product catalog for checkout lives in `src/app/data/products.ts` until `GET /products` is wired. Checkout resolves items by **slug**, so that slug must exist as a `live` product in Supabase.

## Backend integration

Full HTTP contract (methods, auth, request/response): **[`../api.md`](../api.md)** — always update that file when wiring or changing APIs.

Auth and profile use the Express API in `odi-backend/`:

| Frontend (`lib/api.ts`) | Backend |
| --- | --- |
| `POST /auth/sync` | Sync Firebase user → Supabase profile |
| `GET /user/me` | Current user profile |
| `PATCH /user/me` | Update profile |
| `GET /users` | Admin customer list |
| `GET /admin/overview` | Admin KPIs + recent orders (`getAdminOverview`) |
| `GET/POST/PATCH /admin/products` | Admin catalog list + create/edit (`listAdminProducts`, `createAdminProduct`, `updateAdminProduct`) |
| `POST /checkout/sessions` | Create order + Razorpay order (`createCheckoutSession`) |
| `POST /payments/verify` | Confirm payment after Razorpay modal (`verifyPayment`) |

Storefront catalog / cart UI is still partly mock (`src/app/data/products.ts`) until `GET /products` is wired. Admin **Overview** and **Products** use live APIs.

## Project docs

- UI & code rules for agents: `AGENTS.md`
- Monorepo overview: `../AGENTS.md`

## Documentation rule

**Keep this README updated** whenever you change routes, env vars, scripts, or API integration. Docs are part of every feature — not a follow-up task.
