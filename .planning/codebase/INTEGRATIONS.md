# External Integrations

**Analysis Date:** 2026-05-13

## APIs & External Services

**Backend REST API:**

- Django REST Framework — primary data API for all storefront and admin operations
  - Base URL: `NEXT_PUBLIC_API_URL` env var (public) / `DJANGO_API_URL` (server-side)
  - Default fallback: `http://localhost:8000`
  - Client: Axios instance at `src/shared/lib/http/client.ts`
  - All endpoints defined at `src/shared/constants/api-endpoints.ts`
  - Auth: Bearer JWT token via `Authorization` header (injected by request interceptor)
  - Cookies: `withCredentials: true` — refresh token sent as HTTP-only cookie

**API Endpoint Groups:**

```
/api/auth/login/                        — POST login
/api/auth/register/                     — POST register
/api/auth/token/refresh/                — POST token refresh
/api/auth/logout/                       — POST logout
/api/auth/password/reset/               — POST forgot password
/api/auth/password/reset/confirm/       — POST reset password confirm
/api/auth/me/                           — GET current user profile
/api/auth/me/update/                    — PUT update profile
/api/products/                          — GET product list
/api/products/{slug}/                   — GET product detail
/api/categories/                        — GET categories
/api/orders/                            — GET/POST orders
/api/orders/{id}/                       — GET order detail
/api/orders/{id}/cancel/                — POST cancel order
/api/admin/products/                    — Admin CRUD products
/api/admin/orders/                      — Admin CRUD orders
/api/admin/orders/{id}/status/          — Admin update order status
/api/admin/users/                       — Admin user management
/api/admin/dashboard/                   — Admin dashboard stats
```

## Authentication & Identity

**Auth Provider:**

- Custom JWT — handled entirely by Django REST API backend
  - Access token: stored in Zustand `auth-store` (`src/shared/stores/auth-store.ts`), injected via Axios interceptor
  - Refresh token: stored as HTTP-only cookie, sent with `withCredentials: true`
  - Refresh flow: queue-based 401 intercept in `src/shared/lib/http/client.ts`; refresh endpoint: `/api/auth/token/refresh/`
  - Token refresh implementation: `src/shared/lib/http/api-auth.ts`

**Route Protection (Middleware):**

- File: `middleware.ts`
- Protected routes (redirect to login if unauthenticated): `/admin`, `/checkout`, `/orders`, `/profile`
- Auth-only routes (redirect to home if authenticated): `/login`, `/register`
- Token check: reads `access_token` cookie on each request
- Client-side guard: `AuthGuard` component at `src/shared/lib/guards/`

**Session Storage:**

- Access token — Zustand store (memory only, not persisted to localStorage per `partialize` config)
- User object — Zustand store (persisted to `localStorage` under key `auth-storage`)
- Cart — Zustand store (persisted to `localStorage` under key `cart-storage`)

## Payment Gateways

All payment integrations are stubs — implementation files exist but contain no code (1-line empty files).

**VNPay:**

- Purpose: Vietnamese online payment gateway
- Stub file: `src/shared/lib/payment/vnpay.ts` (empty)
- Required env vars: `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `VNPAY_URL`
- Type: `PaymentMethod = 'vnpay'` (defined in `src/shared/types/payment.ts`)

**MoMo:**

- Purpose: Vietnamese mobile wallet payment
- Stub file: `src/shared/lib/payment/momo.ts` (empty)
- Required env vars: `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY`
- Type: `PaymentMethod = 'momo'` (defined in `src/shared/types/payment.ts`)

**ZaloPay:**

- Purpose: Vietnamese digital payment platform
- Stub file: `src/shared/lib/payment/zalopay.ts` (empty)
- Required env vars: `ZALOPAY_APP_ID`, `ZALOPAY_KEY1`, `ZALOPAY_KEY2`
- Type: `PaymentMethod = 'zalopay'` (defined in `src/shared/types/payment.ts`)

**Cash on Delivery (COD):**

- Type: `PaymentMethod = 'cod'` (defined in `src/shared/types/payment.ts`)
- No external integration required

## Image & Media

**Cloudinary:**

- Purpose: Image CDN and transformation
- Integration: `src/shared/lib/cloudinary.ts` — `buildImageUrl()` utility
  - Constructs `https://res.cloudinary.com/{cloud_name}/image/upload/{transforms}/{publicId}`
  - Supports: width, height, crop (`fill|fit|scale|thumb`), quality (`auto|number`), format (`auto|webp|jpg`)
- Required env var: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- SDK: No SDK — direct URL construction only

**Next.js Image Optimization (`next/image`):**

- Allowed remote hostnames (configured in `next.config.ts`):
  - `**.amazonaws.com` — AWS S3 / CloudFront
  - `localhost` (HTTP)
  - `i.pravatar.cc` — avatar placeholder service
  - `images.unsplash.com` — stock photography
  - `placehold.co` — placeholder images

## Monitoring & Observability

**Sentry:**

- Package: `@sentry/nextjs` 10.49.0
- Purpose: Error tracking and performance monitoring
- Integration: `src/shared/lib/monitoring/sentry.ts`
  - `captureError(error, context)` — wraps `Sentry.captureException`; only fires in `production`
  - `captureMessage(message, level)` — wraps `Sentry.captureMessage`; only fires in `production`
- Trigger: All 5xx HTTP errors captured automatically in Axios response interceptor (`src/shared/lib/http/client.ts`)
- Required env var: `NEXT_PUBLIC_SENTRY_DSN`
- Dev behavior: falls back to `console.error` — no Sentry calls in development

**Logging:**

- Development: `console.error` / `console.warn` (no structured logging framework)
- Production: Sentry only (no third-party log aggregation detected)

## Progressive Web App (PWA)

**Serwist:**

- Package: `@serwist/next` 9.5.7
- Purpose: Service Worker for offline support, precaching, background sync
- SW source: `src/app/sw.ts`
- SW output: `public/sw.js` (generated, not committed to version control)
- Cache strategy: `defaultCache` from `@serwist/next/worker` (stale-while-revalidate + cache-first patterns)
- Precaching: auto-generated manifest (`__SW_MANIFEST`)
- Offline fallback URL: `/~offline`
- Enabled: production only (disabled in development via `NODE_ENV` check)
- Navigation preload: enabled
- Reload on online: enabled

## Data Storage

**Databases:**

- No direct database connection from the Next.js frontend
- All persistence delegated to Django REST API backend

**Client-Side Persistence:**

- `localStorage` — Zustand persist middleware
  - `auth-storage` key: user object only (access token NOT persisted)
  - `cart-storage` key: full cart state (items, total, itemCount)

**File Storage:**

- No direct file upload from Next.js detected
- Images served via Cloudinary CDN (URL construction only) or Next.js image optimization

**Caching:**

- React Query in-memory cache — 60s stale time, configured at `src/shared/lib/query-client.ts`
- Serwist Service Worker cache — runtime caching strategies for static assets and navigation

## Localization

**next-intl:**

- Version: 4.9.1
- Locales: `vi` (Vietnamese, default), `en` (English)
- Message loading: dynamic JSON imports per locale per module
- Message source: `src/lang/{vi,en}/{module}.json` — 8 modules (common, auth, product, cart, order, payment, home, checkout)
- Server integration: `src/i18n/request.ts`
- Middleware: `middleware.ts` uses `createMiddleware` from next-intl for locale routing

**Currency & Date Formatting:**

- Currency: VND via `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })` — `src/shared/lib/utils.ts`
- Date: `date-fns` with `vi` locale — `dd/MM/yyyy` and `HH:mm dd/MM/yyyy` formats

## CI/CD & Deployment

**Hosting:**

- Not explicitly configured — no `vercel.json`, `netlify.toml`, or Dockerfile detected
- Compatible with any Node.js server (Next.js SSR output)

**CI Pipeline:**

- Not configured (no `.github/workflows/` or similar detected)
- Playwright config includes CI-specific settings: `retries: 2`, `workers: 1`, HTML + GitHub reporters

**Pre-commit Automation:**

- Husky pre-commit hook → lint-staged → ESLint + Prettier on `*.{ts,tsx}`

## Webhooks & Callbacks

**Incoming:**

- `/api/auth/token/refresh/` — used by client-side refresh flow (not a true webhook)
- Payment gateway callbacks: Not yet implemented (payment stubs are empty)

**Outgoing:**

- None detected

## Environment Variable Summary

| Variable                            | Required | Used By                                                |
| ----------------------------------- | -------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_APP_URL`               | Yes      | SEO metadata, canonical URLs (`src/shared/lib/seo.ts`) |
| `NEXT_PUBLIC_API_URL`               | Yes      | Axios base URL, token refresh fetch                    |
| `DJANGO_API_URL`                    | No       | Optional server-side override                          |
| `NEXT_PUBLIC_SENTRY_DSN`            | No       | Sentry initialization                                  |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No       | Image URL construction                                 |
| `NEXT_PUBLIC_APP_NAME`              | No       | Site name in metadata                                  |
| `VNPAY_TMN_CODE`                    | No       | VNPay payment (not yet implemented)                    |
| `VNPAY_HASH_SECRET`                 | No       | VNPay HMAC signing (not yet implemented)               |
| `VNPAY_URL`                         | No       | VNPay gateway URL (not yet implemented)                |
| `MOMO_PARTNER_CODE`                 | No       | MoMo payment (not yet implemented)                     |
| `MOMO_ACCESS_KEY`                   | No       | MoMo auth (not yet implemented)                        |
| `MOMO_SECRET_KEY`                   | No       | MoMo signing (not yet implemented)                     |
| `ZALOPAY_APP_ID`                    | No       | ZaloPay payment (not yet implemented)                  |
| `ZALOPAY_KEY1`                      | No       | ZaloPay HMAC (not yet implemented)                     |
| `ZALOPAY_KEY2`                      | No       | ZaloPay HMAC (not yet implemented)                     |
| `NODE_ENV`                          | No       | Sentry activation, Serwist disable in dev              |

---

_Integration audit: 2026-05-13_
