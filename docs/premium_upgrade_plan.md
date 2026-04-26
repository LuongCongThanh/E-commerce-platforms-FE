# Premium Antigravity Upgrade Plan

This plan outlines the transformation of the E-commerce platform from a standard flat UI to a **Premium, Immersive, and Spatial experience** using the `antigravity-design-expert` skill.

## 🎯 Goals

- **Visual Excellence**: Implement Glassmorphism, 3D depth, and premium typography.
- **Buttery Smooth Motion**: Use Framer Motion for staggered entrances and spatial transitions.
- **Next.js 16 Architecture**: Optimize for Server Components and latest App Router patterns.

## 🛠️ Detailed Skill Mapping (Bản đồ kỹ năng chi tiết)

| Giai đoạn                  | Skill sẽ sử dụng                                     | Hành động cụ thể (Sẽ làm gì?)                                                                             | Vị trí file thực hiện                                                     |
| :------------------------- | :--------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ |
| **Phase 1: Design Tokens** | `antigravity-design-expert`, `tailwind-patterns`     | Định nghĩa các bộ lọc kính (`glass-blur`), bảng màu Space-HSL, và các biến số chiều sâu 3D.               | `src/app/globals.css`, `tailwind.config.ts`                               |
| **Phase 2: Layout & Nav**  | `nextjs-app-router-patterns`, `baseline-ui`          | Tạo cấu trúc Layout với `Perspective Container`. Xây dựng Header mờ ảo (Glassy) tự động đổi màu khi cuộn. | `src/app/layout.tsx`, `src/components/Header.tsx`                         |
| **Phase 3: Hero 3D**       | `antigravity-design-expert`, `framer-motion`         | Tạo banner chính với hiệu ứng Parallax và các sản phẩm nổi (floating) di chuyển theo chuột.               | `src/app/page.tsx`, `src/components/Hero.tsx`                             |
| **Phase 4: Product Cards** | `ui-pattern`, `react-patterns`                       | Triển khai hiệu ứng **3D Tilt** (nghiêng thẻ theo chuột) và đổ bóng động.                                 | `src/components/ui/AntigravityCard.tsx`, `src/components/ProductCard.tsx` |
| **Phase 5: Cart & SEO**    | `frontend-api-integration-patterns`, `seo-technical` | Tạo hiệu ứng sản phẩm "bay" vào giỏ hàng. Nhúng mã JSON-LD cho từng sản phẩm.                             | `src/components/Cart.tsx`, `src/app/product/[id]/page.tsx`                |

## 🎯 Key Focus Areas (Khu vực trọng tâm)

### 1. Home Page - Hero Section

- **Sẽ làm gì**: Biến banner tĩnh thành không gian 3D.
- **Cách làm**: Hiệu ứng Parallax, Mesh Gradient mượt mà và các sản phẩm nổi (Floating objects).

### 2. Antigravity Product Card

- **Sẽ làm gì**: Nâng cấp thẻ sản phẩm thành khối kính tương tác.
- **Cách làm**: Hiệu ứng **3D Tilt**, phát sáng viền động (Dynamic glow) và Glassmorphism.

### 3. Layout & Experience

- **Sẽ làm gì**: Tạo cảm giác "không trọng lượng" xuyên suốt ứng dụng.
- **Cách làm**: Sticky Header mờ ảo, cuộn trang mượt mà (Lenis) và theme nền Space-depth.

### 4. Cart & Checkout (Micro-interactions)

- **Sẽ làm gì**: Tối ưu luồng mua hàng với các phản hồi cao cấp.
- **Cách làm**: Hiệu ứng "Fly-to-cart", Slide-out cart bằng kính và UI thanh toán tinh gọn.

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

---

_Bạn vui lòng kiểm tra kế hoạch này. Nếu đồng ý, tôi sẽ bắt đầu thực hiện Bước 1._
