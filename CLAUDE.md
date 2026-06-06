# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# Development
npm run dev             # Start dev server (Turbopack)
npm run build           # Production build (Webpack)
npm run start           # Start production server

# Code quality
npm run lint            # ESLint (flat config)
npm run format          # Prettier (apply)
npm run format:check    # Prettier (check only)

# Testing
npm run test            # Vitest (run once)
npm run test:watch      # Vitest (watch mode)
npm run test:coverage   # Coverage — 99% threshold on shared/lib/**, shared/hooks/**, shared/components/**
npm run test:e2e        # Playwright end-to-end

# Utilities
npm run analyze         # Bundle size analysis
```

Run a single test file: `npx vitest run src/path/to/file.test.ts`

## Architecture

### Routing

App Router under `src/app/[locale]/` with three route groups:

- `(shop)` — public storefront
- `(auth)` — login / register
- `(admin)` — protected admin panel

`middleware.ts` handles two responsibilities: locale routing via **next-intl** (default locale `vi`) and server-side admin auth guard (checks `access_token` cookie).

### Shared Layer (`src/shared/`)

All cross-feature utilities live here:

| Path                          | Purpose                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `components/base/`            | Shadcn-style Radix primitive wrappers (Button, Input, Dialog, etc.)              |
| `components/commerce/`        | Domain components: `ProductCard`, `CategoryCard`, `CartDrawer`                   |
| `components/common/`          | Utility UI: `PaginationNav`, `PriceDisplay`, `PasswordInput`, `EmptyState`, etc. |
| `components/layouts/`         | `Header`, `Footer`                                                               |
| `components/marketing/`       | `CountdownTimer`, `NewsletterForm`, `SectionHeading`, `TrustBadgeList`           |
| `components/navigation/`      | `DesktopMegaMenu`, `MobileNav`                                                   |
| `components/skeletons/`       | `ProductCardSkeleton`, `ProductGridSkeleton`                                     |
| `hooks/`                      | Client state: `useAuth`, `useCart`; `useDebounce`, `usePagination`, and more     |
| `lib/http/client.ts`          | Axios instance + interceptors (token injection, `ApiError` transform, Sentry)    |
| `lib/http/api-auth.ts`        | Auth store: `setAccessToken`, `setUser`, `clearAuth`, `subscribeAuth`            |
| `lib/http/api-types.ts`       | Shared HTTP response envelope types                                              |
| `lib/http/zod-helpers.ts`     | Zod parse helpers for API responses                                              |
| `lib/errors/`                 | `ApiError` with helpers: `isUnauthorized()`, `isForbidden()`, `isValidation()`   |
| `lib/guards/`                 | `AuthGuard` client component for route protection                                |
| `lib/monitoring/`             | Sentry SDK initialization                                                        |
| `lib/payment/`                | Payment integrations: `momo`, `vnpay`, `zalopay`                                 |
| `lib/cloudinary.ts`           | `buildImageUrl()` — Cloudinary URL builder with transform options                |
| `lib/seo.ts`                  | `buildMetadata()` — Next.js `Metadata` factory for all pages                     |
| `lib/notification.ts`         | `notify` — Sonner toast wrapper (`success`, `error`, `info`, `warning`)          |
| `lib/query-client.ts`         | React Query config — skip retry <500, retry 2× for server errors                 |
| `lib/env.ts`                  | Zod-validated environment variables                                              |
| `lib/utils.ts`                | `formatCurrency`, `formatDate`, `slugify`                                        |
| `types/`                      | Zod schemas + `z.infer<>` TypeScript types for API contracts                     |
| `constants/api-endpoints.ts`  | API path constants — functions for parameterized routes                          |
| `constants/query-keys.ts`     | React Query key factory                                                          |
| `constants/routes.ts`         | App route path constants                                                         |
| `constants/app-config.ts`     | `APP_CONFIG`, order/payment status labels, color maps, `SORT_OPTIONS`            |
| `constants/nav-categories.ts` | `NAV_CATEGORIES` — mega-menu category tree                                       |
| `constants/payment-config.ts` | `PAYMENT_CONFIG` (VNPay, Momo, ZaloPay), `PAYMENT_LABELS`                        |

### State Management

- **`useSyncExternalStore`** (React built-in) for client state — module-level stores in `shared/lib/http/api-auth.ts` (auth tokens) and `shared/hooks/useCart.ts` (cart); accessed via `shared/hooks/useAuth` and `shared/hooks/useCart`
- **React Query** for all server state; configured in `shared/lib/query-client.ts`

### HTTP Client

`shared/lib/http/` exports an `http` object:

```ts
http.get<T>(url, params?)
http.post<T>(url, body?)
http.put<T>(url, body?)
http.patch<T>(url, body?)
http.delete<T>(url)
```

Always returns `response.data` directly. Errors are transformed to `ApiError` by interceptor.

### Type Safety

Zod schemas in `shared/types/` validate API responses at runtime. TypeScript types are inferred via `z.infer<>`. `strict: true` in tsconfig. Import alias: `@/*` → `src/*`.

Enforced ESLint rules for Type Safety:

- **Strict Booleans**: Conditionals must use explicit boolean values (e.g., `if (val === true)` for `boolean | undefined` or `if (val !== null)` for nullable objects).
- **Boolean Literals**: Avoid redundant `=== true` for strict `boolean` types (e.g., use `if (val)` instead of `if (val === true)`).
- **Template Expressions**: Always convert non-string values to string in template literals (e.g., `${i.toString()}`).

### Styling

- **Tailwind CSS v4** — no `tailwind.config.ts`
- **CVA** (Class Variance Authority) for component variants
- Prettier auto-sorts Tailwind classes via `prettier-plugin-tailwindcss`

### Localization

**next-intl** with messages in `src/lang/` (`vi` default, `en` secondary). `formatCurrency`, `formatDate`, `slugify` in `shared/lib/utils.ts`. Dates use `date-fns` with Vietnamese locale; currency as VND.

### Environment

Variables validated with Zod in `shared/lib/env.ts`. Public vars use `NEXT_PUBLIC_` prefix. Backend is Django REST API (`/api/` prefix).

## Tooling

| Tool        | Config file                                                                                |
| ----------- | ------------------------------------------------------------------------------------------ |
| ESLint      | `eslint.config.mjs` (flat config)                                                          |
| Prettier    | `.prettierrc.mjs` — `semi:true`, `printWidth:150`, `arrowParens:'avoid'`, `endOfLine:'lf'` |
| Husky       | `.husky/pre-commit` → runs lint-staged                                                     |
| lint-staged | Defined in `package.json` — ESLint + Prettier on `*.{ts,tsx}`                              |

ESLint enforces: `@/*` alias imports (no `../` relative parents), no cross-feature imports (shared cannot import from app features), import order via `simple-import-sort`.

## Import Convention — ALWAYS use `@/*` alias

**Never** use `../` or `../../` to go up directories. Every import must use the `@/*` alias (maps to `src/*`).

```ts
// ✗ WRONG — triggers no-restricted-imports ESLint error
import { Foo } from '../_lib/types';
import { bar } from '../client';

// ✓ CORRECT
import { Foo } from '@/app/[locale]/(shop)/_lib/types';
import { bar } from '@/shared/lib/http/client';
```

All imports must use the `@/*` alias — including same-directory imports. No relative imports of any kind (`./foo`, `../`) are allowed.

## Code Conventions

### React Best Practices

- **Keys**: Never use array index in `key` props. Use unique, stable identifiers from data (e.g., `id`, `slug`, or the content itself if unique).

### Tailwind CSS v4 Patterns

- **Masking**: Use `mask-[...]` instead of `[mask-image:...]`.
- **Background Size**: Use `bg-size-[...]` instead of `bg-[size:...]`.
- **Naming**: Prefer standard Tailwind v4 utility-first naming over arbitrary value notation where possible.

### Product & Commerce

- **Badges**: Use the shared `BadgeValue` union type (`'best-seller' | 'new' | 'sale' | 'low-stock'`) for all product badges. Align feature-specific product types with shared `Product` schema where possible.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`LuongCongThanh/E-commerce-platforms-FE`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical label strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — `CONTEXT.md` at root + `docs/adr/`. See `docs/agents/domain.md`.
