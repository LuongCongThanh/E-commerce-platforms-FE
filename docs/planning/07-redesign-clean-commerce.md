# Plan: Redesign storefront theo Clean Commerce

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển storefront từ glassmorphism sang ngôn ngữ **clean commerce** — home kiểu Apple Store, PDP kiểu Nike, checkout kiểu Shopify — trên nền shadcn semantic tokens đã chuẩn hoá.

**Architecture:** Đổi token trước (CTA tối, thêm dải `brand` cho cam-đỏ), rồi redesign từng vùng theo thứ tự phụ thuộc: foundation → layout chrome (header) → home → product card → PLP → PDP → cart → checkout → auth → cleanup. Mỗi task tự đứng được, commit riêng, site không bao giờ ở trạng thái vỡ.

**Tech Stack:** Next.js App Router, Tailwind v4 (CSS-first `@theme`), shadcn/Radix base components, CVA, framer-motion (giảm vai trò), next-intl.

## Các quyết định đã chốt (phiên grilling 2026-07-19)

1. Ngôn ngữ đích: **clean commerce** (ảnh tham chiếu: Apple home / Nike PDP / Shopify checkout) — KHÔNG phải luxury editorial, KHÔNG playful.
2. **Bỏ glassmorphism hoàn toàn** — gỡ `glass`, `spatial-bg`, `spatial-depth`, `shadow-spatial-*`, `animate-float` khỏi toàn bộ storefront, sau đó xoá token/utility khỏi `globals.css`.
3. **CTA tối:** semantic `--primary` đổi từ cam-đỏ sang neutral đậm (kiểu Nike/Shopify). Cam-đỏ rút về vai trò **giá + sale + badge** qua dải scale mới tên `brand`.
4. Phạm vi: core journey (home, PLP, PDP, cart, checkout, header/footer) + 4 trang auth. **Không đụng** orders/profile (đợt sau) và admin.
5. Light-only (giữ `.dark` vars nhưng không bật toggle). Migrate hết `primary-5xx` scale sang semantic/brand trong lúc chạm file (policy "migrate khi chạm").
6. Giữ Inter; không thêm font mới. Giữ dependency framer-motion nhưng **bỏ toàn bộ motion trang trí** (parallax blob, 3D tilt, float vô hạn) — chỉ còn fade-in nhẹ ≤300ms nếu cần.

## Global Constraints

- Mọi import qua alias `@/*` — không relative import (ESLint chặn).
- Semantic token là ngôn ngữ mặc định: `bg-background`, `bg-card`, `text-muted-foreground`, `border`, `bg-primary`… Cam-đỏ chỉ qua `brand-*` và chỉ cho giá/sale/badge.
- Không hardcode màu hex/oklch trong component; không dùng `neutral-*` scale mới khi đã có semantic tương đương.
- Strict booleans (`val === true`, `!= null`), không array-index key, template literal convert non-string.
- Copy hiển thị qua next-intl khi file đang làm đã dùng next-intl; file đang hardcode tiếng Việt sẵn thì giữ nguyên hiện trạng (không mở rộng phạm vi).
- Sau MỖI task: `npm run lint && npm run typecheck && npm run test` phải pass, rồi commit. Commit message conventional (`feat(shop): …`), KHÔNG thêm Co-Authored-By.
- Không đụng: `(admin)/`, `src/core/session/`, orders/profile pages, logic hooks/api — đây là redesign thuần trình bày.

## Ngôn ngữ thị giác (tham chiếu khi làm mọi task)

| Yếu tố              | Quy cách                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Nền trang           | `bg-background` (trắng), KHÔNG lớp gradient cố định                                         |
| Card chuẩn          | `rounded-xl border bg-card shadow-sm`, hover `hover:shadow-md transition-shadow`            |
| Section             | `container mx-auto px-4`, đệm dọc `py-12 md:py-16`                                          |
| Section heading     | `text-2xl font-semibold tracking-tight md:text-3xl`                                         |
| Hero banner (Apple) | `rounded-3xl bg-neutral-950 text-white overflow-hidden`, nút pill `rounded-full`            |
| CTA chính           | `<Button>` default (nền tối sau Task 1), full-width ở PDP/checkout: `h-12 w-full text-base` |
| CTA phụ             | `<Button variant="outline">`                                                                |
| Giá                 | `text-brand-600 font-bold`; giá gạch: `text-muted-foreground line-through`                  |
| Badge sale          | `bg-brand-50 text-brand-700`; badge khác dùng semantic status (bảng ở Task 5)               |
| Ảnh sản phẩm        | đặt trên tile `bg-neutral-50` (như Featured Products của Apple)                             |
| Cấm                 | glass, blur blob, gradient text, 3D transform, animation vô hạn, `shadow-spatial-*`         |

---

### Task 1: Foundation — token CTA tối + dải brand

**Files:**

- Modify: `src/app/globals.css`

**Interfaces:**

- Produces: utility classes `bg-brand-*`, `text-brand-*`, `border-brand-*` (50–950); `bg-primary` từ đây render **tối** ở mọi Button default (kể cả admin — chấp nhận, đã chốt).

- [ ] **Step 1: Thêm dải `brand` vào `@theme`** — chèn ngay sau block primary scale (sao chép giá trị, KHÔNG var() lồng vì primary scale sẽ bị xoá ở Task 12):

```css
/* ── Brand: Cam-đỏ — chỉ dùng cho giá, sale, badge khuyến mãi ─────── */
--color-brand-50: oklch(0.97 0.02 25);
--color-brand-100: oklch(0.93 0.05 25);
--color-brand-200: oklch(0.87 0.09 25);
--color-brand-300: oklch(0.79 0.14 25);
--color-brand-400: oklch(0.7 0.19 25);
--color-brand-500: oklch(0.62 0.23 25);
--color-brand-600: oklch(0.54 0.22 25);
--color-brand-700: oklch(0.45 0.19 25);
--color-brand-800: oklch(0.35 0.15 25);
--color-brand-900: oklch(0.26 0.1 25);
--color-brand-950: oklch(0.16 0.06 25);
```

- [ ] **Step 2: Flip `--primary`/`--ring` sang tối** trong `:root`:

```css
--primary: oklch(0.16 0.004 30);
--primary-foreground: oklch(0.98 0.004 30);
--ring: oklch(0.16 0.004 30);
```

và trong `.dark` (đảo sáng/tối kiểu shadcn default):

```css
--primary: oklch(0.96 0.006 30);
--primary-foreground: oklch(0.16 0.004 30);
--ring: oklch(0.96 0.006 30);
```

- [ ] **Step 3: Verify** — `npm run dev`, mở `/vi/home`: mọi Button default (kể cả "Mua ngay" hero, sidebar admin `/vi/admin`) chuyển nền tối chữ trắng. `npm run lint && npm run typecheck && npm run test` pass.
- [ ] **Step 4: Commit** — `feat(theme): dark primary CTA + brand scale for price/sale accents`

---

### Task 2: Root layout + providers — gỡ lớp nền spatial và toast kính

**Files:**

- Modify: `src/app/layout.tsx:41-44`
- Modify: `src/app/providers.tsx:29-38`

- [ ] **Step 1:** `layout.tsx` — xoá div `spatial-bg` (dòng 42) và bỏ class `spatial-depth` ở wrapper (dòng 44); đổi selection sang brand:

```tsx
<body className="selection:bg-brand-500/30 font-sans antialiased" suppressHydrationWarning>
  <Providers>
    <div className="relative flex min-h-screen flex-col">{children}</div>
  </Providers>
</body>
```

- [ ] **Step 2:** `providers.tsx` — Toaster bỏ glass, dùng card phẳng:

```tsx
<Toaster richColors position="top-right" toastOptions={{ className: '!rounded-xl !border !bg-card !shadow-md' }} />
```

(giữ `AppProgressBar color="#e85d04"` — trùng brand-500, chấp nhận hex tại config prop.)

- [ ] **Step 3: Verify** — nền trang trắng phẳng toàn site, toast (thêm sản phẩm vào giỏ) hiện card trắng viền mảnh. Lint/typecheck/test pass.
- [ ] **Step 4: Commit** — `feat(shop): flat page background and toast, remove spatial layer`

---

### Task 3: Header + navigation phẳng kiểu Apple/Nike

**Files:**

- Modify: `src/app/[locale]/(shop)/_lib/components/layout/Header.tsx`
- Modify: `src/app/[locale]/(shop)/_lib/components/navigation/DesktopMegaMenu.tsx`
- Modify: `src/app/[locale]/(shop)/_lib/components/navigation/MobileNav.tsx`
- Modify: `src/app/[locale]/(shop)/_lib/components/layout/Footer.tsx`

- [ ] **Step 1:** `Header.tsx` — header nền đặc + border mảnh, logo chữ đen tuyền, bỏ gradient text:

```tsx
<header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
```

Logo (dòng 40-42) thay bằng:

```tsx
<span className="text-xl font-black tracking-tighter">
  ANTIGRAVITY<span className="text-muted-foreground">.STORE</span>
</span>
```

Search input (dòng 77) thay class kính bằng: `h-9 w-48 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-64`. Cart badge (dòng 109): `bg-primary-500` → `bg-brand-500`. Link Flash Sale (dòng 58): `text-orange-500…` → `text-brand-600 hover:text-brand-500`. Các `hover:text-primary-*` → `hover:text-foreground`, `text-neutral-600 dark:text-neutral-300` → `text-muted-foreground`.

- [ ] **Step 2:** `DesktopMegaMenu.tsx` + `MobileNav.tsx` — đọc file, áp bảng chuyển đổi: `glass` → `border bg-popover shadow-md`; mọi `primary-5xx` → semantic (`text-foreground`/`bg-muted`) hoặc `brand-*` nếu là điểm nhấn khuyến mãi; xoá `shadow-spatial-*`, `spatial-depth`, gradient text.
- [ ] **Step 3:** `Footer.tsx` — bỏ mọi `primary-5xx`/gradient; footer kiểu Apple: `border-t bg-neutral-50`, cột link `text-sm text-muted-foreground hover:text-foreground`, heading cột `text-sm font-semibold text-foreground`.
- [ ] **Step 4: Verify** — header trắng dính top có border-b, mega menu nền trắng đặc, footer xám nhạt. Lint/typecheck/test pass.
- [ ] **Step 5: Commit** — `feat(shop): flat header, navigation and footer`

---

### Task 4: SectionHero — dark banner kiểu Apple

**Files:**

- Modify: `src/app/[locale]/(shop)/_lib/components/home/SectionHero.tsx` (viết lại toàn bộ)

**Interfaces:**

- Consumes: `homeHeroData` (`badge`, `title`, `subtitle`, `cta`, `ctaSale`, `image`, `trustItems`) — giữ nguyên data file.

- [ ] **Step 1:** Viết lại component — banner tối bo góc trong container, ảnh sản phẩm làm nền phải, KHÔNG blob/parallax/glass/gradient-text; bỏ toàn bộ `useScroll`/`useTransform`/animation vô hạn:

```tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useLocale } from 'next-intl';

import { TrustBadgeList } from '@/app/[locale]/(shop)/_lib/components/home/TrustBadgeList';
import { homeHeroData } from '@/app/[locale]/(shop)/_lib/data/home';
import { Button } from '@/shared/components/base/Button';

export function SectionHero(): React.JSX.Element {
  const locale = useLocale();
  const titleLines = homeHeroData.title.split('\n');

  return (
    <section className="container mx-auto px-4 pt-6 md:pt-8">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white">
        <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-16 text-center md:py-24">
          <span className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold tracking-wide text-white/80">
            {homeHeroData.badge}
          </span>
          <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="max-w-md text-base text-white/70 md:text-lg">{homeHeroData.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-full bg-white px-8 text-base font-semibold text-neutral-950 hover:bg-white/90">
              <Link href={`/${locale}/products`}>{homeHeroData.cta}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/30 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              <Link href={`/${locale}/products?flash-sale=true`}>{homeHeroData.ctaSale}</Link>
            </Button>
          </div>
        </div>
        <Image src={homeHeroData.image} alt="" aria-hidden="true" fill priority sizes="100vw" className="object-cover opacity-30" />
      </div>
      <div className="py-6">
        <TrustBadgeList items={homeHeroData.trustItems} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify** — `/vi/home`: hero là khối tối bo góc 24px, 2 nút pill (trắng đặc + outline trắng), không còn blob. Lint/typecheck/test pass.
- [ ] **Step 3: Commit** — `feat(shop): Apple-style dark hero banner`

---

### Task 5: ProductCard phẳng

**Files:**

- Modify: `src/app/[locale]/(shop)/_lib/components/common/ProductCard.tsx` (viết lại phần render; props giữ NGUYÊN)

**Interfaces:**

- Produces: `ProductCardProps` không đổi — mọi section/PLP dùng lại không sửa call site.

- [ ] **Step 1:** Bỏ toàn bộ 3D tilt (`useMotionValue`, `useSpring`, `useTransform`, `handleMouseMove`, `handleMouseLeave`, import framer-motion, `MouseEvent`), glare overlay, glass. Badge chuyển sang semantic status tokens:

```tsx
const BADGE_STYLES: Record<BadgeValue, string> = {
  'best-seller': 'bg-warning-50 text-warning-700',
  new: 'bg-info-50 text-info-700',
  sale: 'bg-brand-50 text-brand-700',
  'low-stock': 'bg-warning-50 text-warning-700',
};
```

Khung card render:

```tsx
<Link href={`/${locale}/products/${slug}`} className="group block" data-product-id={String(id)}>
  <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
    <div className="relative aspect-square overflow-hidden bg-neutral-50">
      <Image ... className="object-cover transition-transform duration-300 group-hover:scale-105" />
      {/* badges giữ vị trí cũ, style mới: rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider + BADGE_STYLES */}
    </div>
    <div className="flex flex-col gap-2 p-4">
      <p className="line-clamp-2 text-sm font-medium leading-tight text-foreground">{name}</p>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-brand-600 text-lg font-bold">{formatCurrency(displayPrice)}</span>
        {hasDiscount ? <span className="text-xs text-muted-foreground line-through">{formatCurrency(price)}</span> : null}
      </div>
      {/* rating row: Star fill-amber-400 giữ nguyên; text-neutral-* → text-muted-foreground */}
    </div>
  </div>
</Link>
```

(Bỏ hẳn icon giỏ hàng hover-reveal — clean commerce không có.)

- [ ] **Step 2: Verify** — mọi grid sản phẩm (home, `/vi/products`) hiện card trắng viền mảnh, ảnh trên tile xám nhạt, giá cam. Không còn hiệu ứng nghiêng khi rê chuột. Lint/typecheck/test pass.
- [ ] **Step 3: Commit** — `feat(shop): flat product card`

---

### Task 6: Các section còn lại của Home

**Files:**

- Modify: `src/app/[locale]/(shop)/_lib/components/home/SectionFeaturedCategories.tsx`, `SectionFlashSale.tsx`, `SectionBestSellers.tsx`, `SectionNewArrivals.tsx`, `SectionWhyChooseUs.tsx`, `SectionTestimonials.tsx`, `SectionNewsletter.tsx`, `TestimonialCard.tsx`, `TrustBadgeList.tsx`, `CountdownTimer.tsx` (nếu có màu scale)
- Modify: `src/app/[locale]/(shop)/_lib/components/common/HeroBanner.tsx`, `FlashSaleBanner.tsx`, `CategoryGrid.tsx`, `CategoryCard.tsx`, `SectionHeading.tsx`

- [ ] **Step 1:** Đọc từng file, áp **bảng chuyển đổi chung** (đây là task cơ học, quy tắc là nội dung):

| Hiện tại                                                                       | Thay bằng                                                   |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `glass`                                                                        | `border bg-card shadow-sm`                                  |
| `shadow-spatial-sm` / `shadow-spatial-lg`                                      | `shadow-sm` / `shadow-md`                                   |
| `spatial-depth`, `animate-float`, `animate-pulse-slow`, motion vô hạn/parallax | xoá                                                         |
| gradient text (`bg-clip-text text-transparent`)                                | `text-foreground`                                           |
| `bg-primary-5xx` (nút/nhấn tương tác)                                          | Button default (primary tối)                                |
| `text-primary-6xx`/`bg-primary-5xx` (giá, sale, khuyến mãi)                    | `text-brand-600` / `bg-brand-500`                           |
| `bg-primary-50/100` (nền nhạt)                                                 | `bg-muted` hoặc `bg-brand-50` nếu là sale                   |
| `text-neutral-500/600`                                                         | `text-muted-foreground`                                     |
| `text-neutral-800/900`, `dark:text-*` đi kèm                                   | `text-foreground` (bỏ nhánh dark thủ công — semantic tự lo) |
| `border-neutral-100/200`                                                       | `border` (default `--border`)                               |

- [ ] **Step 2:** `SectionFeaturedCategories`/`CategoryGrid`/`CategoryCard` — chuyển thành tile "Shop by Category" kiểu Apple: `rounded-xl border bg-card p-6 flex flex-col items-center gap-3 hover:shadow-md transition-shadow`, icon `size-8 text-foreground`, label `text-sm font-medium`.
- [ ] **Step 3:** `SectionFlashSale`/`FlashSaleBanner` — banner sale là card `bg-brand-50` chữ `text-brand-700` (KHÔNG gradient rực); countdown chip `bg-neutral-950 text-white rounded-lg px-2 py-1 font-mono`.
- [ ] **Step 4:** `SectionHeading` — chuẩn `text-2xl font-semibold tracking-tight md:text-3xl`; link "Xem tất cả" `text-sm text-muted-foreground hover:text-foreground`.
- [ ] **Step 5: Verify** — cuộn toàn bộ `/vi/home`: không còn kính/gradient/float; các section trắng-xám nhất quán; flash sale là điểm cam duy nhất. Lint/typecheck/test pass (chú ý `CountdownTimer.test.tsx`, `NewsletterForm.test.tsx` phải xanh).
- [ ] **Step 6: Commit** — `feat(shop): flat home sections`

---

### Task 7: PLP / search / category pages

**Files:**

- Modify: `src/app/[locale]/(shop)/_lib/components/products/ProductsClient.tsx`, `categories/FilterSidebar.tsx`, `categories/CategoryClient.tsx`, `search/SearchClient.tsx`, `common/ProductGrid.tsx`, `common/Pagination.tsx`, `common/SortSelect.tsx`, `common/ShopLoadingShell.tsx`

- [ ] **Step 1:** Áp bảng chuyển đổi Task 6 cho từng file. FilterSidebar: nhóm filter là section `border-b pb-4` (kiểu Nike), KHÔNG card kính; checkbox/radio dùng base components sẵn có.
- [ ] **Step 2:** Pagination: nút trang hiện tại dùng Button default (tối), còn lại `variant="ghost"`.
- [ ] **Step 3: Verify** — `/vi/products`, `/vi/search?q=a`, `/vi/categories/<slug bất kỳ>` sạch, filter sidebar phẳng. Lint/typecheck/test pass.
- [ ] **Step 4: Commit** — `feat(shop): flat product listing, search and category pages`

---

### Task 8: PDP kiểu Nike

**Files:**

- Modify: `src/app/[locale]/(shop)/products/[slug]/page.tsx`
- Modify: `src/app/[locale]/(shop)/_lib/components/products/ProductGallery.tsx`, `VariantSelector.tsx`, `AddToCartSection.tsx`, `ProductDetailTabs.tsx`
- Modify (nếu chạm): `src/app/[locale]/(shop)/_lib/components/common/PriceDisplay.tsx`, `QuantitySelector.tsx`

- [ ] **Step 1:** `page.tsx` — layout 2 cột kiểu Nike: trái gallery (span rộng hơn), phải info; breadcrumb dùng `shared/components/base/breadcrumb.tsx` trên cùng; gỡ `glass`.
- [ ] **Step 2:** `ProductGallery` — thumbnail rail dọc bên trái (ẩn trên mobile, thành dots/swipe), ảnh chính trên nền `bg-neutral-50 rounded-xl`; thumbnail active: `ring-2 ring-ring rounded-lg`.
- [ ] **Step 3:** `VariantSelector` — size hiển thị dạng **circle/chip kiểu Nike**: `size-11 rounded-full border text-sm font-medium hover:border-foreground`, selected: `border-2 border-foreground`, hết hàng: `opacity-40 line-through pointer-events-none`. Variant màu/ảnh (nếu có ảnh): thumbnail `rounded-lg border-2`, selected `border-foreground`.
- [ ] **Step 4:** `AddToCartSection` — stack dọc kiểu Nike: Buy Now = `<Button className="h-12 w-full text-base">`, Add to Bag = `<Button variant="outline" className="h-12 w-full text-base">`; giá `text-brand-600 text-2xl font-bold` (qua PriceDisplay).
- [ ] **Step 5:** `ProductDetailTabs` — chuyển từ tabs sang **accordion** kiểu Nike (Size & Fit / Delivery & Return / Product Information) dùng `shared/components/base/accordion.tsx`; giữ nguyên nội dung từng panel, gỡ glass.
- [ ] **Step 6: Verify** — mở 1 PDP thật: rail thumbnail, size circles chọn được, 2 nút full-width (đen + outline), accordion mở/đóng. `PriceDisplay.test.tsx`, `QuantitySelector.test.tsx` xanh. Lint/typecheck/test pass.
- [ ] **Step 7: Commit** — `feat(shop): Nike-style product detail page`

---

### Task 9: Cart

**Files:**

- Modify: `src/app/[locale]/(shop)/_lib/components/cart/CartDrawer.tsx`, `CartTable.tsx`, `CartSummary.tsx`, `CartClient.tsx`
- Modify: `src/app/[locale]/(shop)/cart/page.tsx` (nếu có style riêng)

- [ ] **Step 1:** Áp bảng chuyển đổi Task 6. CartDrawer (Sheet) nền `bg-background` đặc; line item: ảnh tile `bg-neutral-50 rounded-lg size-16`, tên `text-sm font-medium`, giá `text-brand-600 font-semibold`.
- [ ] **Step 2:** CartSummary — card chuẩn `rounded-xl border bg-card p-6`; hàng Total `text-base font-semibold`; nút checkout Button default full-width `h-12`.
- [ ] **Step 3: Verify** — thêm sản phẩm → mở drawer → `/vi/cart`: drawer đặc, bảng sạch, summary card phẳng. `useCart.test.tsx` xanh. Lint/typecheck/test pass.
- [ ] **Step 4: Commit** — `feat(shop): flat cart drawer and cart page`

---

### Task 10: Checkout kiểu Shopify

**Files:**

- Modify: `src/app/[locale]/(shop)/_lib/components/checkout/CheckoutClient.tsx`, `OrderSummary.tsx`
- Modify: `src/app/[locale]/(shop)/checkout/success/page.tsx` (nếu có glass/scale)

- [ ] **Step 1:** `CheckoutClient` — bố cục Shopify 2 cột, gỡ toàn bộ `glass spatial-depth`:

```tsx
<div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[1fr_420px]">
  <div className="flex flex-col gap-8">{/* Contact → Delivery → Payment, mỗi khối: h2 text-lg font-semibold + fields */}</div>
  <aside className="lg:border-l lg:pl-8">
    <OrderSummary />
  </aside>
</div>
```

Khối form KHÔNG bọc card từng khối (Shopify để form trần trên nền trắng, phân nhóm bằng heading + spacing). Payment method giữ radio group hiện có, style `rounded-lg border p-4` mỗi option, checked: `border-foreground bg-muted`.

- [ ] **Step 2:** `OrderSummary` — cột phải: line items nhỏ (ảnh `size-16 rounded-lg bg-neutral-50` + badge số lượng), divider, subtotal/shipping/total; total `text-lg font-semibold`. Nút đặt hàng: Button default `h-12 w-full text-base` (đen kiểu "Pay now").
- [ ] **Step 3: Verify** — đi hết flow: thêm giỏ → checkout → đặt hàng (mock) → success. Form 2 cột trên desktop, summary xuống dưới trên mobile. Lint/typecheck/test pass.
- [ ] **Step 4: Commit** — `feat(shop): Shopify-style checkout layout`

---

### Task 11: Auth pages

**Files:**

- Modify: `src/app/[locale]/(auth)/login/page.tsx:16`, `register/page.tsx`, `forgot-password/page.tsx`, `reset-password/[token]/page.tsx`
- Modify (kiểm tra): `src/app/[locale]/(auth)/layout.tsx` — nếu có nền gradient/glass thì làm phẳng cùng lúc

- [ ] **Step 1:** Cả 4 page: `className="glass rounded-2xl p-8"` → `className="rounded-xl border bg-card p-8 shadow-sm"`. Subtitle `text-neutral-500` → `text-muted-foreground`.
- [ ] **Step 2: Verify** — `/vi/login`, `/vi/register`, `/vi/forgot-password`: card trắng phẳng giữa nền trắng (phân tách bằng viền). `useAuth.test.ts` xanh. Lint/typecheck/test pass.
- [ ] **Step 3: Commit** — `feat(auth): flat auth cards`

---

### Task 12: Cleanup token + docs + QA tổng

**Files:**

- Modify: `src/app/globals.css`
- Modify: `docs/architecture/conventions.md`
- Modify: `CONTEXT.md`

- [ ] **Step 1: Gate xoá** — grep phải về **0** trước khi xoá (nếu còn, quay lại fix file đó trước):

```bash
grep -rn --include='*.tsx' -E 'glass|spatial-bg|spatial-depth|shadow-spatial|animate-float|animate-pulse-slow' src/
grep -rn --include='*.tsx' -E '(bg|text|border|from|to|ring)-primary-[0-9]' src/
```

- [ ] **Step 2:** `globals.css` — xoá: block primary scale 50–950 (đã thay bằng brand), block "Antigravity Spatial Tokens" (`--color-spatial-*`, `--shadow-spatial-*`, `--animate-float`, `--animate-pulse-slow`), `@keyframes float`, 3 utility `glass`/`spatial-bg`/`spatial-depth`, `--glass-bg`/`--glass-border`/`--perspective` trong `:root` và `.dark`, và `perspective` trong `body`.
- [ ] **Step 3:** `conventions.md` mục Design system — thay dòng "glass/spatial là visual identity — giữ" bằng: "Visual identity: **clean commerce** (phẳng, trắng, card viền mảnh; CTA tối; cam-đỏ `brand-*` chỉ cho giá/sale/badge). Glassmorphism đã gỡ bỏ (2026-07). Palette scale cam-đỏ tên là `brand`; KHÔNG còn scale `primary-*`."
- [ ] **Step 4:** `CONTEXT.md` — cập nhật định nghĩa **Palette scale**: "(brand/secondary/accent/neutral)" thay cho "(primary/…)".
- [ ] **Step 5: QA tổng** — `npm run lint && npm run typecheck && npm run test && npm run build` đều pass; duyệt tay 8 màn: home, PLP, PDP, cart drawer, cart page, checkout, success, login. Kiểm tra nhanh admin `/vi/admin` không vỡ (Button tối là chủ đích).
- [ ] **Step 6: Commit** — `chore(theme): remove glassmorphism tokens, rename primary scale to brand, update docs`

---

## Ngoài phạm vi (đã chốt, đừng lỡ tay làm)

- Orders/Profile pages (đợt sau — vẫn còn style cũ, chấp nhận lệch tạm thời)
- Admin ngoài hiệu ứng phụ của `--primary`
- Dark mode toggle, font mới, đổi copy/i18n, logic hooks/api/store
- Gỡ dependency framer-motion (vẫn còn dùng cho fade-in; cân nhắc ở đợt khác)
