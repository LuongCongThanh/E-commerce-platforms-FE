---
title: Premium Experience Upgrade Spec
status: active
audience: human
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-08
---

# Premium Experience Upgrade Spec

## Implementation Audit — 2026-05-08

| Phase / Area            | Status  | Notes                                                                                                                            |
| ----------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1 — Design Tokens | Done    | Spatial colors, glass variables, and shadow tokens are present in `src/app/globals.css`.                                         |
| Phase 2 — Layout & Nav  | Done    | Spatial layout shell, glass sticky header, desktop mega menu, mobile nav, and localized footer are in place.                     |
| Phase 3 — Hero 3D       | Done    | Home hero has parallax, floating spatial elements, and immersive glass treatment.                                                |
| Phase 4 — Product Cards | Done    | Product cards use glass + tilt/spatial interaction.                                                                              |
| Phase 5 — Cart & SEO    | Partial | Cart drawer, PDP JSON-LD, PDP fly-to-cart, and route-level metadata hardening are implemented; broader SEO closure still needs a deeper sitemap/robots/browser audit pass. |

## Current Reality Check

- Spec này là **implementation-direction + experience target**, không phải checklist delivery cứng như hai spec còn lại.
- Một số path trong bản gốc đã cũ hơn cấu trúc repo hiện tại; bảng dưới đây đã được chỉnh lại theo file thật đang dùng.
- Những phần còn thiếu lớn nhất hiện tại là:
  - audit SEO/CWV tổng thể ngoài PDP JSON-LD
  - quyết định sâu hơn nếu sau này muốn đẩy motion-system vượt quá native scroll hiện tại

This plan outlines the transformation of the E-commerce platform from a standard flat UI to a **Premium, Immersive, and Spatial experience** using the `antigravity-design-expert` skill.

## 🎯 Goals

- **Visual Excellence**: Implement Glassmorphism, 3D depth, and premium typography.
- **Buttery Smooth Motion**: Use Framer Motion for staggered entrances and spatial transitions.
- **Next.js 16 Architecture**: Optimize for Server Components and latest App Router patterns.

## 🛠️ Detailed Skill Mapping (Bản đồ kỹ năng chi tiết)

| Giai đoạn                  | Skill sẽ sử dụng                                     | Hành động cụ thể (Sẽ làm gì?)                                                                   | Vị trí file thực hiện                                                                                                                                                |
| :------------------------- | :--------------------------------------------------- | :---------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 1: Design Tokens** | `antigravity-design-expert`, `tailwind-patterns`     | Định nghĩa utility `glass`, `spatial-bg`, `spatial-depth`, cùng bảng màu và bóng đổ không gian. | `src/app/globals.css`                                                                                                                                                |
| **Phase 2: Layout & Nav**  | `nextjs-app-router-patterns`, `baseline-ui`          | Layout nền không gian + Header/Footer glassy + mega menu + mobile nav.                          | `src/app/layout.tsx`, `src/shared/components/layouts/Header.tsx`, `src/shared/components/layouts/Footer.tsx`                                                         |
| **Phase 3: Hero 3D**       | `antigravity-design-expert`, `framer-motion`         | Banner chính có parallax, floating blobs, glass card, chuyển động không gian.                   | `src/app/[locale]/(shop)/home/page.tsx`, `src/app/[locale]/(shop)/_components/home/SectionHero.tsx`                                                                  |
| **Phase 4: Product Cards** | `ui-pattern`, `react-patterns`                       | Product card có hiệu ứng **3D Tilt**, shadow động, glass treatment.                             | `src/shared/components/commerce/ProductCard.tsx`                                                                                                                     |
| **Phase 5: Cart & SEO**    | `frontend-api-integration-patterns`, `seo-technical` | Cart drawer premium, checkout glass UI, JSON-LD cho PDP, và fly-to-cart từ PDP CTA tới header cart. | `src/shared/components/commerce/CartDrawer.tsx`, `src/app/[locale]/(shop)/_components/checkout/CheckoutForm.tsx`, `src/app/[locale]/(shop)/products/[slug]/page.tsx` |

## 🎯 Key Focus Areas (Khu vực trọng tâm)

### 1. Home Page - Hero Section

- **Sẽ làm gì**: Biến banner tĩnh thành không gian 3D.
- **Cách làm**: Hiệu ứng Parallax, Mesh Gradient mượt mà và các sản phẩm nổi (Floating objects).

### 2. Antigravity Product Card

- **Sẽ làm gì**: Nâng cấp thẻ sản phẩm thành khối kính tương tác.
- **Cách làm**: Hiệu ứng **3D Tilt**, phát sáng viền động (Dynamic glow) và Glassmorphism.

### 3. Layout & Experience

- **Sẽ làm gì**: Tạo cảm giác "không trọng lượng" xuyên suốt ứng dụng.
- **Cách làm**: Sticky Header mờ ảo, motion cục bộ có chủ đích và theme nền Space-depth.

### 4. Cart & Checkout (Micro-interactions)

- **Sẽ làm gì**: Tối ưu luồng mua hàng với các phản hồi cao cấp.
- **Cách làm**: Slide-out cart bằng kính, UI thanh toán tinh gọn, và hiệu ứng "Fly-to-cart" từ PDP CTA về cart icon header.

## ⚡ Optimization Strategy

### 1. Hiệu năng & Chuyển động

- **GPU Acceleration**: Sử dụng `translate3d` để mượt mà 60fps.
- **Adaptive Blurring**: Tự động giảm hiệu ứng Blur trên thiết bị cấu hình thấp.
- **Will-Change**: Tối ưu hóa render cho các thẻ sản phẩm 3D.

### 2. Next.js 16 & SEO

- **Streaming**: Sử dụng Skeleton Loading để tăng tốc độ cảm nhận (perceived speed).
- **SEO & Data**: Tích hợp JSON-LD cho từng sản phẩm và tối ưu Core Web Vitals.

## 🚀 Execution Steps

1. **Phase 1**: Cấu hình Design Tokens và CSS Utilities.
2. **Phase 2**: Nâng cấp Layout chính và Navigation (Header/Footer).
3. **Phase 3**: Triển khai Hero Section & hiệu ứng 3D không gian.
4. **Phase 4**: Nâng cấp Product Card & Catalog (Tilt effect, Staggered animation).
5. **Phase 5**: Hoàn thiện Cart, Checkout & SEO Audit.

## Delivery Checklist

| Target                                | Status  | Notes                                                                                   |
| ------------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| Glassmorphism + spatial design tokens | Done    | Present in `globals.css`.                                                               |
| Premium sticky header/navigation      | Done    | `Header` and supporting nav components are upgraded.                                    |
| Hero 3D / parallax treatment          | Done    | `SectionHero` matches the intended premium direction.                                   |
| Product card 3D tilt                  | Done    | Implemented in `ProductCard`.                                                           |
| Cart drawer premium UI                | Done    | `CartDrawer` uses glass + motion styling.                                               |
| Checkout premium UI                   | Done    | `CheckoutForm` and related summary blocks use premium styling.                          |
| PDP JSON-LD                           | Done    | Implemented in `products/[slug]/page.tsx`.                                              |
| Fly-to-cart dedicated animation       | Done    | Header now listens for `cart-fly` events and animates the product image from PDP CTA into the cart icon. |
| App-wide premium motion/scroll system | Done    | Quyết định hiện tại là **không thêm Lenis/app-wide smooth scroll**; native scroll + Framer Motion cục bộ đã đủ cho premium baseline mà không tăng runtime complexity. |
| SEO hardening beyond PDP JSON-LD      | Partial | Home/products/search metadata đã được bổ sung và `SearchAction` JSON-LD đã trỏ đúng `/search`, nhưng chưa có sitemap/robots/browser audit end-to-end. |

## Follow-up Tasks To Close Remaining Partial Items

1. SEO hardening:
   Audit riêng Home / PLP / PDP theo checklist metadata, canonical, Open Graph, sitemap/robots, rồi ghi kết quả vào spec hoặc playbook SEO thay vì để ở mức mô tả.
2. Motion polish follow-up:
   Chỉ cân nhắc một motion system rộng hơn nếu sau này xuất hiện pain point thật từ page transitions hoặc storytelling sections; hiện tại chưa cần thêm Lenis.

---

_Bạn vui lòng kiểm tra kế hoạch này. Nếu đồng ý, tôi sẽ bắt đầu thực hiện Bước 1._
