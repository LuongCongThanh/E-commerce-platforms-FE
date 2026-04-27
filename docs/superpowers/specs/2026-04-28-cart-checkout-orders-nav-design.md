# Cart, Checkout, Orders & Navigation — Design Spec

**Date:** 2026-04-28
**Scope:** P1-03 Cart Core (cart page) · P1-04 Checkout fixes · P1-05 Orders fixes · Navigation mega menu · Products page fix

---

## 1. Context & Current State

| Area                                 | State                                                         |
| ------------------------------------ | ------------------------------------------------------------- |
| `CartDrawer` (slide-in)              | ✅ Done — Sheet, item list, qty stepper, total                |
| `Header` cart icon + badge           | ✅ Done                                                       |
| `checkout/page.tsx` + `CheckoutForm` | ✅ Done scaffold — has bugs (locale, redirect)                |
| `orders/page.tsx`                    | ✅ Done — calls real API                                      |
| `orders/[id]/page.tsx`               | ✅ Done — has wrong import path                               |
| `/cart` page                         | ❌ Missing                                                    |
| Mega menu / categories nav           | ❌ Missing                                                    |
| `products/page.tsx`                  | 🔶 TypeScript error (`isLoading` field doesn't exist in hook) |

---

## 2. Cart Page (`/cart`)

### Layout

Two-column layout on desktop (lg+), stacked on mobile:

```
[CartTable — flex-1]   [CartSummary — w-80 sticky]
```

### CartTable

- Client component, reads from `useCartStore`
- Each row: `next/image` 80×80, product name, variant label (from `variantName`), unit price, qty stepper (Minus/Plus buttons clamped 1–99), Trash icon to remove
- Stepper calls `updateQuantity(variantId, qty)`; trash calls `removeCartItem(variantId)`
- No max-stock enforcement here (store only, no product data on cart page)

### CartSummary

- Tạm tính = `total` from store
- Phí vận chuyển = "Miễn phí" (MVP placeholder)
- Tổng cộng = same as tạm tính
- CTA: "Tiến hành thanh toán" → `/${locale}/checkout` (disabled if items empty)
- Secondary: "Tiếp tục mua sắm" link → `/${locale}/home`

### Empty State

- Centered, `ShoppingBag` icon, heading "Giỏ hàng trống", sub "Hãy khám phá các sản phẩm của chúng tôi", button → home

### Route

- `src/app/[locale]/(shop)/cart/page.tsx` — Server Component wrapper (reads locale from params), renders `CartClient` as child
- `CartClient` is the client component holding all store logic

---

## 3. Navigation Mega Menu

### Header changes

Replace current two nav links with:

```
[Logo]   [Tất cả sản phẩm]  [Danh mục ▾]  [Flash Sale]   [Search] [Cart] [User]
```

### Mega Menu Panel

- **Trigger:** Click "Danh mục ▾" button toggles panel (not hover — mobile-friendly)
- **Panel:** Positioned below header, full container width, `glass` backdrop blur styling consistent with header
- **Content:** 3×2 grid of category items — each shows icon emoji + category name + "X sản phẩm"
- **Data:** Imported from `homeCategoriesData` (static, no fetch needed)
- **Navigation:** Click any category → `/${locale}/categories/${slug}`, closes panel
- **Close:** Click outside (via `useEffect` + `mousedown` listener on document) or press Escape

### Mobile menu

Inside the existing mobile accordion, "Danh mục" section expands to show all 6 categories as links, same close behavior.

### Categories data mapping

Use existing `homeCategoriesData` from `_lib/data/home.ts`. Each entry has `slug`, `name`, `image`, `productCount`.

---

## 4. Bug Fixes

### `products/page.tsx`

- Remove `isLoading` destructure (hook is sync `useMemo`, never async)
- Wrap page in `Suspense` (needed because `useSearchParams` requires it in App Router)
- Convert to proper pattern: Server Component `page.tsx` → Suspense boundary → `ProductsClient` client component

### `orders/[id]/page.tsx`

- Fix import: `@/shared/components/common/OrderStatusBadge` → `@/app/[locale]/(shop)/_components/OrderStatusBadge`

### `CartDrawer.tsx`

- Fix hardcoded `/cart` → use `useLocale()` to build `/${locale}/cart`
- Fix hardcoded `/checkout` → `/${locale}/checkout`

### `CheckoutForm.tsx`

- Remove hacky locale detection (`t('title') === 'Checkout'`)
- Use `useLocale()` from `next-intl` for proper locale-aware redirects
- Fix success redirect: `/checkout/success` → `/${locale}/checkout/success`
- Fix empty cart redirect: `/${locale}/cart`

---

## 5. Architecture Decisions

| Decision                                             | Rationale                                                                    |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| Cart page is client-only (no SSR)                    | Cart data lives in Zustand (localStorage); no server data needed             |
| Mega menu uses click not hover                       | Hover is unreliable on touch devices; click toggle is simpler and consistent |
| Categories data is static import                     | Already in `homeCategoriesData`; no need for extra fetch                     |
| No auth gate on cart page                            | P1-02 Auth not done yet; cart works without login                            |
| `CartClient` pattern (server wrapper → client child) | Allows locale from server params without making entire page client           |

---

## 6. Files to Create / Modify

### Create

- `src/app/[locale]/(shop)/cart/page.tsx`
- `src/app/[locale]/(shop)/cart/_components/CartClient.tsx`
- `src/app/[locale]/(shop)/cart/_components/CartTable.tsx`
- `src/app/[locale]/(shop)/cart/_components/CartSummary.tsx`

### Modify

- `src/shared/components/layouts/Header.tsx` — mega menu
- `src/shared/components/commerce/CartDrawer.tsx` — locale links
- `src/app/[locale]/(shop)/_components/checkout/CheckoutForm.tsx` — locale fixes
- `src/app/[locale]/(shop)/products/page.tsx` — remove isLoading, add Suspense
- `src/app/[locale]/(shop)/orders/[id]/page.tsx` — fix import

---

## 7. Acceptance Criteria

- [ ] `/vi/cart` loads; empty state shown when no items
- [ ] Add product to cart → navigate to `/vi/cart` → item visible with correct name/price
- [ ] Stepper +/- updates quantity and subtotal in real time
- [ ] Trash removes item; if last item removed → empty state
- [ ] "Tiến hành thanh toán" → `/vi/checkout`
- [ ] Header "Danh mục" click → mega menu panel opens with 6 categories
- [ ] Click category in mega menu → `/vi/categories/[slug]`, panel closes
- [ ] Click outside mega menu → panel closes
- [ ] Mobile: "Danh mục" accordion shows all categories
- [ ] `/vi/products` loads without TypeScript/console errors
- [ ] `/vi/orders/[id]` loads without import errors
- [ ] CartDrawer links use correct locale prefix
- [ ] CheckoutForm redirect after submit uses correct locale
