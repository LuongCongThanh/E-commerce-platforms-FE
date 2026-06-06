# UI/UX Review — ANTIGRAVITY.STORE

> Ngày: 2026-05-21 · Stack: Next.js 15, Tailwind v4, Framer Motion, Radix UI

---

## Tổng quan

| Tiêu chí      | Score |
| ------------- | ----- |
| Visual Design | 9/10  |
| Responsive    | 8/10  |
| Accessibility | 6/10  |
| Performance   | 7/10  |
| UX Flow       | 7/10  |

**Design đẹp, premium.** Điểm yếu chính: accessibility (motion, contrast) và homepage content density.

---

## Điểm mạnh

### Visual Design

- OKLCH color space → màu chính xác hơn, gradient mượt hơn RGB/HSL
- Glass-morphism + 3D tilt ProductCard → cảm giác premium, hiện đại
- Dark mode via CSS custom properties → triển khai sạch, không flash

### Architecture UI

- 64 components tổ chức tốt theo 7 nhóm (base/common/commerce/marketing/navigation/layouts/skeletons)
- Skeleton loading + Suspense boundaries → không flash unloaded content
- Responsive grid đúng breakpoint: 2 cols (mobile) → 3 cols (tablet) → 4 cols (desktop)
- Design token system với OKLCH, semantic colors, radius tokens

---

## Vấn đề & Khuyến nghị

### 🔴 Critical

#### 1. Homepage 8 sections liên tiếp — cognitive overload

**Vấn đề:** `SectionFlashSale` + `SectionBestSellers` + `SectionNewArrivals` = 3 product grids liên tiếp. User không biết focus vào đâu, scroll fatigue cao.

**File:** `src/app/[locale]/(shop)/home/page.tsx`

**Fix:**

- Giữ tối đa 2 product sections trên homepage
- Bỏ hoặc lazy-load `SectionNewArrivals` — đẩy xuống category page
- Hoặc dùng tab switcher: "Best Sellers | New Arrivals | Flash Sale" trong 1 section

---

#### 2. Auth layout `max-w-md` (28rem) quá hẹp cho RegisterForm

**Vấn đề:** RegisterForm có 6 fields (firstName, lastName, email, password, confirmPassword) trong 448px → crowded, đặc biệt trên tablet.

**File:** `src/app/[locale]/(auth)/layout.tsx`

**Fix:**

```tsx
// Trước
<div className="w-full max-w-md">

// Sau
<div className="w-full max-w-lg">  {/* 512px */}
```

---

### 🟡 High

#### 3. ProductCard — 3 concurrent animations gây motion sickness

**Vấn đề:** Tilt 3D + float animation + zoom hover chạy đồng thời. Vi phạm `prefers-reduced-motion`. Trên low-end device → jank.

**File:** `src/shared/components/commerce/ProductCard.tsx`

**Fix:**

```tsx
import { useReducedMotion } from 'framer-motion';

export function ProductCard(...) {
  const reduceMotion = useReducedMotion();

  // Disable tilt khi user bật reduce motion
  const tiltProps = reduceMotion ? {} : { rotateX, rotateY, ... };

  return (
    <motion.div
      {...tiltProps}
      // Bỏ float animation khi reduceMotion = true
      animate={reduceMotion ? {} : { y: [0, -20, 0] }}
    >
```

Hoặc dùng CSS:

```css
@media (prefers-reduced-motion: reduce) {
  .product-card {
    animation: none;
    transform: none;
    transition: opacity 0.15s ease;
  }
}
```

---

#### 4. CartDrawer — không cap quantity theo stock

**Vấn đề:** User có thể tăng quantity vô hạn trên UI, không bị giới hạn bởi `product.stock`.

**File:** `src/shared/components/commerce/CartDrawer.tsx`

**Fix:**

```tsx
<QuantitySelector
  value={item.quantity}
  max={item.stock ?? 99} // cap tại stock
  onChange={(qty) => updateQuantity(item.variantId, qty)}
/>
```

---

#### 5. Header sticky + parallax blobs — `will-change` overuse

**Vấn đề:** `will-change: transform` set globally trên nhiều elements → tốn GPU memory, đặc biệt trên mobile.

**File:** `src/app/[locale]/(shop)/_lib/components/home/SectionHero.tsx`

**Fix:** Chỉ apply `will-change` trong `onMouseEnter`, remove trong `onMouseLeave`:

```tsx
onMouseEnter={() => element.style.willChange = 'transform'}
onMouseLeave={() => element.style.willChange = 'auto'}
```

---

### 🟢 Medium

#### 6. Font loading thiếu `display: swap`

**Vấn đề:** Nếu Inter Variable load chậm → FOIT (Flash of Invisible Text).

**File:** `src/app/layout.tsx`

**Fix:**

```tsx
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap', // thêm dòng này
  variable: '--font-inter',
});
```

---

#### 7. Color contrast — Accent-500 trên white chưa verify

**Vấn đề:** Accent-500 `oklch(0.72 0.22 55)` = yellow-orange. Lightness 0.72 trên white background có thể < 4.5:1 (WCAG AA fail).

**File:** `src/app/globals.css`

**Action:** Kiểm tra tại [https://oklch.com](https://oklch.com) hoặc dùng browser DevTools → Accessibility panel. Nếu fail, tăng độ tối: `oklch(0.58 0.22 55)`.

---

#### 8. Error boundary thiếu ở product detail page

**Vấn đề:** Nếu API lỗi → page crash thay vì show `ErrorState` component.

**File:** `src/app/[locale]/(shop)/products/[slug]/page.tsx`

**Fix:** Wrap fetch logic trong try/catch và render `ErrorState`:

```tsx
try {
  const product = await fetchProduct(slug);
} catch (e) {
  return <ErrorState message="Không tìm thấy sản phẩm" />;
}
```

---

#### 9. EmptyState chưa đồng nhất ở tất cả pages

**Vấn đề:** Cart empty state có, nhưng cần verify Orders page và Search no-results có dùng `EmptyState` component không.

**Files cần check:**

- `src/app/[locale]/(shop)/orders/page.tsx`
- `src/app/[locale]/(shop)/search/page.tsx`

---

## Quick Wins (làm ngay, impact cao)

| #   | Fix                                      | File                                           | Effort  |
| --- | ---------------------------------------- | ---------------------------------------------- | ------- |
| 1   | `prefers-reduced-motion` cho ProductCard | `shared/components/commerce/ProductCard.tsx`   | ~15 min |
| 2   | `font-display: swap` cho Inter           | `app/layout.tsx`                               | ~5 min  |
| 3   | Auth layout `max-w-md` → `max-w-lg`      | `app/[locale]/(auth)/layout.tsx`               | ~2 min  |
| 4   | Error boundary product detail            | `app/[locale]/(shop)/products/[slug]/page.tsx` | ~30 min |
| 5   | Cap quantity tại stock trong CartDrawer  | `shared/components/commerce/CartDrawer.tsx`    | ~10 min |

---

## Cấu trúc Component (tham khảo)

```
src/shared/components/
├── base/          → 27 primitive components (Button, Input, Dialog...)
├── common/        → 13 domain utilities (PriceDisplay, QuantitySelector...)
├── commerce/      → 3 e-commerce components (ProductCard, CartDrawer...)
├── marketing/     → 5 marketing sections (CountdownTimer, TestimonialCard...)
├── navigation/    → 2 nav components (DesktopMegaMenu, MobileNav)
├── layouts/       → 2 layout components (Header, Footer)
└── skeletons/     → 2 skeleton loaders
```

---

## Palette Reference

| Token         | Value                  | Dùng cho                                 |
| ------------- | ---------------------- | ---------------------------------------- |
| Primary-500   | `oklch(0.62 0.23 25)`  | CTA buttons, badges chính                |
| Secondary-500 | `oklch(0.57 0.22 15)`  | Supporting elements                      |
| Accent-500    | `oklch(0.72 0.22 55)`  | Flash sale, emphasis ⚠ kiểm tra contrast |
| Neutral-950   | `oklch(0.10 0.003 30)` | Body text                                |
| Success       | `oklch(0.55 0.18 145)` | Order confirmed                          |
| Error         | `oklch(0.55 0.22 10)`  | Destructive actions                      |
