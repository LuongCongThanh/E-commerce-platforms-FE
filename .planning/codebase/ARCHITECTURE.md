<!-- refreshed: 2026-05-13 -->

# Architecture

**Analysis Date:** 2026-05-13

## System Overview

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                      Browser / Client                                    │
│  Zustand stores (auth-store, cart-store) persisted to localStorage       │
└───────────────┬─────────────────────────────────────────────────────────┘
                │ HTTP (Axios)
                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Next.js App Router (src/app/)                       │
│                                                                          │
│  middleware.ts  ──► locale routing (next-intl) + auth guard (cookies)   │
│                                                                          │
│  src/app/[locale]/                                                       │
│  ├── (shop)/    Public storefront — Header, Footer, product pages        │
│  ├── (auth)/    Login, register, password reset                          │
│  └── (admin)/   Protected admin panel (cookie-guarded by middleware)     │
│                                                                          │
│  src/app/api/   Next.js Route Handlers (auth relay, payment gateways)   │
└───────┬─────────────────────────────┬───────────────────────────────────┘
        │                             │
        ▼                             ▼
┌───────────────────┐    ┌────────────────────────────────────────────────┐
│  src/shared/      │    │  External / Backend                            │
│  ─ components/    │    │  Django REST API  (NEXT_PUBLIC_API_URL/api/)   │
│  ─ hooks/         │    │  VNPay / MoMo / ZaloPay payment gateways       │
│  ─ lib/http/      │    │  Cloudinary (image hosting)                    │
│  ─ stores/        │    │  Sentry (error monitoring)                     │
│  ─ types/         │    └────────────────────────────────────────────────┘
│  ─ constants/     │
└───────────────────┘
```

## Component Responsibilities

| Component                 | Responsibility                                                   | Key File(s)                                                    |
| ------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| `middleware.ts`           | Locale routing + server-side auth redirect                       | `middleware.ts`                                                |
| `(shop)` route group      | Public storefront pages and components                           | `src/app/[locale]/(shop)/`                                     |
| `(auth)` route group      | Login, register, password flows                                  | `src/app/[locale]/(auth)/`                                     |
| `(admin)` route group     | Admin panel (products, orders, users, dashboard)                 | `src/app/[locale]/(admin)/`                                    |
| `app/api/` route handlers | Auth token relay to Django, payment gateway callbacks            | `src/app/api/`                                                 |
| `shared/lib/http/`        | Axios client, token injection, auto-refresh, error normalisation | `src/shared/lib/http/client.ts`, `api-client.ts`, `methods.ts` |
| `shared/stores/`          | Zustand client state — auth tokens and cart items                | `src/shared/stores/auth-store.ts`, `cart-store.ts`             |
| `shared/types/`           | Zod schemas + inferred TypeScript types for API contracts        | `src/shared/types/`                                            |
| `shared/components/`      | Radix/Shadcn UI primitives, commerce, layout, marketing          | `src/shared/components/`                                       |
| `shared/constants/`       | API endpoint paths, route paths, payment config                  | `src/shared/constants/`                                        |

## Pattern Overview

**Overall:** Feature-scoped Next.js App Router with a cross-cutting shared layer.

**Key Characteristics:**

- Each route group (`(shop)`, `(auth)`, `(admin)`) is self-contained with its own `_lib/` (actions, hooks, query-keys, schemas, types) and `_components/` directories.
- The `src/shared/` layer is the only cross-feature boundary — features may import from `shared/`, but `shared/` must not import from any feature directory.
- Server components own data fetching (via `_lib/queries.ts` static data or future RSC fetch); client components own interactivity (React Query hooks in `_lib/hooks.ts`).
- Middleware is the sole server-side auth guard. Client-side protection uses `AuthGuard` (`src/shared/lib/guards/auth-guard.tsx`) as a supplementary layer.

## Layers

**Middleware Layer:**

- Purpose: Two responsibilities — `next-intl` locale routing and cookie-based auth redirect.
- Location: `middleware.ts` (repo root)
- Protected patterns: `/[locale]/admin/**`, `/[locale]/checkout`, `/[locale]/orders`, `/[locale]/profile`
- Auth-only (redirect out if logged in): `/[locale]/login`, `/[locale]/register`
- Auth signal: presence of `access_token` cookie

**Route Group Layer (`src/app/[locale]/`):**

- Purpose: Page components (Server Components by default) that compose shared components and call `_lib/` utilities.
- Layouts: `src/app/layout.tsx` → `src/app/[locale]/layout.tsx` (i18n + providers) → group layouts (`(shop)/layout.tsx`, `(auth)/layout.tsx`)
- Each group's `_lib/` contains:
  - `actions.ts` — thin wrappers around `http.*` calls mapped to `API.*` constants
  - `hooks.ts` — React Query `useQuery` / `useMutation` wrappers around actions
  - `query-keys.ts` — typed query key factories
  - `schemas.ts` — Zod form schemas (Zod v4)
  - `types/` or `types.ts` — re-exports of shared types or local-only types

**Shared Layer (`src/shared/`):**

- Purpose: All utilities and components that are used by more than one feature or route group.
- Sub-layers:
  - `components/` — UI primitives (`base/`), commerce-specific (`commerce/`), layout shells (`layouts/`), marketing sections (`marketing/`), loading skeletons (`skeletons/`), common helpers (`common/`)
  - `lib/http/` — Axios setup, interceptors, typed API functions
  - `stores/` — Zustand stores with `persist` + `subscribeWithSelector`
  - `types/` — Zod schemas and inferred types for all API models
  - `constants/` — API endpoints, route paths, app config, payment config, nav categories
  - `hooks/` — Shared custom hooks (`useCart`, `useAuth`, `useProductFilters`, etc.)

**API Route Layer (`src/app/api/`):**

- Purpose: Next.js Route Handlers acting as a BFF (Backend For Frontend) — primarily for auth token relay and payment gateway server-side operations.
- Routes: `api/auth/{login,register,logout,refresh}`, `api/payment/{vnpay,momo,zalopay}/{create,callback}`, `api/payment/cod/confirm`

## Data Flow

### Public Storefront — Static Data (Current State)

1. Page component renders (`src/app/[locale]/(shop)/products/[slug]/page.tsx`)
2. Calls `getProductBySlug(slug)` from `src/app/[locale]/(shop)/_lib/queries.ts`
3. `queries.ts` reads from `src/app/[locale]/(shop)/_lib/data/products.ts` (in-memory mock data)
4. Page renders with data; client interactive component (`AddToCartSection`) hydrates

> **Note:** The `actions.ts` + `hooks.ts` HTTP layer is wired and ready for live API. Current product pages use static `productsData` array pending backend integration.

### Authenticated Mutation Flow (Checkout / Orders)

1. Client form submits → calls React Query mutation hook from `src/app/[locale]/(shop)/_lib/hooks.ts`
2. Hook calls `orderActions.create(...)` from `_lib/actions.ts`
3. `actions.ts` calls `http.post<Order>(API.ORDERS.LIST, data)` from `src/shared/lib/http/methods.ts`
4. `methods.ts` → `apiPost` in `src/shared/lib/http/api-client.ts`
5. `api-client.ts` → `httpClient.request(...)` (Axios instance in `src/shared/lib/http/client.ts`)
6. Request interceptor injects `Authorization: Bearer <token>` from `useAuthStore.getState().accessToken`
7. Response interceptor normalises errors to `ApiError`; on 401 triggers token refresh (`src/shared/lib/http/api-auth.ts`) with queue to prevent parallel refresh storms
8. On success: mutation `onSuccess` clears cart, invalidates React Query cache, navigates to success page

### Auth Login Flow

1. `LoginForm` submits → `loginAction(payload)` in `src/app/[locale]/(auth)/_lib/actions.ts`
2. `http.post<AuthResponse>(API.AUTH.LOGIN, payload)`
3. On success: `useAuthStore.getState().setAccessToken(data.access)` and `setUser(data.user)`
4. `setSessionCookie(data.access)` writes `access_token` cookie for middleware auth guard
5. Router navigates to `/${locale}/home`

**State Management:**

- `useAuthStore` (`src/shared/stores/auth-store.ts`): holds `accessToken` (memory only) and `user` (persisted to `auth-storage` localStorage key). `accessToken` is intentionally excluded from persistence.
- `useCartStore` (`src/shared/stores/cart-store.ts`): holds `items`, `total`, `itemCount` — all persisted to `cart-storage` localStorage key.
- React Query: all server state. Configured in `src/shared/lib/query-client.ts` — 60s `staleTime`, no `refetchOnWindowFocus`, no retry for 4xx, 2 retries for server errors.

## Key Abstractions

**`http` object (`src/shared/lib/http/methods.ts`):**

- Purpose: Typed facade over Axios for all API calls.
- Pattern: `http.get<T>(url, params?)`, `http.post<T>(url, body?)`, etc. Always resolves to `response.data.data` (unwraps the Django `{ data, message, status }` envelope).

**`ApiError` (`src/shared/lib/errors/api-error.ts`):**

- Purpose: Typed error class with HTTP status and boolean helper getters (`isUnauthorized`, `isForbidden`, `isValidation`, `isServerError`).
- Used by: Axios interceptors (throw), React Query config (retry logic), mutation handlers.

**`API` constants (`src/shared/constants/api-endpoints.ts`):**

- Purpose: Single source of truth for all Django API paths. Parameterised routes are functions returning strings.
- Pattern: `API.PRODUCTS.LIST`, `API.ORDERS.DETAIL(id)`, `API.ADMIN.PRODUCT_DETAIL(id)`.

**Zod schemas + inferred types (`src/shared/types/`):**

- Purpose: Runtime API response validation and compile-time TypeScript types.
- Pattern: Define `z.object(...)` schema → export `z.infer<typeof Schema>` as the type → pass schema to `apiGet(..., { schema: ProductSchema })` for optional runtime validation.

**`AuthGuard` (`src/shared/lib/guards/auth-guard.tsx`):**

- Purpose: Client-side supplementary guard — checks `accessToken` in Zustand store and redirects to login if absent.
- Usage: Wrap client components in route groups that need extra protection beyond middleware.

## Entry Points

**Root layout (`src/app/layout.tsx`):**

- Renders HTML shell, Inter font, global CSS, wraps everything in `<Providers>`.
- `<Providers>` mounts: `QueryClientProvider`, `ThemeProvider`, `Toaster` (sonner), `AppProgressBar`.

**Locale layout (`src/app/[locale]/layout.tsx`):**

- Validates locale (vi/en), sets `requestLocale` for next-intl, wraps in `NextIntlClientProvider`.

**Middleware (`middleware.ts`):**

- Runs on all non-asset, non-API requests.
- Order: protected-pattern check → auth-only-pattern check → intl middleware.
- Matcher: all paths excluding `/api/`, `/_next/`, and static file extensions.

**Shop page entry (`src/app/[locale]/(shop)/page.tsx`):**

- Redirects to `/{locale}/home`.

## Architectural Constraints

- **Import direction:** Features import from `shared/`; `shared/` never imports from features. Enforced by ESLint `no-restricted-imports`. Upward relative imports (`../`) are banned; always use `@/*` alias.
- **Cross-feature imports:** No direct imports between `(shop)`, `(auth)`, and `(admin)` feature directories.
- **Token storage split:** `accessToken` lives in memory (Zustand, not persisted) to reduce XSS exposure; `user` object is persisted. The `access_token` cookie (httpOnly is NOT set — written via `document.cookie`) is used only for middleware server-side reads.
- **Global state:** Two module-level Zustand singletons: `useAuthStore` and `useCartStore`. No other global singletons.
- **Server vs. client:** Page components default to Server Components. Interactive sections (add-to-cart, cart drawer, auth forms) are explicitly `'use client'`. React Query hooks are client-only.
- **Env validation:** All environment variables are validated at startup via Zod in `src/shared/lib/env.ts`. Missing required vars throw at build time.

## Anti-Patterns

### Duplicate Product Types

**What happens:** `src/app/[locale]/(shop)/_lib/types/product.ts` defines a local `Product` type separate from `src/shared/types/product.ts` which has a Zod-backed `ProductSchema`.
**Why it's wrong:** The feature-local `Product` type diverges from the shared Zod-validated schema — the mock data type does not match what the live API returns, causing silent mismatches when connecting the real backend.
**Do this instead:** Use `Product` from `src/shared/types/product.ts` (via `z.infer<typeof ProductSchema>`) everywhere. Adapt mock data shape to match the shared schema.

### Cookie Written from Client (Not HttpOnly)

**What happens:** `src/app/[locale]/(auth)/_lib/actions.ts` sets `access_token` via `document.cookie` without `HttpOnly`.
**Why it's wrong:** Accessible to JavaScript, making it vulnerable to XSS token theft. Middleware relies on this cookie for server-side route protection.
**Do this instead:** Write the `access_token` cookie from a Next.js Route Handler (`src/app/api/auth/login/`) using `response.cookies.set(...)` with `httpOnly: true; sameSite: strict`.

### Static Mock Data Used in Production Pages

**What happens:** `src/app/[locale]/(shop)/_lib/queries.ts` reads from `_lib/data/products.ts` (hardcoded array) rather than calling the backend.
**Why it's wrong:** Product pages show stale data, ignore real inventory/pricing, and bypass the authentication-aware `http` client.
**Do this instead:** Replace `getProductBySlug` with an `apiGet` call to `API.PRODUCTS.DETAIL(slug)` inside an RSC or React Query hook.

## Error Handling

**Strategy:** Centralised normalisation in Axios response interceptor; propagated as typed `ApiError` instances.

**Patterns:**

- HTTP errors → normalised to `ApiError` with `status`, `message`, `code`, `details` in `src/shared/lib/http/client.ts`
- 5xx errors → additionally reported to Sentry via `captureError` in `src/shared/lib/monitoring/sentry.ts`
- React Query mutations → `onError` global handler in `src/shared/lib/query-client.ts` shows `toast.error(message)` via sonner
- Zod validation failures on API responses → thrown as `ApiError` with `code: 'INVALID_RESPONSE_SCHEMA'` from `src/shared/lib/http/zod-helpers.ts`
- Route-level: `src/app/[locale]/error.tsx` is the Next.js error boundary for the locale segment

## Cross-Cutting Concerns

**Logging:** Sentry (`src/shared/lib/monitoring/sentry.ts`) for 5xx errors only. No structured logging otherwise.
**Validation:** Zod — form schemas in `_lib/schemas.ts` per feature; API response schemas in `src/shared/types/`.
**Authentication:** Three-layer — middleware cookie check (server), `AuthGuard` component (client), Axios interceptor token injection + refresh.
**Localisation:** next-intl with `vi` default, `en` secondary. Messages in `src/lang/{vi,en}/`. Currency as VND via `formatCurrency` in `src/shared/lib/utils.ts`.
**SEO:** JSON-LD structured data injected per page (`Product`, `WebSite` schema.org types). `generateMetadata` on product and category pages. SEO utilities in `src/shared/lib/seo.ts`.

---

_Architecture analysis: 2026-05-13_
