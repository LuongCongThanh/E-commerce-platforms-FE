# Codebase Structure

**Analysis Date:** 2026-05-13

## Directory Layout

```
ecommerce-next/
├── middleware.ts              # Locale routing + server auth guard
├── next.config.ts             # Next.js config (remotePatterns, etc.)
├── tailwind.config.ts         # Tailwind v4 config
├── eslint.config.mjs          # ESLint flat config
├── vitest.config.ts           # Vitest config
├── playwright.config.ts       # E2E test config
├── components.json            # Shadcn UI component registry
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root HTML shell, Providers, Inter font
│   │   ├── page.tsx               # Redirects → /vi/home
│   │   ├── globals.css            # Global styles (Tailwind entry)
│   │   ├── providers.tsx          # QueryClient, ThemeProvider, Toaster
│   │   ├── sw.ts                  # Service Worker (offline support)
│   │   ├── ~offline/              # Offline fallback page
│   │   ├── api/                   # Next.js Route Handlers (BFF)
│   │   │   ├── auth/
│   │   │   │   ├── login/         # POST /api/auth/login
│   │   │   │   ├── register/      # POST /api/auth/register
│   │   │   │   ├── logout/        # POST /api/auth/logout
│   │   │   │   └── refresh/       # POST /api/auth/refresh
│   │   │   └── payment/
│   │   │       ├── vnpay/{create,callback}
│   │   │       ├── momo/{create,callback}
│   │   │       ├── zalopay/{create,callback}
│   │   │       └── cod/confirm
│   │   └── [locale]/              # Locale segment (vi | en)
│   │       ├── layout.tsx         # i18n provider + Providers wrapper
│   │       ├── loading.tsx        # Top-level loading UI
│   │       ├── error.tsx          # Next.js error boundary
│   │       ├── (shop)/            # Public storefront route group
│   │       │   ├── layout.tsx         # Header + main + Footer
│   │       │   ├── page.tsx           # → redirect to /home
│   │       │   ├── home/page.tsx      # Home page
│   │       │   ├── products/
│   │       │   │   ├── page.tsx           # Product listing
│   │       │   │   └── [slug]/page.tsx    # Product detail (SSG)
│   │       │   ├── categories/
│   │       │   │   └── [slug]/page.tsx    # Category filtered listing
│   │       │   ├── cart/
│   │       │   │   ├── page.tsx
│   │       │   │   └── _components/       # CartClient, CartTable, CartSummary
│   │       │   ├── checkout/
│   │       │   │   ├── page.tsx
│   │       │   │   └── success/page.tsx
│   │       │   ├── orders/
│   │       │   │   ├── page.tsx
│   │       │   │   └── [id]/page.tsx
│   │       │   ├── profile/page.tsx
│   │       │   ├── search/
│   │       │   │   ├── page.tsx
│   │       │   │   └── _components/SearchResults.tsx
│   │       │   ├── _components/           # Shop-scoped components
│   │       │   │   ├── categories/        # FilterSidebar, CategoryClient
│   │       │   │   ├── checkout/          # CheckoutForm, OrderSummary
│   │       │   │   ├── home/              # SectionHero, SectionBestSellers, etc.
│   │       │   │   └── products/          # ProductGrid, ProductGallery, AddToCartSection, etc.
│   │       │   └── _lib/                  # Shop-scoped utilities
│   │       │       ├── actions.ts         # http.* calls (productActions, orderActions, profileActions)
│   │       │       ├── hooks.ts           # React Query hooks (useProducts, useOrders, etc.)
│   │       │       ├── queries.ts         # Static data helpers (getProductBySlug, getHomeData)
│   │       │       ├── query-keys.ts      # Typed query key factories
│   │       │       ├── schemas.ts         # Zod form schemas (CheckoutInput, etc.)
│   │       │       ├── types.ts           # Re-exports + combined types
│   │       │       ├── types/             # Domain type modules
│   │       │       │   ├── product.ts     # Local Product, ProductVariant types
│   │       │       │   ├── category.ts
│   │       │       │   └── home.ts
│   │       │       ├── data/              # Static mock data (to be replaced by API)
│   │       │       │   ├── products.ts    # productsData array (16 items)
│   │       │       │   └── home.ts        # bestSellersData, newArrivalsData, homeCategoriesData
│   │       │       └── hooks/             # Feature-specific hooks
│   │       │           ├── useHomeData.ts
│   │       │           ├── useProducts.ts
│   │       │           ├── useCategories.ts
│   │       │           ├── useSearch.ts
│   │       │           └── useHomeFlashSaleCountdown.ts
│   │       ├── (auth)/            # Auth route group
│   │       │   ├── layout.tsx         # Centred card layout
│   │       │   ├── login/page.tsx
│   │       │   ├── register/page.tsx
│   │       │   ├── forgot-password/page.tsx
│   │       │   ├── reset-password/[token]/page.tsx
│   │       │   ├── _components/       # LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm
│   │       │   └── _lib/
│   │       │       ├── actions.ts     # loginAction, registerAction, logoutAction, forgotPasswordAction
│   │       │       └── schemas.ts     # Zod form schemas
│   │       └── (admin)/           # Admin route group (cookie-protected by middleware)
│   │           ├── layout.tsx
│   │           ├── dashboard/
│   │           ├── products/
│   │           │   ├── page.tsx
│   │           │   ├── new/page.tsx
│   │           │   └── [id]/page.tsx
│   │           ├── orders/
│   │           │   ├── page.tsx
│   │           │   └── [id]/page.tsx
│   │           ├── categories/
│   │           ├── users/
│   │           │   ├── page.tsx
│   │           │   └── [id]/page.tsx
│   │           ├── _components/       # Admin-scoped UI
│   │           └── _lib/              # Admin actions, hooks, query-keys
│   ├── shared/
│   │   ├── components/
│   │   │   ├── base/              # Radix/Shadcn primitive wrappers
│   │   │   │   ├── Button.tsx, Input.tsx, Badge.tsx, Card.tsx
│   │   │   │   ├── Dialog.tsx, Sheet.tsx, Select.tsx, Checkbox.tsx
│   │   │   │   ├── Form.tsx, Label.tsx, Textarea.tsx, Tooltip.tsx
│   │   │   │   ├── DropdownMenu.tsx, Command.tsx, Popover.tsx
│   │   │   │   ├── Table.tsx, Separator.tsx, ScrollArea.tsx
│   │   │   │   ├── accordion.tsx, breadcrumb.tsx, progress.tsx
│   │   │   │   ├── radio-group.tsx, slider.tsx, switch.tsx, tabs.tsx
│   │   │   │   ├── Avatar.tsx, Alert.tsx, Skeleton.tsx
│   │   │   │   ├── aspect-ratio.tsx, RichTextEditor.tsx
│   │   │   ├── commerce/          # Domain-aware shared components
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   └── CategoryCard.tsx
│   │   │   ├── common/            # General-purpose components
│   │   │   │   ├── ConfirmDialog.tsx, EmptyState.tsx, ErrorState.tsx
│   │   │   │   ├── LoadingSpinner.tsx, PageLoader.tsx
│   │   │   │   ├── OrderStatusBadge.tsx, PriceDisplay.tsx
│   │   │   │   ├── PaginationNav.tsx, SearchInput.tsx
│   │   │   │   ├── PasswordInput.tsx, QuantitySelector.tsx, SortSelect.tsx
│   │   │   ├── layouts/           # Page shell components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── DesktopMegaMenu.tsx
│   │   │   │   └── MobileNav.tsx
│   │   │   ├── marketing/         # Presentation/marketing sections
│   │   │   │   ├── SectionHeading.tsx, TrustBadgeList.tsx
│   │   │   │   ├── TestimonialCard.tsx, CountdownTimer.tsx
│   │   │   │   └── NewsletterForm.tsx
│   │   │   └── skeletons/         # Loading skeleton components
│   │   │       ├── ProductCardSkeleton.tsx
│   │   │       └── ProductGridSkeleton.tsx
│   │   ├── constants/
│   │   │   ├── api-endpoints.ts   # API.AUTH.*, API.PRODUCTS.*, API.ORDERS.*, API.ADMIN.*
│   │   │   ├── routes.ts          # Client-side route path constants
│   │   │   ├── query-keys.ts      # Shared React Query key factories
│   │   │   ├── app-config.ts      # App-wide constants
│   │   │   ├── payment-config.ts  # Payment method configuration
│   │   │   └── nav-categories.ts  # Mega menu category structure
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCart.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   ├── usePagination.ts
│   │   │   ├── useProductFilters.ts
│   │   │   ├── useToast.ts
│   │   │   └── __tests__/         # Unit tests for hooks
│   │   ├── lib/
│   │   │   ├── env.ts             # Zod-validated environment variables
│   │   │   ├── utils.ts           # formatCurrency, formatDate, slugify, cn()
│   │   │   ├── seo.ts             # SEO/metadata helpers
│   │   │   ├── cloudinary.ts      # Cloudinary URL helpers
│   │   │   ├── notification.ts    # Toast notification helpers
│   │   │   ├── query-client.ts    # makeQueryClient() factory
│   │   │   ├── errors/
│   │   │   │   ├── api-error.ts   # ApiError class
│   │   │   │   └── error-codes.ts # Error code constants
│   │   │   ├── guards/
│   │   │   │   └── auth-guard.tsx # Client-side AuthGuard component
│   │   │   ├── http/
│   │   │   │   ├── client.ts      # Axios instance + interceptors (token inject, refresh, error normalise)
│   │   │   │   ├── api-auth.ts    # getAccessToken, refreshAccessToken
│   │   │   │   ├── api-client.ts  # apiGet, apiPost, apiPut, apiPatch, apiDelete
│   │   │   │   ├── methods.ts     # http.get/post/put/patch/delete facade
│   │   │   │   ├── api-types.ts   # ApiResponse<T>, ApiRequestConfig<T> types
│   │   │   │   └── zod-helpers.ts # validateResponse() — Zod parse + throw ApiError
│   │   │   ├── monitoring/
│   │   │   │   └── sentry.ts      # captureError() wrapper
│   │   │   └── payment/
│   │   │       ├── vnpay.ts       # VNPay SDK helpers
│   │   │       ├── momo.ts        # MoMo SDK helpers
│   │   │       └── zalopay.ts     # ZaloPay SDK helpers
│   │   ├── stores/
│   │   │   ├── auth-store.ts      # useAuthStore (accessToken, user)
│   │   │   └── cart-store.ts      # useCartStore (items, total, itemCount)
│   │   └── types/
│   │       ├── api.ts             # PaginatedResponse<T>, DjangoErrorResponse
│   │       ├── product.ts         # ProductSchema, ProductListSchema + inferred types
│   │       ├── order.ts           # OrderSchema + inferred types
│   │       ├── user.ts            # UserSchema, AuthToken + inferred types
│   │       ├── category.ts        # CategorySchema + inferred types
│   │       ├── checkout.ts        # CheckoutSchema + inferred types
│   │       ├── payment.ts         # PaymentSchema + inferred types
│   │       ├── address.ts         # AddressSchema + inferred types
│   │       └── filter.ts          # ProductFilter type
│   ├── i18n/                  # next-intl config
│   ├── lang/
│   │   ├── vi/                # Vietnamese message files
│   │   └── en/                # English message files
│   └── __tests__/
│       ├── helpers/           # Test utilities and factories
│       └── integration/       # Integration tests
├── e2e/                       # Playwright E2E tests
└── docs/                      # Architecture docs, ADRs, agent docs
```

## Directory Purposes

**`src/app/[locale]/(shop)/_lib/`:**

- Purpose: All business logic for the storefront feature — HTTP calls, React Query hooks, query keys, form schemas, domain types, and static mock data.
- Contains: `actions.ts`, `hooks.ts`, `queries.ts`, `query-keys.ts`, `schemas.ts`, `types/`, `data/`, `hooks/` subdirectory.
- Key files: `src/app/[locale]/(shop)/_lib/actions.ts`, `src/app/[locale]/(shop)/_lib/hooks.ts`

**`src/app/[locale]/(shop)/_components/`:**

- Purpose: UI components used only within the storefront route group.
- Sub-directories: `categories/`, `checkout/`, `home/`, `products/`

**`src/shared/lib/http/`:**

- Purpose: The HTTP client stack. Everything needed to make typed, authenticated API calls.
- Key files: `client.ts` (Axios instance), `methods.ts` (exported `http` facade), `api-client.ts` (typed request function), `api-auth.ts` (token management)

**`src/shared/stores/`:**

- Purpose: Global client state persisted to localStorage.
- Contains: `auth-store.ts`, `cart-store.ts`

**`src/shared/types/`:**

- Purpose: Zod schemas as the single source of truth for all API data shapes. TypeScript types are derived from schemas via `z.infer<>`.

**`src/app/api/`:**

- Purpose: Next.js Route Handlers acting as a BFF — relays auth to Django and handles payment gateway server-side logic (signature verification, callback processing).

## Key File Locations

**Entry Points:**

- `src/app/layout.tsx`: Root layout — fonts, global CSS, Providers
- `src/app/[locale]/layout.tsx`: Locale segment — i18n setup
- `middleware.ts`: First-run middleware — locale + auth redirect

**Configuration:**

- `src/shared/lib/env.ts`: Zod-validated environment config (import `env` from here)
- `src/shared/constants/api-endpoints.ts`: All API paths (`API.AUTH.*`, `API.PRODUCTS.*`, etc.)
- `src/shared/constants/routes.ts`: Client-side route constants
- `src/shared/lib/query-client.ts`: React Query global config

**Core HTTP:**

- `src/shared/lib/http/methods.ts`: `http` object — import this for all API calls
- `src/shared/lib/http/client.ts`: Axios instance (do not import directly in features)
- `src/shared/lib/errors/api-error.ts`: `ApiError` class

**State:**

- `src/shared/stores/auth-store.ts`: `useAuthStore`
- `src/shared/stores/cart-store.ts`: `useCartStore`

**Testing:**

- `src/__tests__/helpers/`: Test factories and utilities
- `src/__tests__/integration/`: Integration tests
- `src/shared/hooks/__tests__/`: Hook unit tests
- `src/shared/lib/__tests__/`: Lib unit tests
- `e2e/`: Playwright E2E tests

## Naming Conventions

**Files:**

- React components: `PascalCase.tsx` (e.g., `ProductCard.tsx`, `CartDrawer.tsx`)
- Non-component modules: `kebab-case.ts` (e.g., `api-endpoints.ts`, `auth-store.ts`, `query-client.ts`)
- Test files: same name as source + `.test.ts` / `.test.tsx` suffix (e.g., `useCart.test.ts`)
- Route files: Next.js conventions — `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`

**Directories:**

- Route groups: `(groupname)` — parentheses notation, no URL segment
- Private/co-located dirs in routes: `_lib/`, `_components/` — underscore prefix means non-routable
- Shared sub-dirs: `kebab-case` (e.g., `base/`, `common/`, `layouts/`)

**Exports:**

- Named exports preferred over default exports for shared utilities and components
- Page components use default exports (required by Next.js)

## Where to Add New Code

**New storefront page:**

- Page file: `src/app/[locale]/(shop)/[new-route]/page.tsx`
- Page-specific components: `src/app/[locale]/(shop)/_components/[new-route]/`
- Data actions: add to `src/app/[locale]/(shop)/_lib/actions.ts`
- React Query hooks: add to `src/app/[locale]/(shop)/_lib/hooks.ts`
- Query keys: add to `src/app/[locale]/(shop)/_lib/query-keys.ts`
- Form schemas: add to `src/app/[locale]/(shop)/_lib/schemas.ts`

**New admin page:**

- Page file: `src/app/[locale]/(admin)/[new-route]/page.tsx`
- Follow the same `_lib/` + `_components/` pattern as shop

**New shared UI component:**

- Generic Radix/Shadcn primitive: `src/shared/components/base/`
- Commerce-domain component: `src/shared/components/commerce/`
- General helper UI: `src/shared/components/common/`
- Layout shell: `src/shared/components/layouts/`

**New shared hook:**

- Location: `src/shared/hooks/`
- Test: `src/shared/hooks/__tests__/[hookName].test.ts`

**New API endpoint constant:**

- Add to the `API` object in `src/shared/constants/api-endpoints.ts`

**New Zod schema + type:**

- Domain model: `src/shared/types/[domain].ts`
- Form schema: `src/app/[locale]/([group])/_lib/schemas.ts`

**New API Route Handler (BFF):**

- Location: `src/app/api/[category]/[action]/route.ts`

**New payment provider:**

- Server-side helper: `src/shared/lib/payment/[provider].ts`
- Route handlers: `src/app/api/payment/[provider]/{create,callback}/route.ts`

**Environment variables:**

- Add to Zod schema in `src/shared/lib/env.ts`, then reference via `env.VAR_NAME`

## Special Directories

**`src/app/[locale]/(shop)/_lib/data/`:**

- Purpose: Static mock product and home data arrays (in-memory).
- Generated: No (hand-authored)
- Committed: Yes
- Note: Temporary — will be replaced by live API calls via `_lib/actions.ts` when backend is ready.

**`src/app/~offline/`:**

- Purpose: Service Worker offline fallback page.
- Generated: No
- Committed: Yes

**`.planning/`:**

- Purpose: Agent planning documents (codebase maps, phase plans).
- Generated: By agents
- Committed: Yes

**`docs/`:**

- Purpose: Architecture decision records, agent documentation.
- Contains: `docs/adr/`, `docs/agents/`
- Generated: No
- Committed: Yes

**`node_modules/`:**

- Generated: Yes (npm install)
- Committed: No

---

_Structure analysis: 2026-05-13_
