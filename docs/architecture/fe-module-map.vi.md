---
title: FE Module Map
status: active
audience: human
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-06
---

# FE Module Map

> Tài liệu này trả lời câu hỏi "cái X nằm ở đâu?" và "module nào làm gì?". Dựa trực tiếp trên codebase thực tế — không có gì được bịa.

---

## 1. Sơ đồ tổng quan

```
src/
├── app/
│   ├── page.tsx                    ← redirect về [locale]/
│   ├── layout.tsx                  ← root HTML shell
│   ├── providers.tsx               ← React Query + Toast providers
│   ├── sw.ts                       ← Service Worker (PWA offline)
│   └── [locale]/
│       ├── layout.tsx              ← locale layout (next-intl)
│       ├── error.tsx               ← error boundary toàn cục
│       ├── loading.tsx             ← loading UI
│       ├── (shop)/                 ← public storefront
│       ├── (auth)/                 ← auth flows
│       └── (admin)/                ← protected backoffice (WIP)
├── shared/                         ← cross-feature utilities
│   ├── components/                 ← UI components dùng chung
│   ├── constants/                  ← config constants
│   ├── hooks/                      ← shared hooks
│   ├── lib/                        ← core utilities (http, errors, guards, etc.)
│   ├── stores/                     ← Zustand global stores
│   └── types/                      ← Zod schemas + inferred types
├── i18n/
│   └── request.ts                  ← next-intl config (locale detection)
└── messages/
    ├── vi.json                     ← translations (source of truth)
    └── en.json
```

---

## 2. Route Group: `(shop)` — Storefront

**Tất cả routes công khai, không cần đăng nhập để xem (trừ checkout và orders).**

### Pages

| Route                | File                                | Mô tả                                       |
| -------------------- | ----------------------------------- | ------------------------------------------- |
| `/`                  | `(shop)/page.tsx`                   | Home — redirect về `/home` hoặc render home |
| `/home`              | `(shop)/home/page.tsx`              | Home sections (Hero, BestSellers, etc.)     |
| `/products`          | `(shop)/products/page.tsx`          | Product listing page                        |
| `/products/[slug]`   | `(shop)/products/[slug]/page.tsx`   | Product detail page (PDP)                   |
| `/categories/[slug]` | `(shop)/categories/[slug]/page.tsx` | Category listing                            |
| `/search`            | `(shop)/search/page.tsx`            | Search results                              |
| `/cart`              | `(shop)/cart/page.tsx`              | Giỏ hàng                                    |
| `/checkout`          | `(shop)/checkout/page.tsx`          | Checkout COD                                |
| `/checkout/success`  | `(shop)/checkout/success/page.tsx`  | Order confirmation                          |
| `/orders`            | `(shop)/orders/page.tsx`            | Order history                               |
| `/orders/[id]`       | `(shop)/orders/[id]/page.tsx`       | Order detail                                |
| `/profile`           | `(shop)/profile/page.tsx`           | Customer profile                            |

### Data layer (3-layer pattern)

```
(shop)/_lib/
├── data/                   ← Layer 1: Static mock arrays (thay bằng API khi BE ready)
│   ├── products.ts         ← 16 mock products với variants
│   ├── categories.ts       ← category tree
│   └── home.ts             ← home sections data
├── queries.ts              ← Layer 2a: Server Component fetchers
│   │                          getProductBySlug(), getHomeData(), getCategoryBySlug()
│   │                          Gọi trực tiếp từ data/ hoặc http — KHÔNG dùng hooks
├── hooks/                  ← Layer 2b: Client Component hooks (wrap queries + state)
│   ├── useHomeData.ts      ← bestSellers, newArrivals, flashSale, categories
│   ├── useProducts.ts      ← filter + sort + paginate
│   ├── useSearch.ts        ← search by name (debounced)
│   ├── useCategories.ts    ← all categories
│   └── useHomeFlashSaleCountdown.ts  ← countdown timer cho flash sale
├── schemas.ts              ← Zod schemas cho forms trong (shop)
├── types/                  ← Types riêng cho shop
│   ├── product.ts          ← ProductVariant, Product (shop-specific)
│   ├── category.ts         ← HomeCategory, Category
│   └── home.ts             ← HomeSection types
├── query-keys.ts           ← React Query keys cho shop
└── actions.ts              ← Server Actions (form submissions)
```

**Rule quan trọng:** Components không được import trực tiếp từ `data/`. Luôn qua `queries.ts` (Server) hoặc `hooks/` (Client).

### Components

```
(shop)/_components/
├── home/                   ← Sections cho home page
│   ├── SectionHero.tsx
│   ├── SectionBestSellers.tsx
│   ├── SectionNewArrivals.tsx
│   ├── SectionFlashSale.tsx
│   ├── SectionFeaturedCategories.tsx
│   ├── SectionNewsletter.tsx
│   ├── SectionTestimonials.tsx
│   └── SectionWhyChooseUs.tsx
├── products/               ← Product listing + PDP components
│   ├── ProductGrid.tsx     ← Grid layout — dùng cả ở PLP và search
│   ├── ProductsClient.tsx  ← Client wrapper cho PLP (filter state)
│   ├── VariantSelector.tsx ← Size/color buttons, disabled khi stock=0
│   ├── AddToCartSection.tsx
│   ├── ProductGallery.tsx
│   ├── ProductDetailTabs.tsx
│   └── Pagination.tsx
├── categories/
│   ├── CategoryClient.tsx  ← Client wrapper cho category page
│   └── FilterSidebar.tsx   ← Price/brand/size filters
├── checkout/
│   ├── CheckoutForm.tsx    ← Form nhập địa chỉ + COD submission
│   └── OrderSummary.tsx
├── HeroBanner.tsx          ← Standalone banner (dùng ngoài home sections)
├── FeaturedProducts.tsx
├── FlashSaleBanner.tsx
├── CategoryGrid.tsx
├── OrderStatusBadge.tsx    ← Badge trạng thái đơn hàng
└── ShopLoadingShell.tsx    ← Loading skeleton cho shop layout
```

---

## 3. Route Group: `(auth)` — Authentication

| Route                     | File                                     |
| ------------------------- | ---------------------------------------- |
| `/login`                  | `(auth)/login/page.tsx`                  |
| `/register`               | `(auth)/register/page.tsx`               |
| `/forgot-password`        | `(auth)/forgot-password/page.tsx`        |
| `/reset-password/[token]` | `(auth)/reset-password/[token]/page.tsx` |

```
(auth)/
├── _lib/
│   ├── actions.ts     ← Server Actions: login, register, forgotPassword, resetPassword
│   └── schemas.ts     ← Zod schemas cho auth forms
└── _components/
    ├── LoginForm.tsx
    ├── RegisterForm.tsx
    ├── ForgotPasswordForm.tsx
    └── ResetPasswordForm.tsx
```

---

## 4. Shared Layer — `src/shared/`

### 4.1 Components

```
shared/components/
├── base/           ← Shadcn/Radix primitive wrappers
│   ├── Button.tsx, Input.tsx, Form.tsx, Label.tsx
│   ├── Dialog.tsx, Sheet.tsx, Popover.tsx, DropdownMenu.tsx
│   ├── Card.tsx, Badge.tsx, Avatar.tsx, Alert.tsx
│   ├── Table.tsx, Select.tsx, Checkbox.tsx, Textarea.tsx
│   ├── ScrollArea.tsx, Skeleton.tsx, Tooltip.tsx, Separator.tsx
│   ├── Command.tsx, RichTextEditor.tsx
│   └── accordion, aspect-ratio, breadcrumb, progress, radio-group, slider, switch, tabs
│
├── commerce/       ← E-commerce specific shared components
│   ├── ProductCard.tsx     ← Card sản phẩm — dùng ở PLP, search, home sections
│   ├── CategoryCard.tsx    ← Card danh mục
│   └── CartDrawer.tsx      ← Slide-out cart (Sheet)
│
├── common/         ← Generic UI patterns
│   ├── EmptyState.tsx      ← Khi list rỗng
│   ├── ErrorState.tsx      ← Khi fetch lỗi
│   ├── LoadingSpinner.tsx
│   ├── PageLoader.tsx
│   ├── ConfirmDialog.tsx   ← Confirm trước khi xóa/hủy
│   ├── PriceDisplay.tsx    ← Format giá VND, gạch giá gốc
│   ├── QuantitySelector.tsx
│   ├── SearchInput.tsx
│   ├── SortSelect.tsx
│   ├── PaginationNav.tsx
│   ├── OrderStatusBadge.tsx
│   └── PasswordInput.tsx   ← Input có toggle show/hide
│
├── layouts/        ← Layout components
│   ├── header.tsx          ← Top navigation
│   ├── footer.tsx
│   ├── DesktopMegaMenu.tsx ← Mega menu categories (desktop)
│   └── MobileNav.tsx       ← Mobile navigation drawer
│
├── marketing/      ← Promotion + content components
│   ├── CountdownTimer.tsx
│   ├── NewsletterForm.tsx
│   ├── SectionHeading.tsx  ← Section title + subtitle pattern
│   ├── TestimonialCard.tsx
│   └── TrustBadgeList.tsx
│
└── skeletons/      ← Loading skeletons
    ├── ProductCardSkeleton.tsx
    └── ProductGridSkeleton.tsx
```

### 4.2 Hooks (`shared/hooks/`)

| Hook                | Dùng khi nào                                                   |
| ------------------- | -------------------------------------------------------------- |
| `useAuth`           | Lấy current user, auth state, login/logout actions             |
| `useCart`           | Thao tác giỏ hàng (add/remove/update) — wrapper cho cart-store |
| `useDebounce`       | Debounce search input, filter changes                          |
| `useLocalStorage`   | Persist UI state (không phải domain state)                     |
| `useMediaQuery`     | Responsive breakpoints trong JS                                |
| `usePagination`     | Tính offset/page cho list                                      |
| `useProductFilters` | Quản lý filter state cho product listing                       |
| `useToast`          | Show toast notifications                                       |

### 4.3 Lib (`shared/lib/`)

| Path                    | Mục đích                                                                   |
| ----------------------- | -------------------------------------------------------------------------- |
| `http/methods.ts`       | `http` object — entry point duy nhất cho HTTP calls                        |
| `http/client.ts`        | Axios instance + interceptors                                              |
| `http/api-client.ts`    | Low-level `apiGet/apiPost/...` functions                                   |
| `http/api-auth.ts`      | Token refresh logic                                                        |
| `http/api-types.ts`     | `ApiResponse<T>` wrapper type                                              |
| `http/zod-helpers.ts`   | Parse API response qua Zod schema                                          |
| `errors/api-error.ts`   | `ApiError` class với `isUnauthorized()`, `isForbidden()`, `isValidation()` |
| `errors/error-codes.ts` | Error code constants                                                       |
| `guards/auth-guard.tsx` | `<AuthGuard>` Client Component — redirect về login nếu chưa auth           |
| `query-client.ts`       | React Query config (retry policy, stale time)                              |
| `env.ts`                | Zod-validated env vars                                                     |
| `utils.ts`              | `formatCurrency()`, `formatDate()`, `slugify()`                            |
| `seo.ts`                | `buildMetadata()` helpers                                                  |
| `cloudinary.ts`         | Image URL builder (resize, format)                                         |
| `notification.ts`       | Toast wrapper (Sonner)                                                     |
| `monitoring/sentry.ts`  | Sentry init + error capture                                                |
| `payment/vnpay.ts`      | VNPay integration (Post-MVP)                                               |
| `payment/momo.ts`       | Momo integration (Post-MVP)                                                |
| `payment/zalopay.ts`    | ZaloPay integration (Post-MVP)                                             |

### 4.4 Stores (`shared/stores/`)

| Store           | Persist                              | State chính                                                                       |
| --------------- | ------------------------------------ | --------------------------------------------------------------------------------- |
| `auth-store.ts` | `user` (không persist `accessToken`) | `user`, `accessToken`, `setUser`, `setAccessToken`, `clearAuth`                   |
| `cart-store.ts` | `items`, `total`, `itemCount`        | `items: CartItem[]`, `addToCart`, `removeCartItem`, `updateQuantity`, `clearCart` |

`CartItem` gồm: `variantId`, `productId`, `name`, `image`, `price`, `quantity`, `variantName?`

### 4.5 Types (`shared/types/`)

| File          | Types chính                               |
| ------------- | ----------------------------------------- |
| `product.ts`  | `Product`, `ProductVariant`, `BadgeValue` |
| `category.ts` | `Category`                                |
| `order.ts`    | `Order`, `OrderLine`, `OrderStatus`       |
| `checkout.ts` | `CheckoutPayload`, `ShippingAddress`      |
| `user.ts`     | `User`                                    |
| `address.ts`  | `Address`                                 |
| `payment.ts`  | `PaymentMethod`                           |
| `filter.ts`   | `ProductFilters`, `SortOption`            |
| `api.ts`      | `ApiResponse<T>`, `PaginatedResponse<T>`  |

### 4.6 Constants (`shared/constants/`)

| File                | Nội dung                                               |
| ------------------- | ------------------------------------------------------ |
| `api-endpoints.ts`  | API path constants, functions cho parameterized routes |
| `routes.ts`         | FE route paths                                         |
| `query-keys.ts`     | React Query key factory                                |
| `nav-categories.ts` | Navigation category tree                               |
| `app-config.ts`     | App-level config (page size, thresholds)               |
| `payment-config.ts` | Payment method metadata                                |

---

## 5. Middleware (`src/middleware.ts`)

Xử lý 2 concerns theo thứ tự:

1. **Locale routing** — next-intl, default locale `vi`
2. **Admin auth guard** — kiểm tra cookie `access_token` cho routes `/admin/**`

Không thêm logic nào khác vào đây.

---

## 6. Testing

```
src/__tests__/
├── helpers/
│   ├── render.tsx       ← Custom render với providers
│   └── mock-handlers.ts ← MSW handlers cho API mock
└── setup.ts             ← Vitest global setup

shared/hooks/__tests__/  ← Unit tests cho shared hooks
shared/lib/__tests__/    ← Unit tests cho lib utilities
```

Test command nhanh cho một file: `npx vitest run src/path/to/file.test.ts`

Coverage threshold **70%** cho `shared/lib/**` và `shared/hooks/**`.

---

## 7. Lookup nhanh — "Cái X ở đâu?"

| Tìm gì                        | Ở đâu                                             |
| ----------------------------- | ------------------------------------------------- |
| Global auth state             | `@/shared/stores/auth-store`                      |
| Global cart state             | `@/shared/stores/cart-store`                      |
| Gọi API                       | `@/shared/lib/http/methods` (`http.get/post/...`) |
| API endpoint strings          | `@/shared/constants/api-endpoints`                |
| Format tiền VND               | `@/shared/lib/utils` → `formatCurrency()`         |
| Zod types (Product, Order...) | `@/shared/types/`                                 |
| Product mock data             | `@/app/[locale]/(shop)/_lib/data/products`        |
| Server Component data fetcher | `@/app/[locale]/(shop)/_lib/queries`              |
| Client hooks (shop)           | `@/app/[locale]/(shop)/_lib/hooks/`               |
| Shared client hooks           | `@/shared/hooks/`                                 |
| Product card UI               | `@/shared/components/commerce/ProductCard`        |
| Cart drawer UI                | `@/shared/components/commerce/CartDrawer`         |
| Route paths                   | `@/shared/constants/routes`                       |
| Env variables                 | `@/shared/lib/env`                                |
| Error handling                | `@/shared/lib/errors/api-error`                   |
| SEO metadata                  | `@/shared/lib/seo`                                |
| Auth guard (client)           | `@/shared/lib/guards/auth-guard`                  |
| i18n config                   | `@/i18n/request`                                  |
| Translation files             | `src/messages/{vi,en}.json`                       |
