# Kế hoạch `src/shared/` — MVP E-Commerce

> Phân tích dựa trên [mvp-plan.md](./mvp-plan.md) và [skills-mapping.md](./skills-mapping.md).
> Mục tiêu: xác định toàn bộ những gì `shared/` phải cung cấp để các feature module
> (auth, catalog, cart, checkout, orders) build được mà không cần tự tạo lại.

---

## Trạng thái hiện tại (tóm tắt)

| Nhóm                    | Đã có                                                                 | Thiếu cốt lõi                                                           |
| ----------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `components/ui/` base   | 21 shadcn primitives (xem bảng bên dưới)                              | Accordion, RadioGroup, Tabs, Switch, Sonner — **blockers**              |
| `components/ui/` custom | Header, Footer, 3 Skeletons                                           | ProductCard, CartDrawer, QuantitySelector, EmptyState, ErrorBoundary, … |
| `hooks/`                | useDebounce, useLocalStorage, useMediaQuery                           | useAuth, useCart, usePagination, useProductFilters, useToast            |
| `lib/`                  | HTTP client, interceptors, query-client, ApiError, Sentry, auth-guard | cloudinary.ts, notification.ts, seo.ts                                  |
| `stores/`               | auth-store, cart-store                                                | — (đủ dùng)                                                             |
| `types/`                | api, product, user, order, payment                                    | Category, ShippingAddress, CheckoutForm schema                          |
| `constants/`            | api-endpoints, app-config, payment-config                             | ROUTES, QUERY_KEYS                                                      |

---

## 0. Shadcn Primitives (Base Components)

> Đây là lớp nền — cần install trước khi build bất kỳ component nào ở mục 1.
> Chạy: `npx shadcn@latest add <tên>` cho từng component còn thiếu.

### Đã có (21 components)

| Component      | Dùng ở                                     |
| -------------- | ------------------------------------------ |
| `Alert`        | Form errors, thông báo hệ thống            |
| `Avatar`       | User menu, order detail                    |
| `Badge`        | OrderStatusBadge, tag sản phẩm             |
| `Button`       | Toàn app                                   |
| `Card`         | ProductCard, OrderCard, stat cards         |
| `Checkbox`     | Filter in-stock, terms agreement           |
| `Command`      | Search combobox                            |
| `Dialog`       | ConfirmDialog, modal xác nhận              |
| `DropdownMenu` | User menu header, action menu admin        |
| `Form`         | Tất cả forms (react-hook-form integration) |
| `Input`        | Tất cả text inputs                         |
| `Label`        | Tất cả form labels                         |
| `Popover`      | Filter popover, tooltip nâng cao           |
| `ScrollArea`   | CartDrawer, danh sách dài                  |
| `Select`       | SortSelect, variant select                 |
| `Separator`    | Phân cách sections                         |
| `Sheet`        | CartDrawer (slide-in panel)                |
| `Skeleton`     | Loading states                             |
| `Table`        | Admin order list, admin product list       |
| `Textarea`     | Ghi chú đơn hàng, địa chỉ chi tiết         |
| `Tooltip`      | Icon buttons, truncated text               |

### Cần install thêm

| Component     | Install command                      | Cần ở đâu                                                             | Priority     |
| ------------- | ------------------------------------ | --------------------------------------------------------------------- | ------------ |
| `Accordion`   | `npx shadcn@latest add accordion`    | FilterSidebar (nhóm category / price / in-stock), FAQ                 | **Must**     |
| `RadioGroup`  | `npx shadcn@latest add radio-group`  | Checkout — chọn phương thức thanh toán (COD), chọn variant size/color | **Must**     |
| `Tabs`        | `npx shadcn@latest add tabs`         | Orders page — lọc theo trạng thái đơn; Admin dashboard tabs           | **Must**     |
| `Switch`      | `npx shadcn@latest add switch`       | FilterSidebar — toggle "Còn hàng"                                     | **Must**     |
| `Sonner`      | `npx shadcn@latest add sonner`       | Toast notifications toàn app — thêm giỏ, lỗi API, đặt hàng xong       | **Must**     |
| `Slider`      | `npx shadcn@latest add slider`       | FilterSidebar — kéo khoảng giá min/max                                | Nice-to-have |
| `Breadcrumb`  | `npx shadcn@latest add breadcrumb`   | Catalog → Category → Product detail                                   | Nice-to-have |
| `AspectRatio` | `npx shadcn@latest add aspect-ratio` | ProductCard, ImageGallery — giữ tỉ lệ ảnh nhất quán                   | Nice-to-have |
| `Progress`    | `npx shadcn@latest add progress`     | Checkout stepper: Địa chỉ → Thanh toán → Xác nhận                     | Nice-to-have |

> **Lưu ý Sonner:** Sau khi install, cần thêm `<Toaster />` vào root layout (`src/app/[locale]/layout.tsx`).
> `Accordion`, `RadioGroup`, `Tabs`, `Switch` là **blockers** — FilterSidebar và Checkout form không build được nếu thiếu.

---

## 1. Components UI (Custom)

> Quy tắc đặt trong `shared/`: component dùng ở ≥ 2 feature khác nhau, không chứa business logic riêng của 1 feature.
> Tất cả component bên dưới đều build trên shadcn primitives ở mục 0.

| Component             | Mô tả                                                                | Feature dùng              | Priority     |
| --------------------- | -------------------------------------------------------------------- | ------------------------- | ------------ |
| `ProductCard`         | Card sản phẩm: ảnh, tên, giá, badge, nút thêm giỏ                    | catalog, homepage         | **Must**     |
| `ProductGrid`         | Responsive grid wrapper cho danh sách ProductCard                    | catalog, homepage         | **Must**     |
| `QuantitySelector`    | Nút `−` / số / `+` với min=1, max=stock                              | cart, product detail      | **Must**     |
| `CartDrawer`          | Sheet slide-in từ phải, hiển thị cart items + tổng tiền              | cart (header icon)        | **Must**     |
| `CartItem`            | Hàng item trong CartDrawer: ảnh, tên, variant, quantity, remove      | cart                      | **Must**     |
| `PaginationNav`       | Previous / số trang / Next, nhận `page`, `totalPages`                | catalog, orders           | **Must**     |
| `OrderStatusBadge`    | Badge màu theo `OrderStatus` (pending/shipping/done/cancelled)       | orders, admin             | **Must**     |
| `EmptyState`          | Icon + tiêu đề + mô tả khi list rỗng (giỏ hàng trống, không có đơn)  | cart, orders, catalog     | **Must**     |
| `ErrorBoundary`       | React error boundary — hiển thị fallback UI thay vì crash toàn trang | checkout, orders, catalog | **Must**     |
| `LoadingSpinner`      | Spinner inline dùng trong button/page khi đang fetch                 | toàn app                  | **Must**     |
| `ConfirmDialog`       | Dialog xác nhận hành động (xoá sản phẩm, huỷ đơn)                    | cart, orders, admin       | **Must**     |
| `PriceDisplay`        | Hiển thị giá VND, giá gốc gạch chân nếu có discount                  | catalog, cart, checkout   | **Must**     |
| `SearchInput`         | Input + icon search + debounce built-in (dùng useDebounce nội bộ)    | header, catalog           | **Must**     |
| `PasswordInput`       | Input type password với toggle show/hide                             | auth (login, register)    | **Must**     |
| `ProductImageGallery` | Main image + thumbnail strip, hỗ trợ click switch                    | product detail            | **Must**     |
| `SortSelect`          | Dropdown sắp xếp: mới nhất, giá thấp→cao, …                          | catalog                   | **Must**     |
| `AddressForm`         | Form fields địa chỉ giao hàng có validation messages                 | checkout, profile         | **Must**     |
| `OrderCard`           | Card đơn hàng: mã đơn, ngày, tổng tiền, trạng thái, link chi tiết    | orders list               | **Must**     |
| `FilterSidebar`       | Accordion: category, price range, in-stock toggle                    | catalog                   | Nice-to-have |
| `RatingStars`         | Hiển thị số sao (read-only ở MVP, interactive ở Phase 2)             | product detail            | Nice-to-have |
| `OrderTimeline`       | Dãy bước trạng thái đơn hàng theo thời gian                          | order detail              | Nice-to-have |
| `BreadcrumbNav`       | Breadcrumb tự động từ pathname hoặc props                            | catalog, product detail   | Nice-to-have |
| `ImageWithFallback`   | `next/image` wrapper với ảnh fallback khi lỗi                        | ProductCard, Gallery      | Nice-to-have |

---

## 2. Hooks

| Hook                      | Signature                                                  | Mô tả                                                     | Feature dùng                        | Priority     |
| ------------------------- | ---------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------- | ------------ |
| `useAuth`                 | `() → { user, isLoggedIn, login, logout, … }`              | Wrapper đọc/ghi `auth-store`, bao gồm helper `isLoggedIn` | auth, header, checkout, orders      | **Must**     |
| `useCart`                 | `() → { items, total, count, add, remove, update, clear }` | Wrapper `cart-store` với computed values                  | cart, header, checkout              | **Must**     |
| `usePagination`           | `(total, pageSize) → { page, setPage, totalPages, … }`     | State quản lý phân trang, sync với URL search params      | catalog, orders                     | **Must**     |
| `useProductFilters`       | `() → { filters, setFilter, resetFilters, toQueryString }` | State + serialization bộ lọc sản phẩm                     | catalog                             | **Must**     |
| `useToast`                | `() → { toast, dismiss }`                                  | Gọi toast notification (wrap Sonner/radix toast)          | toàn app (form submit, API error)   | **Must**     |
| `useIntersectionObserver` | `(ref, options) → isIntersecting`                          | Lazy load ảnh, trigger load-more                          | catalog (infinite scroll tương lai) | Nice-to-have |
| `useScrollDirection`      | `() → 'up' \| 'down'`                                      | Ẩn/hiện header khi scroll trên mobile                     | layout/Header                       | Nice-to-have |

---

## 3. Utils / Functions

> Đặt trong `shared/lib/utils.ts` (bổ sung) hoặc file utils riêng theo nhóm.

| Hàm                        | Signature                                        | Mô tả                                                                | Dùng ở                    | Priority     |
| -------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- | ------------------------- | ------------ | ------------ |
| `buildQueryString`         | `(params: Record<string, unknown>) → string`     | Chuyển object filter thành query string, bỏ qua giá trị falsy        | catalog, orders           | **Must**     |
| `parseSearchParams`        | `(searchParams: URLSearchParams) → FilterParams` | Parse URL params thành object filter đã validate                     | catalog                   | **Must**     |
| `getCloudinaryUrl`         | `(publicId, options?) → string`                  | Tạo URL Cloudinary với transform (resize, format=auto, quality=auto) | ProductCard, Gallery      | **Must**     |
| `calculateDiscountPercent` | `(original, discounted) → number`                | Tính % giảm giá để hiển thị badge                                    | PriceDisplay, ProductCard | **Must**     |
| `truncateText`             | `(text, maxLen) → string`                        | Cắt ngắn mô tả sản phẩm với dấu "…"                                  | ProductCard               | **Must**     |
| `getOrderStatusLabel`      | `(status: OrderStatus) → string`                 | Tra cứu label tiếng Việt từ enum (dùng map trong constants)          | OrderStatusBadge          | **Must**     |
| `getOrderStatusColor`      | `(status: OrderStatus) → string`                 | Trả về class Tailwind màu badge theo trạng thái                      | OrderStatusBadge          | **Must**     |
| `validateVietnamesePhone`  | `(phone: string) → boolean`                      | Kiểm tra số điện thoại VN (096/097/…)                                | AddressForm Zod schema    | **Must**     |
| `generateMetaTitle`        | `(title, siteName?) → string`                    | Format `"Tên SP                                                      | Site Name"` cho SEO       | page layouts | Nice-to-have |
| `formatWeight`             | `(grams: number) → string`                       | Hiển thị trọng lượng (shipping tương lai)                            | product detail            | Optional     |

---

## 4. Lib (modules độc lập)

| File                  | Mô tả                                                                                       | Export chính                                  | Priority     |
| --------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------ |
| `lib/notification.ts` | Setup Sonner toast + helper functions (`notifySuccess`, `notifyError`, `notifyInfo`)        | `notify` object                               | **Must**     |
| `lib/cloudinary.ts`   | Cloudinary URL builder — không cần SDK, chỉ build URL theo convention                       | `buildImageUrl(publicId, opts)`               | **Must**     |
| `lib/seo.ts`          | Helper tạo `Metadata` object cho Next.js `generateMetadata()`: title, description, OG image | `buildMetadata(opts)`                         | **Must**     |
| `lib/format.ts`       | Tách riêng format functions ra khỏi `utils.ts` — VND, date, phone, số lượng                 | `formatCurrency`, `formatDate`, `formatPhone` | Nice-to-have |

> `lib/payment/vnpay.ts`, `momo.ts`, `zalopay.ts` — đã có file rỗng, **không implement ở MVP**, giữ nguyên.

---

## 5. Types & Zod Schemas

> Đặt trong `shared/types/`. Zod schema → export thêm `z.infer<>` type tương ứng.

| File / Schema       | Zod Schema                                                                | TypeScript Type    | Dùng ở                      | Priority |
| ------------------- | ------------------------------------------------------------------------- | ------------------ | --------------------------- | -------- |
| `types/category.ts` | `CategorySchema`                                                          | `Category`         | catalog, filter, breadcrumb | **Must** |
| `types/address.ts`  | `ShippingAddressSchema` (name, phone, province, district, ward, detail)   | `ShippingAddress`  | checkout, profile           | **Must** |
| `types/checkout.ts` | `CheckoutFormSchema` (address + payment_method=COD)                       | `CheckoutFormData` | checkout form               | **Must** |
| `types/filter.ts`   | `ProductFilterSchema` (category, minPrice, maxPrice, inStock, sort, page) | `ProductFilter`    | catalog                     | **Must** |
| `types/product.ts`  | Bổ sung `ProductVariantSchema` nếu chưa có (size, color, price, stock)    | `ProductVariant`   | product detail, cart        | **Must** |
| `types/cart.ts`     | `CartItemSchema` (productId, variantId, name, price, quantity, image)     | `CartItem`         | cart-store, CartDrawer      | **Must** |

---

## 6. Constants & Enums

| File                      | Tên hằng số / enum               | Mô tả                                                                                                 | Dùng ở                          | Priority |
| ------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------- | -------- |
| `constants/routes.ts`     | `ROUTES` object                  | Tất cả app routes: `ROUTES.CATALOG`, `ROUTES.CHECKOUT`, `ROUTES.ORDERS`, … Tránh hardcode string path | link components, redirect logic | **Must** |
| `constants/query-keys.ts` | `QUERY_KEYS` object              | React Query keys: `QUERY_KEYS.PRODUCTS`, `QUERY_KEYS.ORDER(id)`, … Tránh typo, dễ invalidate          | tất cả TanStack Query hooks     | **Must** |
| `constants/app-config.ts` | Bổ sung `ORDER_STATUS_COLOR_MAP` | Map `OrderStatus → Tailwind class`                                                                    | OrderStatusBadge                | **Must** |
| `constants/app-config.ts` | Bổ sung `SORT_OPTIONS`           | Array options cho SortSelect                                                                          | catalog                         | **Must** |
| `types/order.ts`          | `OrderStatus` enum               | `PENDING \| CONFIRMED \| SHIPPING \| DELIVERED \| CANCELLED` — đã có, verify đủ values                | orders, badge                   | **Must** |
| `types/order.ts`          | `PaymentMethod` enum             | `COD \| VNPAY \| MOMO` — đã có, giữ nguyên                                                            | checkout, order                 | **Must** |

---

## Sơ đồ phụ thuộc giữa các nhóm

```
constants/routes        ←── toàn app (navigation)
constants/query-keys    ←── hooks TanStack Query
types/* (Zod schemas)   ←── forms, API calls, stores
lib/cloudinary          ←── components (ProductCard, Gallery)
lib/notification        ←── hooks/useToast ← components
lib/seo                 ←── page layouts (generateMetadata)
hooks/useAuth           ←── auth-store
hooks/useCart           ←── cart-store
hooks/usePagination     ←── catalog, orders pages
hooks/useProductFilters ←── catalog page
components/ui/*         ←── feature pages
```

---

## Thứ tự build đề xuất (theo tuần MVP)

### Tuần 2 — Foundation (song song với setup FE)

1. `constants/routes.ts` + `constants/query-keys.ts`
2. `types/category.ts`, `types/cart.ts`, `types/filter.ts`
3. `lib/notification.ts` (Sonner setup)
4. `lib/cloudinary.ts`
5. `hooks/useAuth`, `hooks/useCart`
6. Components: `QuantitySelector`, `PriceDisplay`, `ProductCard`, `ProductGrid`, `SearchInput`, `LoadingSpinner`, `EmptyState`

### Tuần 2–3 — Cart & Checkout

7. `types/address.ts`, `types/checkout.ts`
8. `utils/validateVietnamesePhone`, `utils/buildQueryString`
9. Components: `CartDrawer`, `CartItem`, `AddressForm`, `PasswordInput`, `ConfirmDialog`
10. `hooks/usePagination`, `hooks/useProductFilters`

### Tuần 3–4 — Orders & SEO

11. `lib/seo.ts`
12. `constants/app-config.ts` bổ sung ORDER_STATUS_COLOR_MAP
13. Components: `OrderStatusBadge`, `OrderCard`, `OrderTimeline`, `ErrorBoundary`, `PaginationNav`, `FilterSidebar`, `SortSelect`
14. `hooks/useToast` (nếu tách riêng)

---

## Không làm ở MVP (Phase 2)

- `lib/payment/vnpay.ts`, `momo.ts`, `zalopay.ts` — implement khi thêm cổng thanh toán
- `RatingStars` interactive mode — sau khi có review feature
- `useIntersectionObserver` + infinite scroll — sau khi catalog ổn định
- `lib/format.ts` tách riêng — chỉ cần khi `utils.ts` > 200 dòng
