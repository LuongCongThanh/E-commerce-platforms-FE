# Codebase Concerns

**Analysis Date:** 2026-05-13

---

## Tech Debt

**Checkout form submits to nowhere (fake order creation):**

- Issue: `CheckoutForm.onSubmit` does `await new Promise(resolve => setTimeout(resolve, 2000))` then clears the cart and navigates to success. It never calls the real API. The `useCreateOrder` hook in `hooks.ts` correctly calls `orderActions.create`, but `CheckoutForm.tsx` is disconnected from it entirely.
- Files: `src/app/[locale]/(shop)/_components/checkout/CheckoutForm.tsx` (line 51–54), `src/app/[locale]/(shop)/_lib/hooks.ts` (lines 47–66)
- Impact: No order is ever persisted to the backend. Completing checkout in production silently loses the order.
- Fix approach: Replace the mock `onSubmit` in `CheckoutForm.tsx` with `useCreateOrder(locale)` and wire `handleSubmit` to `createOrder.mutate(data)`.

**Checkout schema mismatch between form and shared schema:**

- Issue: `CheckoutForm.tsx` defines a local `checkoutSchema` with `paymentMethod: z.enum(['cod', 'bankTransfer'])`. The shared `src/app/[locale]/(shop)/_lib/schemas.ts` defines `paymentMethod: z.enum(['cod', 'vnpay', 'momo', 'zalopay'])`. The form exposes only two options and uses a key (`bankTransfer`) that does not exist in the API type.
- Files: `src/app/[locale]/(shop)/_components/checkout/CheckoutForm.tsx` (line 22), `src/app/[locale]/(shop)/_lib/schemas.ts` (line 11)
- Impact: If the local form were ever wired to the real API, `bankTransfer` would be rejected by Django and by the shared `PaymentMethod` type in `src/shared/types/order.ts`.
- Fix approach: Delete the local `checkoutSchema` in `CheckoutForm.tsx`. Import `checkoutSchema` and `CheckoutInput` from `@/app/[locale]/(shop)/_lib/schemas`. Update the radio options to match the enum values.

**Product type divergence: feature-local vs. shared Zod schema:**

- Issue: There are two incompatible `Product` types. `src/app/[locale]/(shop)/_lib/types/product.ts` is a plain TypeScript type used by all storefront UI and mock data, with `variants: { id: string; label: string; stock: number }[]`. `src/shared/types/product.ts` is a Zod-validated type used by API calls, with `variants: { id: number; size: string|null; color: string|null; stock: number; price: number }[]`. These types are structurally incompatible.
- Files: `src/app/[locale]/(shop)/_lib/types/product.ts`, `src/shared/types/product.ts`
- Impact: When the API is connected, product detail pages will break because `AddToCartSection` and `VariantSelector` consume the local type. The variant `id` would be a `number` from the API but is expected as a `string` in the cart store.
- Fix approach: Unify behind the Zod schema. Adapt UI components to accept the Zod-inferred `Product` type. Update `cart-store.ts` `variantId` to accept `number | string` or normalize to `string` at the boundary.

**Static mock data wired throughout the storefront:**

- Issue: Every storefront data hook reads from in-memory arrays instead of calling the backend.
  - `useProducts` (`src/app/[locale]/(shop)/_lib/hooks/useProducts.ts`) — reads `productsData` directly, sets `isLoading: false` unconditionally.
  - `useSearch` (`src/app/[locale]/(shop)/_lib/hooks/useSearch.ts`) — searches `productsData` in-memory.
  - `useCategories` (`src/app/[locale]/(shop)/_lib/hooks/useCategories.ts`) — returns `homeCategoriesData` via `useMemo`.
  - `useHomeData` (`src/app/[locale]/(shop)/_lib/hooks/useHomeData.ts`) — returns `bestSellersData`, `newArrivalsData`, `homeCategoriesData` from static imports.
  - `getHomeData`, `getProductBySlug`, `getCategoryBySlug` (`src/app/[locale]/(shop)/_lib/queries.ts`) — all operate on static imports.
- Files: `src/app/[locale]/(shop)/_lib/data/products.ts`, `src/app/[locale]/(shop)/_lib/data/home.ts`, `src/app/[locale]/(shop)/_lib/data/categories.ts`
- Impact: The entire product catalogue is hardcoded. Any real inventory, pricing, or category changes on the backend are invisible to users. Pagination and search are purely client-side with 16 products.
- Fix approach: Replace static hook implementations with React Query calls using the existing `productActions` in `src/app/[locale]/(shop)/_lib/actions.ts`. The API constants in `src/shared/constants/api-endpoints.ts` are already correct.

**`bestSellersData` reused as flash sale data:**

- Issue: `getHomeData()` and `useHomeData()` both produce `flashSale: bestSellersData.slice(0, 4)`. Flash sale is literally the first four best-sellers.
- Files: `src/app/[locale]/(shop)/_lib/queries.ts` (line 31), `src/app/[locale]/(shop)/_lib/hooks/useHomeData.ts` (line 15)
- Impact: Misleading UI. Flash sale section always shows the same products as best-sellers with no actual discounted pricing distinction.
- Fix approach: Introduce a dedicated API endpoint or filter products by badge value `'sale'` from the real API response.

**Home sections use placeholder/non-existent images:**

- Issue: `bestSellersData` and `newArrivalsData` in `src/app/[locale]/(shop)/_lib/data/home.ts` use `/images/products/placeholder.jpg`. `homeCategoriesData` uses `/images/categories/*.jpg`. None of these local files appear to exist in `public/`.
- Files: `src/app/[locale]/(shop)/_lib/data/home.ts` (lines 35, 44)
- Impact: Home page "Best Sellers" and "New Arrivals" sections render with broken images in production.
- Fix approach: Either add real images to `public/`, or fetch product images from the API.

**Product specs tab is fully hardcoded:**

- Issue: `ProductDetailTabs` contains `MOCK_REVIEWS` (3 fake reviews) and `FEATURES` (4 hardcoded specs like "Cotton 100%" and "Việt Nam") that apply universally regardless of which product is displayed.
- Files: `src/app/[locale]/(shop)/_components/products/ProductDetailTabs.tsx` (lines 22–39)
- Impact: Every product shows identical specs and the same three fake reviews.
- Fix approach: Add `specs` and `reviews` fields to the product API and pass them as props.

**Category page product count is hardcoded fiction:**

- Issue: `homeCategoriesData` hard-codes `productCount` values (e.g., `{ slug: 'phu-kien', productCount: 200 }`). These counts are never derived from the actual product list.
- Files: `src/app/[locale]/(shop)/_lib/data/home.ts` (lines 11–17)
- Impact: UI shows incorrect counts. With only 16 mock products, "Phụ kiện" shows 200.
- Fix approach: Remove `productCount` from the static data. Fetch it from the categories API which should return real counts.

**Flash sale countdown resets on every mount:**

- Issue: `useHomeFlashSaleCountdown` computes `targetDate = new Date() + 24 hours` inside a `useMemo`. Every unmount/remount resets the countdown. There is no persistent end time.
- Files: `src/app/[locale]/(shop)/_lib/hooks/useHomeFlashSaleCountdown.ts`
- Impact: The countdown is meaningless. Refreshing the page always shows 24 hours remaining.
- Fix approach: Store the flash sale end time in the API or a persistent store. Read it once and cache.

**Newsletter form submission does nothing:**

- Issue: `NewsletterForm.tsx` calls `onSubmit?.(email)` which is optional and never provided by `SectionNewsletter.tsx`. After submit, it sets `submitted = true` and shows a success message — regardless of whether any server call happened.
- Files: `src/shared/components/marketing/NewsletterForm.tsx` (line 21), `src/app/[locale]/(shop)/_components/home/SectionNewsletter.tsx`
- Impact: Email subscriptions are silently discarded.
- Fix approach: Create an API endpoint for newsletter subscription. Pass a real `onSubmit` handler from `SectionNewsletter`.

---

## Security Considerations

**Access token stored in `localStorage` (via Zustand persist):**

- Risk: `auth-store.ts` persists `accessToken` and `user` to `localStorage` under key `auth-storage`. However, looking at `partialize`, only `user` is explicitly persisted — the `accessToken` is not in `partialize`. But `accessToken` is also set on the client via `setAccessToken` with no `partialize` exclusion correctly. The cookie `access_token` IS set by `document.cookie` without `HttpOnly` or `Secure` flags.
- Files: `src/app/[locale]/(auth)/_lib/actions.ts` (lines 26–28), `src/shared/stores/auth-store.ts` (line 27)
- Current mitigation: Cookie has `SameSite=Lax`.
- Recommendations: Set `Secure` flag in production. Prefer `HttpOnly` cookies set server-side (Next.js route handler or middleware) to prevent XSS token theft. The current approach sets cookies from `document.cookie` which is readable by any JavaScript on the page.

**Token refresh response shape assumed without validation:**

- Risk: `refreshAccessToken()` casts the response as `{ data: string }` with an inline comment "Adjust based on your API response". If the API returns a different shape, `newToken` will be `undefined` and silently stored.
- Files: `src/shared/lib/http/api-auth.ts` (lines 29–33)
- Current mitigation: None — the cast is unvalidated.
- Recommendations: Validate the refresh response with a Zod schema (e.g., `z.object({ data: z.string() })`). Throw a typed error if the shape is unexpected.

**`AuthGuard` is bypassable via SSR:**

- Risk: `AuthGuard` in `src/shared/lib/guards/auth-guard.tsx` renders `null` on the server (when `accessToken` is null) and then redirects client-side via `useEffect`. Protected pages briefly render nothing on the client before the redirect fires. More critically, the middleware in `middleware.ts` guards routes by checking the `access_token` cookie — if the cookie is missing but the Zustand store has a token, or vice versa, the two guards can diverge.
- Files: `src/shared/lib/guards/auth-guard.tsx`, `middleware.ts` (lines 10–27)
- Current mitigation: Middleware cookie check is the real server-side guard. `AuthGuard` adds client-side gating.
- Recommendations: Eliminate `AuthGuard` for layout-level protection and rely solely on middleware. Use `AuthGuard` only for progressive disclosure within pages.

**`AuthGuard` hardcodes locale to `/vi/login`:**

- Risk: `AuthGuard` always redirects to `/vi/login` regardless of the active locale.
- Files: `src/shared/lib/guards/auth-guard.tsx` (line 13)
- Impact: English-locale users (`/en/`) are bounced to the Vietnamese login page.
- Fix approach: Derive locale from `useLocale()` or accept as prop.

---

## Performance Bottlenecks

**Client-side search and filtering over a fixed 16-item array:**

- Problem: `useSearch` and `useProducts` perform all filtering, sorting, and pagination in-browser via `useMemo`. While the current dataset is tiny, the architecture does not scale. There is no debounce on the search input from URL params.
- Files: `src/app/[locale]/(shop)/_lib/hooks/useSearch.ts`, `src/app/[locale]/(shop)/_lib/hooks/useProducts.ts`
- Cause: Static data layer instead of server-side API calls.
- Improvement path: Move to server-side search and filtering via Django REST API. `useDebounce` exists at `src/shared/hooks/useDebounce.ts` and should be applied before firing API requests.

**Flash sale section re-renders on every scroll (framer-motion `useTransform`):**

- Problem: `SectionHero` subscribes to `scrollY` via `useScroll()` and passes motion values to two `<motion.div>` blur blobs. While framer-motion uses `requestAnimationFrame`, this is a continuous compositor animation that can affect paint performance on lower-end devices.
- Files: `src/app/[locale]/(shop)/_components/home/SectionHero.tsx` (lines 19–21)
- Improvement path: Apply `will-change: transform` via Tailwind, or replace with CSS-only parallax using `@supports`.

---

## Fragile Areas

**`refreshAccessToken` has an unresolved "queue drain" race on error:**

- Files: `src/shared/lib/http/client.ts` (lines 86–103)
- Why fragile: If `refreshAccessToken()` throws, the `refreshQueue` promises are never resolved or rejected — they remain pending forever. Any request that queued while `isRefreshing` was `true` will hang indefinitely. Additionally, `isRefreshing` is module-level mutable state; Next.js can run multiple server-side instances where this state is not shared, making the logic unreliable in SSR contexts.
- Safe modification: On refresh failure, drain the queue by rejecting each queued promise. Reset `isRefreshing = false` in the `catch` block (it currently only resets in `finally`, which is correct — but the queue rejection is missing).

**`FilterSidebar` calls `window.location.pathname` directly:**

- Files: `src/app/[locale]/(shop)/_components/categories/FilterSidebar.tsx` (line 83)
- Why fragile: This breaks server-side rendering and will throw `ReferenceError: window is not defined` during prerendering. The component is `'use client'`, so it won't error during hydration, but it is an SSR anti-pattern. If the component is ever used in a context without `typeof window !== 'undefined'` guard, it will fail.
- Safe modification: Replace with `usePathname()` from `next/navigation`.

**`addToCart` silently ignores stock limits:**

- Files: `src/shared/stores/cart-store.ts` (lines 42–49)
- Why fragile: When an item already in the cart is re-added, quantity is incremented by `item.quantity` with no upper bound check against `stock`. A user can add more items than exist in stock by clicking "Add to Cart" repeatedly.
- Safe modification: Pass `maxStock` into `addToCart` and cap the resulting quantity.

**`ProductDetailPage` shows "Còn hàng" regardless of real stock:**

- Files: `src/app/[locale]/(shop)/products/[slug]/page.tsx` (line 125)
- Why fragile: The product detail page always renders the text "Còn hàng" (In Stock) as a static string. Variant-level stock is only surfaced in `AddToCartSection` (buttons disable when `stock === 0`), but the global stock indicator is always green.

---

## Missing Critical Features

**Admin panel is completely absent:**

- Problem: `middleware.ts` protects `/(vi|en)/admin` routes and `API.ADMIN.*` endpoints are defined, but no admin route group exists under `src/app/[locale]/(admin)/`.
- Blocks: Dashboard, order management, product management, and user management are all unreachable.

**E2E test directory is empty:**

- Problem: `playwright.config.ts` exists and `npm run test:e2e` is a declared command, but the `e2e/` directory contains no test files.
- Blocks: No automated end-to-end verification of checkout, auth, or cart flows.

**No voucher/coupon code implementation:**

- Problem: `checkoutSchema` in `src/app/[locale]/(shop)/_lib/schemas.ts` includes `voucherCode: z.string().optional()`, but `CheckoutForm.tsx` has no voucher input field, and the cart summary (`CartSummary.tsx`) shows no discount line.
- Blocks: Promotional pricing cannot be applied at checkout.

**Payment gateway integrations are stubs:**

- Problem: `src/shared/lib/env.ts` declares env vars for VNPay, MoMo, and ZaloPay (`VNPAY_TMN_CODE`, `MOMO_ACCESS_KEY`, `ZALOPAY_KEY1`, etc.), all as optional. No payment gateway client code or server route handler exists in the codebase.
- Blocks: Only COD payments are functionally possible (and even those are currently faked).

**No address autocomplete or location selector:**

- Problem: `CheckoutForm.tsx` renders plain `<input>` fields for city, district, and ward with no dropdown, autocomplete, or validation against real Vietnamese administrative divisions.
- Blocks: Address data quality is poor. The API's `address` field on `Order` is a single string with no structure.

---

## Test Coverage Gaps

**Checkout flow has zero test coverage:**

- What's not tested: `CheckoutForm` submission logic, `useCreateOrder` mutation, cart-to-checkout transition.
- Files: `src/app/[locale]/(shop)/_components/checkout/CheckoutForm.tsx`, `src/app/[locale]/(shop)/_lib/hooks.ts`
- Risk: Regressions in the most critical user journey go undetected.
- Priority: High

**Product data hooks (useProducts, useSearch) have no tests:**

- What's not tested: Filter logic, sort logic, pagination edge cases (empty results, last page), search with special characters.
- Files: `src/app/[locale]/(shop)/_lib/hooks/useProducts.ts`, `src/app/[locale]/(shop)/_lib/hooks/useSearch.ts`
- Risk: Silent regressions in filtering as data transitions from static to real API.
- Priority: High

**Auth cookie handling is untested:**

- What's not tested: `setSessionCookie` and `clearSessionCookie` in `src/app/[locale]/(auth)/_lib/actions.ts`. `loginAction` and `logoutAction` integration.
- Files: `src/app/[locale]/(auth)/_lib/actions.ts`
- Risk: Token management bugs can cause silent auth failures or sessions that don't clear on logout.
- Priority: High

**HTTP client interceptors have no tests:**

- What's not tested: Token refresh queue drain on concurrent 401s, error normalization for network errors vs API errors, Sentry capture for 5xx.
- Files: `src/shared/lib/http/client.ts`
- Risk: The refresh race condition described above (queue never draining on error) could go undetected.
- Priority: Medium

**No snapshot or render tests for any UI component:**

- What's not tested: No `.test.tsx` files exist anywhere in the codebase. All tests are pure unit tests for utilities and hooks.
- Risk: Layout regressions, broken Tailwind class names, and accessibility issues cannot be caught automatically.
- Priority: Medium

---

## Dependencies at Risk

**`@tanstack/react-query` v5 with `onError` in `defaultOptions.mutations`:**

- Risk: In React Query v5, the `onError` callback in `defaultOptions.mutations` is deprecated in favor of the `MutationCache` `onError` global handler. The current usage in `src/shared/lib/query-client.ts` (line 22) works but triggers deprecation warnings and may break in a future minor version.
- Files: `src/shared/lib/query-client.ts`
- Impact: Global mutation error toasts silently stop working if the API is updated.
- Migration plan: Move to `new MutationCache({ onError: ... })` in `makeQueryClient()`.

---

_Concerns audit: 2026-05-13_
