# Sơ đồ hệ thống — Kiến trúc theo Component

Last updated: 2026-07-18
Source of truth: `middleware.ts`, `src/app/providers.tsx`, cấu trúc `src/app/[locale]/*`, `src/shared/`
Owner: FE team

## Mục đích

Tài liệu này vẽ **sơ đồ trực quan (ASCII)** về cách các component/khối kiến trúc trong hệ thống phối hợp với nhau lúc runtime — bổ sung cho các cây thư mục tĩnh đã có ở [`shop-module-structure.md`](./shop-module-structure.md) và [`shared-structure.md`](./shared-structure.md) (2 file đó liệt kê file theo thư mục, file này vẽ **quan hệ/luồng chạy** giữa các khối).

Không lặp lại: quy ước code (xem [`conventions.md`](./conventions.md)), quy tắc boundary chi tiết của `shared/` (xem [`shared-structure.md`](./shared-structure.md)).

---

## 1. Request lifecycle — từ request tới trang render

```text
Browser request: /vi/products
        │
        ▼
middleware.ts                            # next-intl locale routing (mặc định vi)
  │                                       # ⚠ Next.js 16.0.0 đã deprecate convention `middleware.ts`,
  │                                       #   đổi tên thành `proxy.ts` (codemod: `npx @next/codemod@canary
  │                                       #   middleware-to-proxy .`) — repo CHƯA migrate, vẫn dùng tên cũ.
  ├─ locale detect: vi | en
  └─ guard cookie `access_token`:         # áp dụng cho CẢ 4 nhóm path, không chỉ admin. CHỈ check cookie
       /admin/*, /checkout/*,             #   TỒN TẠI, KHÔNG decode/verify JWT, KHÔNG check role — mọi user
       /orders/*, /profile/*              #   đã login (không riêng admin) đều qua được guard `/admin/*`.
                                          #   → thiếu cookie: redirect /login?returnUrl=...
                                          #   → /login, /register khi ĐÃ đăng nhập: redirect /home
        │
        ▼
src/app/layout.tsx                       # root layout (fonts, <html>, tối giản)
        │
        ▼
src/app/[locale]/layout.tsx
  └─ NextIntlClientProvider
        └─ Providers  ('use client', src/app/providers.tsx)
              ├─ AuthRuntimeProvider      # (auth)/_lib — đăng ký token/refresh vào shared/lib/http/runtime.ts
                                          # ⚠ dùng cho TOÀN app (shop/checkout/profile/admin), nhưng lại nằm
                                          #   trong module private (auth)/_lib — ngoại lệ của quy tắc "KHÔNG
                                          #   import chéo route group" ở mục 2. Cân nhắc tách thành module
                                          #   cross-cutting riêng (vd. src/app/_providers/) nếu mở rộng thêm.
              ├─ QueryClientProvider      # React Query — server state
              ├─ ThemeProvider           # next-themes (light, no system)
              ├─ {children}
              ├─ Toaster                 # sonner
              └─ AppProgressBar
        │
        ▼
Route group layout (chọn theo path)
  ├─ (shop)/layout.tsx   → Header + <main>{children}</main> + Footer + JSON-LD WebSite
  ├─ (auth)/layout.tsx   → shell tối giản cho form login/register
  └─ (admin)/            → [CHƯA CÓ layout.tsx — route group còn rỗng, xem mục 7]
        │
        ▼
page.tsx (Server Component) của route tương ứng
```

---

## 2. Kiến trúc tầng toàn hệ thống

```text
                              ┌───────────────────────────────┐
                              │  middleware.ts (locale + guard) │
                              └────────────────┬───────────────┘
                                               │
        ┌───────────────────────┬─────────────┴─────────────┬───────────────────────┐
        ▼                       ▼                           ▼
 (shop)/_lib/             (auth)/_lib/                (admin)/
 storefront công khai      login/register/forgot/       [PLANNED — rỗng]
 home, products, cart,     reset password, guard,        categories/, dashboard/,
 checkout, orders,         auth-store                    orders/, products/, users/
 profile, search                                          → chỉ có thư mục route,
                                                            chưa có page.tsx/component
        │                       │
        │   KHÔNG import chéo giữa 3 route group (ESLint eslint-plugin-boundaries enforce)
        └───────────┬───────────┘
                     ▼
              src/shared/                 # dùng chung ≥2 route group, không mang business rule riêng
   ┌─────────────────┼─────────────────────┐
   ▼                 ▼                     ▼
components/base   hooks (generic)      lib/
(Radix wrappers:  useDebounce,          ├─ http/client.ts      → axios + interceptor
Button, Dialog,   useMediaQuery,        ├─ errors/api-error.ts → chuẩn hoá lỗi
Select...)        usePagination...      ├─ query-client.ts     → cấu hình React Query
                                         └─ utils.ts, seo.ts, cloudinary.ts, monitoring/
                                                     │
                                                     ▼
                                          Django REST API (`/api/...`)
```

---

## 3. Hai nhánh gọi API (khác nhau giữa auth và phần còn lại)

```text
Nhánh A — auth cookie flow (chỉ login/register/logout/refresh)
  LoginForm / RegisterForm ('use client')
    └─► loginAction() / registerAction()      [(auth)/_lib/actions/auth.ts]
          └─► callAuthRoute()                 [(auth)/_lib/http/auth-route-client.ts — fetch thuần, KHÔNG qua axios]
                └─► POST /api/auth/login       [Next.js Route Handler — src/app/api/auth/login/route.ts]
                      └─► fetch Django /api/auth/login/
                      └─► set-cookie: access_token (httpOnly), refresh_token (httpOnly)
                └─► auth-store: setAccessToken() + setUser()   (useSyncExternalStore)

Nhánh B — mọi API khác (product/order/profile/forgot-password/reset-password...)
  Component/Hook
    └─► actions/xxx.ts   [(shop|auth)/_lib/actions/*]
          └─► http.get/post/put/patch/delete<T>()   [shared/lib/http/client.ts]
                └─► axios + interceptor (đính access_token, chuẩn hoá lỗi → ApiError)
                └─► Django REST API
```

> ⚠ Tên thư mục `actions/` (`(auth)/_lib/actions/auth.ts`, `(shop)/_lib/actions/{order,product,profile}.ts`) dễ gây hiểu nhầm với Next.js Server Actions — nhưng các file này KHÔNG có directive `'use server'`, chỉ là wrapper gọi `http`/axios chạy phía client. Cân nhắc đổi tên (`api/`, `services/`) khi có dịp để tránh nhầm lẫn browser vs server code.

---

## 4. State layer — server state vs client state

```text
Server state (dữ liệu chủ sở hữu là API)     Client state (chỉ tồn tại phía browser)
─────────────────────────────────────        ──────────────────────────────────────
React Query (@tanstack/react-query)          useSyncExternalStore + module-level store
  useProducts(), useOrders(),                  ├─ (shop)/_lib/hooks/useCart.ts
  useProfile(), useOrder()...                  │    → mảng CartItem[], persist localStorage
  cache key chuẩn hoá qua                      │      key "cart-storage"
  shared/constants/query-keys.ts               └─ (auth)/_lib/store/auth-store.ts
                                                     → { token, user }, KHÔNG persist localStorage
```

> Không dùng Zustand ở cả 2 nhóm trên (theo `CLAUDE.md`). **Lưu ý đối chiếu:** bảng trạng thái feature trong [`shop-module-structure.md`](./shop-module-structure.md) ghi "Giỏ hàng — Zustand persist", nhưng code thực tế (`useCart.ts`) dùng `useSyncExternalStore` + `localStorage` thủ công — dòng đó đã lỗi thời, nên cập nhật lại.

---

## 5. Luồng dữ liệu chuẩn trong 1 page

```text
page.tsx (Server Component, KHÔNG 'use client')
  └─► *Client.tsx  ('use client' container — vd: ProductsClient, CartClient, CheckoutClient)
        └─► useXxx() hook   (business logic + state)
              └─► actions/xxx.ts  →  http client  →  Django REST API
                                                         ↑
                                     (mock: (shop)/_lib/data/*.ts khi API chưa sẵn sàng)
```

---

## 6. Component composition — các trang chính

### Trang chủ (`/[locale]/home`)

```text
home/page.tsx (Server)
  ├─► SectionHero                 'use client'  (dùng useRef)
  ├─► SectionFeaturedCategories   'use client'
  ├─► SectionFlashSale            'use client'  → CountdownTimer
  ├─► SectionBestSellers          'use client'
  ├─► SectionNewArrivals          'use client'
  ├─► SectionWhyChooseUs          Server        # KHÔNG 'use client'
  ├─► SectionTestimonials         Server        # KHÔNG 'use client'
  └─► SectionNewsletter           Server        # KHÔNG 'use client' → NewsletterForm ('use client')
        (mỗi Section độc lập — KHÔNG có 1 *Client.tsx container chung bọc cả trang.
         5/8 section hiện là Client Component; WhyChooseUs/Testimonials/Newsletter đã là Server.)
```

### Danh sách sản phẩm (`/[locale]/products`)

```text
products/page.tsx (Server)
  └─► ProductsClient ('use client')      # container: filter state + pagination
        ├─► ProductGrid (common/)
        └─► Pagination (common/)
```

### Giỏ hàng (`/[locale]/cart`)

```text
cart/page.tsx (Server)
  └─► CartClient ('use client')
        ├─► useCart()                    # client state — useSyncExternalStore
        ├─► (rỗng) EmptyState UI          # khi items.length === 0
        └─► (có hàng)
              ├─► CartTable
              └─► CartSummary
```

### Checkout (`/[locale]/checkout`)

```text
checkout/page.tsx (Server)
  └─► CheckoutClient ('use client')
        ├─► useCart()                    # đọc items, redirect /cart nếu rỗng
        ├─► useCreateOrder()              # mutation — React Query
        ├─► react-hook-form + zodResolver(checkoutSchema)
        └─► OrderSummary
```

### Đăng nhập / Đăng ký (`(auth)`)

```text
login/page.tsx (Server)
  └─► LoginForm ('use client')
        ├─► react-hook-form + zodResolver(loginSchema)
        ├─► loginAction()   → Nhánh A (mục 3)
        └─► ApiErrorAlert   # hiển thị lỗi qua useApiErrorMessage()
```

---

## 7. `(admin)` route group — trạng thái hiện tại

```text
(admin)/
  └─ admin/            # segment bắt buộc — (admin) không xuất hiện trong URL, "admin/" mới tạo path /{locale}/admin/*
      ├─ categories/     [rỗng — chỉ có thư mục]
      ├─ dashboard/      [rỗng — chỉ có thư mục]
      ├─ orders/
      │   ├─ [id]/       [rỗng]
      │   └─ _lib/       [rỗng]
      ├─ products/
      │   ├─ [id]/       [rỗng]
      │   ├─ _lib/       [rỗng]
      │   └─ new/        [rỗng]
      └─ users/
          └─ [id]/       [rỗng]
```

Toàn bộ `(admin)/admin/` hiện chỉ là **scaffold thư mục theo route**, chưa có `page.tsx`, `layout.tsx` hay bất kỳ component/hook nào. `middleware.ts` đã bật guard cho `/admin/*` (cần cookie `access_token`) nhưng chưa có UI để guard.

> ⚠ **Vì sao có segment `admin/` lồng bên trong**: route group `(admin)` không xuất hiện trong URL — nếu đặt `page.tsx` trực tiếp dưới `(admin)/products/` (không qua `admin/`), nó sẽ map thành `/{locale}/products`, đụng route với `(shop)/products/page.tsx` đã tồn tại (Next.js build error), và cũng không khớp guard `/admin/*` ở `middleware.ts`. Segment `admin/` giải quyết cả 2 vấn đề cùng lúc → `(admin)/admin/products/page.tsx` map đúng `/{locale}/admin/products`.

---

## Ghi chú đối chiếu code (phát hiện khi vẽ sơ đồ — đã sửa)

- **Cart state**: `useCart.ts` dùng `useSyncExternalStore` + `localStorage` thủ công, không phải Zustand — đã sửa dòng "Zustand persist" ở `shop-module-structure.md` (mục 4).
- **Middleware guard rộng hơn mô tả tóm tắt cũ**: `CLAUDE.md` từng tóm tắt middleware là "guard admin phía server", đã sửa lại thành guard cả `admin/`, `checkout/`, `orders/`, `profile/` (khớp `middleware.ts`, mục 1).
- **`(admin)` chưa có code**: các thư mục con đều rỗng (0 file) — mọi tài liệu/sơ đồ về admin trong tương lai nên đánh dấu rõ [PLANNED].
- **`(admin)` thiếu subfolder `admin/` → đã sửa**: relocate scaffold rỗng vào `(admin)/admin/**` (xem mục 7) để tránh trùng route với `(shop)/products`, `(shop)/orders`. Đã thêm quy ước bắt buộc vào `conventions.md`.

---

## Rủi ro / gap đã phát hiện — CHƯA xử lý trong code

Khác với mục trên (đã sửa trong tài liệu), các điểm này là gap thật trong code, cần xử lý trước khi triển khai `(admin)` hoặc khi nâng cấp Next.js:

- **Guard `/admin/*` trong `middleware.ts` chỉ check cookie `access_token` tồn tại, không check role** → user thường (không phải admin) đã login vẫn qua được guard này. Cần bổ sung role/permission check (ví dụ `role === 'ADMIN'`) trước khi coi `(admin)` là bảo vệ đủ. Next.js docs (`node_modules/next/dist/docs/.../file-conventions/proxy.md`) cũng khuyến nghị không dựa hoàn toàn vào Proxy cho authorization — nên verify lại ở Route Handler/Server Action hoặc Django API.
- **`middleware.ts` là convention đã deprecated từ Next.js 16.0.0**, đổi tên thành `proxy.ts` (có codemod chính thức). Repo đang chạy Next `^16.2.6` (`package.json`) nhưng chưa migrate — nên cập nhật khi có cơ hội, tránh nợ kỹ thuật tích lũy.
- **Token không được bootstrap lại sau F5**: `AuthRuntimeProvider` (`(auth)/_lib/components/AuthRuntimeProvider.tsx`) chỉ đăng ký callback `getAccessToken`/`refreshAccessToken` vào `shared/lib/http/runtime.ts`, không tự gọi refresh khi mount; `auth-store` chỉ lưu trong memory (không persist). Sau khi reload trang, request đầu tiên sẽ luôn nhận 401 rồi mới kích hoạt refresh — interceptor tại `shared/lib/http/client.ts` đã có single-flight refresh + retry nên không bị lặp vô hạn, nhưng luôn tốn 1 round-trip 401 và có thể gây flash UI "chưa đăng nhập" trong lúc chờ refresh.
- **Cart lưu giá tại client (`useCart.ts`)**: `CartItem` cache `price` phía browser, không có field `version` để migrate schema. Server (khi tạo order) phải luôn coi đây là dữ liệu KHÔNG đáng tin, tự kiểm tra lại giá/tồn kho/khuyến mãi.

---

## Tài liệu liên quan

| Nội dung                              | File                                                     |
| ------------------------------------- | -------------------------------------------------------- |
| Cây thư mục chi tiết module shop      | [`shop-module-structure.md`](./shop-module-structure.md) |
| Quy tắc boundary của `shared/`        | [`shared-structure.md`](./shared-structure.md)           |
| Tech stack, API client, quality gates | [`tech-stack.md`](./tech-stack.md)                       |
| Quy ước code đầy đủ                   | [`conventions.md`](./conventions.md)                     |
