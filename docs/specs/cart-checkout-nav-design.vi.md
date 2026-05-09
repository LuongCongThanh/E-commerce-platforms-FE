---
title: Cart, Checkout, Orders & Navigation Design Spec
status: active
audience: human
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-09
---

# Cart, Checkout, Orders & Navigation — Design Spec

## Implementation Audit — 2026-05-08

| Area                              | Status  | Notes                                                                                            |
| --------------------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| Cart page                         | Done    | `/[locale]/cart` and `CartClient/Table/Summary` now exist and are wired to Zustand store.        |
| Mega menu and mobile category nav | Done    | Desktop and mobile nav are implemented and the subcategory routing path has been hardened.       |
| Products page fix                 | Done    | `products/page.tsx` uses `Suspense` and `ProductsClient`; previous hook mismatch is gone.        |
| Orders detail import fix          | Done    | `orders/[id]/page.tsx` imports the app-local `OrderStatusBadge`.                                 |
| Checkout locale redirect fixes    | Done    | `CheckoutForm` uses `useLocale()` for cart redirect/success redirect, and `src/proxy.ts` now protects checkout/orders/profile routes optimistically. |
| Business-order realism            | Partial | Checkout is locked back to COD-only, calls the real `useCreateOrder()` hook, has success/failed routes, and still needs live backend/API verification for full closure. |

**Scope:** P1-03 Cart Core (cart page) · P1-04 Checkout fixes · P1-05 Orders fixes · Navigation mega menu · Products page fix

---

## 1. Context & Current State

| Area                                 | State                                                  |
| ------------------------------------ | ------------------------------------------------------ |
| `CartDrawer` (slide-in)              | ✅ Done — Sheet, item list, qty stepper, total         |
| `Header` cart icon + badge           | ✅ Done                                                |
| `checkout/page.tsx` + `CheckoutForm` | ✅ Done — locale-aware form now submits through `useCreateOrder()` with COD-only scope |
| `orders/page.tsx`                    | ✅ Done — calls real API                               |
| `orders/[id]/page.tsx`               | ✅ Done — import path fixed                            |
| `/cart` page                         | ✅ Done                                                |
| Mega menu / categories nav           | ✅ Done — desktop/mobile nav shipped, routing hardened |
| `products/page.tsx`                  | ✅ Done — Suspense + `ProductsClient` pattern          |

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
- Stepper calls `updateQuantity(lineId, qty)`; trash calls `removeCartItem(lineId)`
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

### Sub-category routing rule

- Category chính điều hướng tới `/${locale}/categories/${slug}`
- Sub-category hiện tại **không** mở rộng router thành multi-segment route
- Thay vào đó, sub-category sẽ điều hướng an toàn về category page của danh mục cha với query `?subcategory=<slug-con>`
- Mục tiêu của giai đoạn này là bảo toàn browse journey và tránh dead link; taxonomy router sâu hơn là scope riêng

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

- Done: uses `useLocale()` from `next-intl`
- Done: success redirect is `/${locale}/checkout/success?orderId=...`
- Done: empty-cart redirect is `/${locale}/cart`
- Done: submit flow now uses `useCreateOrder()` and shared order action contract
- Done: optimistic auth protection now lives in `src/proxy.ts`
- Done: checkout scope is locked back to COD-only in the UI/schema layer
- Done: failed checkout route exists for server/network failure cases
- Done: success page now resolves `orderId` into a real order summary instead of showing only a bare confirmation
- Remaining gap: final confidence still needs browser/e2e verification against a live backend to mark the full checkout lifecycle absolutely closed

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

## 7. Acceptance Checklist

| Acceptance                                                                          | Status  | Notes                                                                                                |
| ----------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `/vi/cart` loads; empty state shown when no items                                   | Done    | Implemented in `CartClient`.                                                                         |
| Add product to cart → navigate to `/vi/cart` → item visible with correct name/price | Done    | Cart page reads directly from persisted Zustand store.                                               |
| Stepper +/- updates quantity and subtotal in real time                              | Done    | `CartTable` and `CartSummary` update from shared store state.                                        |
| Trash removes item; if last item removed → empty state                              | Done    | Implemented in `CartTable` + `CartClient`.                                                           |
| "Tiến hành thanh toán" → `/vi/checkout`                                             | Done    | Locale-aware link in `CartSummary`.                                                                  |
| Header "Danh mục" click → mega menu panel opens with 6 categories                   | Done    | Desktop mega menu exists in `Header` / `DesktopMegaMenu`.                                            |
| Click category in mega menu → `/vi/categories/[slug]`, panel closes                 | Done    | Category links are locale-aware and panel closes on navigation.                                      |
| Click outside mega menu → panel closes                                              | Done    | Outside-click handling exists in `DesktopMegaMenu`.                                                  |
| Mobile: "Danh mục" accordion shows all categories                                   | Done    | Implemented in `MobileNav`.                                                                          |
| `/vi/products` loads without TypeScript/console errors                              | Partial | Typecheck/build pass and page pattern is fixed; browser console was not re-audited in this doc pass. |
| `/vi/orders/[id]` loads without import errors                                       | Done    | Import path is corrected.                                                                            |
| CartDrawer links use correct locale prefix                                          | Done    | `CartDrawer` now uses `useLocale()`.                                                                 |
| CheckoutForm redirect after submit uses correct locale                              | Done    | `CheckoutForm` redirects with locale prefix.                                                         |
| CheckoutForm submits through real order-create hook instead of mock delay           | Done    | Form now maps UI fields into `CheckoutInput` and calls `useCreateOrder(locale)`.                     |
| Checkout route redirects unauthenticated users to login                            | Done    | `src/proxy.ts` now redirects `/[locale]/checkout`, `/orders`, `/profile` when `access_token` cookie is absent. |
| Checkout supports COD only at MVP scope                                            | Done    | VNPay option was removed from checkout UI/schema to match locked MVP scope.                          |
| Success page renders order summary after placement                                 | Done    | Success page now resolves `orderId` into real order data on the client.                              |
| Failed page exists for recoverable checkout failures                               | Done    | `/[locale]/checkout/failed` now gives retry and cart-return options.                                 |

## Follow-up Tasks To Close Remaining Partial Items

1. Checkout business realism:
   Phần frontend đã dùng flow tạo order thật; bước còn lại là verify thành công end-to-end với backend đang chạy để xác nhận payload `variantId/items/address` khớp contract thực tế.
2. Products page verification depth:
   Nếu muốn đổi `/vi/products` từ `Partial` sang `Done` tuyệt đối, cần thêm một lượt kiểm tra browser console/e2e thay vì chỉ dựa trên typecheck/build pass.
3. Spec drift cleanup:
   Tách phần `Navigation mega menu` đã xong khỏi nhóm `in progress` trong backlog/plan liên quan để docs cấp cao không tiếp tục nói chậm hơn code thật.
