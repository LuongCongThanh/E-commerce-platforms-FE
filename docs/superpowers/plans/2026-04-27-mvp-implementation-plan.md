# MVP Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện toàn bộ frontend MVP để end-to-end flow "browse → cart → checkout COD → order confirmation" chạy được trên production.

**Architecture:** Module-driven App Router — mỗi route group `(shop)`, `(auth)`, `(admin)` là một module độc lập. Shared layer (`src/shared/`) cung cấp http client, stores, types, components dùng chung. Server state qua TanStack Query, client state qua Zustand.

**Tech Stack:** Next.js 15 App Router · TypeScript strict · TanStack Query v5 · Zustand · React Hook Form + Zod · Tailwind CSS v4 · Shadcn/Radix · next-intl (vi default)

---

## Trạng thái hiện tại (2026-04-27)

> Dựa trên kiểm tra thực tế codebase. ✅ = đã có scaffold/hoàn chỉnh · 🔶 = có file nhưng cần hoàn thiện · ❌ = chưa có

| Route / Artifact                   | Trạng thái | Ghi chú                              |
| ---------------------------------- | ---------- | ------------------------------------ |
| `(shop)/home/page.tsx`             | 🔶         | Sections UI xong, cần nối API thật   |
| `(shop)/products/[slug]/page.tsx`  | 🔶         | File tồn tại, cần variant/cart logic |
| `(shop)/checkout/page.tsx`         | 🔶         | Scaffold, cần form + API             |
| `(shop)/checkout/success/page.tsx` | 🔶         | Scaffold, cần order data             |
| `(shop)/orders/page.tsx`           | 🔶         | Scaffold, cần API                    |
| `(shop)/orders/[id]/page.tsx`      | 🔶         | Scaffold, cần API                    |
| `(shop)/profile/page.tsx`          | 🔶         | Scaffold, cần form + API             |
| `(shop)/cart/`                     | ❌         | Chưa có route, chỉ có store          |
| `(shop)/search/`                   | ❌         | Chưa có route                        |
| `(shop)/categories/[slug]/`        | ❌         | Chưa có route                        |
| `(auth)/login/page.tsx`            | ❌         | Thư mục có, page chưa có             |
| `(auth)/register/page.tsx`         | ❌         | Thư mục có, page chưa có             |
| `(auth)/forgot-password/page.tsx`  | ❌         | Thư mục có, page chưa có             |
| `(auth)/reset-password/[token]/`   | ❌         | Chưa có                              |
| `(shop)/checkout/failed/`          | ❌         | Chưa có                              |
| `(admin)/products/`                | 🔶         | Thư mục + `_lib/` có, page cần xây   |
| `(admin)/orders/`                  | 🔶         | Thư mục + `_lib/` có, page cần xây   |
| `(admin)/dashboard/`               | 🔶         | Thư mục có, page cần xây             |
| `shared/stores/auth-store.ts`      | ✅         | Hoàn chỉnh                           |
| `shared/stores/cart-store.ts`      | ✅         | Hoàn chỉnh                           |
| `shared/lib/http/`                 | ✅         | Hoàn chỉnh                           |
| `shared/types/`                    | 🔶         | Cần thêm types cho order/checkout    |

---

## Priority Map

```
P0 (Foundation)   → ĐÃ XONG — kiến trúc, stores, http client
P1 (Core build)   → ĐANG LÀM — 6 nhóm tính năng bên dưới
P2 (Hardening)    → SAU KHI P1 PASS GATE
P3 (Post-MVP)     → KHÔNG LÀM trong sprint này
```

---

## P1 — Core MVP Build

### Sequencing Rule

```
[P1-02 Auth] → [P1-01 Storefront] → [P1-03 Cart] → [P1-04 Checkout] → [P1-05 Order] → [P1-06 Admin]
```

Auth phải xong trước Checkout. Cart xong trước Checkout.

---

### Task 1: Auth Core (P1-02)

> Gate: Không bắt đầu Task 4 (Checkout) nếu chưa xong Auth.

**Files:**

- Create: `src/app/[locale]/(auth)/login/page.tsx`
- Create: `src/app/[locale]/(auth)/register/page.tsx`
- Create: `src/app/[locale]/(auth)/forgot-password/page.tsx`
- Create: `src/app/[locale]/(auth)/reset-password/[token]/page.tsx`
- Create: `src/app/[locale]/(auth)/_components/LoginForm.tsx`
- Create: `src/app/[locale]/(auth)/_components/RegisterForm.tsx`
- Create: `src/app/[locale]/(auth)/_components/ForgotPasswordForm.tsx`
- Create: `src/app/[locale]/(auth)/_components/ResetPasswordForm.tsx`
- Create: `src/app/[locale]/(auth)/_lib/actions.ts` (server actions hoặc mutations)
- Create: `src/app/[locale]/(auth)/_lib/schemas.ts` (Zod schemas)
- Modify: `src/middleware.ts` (đảm bảo guard `/profile`, `/checkout`, `/orders` redirect login)

**Checklist theo trang:**

| Trang                     | Task                                                                           | Done? |
| ------------------------- | ------------------------------------------------------------------------------ | ----- |
| `/login`                  | Tạo page.tsx + import LoginForm                                                | - [ ] |
| `/login`                  | LoginForm: fields email + password, Zod validation                             | - [ ] |
| `/login`                  | LoginForm: gọi auth API, lưu token vào auth-store                              | - [ ] |
| `/login`                  | LoginForm: hiển thị lỗi inline từ API ("Sai mật khẩu")                         | - [ ] |
| `/login`                  | LoginForm: redirect về `returnUrl` hoặc trang chủ sau login                    | - [ ] |
| `/register`               | Tạo page.tsx + import RegisterForm                                             | - [ ] |
| `/register`               | RegisterForm: fields email, password, confirm password, họ tên                 | - [ ] |
| `/register`               | RegisterForm: Zod validate (email format, password match, min length)          | - [ ] |
| `/register`               | RegisterForm: gọi API register, tự động login sau đăng ký thành công           | - [ ] |
| `/register`               | RegisterForm: hiển thị lỗi "Email đã tồn tại" từ API                           | - [ ] |
| `/forgot-password`        | Tạo page.tsx + ForgotPasswordForm                                              | - [ ] |
| `/forgot-password`        | Form nhập email → gọi API → hiển thị "Kiểm tra email"                          | - [ ] |
| `/reset-password/[token]` | Tạo page.tsx + ResetPasswordForm                                               | - [ ] |
| `/reset-password/[token]` | Form mật khẩu mới + xác nhận → gọi API với token                               | - [ ] |
| Middleware                | Guard `/profile/*`, `/checkout`, `/orders/*` → redirect `/login?returnUrl=...` | - [ ] |
| Middleware                | Nếu đã login mà vào `/login` hoặc `/register` → redirect trang chủ             | - [ ] |

**Acceptance Criteria:**

- [ ] Đăng ký email mới → nhận token → redirect trang chủ
- [ ] Đăng ký email đã tồn tại → lỗi inline "Email đã được sử dụng"
- [ ] Đăng nhập đúng → redirect về trang trước đó (returnUrl)
- [ ] Đăng nhập sai → lỗi inline, không redirect
- [ ] Quên mật khẩu → nhập email → thông báo "Kiểm tra email"
- [ ] Token hết hạn → auto refresh 1 lần → nếu fail → redirect `/login`

---

### Task 2: Storefront Core (P1-01)

**Files:**

- Modify: `src/app/[locale]/(shop)/home/page.tsx` (nối API thật)
- Modify: `src/app/[locale]/(shop)/_components/home/SectionHero.tsx`
- Modify: `src/app/[locale]/(shop)/_components/home/SectionFeaturedCategories.tsx`
- Modify: `src/app/[locale]/(shop)/_components/home/SectionBestSellers.tsx`
- Create: `src/app/[locale]/(shop)/categories/[slug]/page.tsx`
- Create: `src/app/[locale]/(shop)/categories/[slug]/_components/ProductGrid.tsx`
- Create: `src/app/[locale]/(shop)/categories/[slug]/_components/FilterSidebar.tsx`
- Create: `src/app/[locale]/(shop)/search/page.tsx`
- Create: `src/app/[locale]/(shop)/search/_components/SearchResults.tsx`
- Modify: `src/app/[locale]/(shop)/products/[slug]/page.tsx` (variant selection, add-to-cart)
- Create: `src/app/[locale]/(shop)/products/[slug]/_components/ProductImages.tsx`
- Create: `src/app/[locale]/(shop)/products/[slug]/_components/VariantSelector.tsx`
- Create: `src/app/[locale]/(shop)/products/[slug]/_components/AddToCartButton.tsx`

**Checklist theo trang:**

| Trang                | Task                                                                          | Done? |
| -------------------- | ----------------------------------------------------------------------------- | ----- |
| `/` (home)           | Nối SectionHero với API hoặc CMS data thật                                    | - [ ] |
| `/` (home)           | SectionFeaturedCategories → `GET /api/categories/?featured=true`              | - [ ] |
| `/` (home)           | SectionBestSellers → `GET /api/products/?is_featured=true`                    | - [ ] |
| `/` (home)           | SectionNewArrivals → `GET /api/products/?ordering=-created_at&limit=8`        | - [ ] |
| `/` (home)           | SectionFlashSale → `GET /api/products/?sale=true` (hoặc mock nếu chưa có API) | - [ ] |
| `/categories/[slug]` | Tạo page.tsx với SSR: fetch category info + products                          | - [ ] |
| `/categories/[slug]` | ProductGrid: 2 cột mobile, 3-4 cột desktop                                    | - [ ] |
| `/categories/[slug]` | FilterSidebar: khoảng giá (min/max), sắp xếp (price asc/desc, newest)         | - [ ] |
| `/categories/[slug]` | URL params sync: `?min_price=&max_price=&sort=&page=`                         | - [ ] |
| `/categories/[slug]` | Pagination component (prev/next + page numbers)                               | - [ ] |
| `/search?q=`         | Tạo page.tsx: nhận query param `q`                                            | - [ ] |
| `/search?q=`         | SearchResults: hiển thị kết quả + số lượng "Tìm thấy X sản phẩm"              | - [ ] |
| `/search?q=`         | Empty state khi không có kết quả                                              | - [ ] |
| `/products/[slug]`   | SSR + `generateMetadata()` với title, description, OG image                   | - [ ] |
| `/products/[slug]`   | ProductImages: ảnh chính + thumbnail list, click đổi ảnh                      | - [ ] |
| `/products/[slug]`   | VariantSelector: chọn size/color, disable biến thể hết hàng                   | - [ ] |
| `/products/[slug]`   | Hiển thị tồn kho ("Còn X sản phẩm" khi < 10)                                  | - [ ] |
| `/products/[slug]`   | Input số lượng: max = tồn kho của variant đã chọn                             | - [ ] |
| `/products/[slug]`   | AddToCartButton: thêm vào cart-store, show toast thành công                   | - [ ] |
| `/products/[slug]`   | Nút "Mua ngay": thêm giỏ + redirect `/checkout`                               | - [ ] |
| `/products/[slug]`   | Section sản phẩm liên quan (cùng danh mục, limit 4-6)                         | - [ ] |

**Acceptance Criteria:**

- [ ] Home load < 3s, hiển thị đúng data từ API
- [ ] Category page lọc/sắp xếp đúng, URL sync với filter state
- [ ] Search trả kết quả đúng theo từ khóa
- [ ] PDP: chọn variant → giá và tồn kho cập nhật đúng
- [ ] Add to cart → badge trên navbar icon tăng đúng số lượng

---

### Task 3: Cart Core (P1-03)

**Files:**

- Create: `src/app/[locale]/(shop)/cart/page.tsx`
- Create: `src/app/[locale]/(shop)/cart/_components/CartTable.tsx`
- Create: `src/app/[locale]/(shop)/cart/_components/CartSummary.tsx`
- Create: `src/shared/components/common/CartDrawer.tsx`
- Modify: `src/shared/components/layouts/Header.tsx` (cart icon + count badge)

**Checklist:**

| Component  | Task                                                          | Done? |
| ---------- | ------------------------------------------------------------- | ----- |
| CartDrawer | Slide-in từ phải khi click cart icon                          | - [ ] |
| CartDrawer | Danh sách items: ảnh, tên, variant, giá, số lượng             | - [ ] |
| CartDrawer | Tăng/giảm số lượng (min=1, max=tồn kho)                       | - [ ] |
| CartDrawer | Xóa item khỏi giỏ                                             | - [ ] |
| CartDrawer | Tổng tiền tạm tính                                            | - [ ] |
| CartDrawer | Nút "Xem giỏ hàng" → `/cart`                                  | - [ ] |
| CartDrawer | Nút "Thanh toán" → `/checkout` (disabled nếu giỏ trống)       | - [ ] |
| `/cart`    | CartTable: responsive (stack trên mobile, table trên desktop) | - [ ] |
| `/cart`    | CartSummary: subtotal, shipping fee placeholder, total        | - [ ] |
| `/cart`    | Giỏ hàng persist sau refresh (Zustand persist đã có)          | - [ ] |
| `/cart`    | Empty state: "Giỏ hàng trống" + nút "Tiếp tục mua sắm"        | - [ ] |
| Header     | Cart icon hiển thị count badge (số items)                     | - [ ] |
| Header     | Click icon mở CartDrawer                                      | - [ ] |

**Acceptance Criteria:**

- [ ] Add to cart từ PDP → item xuất hiện trong CartDrawer ngay lập tức
- [ ] Refresh trang → giỏ hàng vẫn còn (localStorage persist)
- [ ] Tăng/giảm số lượng → subtotal cập nhật đúng
- [ ] Xóa item → item biến mất, total cập nhật

---

### Task 4: Checkout COD (P1-04)

> Gate: Auth (Task 1) và Cart (Task 3) phải xong trước.

**Files:**

- Modify: `src/app/[locale]/(shop)/checkout/page.tsx`
- Create: `src/app/[locale]/(shop)/checkout/_components/CheckoutForm.tsx`
- Create: `src/app/[locale]/(shop)/checkout/_components/ShippingAddressStep.tsx`
- Create: `src/app/[locale]/(shop)/checkout/_components/OrderReviewStep.tsx`
- Create: `src/app/[locale]/(shop)/checkout/_components/PaymentMethodStep.tsx`
- Modify: `src/app/[locale]/(shop)/checkout/success/page.tsx`
- Create: `src/app/[locale]/(shop)/checkout/failed/page.tsx`
- Create: `src/app/[locale]/(shop)/checkout/_lib/schemas.ts`
- Create: `src/app/[locale]/(shop)/checkout/_lib/actions.ts`
- Create: `src/shared/types/order.ts` (Zod schema cho Order)

**Checklist:**

| Bước             | Task                                                              | Done? |
| ---------------- | ----------------------------------------------------------------- | ----- |
| Checkout guard   | Redirect `/login?returnUrl=/checkout` nếu chưa đăng nhập          | - [ ] |
| Checkout guard   | Redirect `/cart` nếu giỏ hàng trống                               | - [ ] |
| Step 1 - Địa chỉ | Form: họ tên, SĐT, địa chỉ, phường/xã, quận/huyện, tỉnh/thành     | - [ ] |
| Step 1 - Địa chỉ | Zod validation cho từng field                                     | - [ ] |
| Step 1 - Địa chỉ | Nếu user có địa chỉ lưu sẵn: hiển thị dropdown chọn hoặc nhập mới | - [ ] |
| Step 2 - Review  | Hiển thị danh sách sản phẩm trong giỏ (readonly)                  | - [ ] |
| Step 2 - Review  | Tóm tắt chi phí: tạm tính, phí vận chuyển, tổng cộng              | - [ ] |
| Step 3 - Payment | Chọn phương thức: COD (duy nhất ở MVP)                            | - [ ] |
| Submit           | Nút "Đặt hàng" → gọi `POST /api/orders/`                          | - [ ] |
| Submit           | Disable nút sau khi submit (tránh double-submit)                  | - [ ] |
| Submit           | Loading state trong khi chờ API                                   | - [ ] |
| Error handling   | Hiển thị lỗi "hết hàng" từ API (HTTP 409)                         | - [ ] |
| Error handling   | Lỗi server → redirect `/checkout/failed`                          | - [ ] |
| Success          | Redirect `/checkout/success?orderId=<id>`                         | - [ ] |
| Success page     | Fetch và hiển thị thông tin đơn vừa đặt                           | - [ ] |
| Success page     | Clear cart-store sau khi đặt thành công                           | - [ ] |
| Success page     | Nút "Xem đơn hàng" → `/orders/<id>`                               | - [ ] |
| Success page     | Nút "Tiếp tục mua sắm" → `/`                                      | - [ ] |
| Success page     | Redirect trang chủ nếu vào URL mà không có `orderId`              | - [ ] |
| Failed page      | Thông báo lỗi rõ: hết hàng / lỗi mạng / lỗi server                | - [ ] |
| Failed page      | Nút "Thử lại" → quay về `/checkout`                               | - [ ] |

**Acceptance Criteria:**

- [ ] Checkout COD end-to-end: địa chỉ → review → COD → đặt hàng → success page
- [ ] Sản phẩm hết hàng → hiển thị lỗi, không tạo đơn, không clear giỏ hàng
- [ ] Submit 2 lần liên tiếp → chỉ tạo 1 đơn
- [ ] Mất kết nối → hiển thị lỗi thân thiện, không crash

---

### Task 5: Order Visibility (P1-05)

**Files:**

- Modify: `src/app/[locale]/(shop)/orders/page.tsx`
- Modify: `src/app/[locale]/(shop)/orders/[id]/page.tsx`
- Create: `src/app/[locale]/(shop)/orders/_components/OrderList.tsx`
- Create: `src/app/[locale]/(shop)/orders/_components/OrderStatusBadge.tsx`
- Create: `src/app/[locale]/(shop)/orders/_components/OrderTimeline.tsx`
- Create: `src/app/[locale]/(shop)/orders/_components/CancelOrderButton.tsx`

**Checklist:**

| Trang          | Task                                                                             | Done? |
| -------------- | -------------------------------------------------------------------------------- | ----- |
| `/orders`      | Fetch danh sách đơn của user đang đăng nhập                                      | - [ ] |
| `/orders`      | Sắp xếp theo ngày mới nhất                                                       | - [ ] |
| `/orders`      | OrderStatusBadge: màu khác nhau cho từng status                                  | - [ ] |
| `/orders`      | Empty state: "Chưa có đơn hàng nào"                                              | - [ ] |
| `/orders`      | Link "Xem chi tiết" cho từng đơn                                                 | - [ ] |
| `/orders/[id]` | Fetch chi tiết đơn (chỉ đơn của mình — 403 nếu không phải)                       | - [ ] |
| `/orders/[id]` | Hiển thị đầy đủ: items, địa chỉ, tổng tiền, phương thức thanh toán               | - [ ] |
| `/orders/[id]` | OrderTimeline: lịch sử thay đổi status                                           | - [ ] |
| `/orders/[id]` | CancelOrderButton: hiện khi status = PENDING, gọi `POST /api/orders/:id/cancel/` | - [ ] |
| `/orders/[id]` | Sau hủy: invalidate query, cập nhật UI status                                    | - [ ] |
| Profile        | `/profile`: xem + sửa thông tin cá nhân qua API                                  | - [ ] |
| Profile        | Quản lý địa chỉ giao hàng (list + add + set default)                             | - [ ] |

**Acceptance Criteria:**

- [ ] User chỉ thấy đơn của mình (không thấy đơn người khác)
- [ ] Hủy đơn PENDING → status đổi sang CANCELLED ngay trên UI
- [ ] Đơn đã CONFIRMED → không hiện nút hủy

---

### Task 6: Admin Core (P1-06)

**Files:**

- Modify: `src/app/[locale]/(admin)/dashboard/page.tsx`
- Modify: `src/app/[locale]/(admin)/products/page.tsx`
- Create: `src/app/[locale]/(admin)/products/new/page.tsx`
- Create: `src/app/[locale]/(admin)/products/[id]/page.tsx`
- Modify: `src/app/[locale]/(admin)/orders/page.tsx`
- Create: `src/app/[locale]/(admin)/orders/[id]/page.tsx`
- Create: `src/app/[locale]/(admin)/_components/AdminDataTable.tsx`
- Create: `src/app/[locale]/(admin)/_components/OrderStatusSelect.tsx`
- Create: `src/app/[locale]/(admin)/_lib/actions.ts`

**Checklist:**

| Trang                  | Task                                                                               | Done? |
| ---------------------- | ---------------------------------------------------------------------------------- | ----- |
| `/admin/dashboard`     | Số đơn hôm nay (từ API)                                                            | - [ ] |
| `/admin/dashboard`     | Doanh thu hôm nay (từ API)                                                         | - [ ] |
| `/admin/dashboard`     | Sản phẩm sắp hết hàng (< 5 units)                                                  | - [ ] |
| `/admin/products`      | Bảng danh sách sản phẩm (tên, giá, tồn kho, danh mục, status)                      | - [ ] |
| `/admin/products`      | Search theo tên, filter theo danh mục                                              | - [ ] |
| `/admin/products`      | Link "Thêm sản phẩm" → `/admin/products/new`                                       | - [ ] |
| `/admin/products/new`  | Form tạo sản phẩm: tên, slug, mô tả, giá, danh mục, ảnh                            | - [ ] |
| `/admin/products/new`  | Quản lý variants (size/color/stock) — thêm/xóa row                                 | - [ ] |
| `/admin/products/[id]` | Form sửa sản phẩm (tương tự new, prefill data)                                     | - [ ] |
| `/admin/products/[id]` | Toggle active/inactive sản phẩm                                                    | - [ ] |
| `/admin/orders`        | Bảng danh sách đơn (mã đơn, khách hàng, tổng tiền, status, ngày)                   | - [ ] |
| `/admin/orders`        | Filter theo status, ngày                                                           | - [ ] |
| `/admin/orders/[id]`   | Xem chi tiết đơn đầy đủ                                                            | - [ ] |
| `/admin/orders/[id]`   | OrderStatusSelect: đổi status theo workflow (PENDING→CONFIRMED→SHIPPING→COMPLETED) | - [ ] |
| `/admin/orders/[id]`   | Chặn đổi ngược status (không cho COMPLETED → PENDING)                              | - [ ] |
| Admin guard            | Middleware chặn non-admin truy cập `/admin/*`                                      | - [ ] |

**Acceptance Criteria:**

- [ ] Admin tạo sản phẩm mới → xuất hiện trong storefront
- [ ] Admin đổi status đơn → customer thấy status mới ngay
- [ ] Non-admin vào `/admin/*` → redirect hoặc 403

---

## P2 — Hardening Before Release

> Bắt đầu P2 chỉ khi tất cả P1 Acceptance Criteria đều pass.

### Task 7: Test Hardening (P2-01)

**Checklist:**

| Layer    | Task                                                                 | Done? |
| -------- | -------------------------------------------------------------------- | ----- |
| Unit     | `cart-store.test.ts`: add/remove/update/persist                      | - [ ] |
| Unit     | `auth-store.test.ts`: login/logout/token refresh                     | - [ ] |
| Unit     | Zod schemas: test invalid inputs cho checkout form                   | - [ ] |
| Unit     | `shared/lib/http`: test interceptor, ApiError transform              | - [ ] |
| E2E      | `e2e/auth.spec.ts`: register → login → logout                        | - [ ] |
| E2E      | `e2e/shopping.spec.ts`: search → PDP → add to cart                   | - [ ] |
| E2E      | `e2e/checkout.spec.ts`: full COD flow → success page                 | - [ ] |
| E2E      | `e2e/checkout.spec.ts`: hết hàng → error message                     | - [ ] |
| Coverage | `npm run test:coverage` → shared/lib/** và shared/hooks/** đạt ≥ 70% | - [ ] |

### Task 8: Performance & SEO (P2-02)

**Checklist:**

| Area | Task                                                                         | Done? |
| ---- | ---------------------------------------------------------------------------- | ----- |
| SEO  | `generateMetadata()` cho `/`, `/categories/[slug]`, `/products/[slug]`       | - [ ] |
| SEO  | `src/app/sitemap.ts`: auto generate từ API                                   | - [ ] |
| SEO  | `src/app/robots.ts`: allow crawl, disallow `/account`, `/checkout`, `/admin` | - [ ] |
| SEO  | Open Graph tags (image, title, description) trên PDP                         | - [ ] |
| SEO  | JSON-LD structured data cho Product schema                                   | - [ ] |
| Perf | Tất cả ảnh dùng `next/image` với `width`/`height` hoặc `fill`                | - [ ] |
| Perf | Cloudinary URL có `f_auto,q_auto`                                            | - [ ] |
| Perf | Font dùng `next/font` (tránh layout shift)                                   | - [ ] |
| Perf | Lighthouse mobile: Home > 75, PDP > 80                                       | - [ ] |

### Task 9: Accessibility & UX (P2-03)

**Checklist:**

| Area       | Task                                                                   | Done? |
| ---------- | ---------------------------------------------------------------------- | ----- |
| A11y       | Tất cả `<img>` có `alt` mô tả sản phẩm                                 | - [ ] |
| A11y       | Tất cả button/link có label rõ (không chỉ icon)                        | - [ ] |
| A11y       | Color contrast text ≥ 4.5:1                                            | - [ ] |
| A11y       | Focus visible khi tab qua form checkout                                | - [ ] |
| UX         | Loading skeleton đúng chỗ (home sections, product grid, order list)    | - [ ] |
| UX         | Empty states đầy đủ (giỏ trống, không có đơn, không có kết quả search) | - [ ] |
| UX         | Error states đầy đủ (API lỗi, hết hàng, network error)                 | - [ ] |
| UX         | Toast notifications nhất quán (add cart, login, order success)         | - [ ] |
| Responsive | Test 375px (iPhone SE) — không overflow, text không cắt                | - [ ] |
| Responsive | Test 768px (tablet), 1024px, 1440px                                    | - [ ] |

### Task 10: Observability (P2-04)

**Checklist:**

| Task                                                  | Done? |
| ----------------------------------------------------- | ----- |
| Cài `@sentry/nextjs` + cấu hình DSN từ env            | - [ ] |
| Error boundary bọc toàn bộ `(shop)` layout            | - [ ] |
| Error boundary bọc toàn bộ checkout flow              | - [ ] |
| Log checkout failures (structured log với order data) | - [ ] |
| Test trigger lỗi thủ công → Sentry nhận được          | - [ ] |
| Không có uncaught errors sau smoke test toàn luồng    | - [ ] |

---

## Release Gates

### Gate B — Feature Complete (sau P1)

- [ ] Tất cả P1 Acceptance Criteria pass
- [ ] Core journeys chạy end-to-end trên local/staging
- [ ] Không còn blocker severity cao

### Gate C — Release Ready (sau P2)

- [ ] E2E tests pass (auth + shopping + checkout)
- [ ] Coverage ≥ 70% trên shared/lib và shared/hooks
- [ ] Lighthouse mobile: Home > 75
- [ ] Sentry cấu hình xong, không có lỗi uncaught sau smoke test
- [ ] `npm run build` pass không lỗi TypeScript
- [ ] `npm run lint` pass

---

## Quick Reference — Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build (verify no TS errors)
npm run lint         # ESLint check
npm run test         # Run unit tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
npm run test:e2e     # Playwright E2E
npx vitest run src/path/to/file.test.ts  # Single test file
```

---

## Ghi chú scope

**KHÔNG làm trong MVP này:**

- VNPAY / Momo / ZaloPay
- Voucher / Flash sale engine
- Wishlist
- Social login
- Redis cache
- Thông báo realtime
- Multi-vendor
- Báo cáo doanh thu

> Mọi yêu cầu mới → ghi vào Phase 2 backlog, không implement.
