# Technology Stack

**Analysis Date:** 2026-05-13

## Languages

**Primary:**

- TypeScript 5.x — all application code (`src/**/*.ts`, `src/**/*.tsx`), config files
- JSON — translation message files (`src/lang/{locale}/*.json`)

**Secondary:**

- JavaScript/MJS — config files (`eslint.config.mjs`, `postcss.config.mjs`, `lint-staged.config.mjs`)

## Runtime

**Environment:**

- Node.js 20.x (inferred from `@types/node: ^20` in devDependencies)

**Package Manager:**

- npm
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**

- Next.js 16.2.4 — App Router, SSR/SSG, API Routes, image optimization
  - Uses App Router under `src/app/[locale]/` with route groups `(shop)`, `(auth)`, `(admin)`
  - Default bundler: Webpack for `npm run build`; Turbopack available for `npm run dev`
- React 19.2.4 — UI rendering
- React DOM 19.2.4 — DOM reconciler

**Internationalization:**

- next-intl 4.9.1 — locale routing, translations, server-side message loading
  - Locales: `vi` (default), `en`
  - Message modules: `common`, `auth`, `product`, `cart`, `order`, `payment`, `home`, `checkout`
  - Message files: `src/lang/{vi,en}/*.json`
  - Request config: `src/i18n/request.ts`

**Styling:**

- Tailwind CSS 4.x — utility-first CSS, no `tailwind.config.ts` content beyond minimal setup
  - PostCSS integration via `@tailwindcss/postcss` (`postcss.config.mjs`)
  - Dark mode: `class` strategy
  - Content scanning: `./src/**/*.{js,jsx,ts,tsx,mdx}`
- Class Variance Authority (CVA) 0.7.1 — component variant management
- clsx 2.1.1 — conditional class composition
- tailwind-merge 3.5.0 — class conflict resolution; `cn()` helper at `src/shared/lib/utils.ts`
- framer-motion 12.38.0 — animations

**UI Components:**

- Radix UI primitives (Shadcn-style wrappers in `src/shared/components/ui/`):
  - `@radix-ui/react-accordion`, `react-aspect-ratio`, `react-avatar`, `react-checkbox`
  - `@radix-ui/react-dialog`, `react-dropdown-menu`, `react-label`, `react-popover`
  - `@radix-ui/react-progress`, `react-radio-group`, `react-scroll-area`, `react-select`
  - `@radix-ui/react-separator`, `react-slider`, `react-slot`, `react-switch`
  - `@radix-ui/react-tabs`, `react-tooltip`
- lucide-react 1.8.0 — icon library
- cmdk 1.1.1 — command palette component
- vaul 1.1.2 — drawer component
- sonner 2.0.7 — toast notifications

**Forms:**

- react-hook-form 7.72.1 — form state management
- @hookform/resolvers 5.2.2 — Zod schema resolver integration
- zod 4.3.6 — schema validation and TypeScript type inference

**State Management:**

- Zustand 5.0.12 — client state (`subscribeWithSelector` + `persist` middleware)
  - `src/shared/stores/auth-store.ts` — access token, user object (persisted key: `auth-storage`)
  - `src/shared/stores/cart-store.ts` — cart items, total, count (persisted key: `cart-storage`)
- @tanstack/react-query 5.99.1 — server state, caching, retry logic
  - Config: `src/shared/lib/query-client.ts`
  - Stale time: 60 seconds; no retry on 4xx; 2 retries on 5xx
- @tanstack/react-query-devtools 5.99.1 — development tooling

**Data Tables:**

- @tanstack/react-table 8.21.3 — headless table for admin data grids

**HTTP Client:**

- axios 1.15.0 — HTTP requests with interceptor chain
  - Client: `src/shared/lib/http/client.ts`
  - Methods facade: `src/shared/lib/http/methods.ts` → `http.get/post/put/patch/delete`
  - Auth: Bearer token injected via request interceptor
  - Token refresh: queue-based refresh on 401, `src/shared/lib/http/api-auth.ts`
  - Error transform: all errors normalized to `ApiError`, `src/shared/lib/errors/api-error.ts`

**Utilities:**

- date-fns 4.1.0 — date formatting with Vietnamese locale (`vi` locale from `date-fns/locale`)
- http-status-codes 2.3.0 — HTTP status code constants
- client-only / server-only — Next.js boundary enforcement markers
- next-themes 0.4.6 — theme (dark/light) management
- next-nprogress-bar 2.4.7 — route change progress indicator
- react-error-boundary 6.1.1 — error boundary component

**PWA:**

- @serwist/next 9.5.7 — Service Worker integration for PWA
  - SW source: `src/app/sw.ts`
  - SW output: `public/sw.js`
  - Disabled in development; cache on navigation; reload on online
  - Offline fallback: `/~offline`

**Monitoring:**

- @sentry/nextjs 10.49.0 — error tracking and performance monitoring
  - Wrapper: `src/shared/lib/monitoring/sentry.ts`
  - Only active in production; dev falls back to `console.error`

## Testing

**Unit/Integration:**

- Vitest 4.1.4 — test runner
  - Config: `vitest.config.ts`
  - Environment: jsdom
  - Test pattern: `src/**/__tests__/**/*.{test,spec}.{ts,tsx}`
  - Setup: `src/__tests__/setup.ts`
  - Coverage provider: v8; threshold 90% on `src/shared/lib/**` and `src/shared/hooks/**`
- @testing-library/react 16.3.2 — component testing utilities
- @testing-library/user-event 14.6.1 — user interaction simulation
- @testing-library/jest-dom 6.9.1 — DOM matchers
- msw 2.13.4 — API mocking (Mock Service Worker)
- jsdom 29.0.2 — DOM simulation environment
- @vitejs/plugin-react 6.0.1 — React support in Vite/Vitest

**E2E:**

- @playwright/test 1.59.1 — end-to-end tests
  - Config: `playwright.config.ts`
  - Test dir: `./e2e`
  - Browsers: Chromium, Firefox, WebKit
  - Base URL: `http://127.0.0.1:3000` (or `PLAYWRIGHT_BASE_URL`)
  - Retry: 2 in CI, 0 locally

## Build & Tooling

**Linting:**

- ESLint 9.39.4 — flat config (`eslint.config.mjs`)
  - @typescript-eslint/eslint-plugin 8.58.2 — strict TypeScript rules
  - eslint-plugin-import 2.32.0 — import discipline + no-cycle enforcement
  - eslint-plugin-simple-import-sort 13.0.0 — import order
  - eslint-plugin-unused-imports 4.4.1 — dead import removal
  - eslint-plugin-no-relative-import-paths 1.6.1 — enforces `@/*` alias
  - eslint-plugin-react 7.37.5 + eslint-plugin-react-hooks 7.1.1 — React rules
  - eslint-plugin-tailwindcss 4.0.0-beta — Tailwind class validation
  - eslint-plugin-jest 29.15.2 — test hygiene rules (used as Vitest proxy)

**Formatting:**

- Prettier 3.8.3 — code formatting
  - Config: `.prettierrc.mjs` — `semi: true`, `printWidth: 150`, `arrowParens: 'avoid'`, `endOfLine: 'lf'`
  - prettier-plugin-tailwindcss 0.7.2 — auto-sort Tailwind class names

**Git Hooks:**

- Husky 9.1.7 — pre-commit hook runner
- lint-staged 16.4.0 — runs ESLint + Prettier on staged `*.{ts,tsx}` files
  - Config: `lint-staged.config.mjs`

**Bundle Analysis:**

- @next/bundle-analyzer 16.2.4 — triggered via `ANALYZE=true npm run build`

## Key Configuration Files

| File                    | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `next.config.ts`        | Next.js config — wraps next-intl, Serwist, bundle analyzer   |
| `tsconfig.json`         | TypeScript — `strict: true`, `@/*` path alias, ES2017 target |
| `eslint.config.mjs`     | ESLint flat config with full ruleset                         |
| `vitest.config.ts`      | Vitest unit test config + coverage thresholds                |
| `playwright.config.ts`  | E2E test config — 3 browser projects                         |
| `tailwind.config.ts`    | Tailwind content paths + dark mode strategy                  |
| `postcss.config.mjs`    | PostCSS with `@tailwindcss/postcss` plugin                   |
| `src/shared/lib/env.ts` | Zod-validated environment variable schema                    |
| `src/i18n/request.ts`   | next-intl server request config — dynamic JSON imports       |
| `middleware.ts`         | Route protection (auth guard) + locale routing               |

## Environment Configuration

Variables validated via Zod in `src/shared/lib/env.ts`:

| Variable                            | Type       | Required | Notes                                                          |
| ----------------------------------- | ---------- | -------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`               | URL string | Yes      | Public app base URL                                            |
| `NEXT_PUBLIC_API_URL`               | URL string | Yes      | Backend Django REST API base URL                               |
| `DJANGO_API_URL`                    | URL string | No       | Server-side Django URL (optional override)                     |
| `NODE_ENV`                          | enum       | No       | development/production/test                                    |
| `NEXT_PUBLIC_SENTRY_DSN`            | string     | No       | Sentry DSN for error tracking                                  |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | string     | No       | Cloudinary cloud name (read in `src/shared/lib/cloudinary.ts`) |
| `NEXT_PUBLIC_APP_NAME`              | string     | No       | Site name for metadata                                         |
| `VNPAY_TMN_CODE`                    | string     | No       | VNPay merchant code                                            |
| `VNPAY_HASH_SECRET`                 | string     | No       | VNPay HMAC secret                                              |
| `VNPAY_URL`                         | URL string | No       | VNPay gateway URL                                              |
| `MOMO_PARTNER_CODE`                 | string     | No       | MoMo partner code                                              |
| `MOMO_ACCESS_KEY`                   | string     | No       | MoMo access key                                                |
| `MOMO_SECRET_KEY`                   | string     | No       | MoMo secret key                                                |
| `ZALOPAY_APP_ID`                    | string     | No       | ZaloPay app ID                                                 |
| `ZALOPAY_KEY1`                      | string     | No       | ZaloPay HMAC key 1                                             |
| `ZALOPAY_KEY2`                      | string     | No       | ZaloPay HMAC key 2                                             |

## Platform Requirements

**Development:**

- Node.js 20+
- npm
- Run: `npm run dev` (Turbopack)

**Production:**

- Build: `npm run build --webpack`
- Start: `npm run start`
- Target: Node.js server (not static export)
- Deployment: Any Node.js-capable platform (Vercel recommended given Next.js)

---

_Stack analysis: 2026-05-13_
