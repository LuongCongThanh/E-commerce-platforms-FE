# Runtime: Routing, Auth, State, API

> Tầng sống. Source of truth: `middleware.ts`, `src/app/[locale]/*`, `src/core/session/`, `shared/lib/http/`. Last verified: 2026-07-23.

Gộp 5 hạng mục (Routing, Authentication UI flow, Authorization, State ownership, API client — theo Giai đoạn 2 của [`../../workflow.md`](../../workflow.md)) vào một file vì cả 5 mô tả **cùng một luồng chạy**: request vào → qua route group nào → xác thực ai → được phép làm gì → state nằm ở đâu → gọi API ra sao. Cấu trúc module (`shared`/`shop`) và quality (design system/testing/performance) nằm ở file riêng — xem [`README.md`](./README.md).

## Routing

App Router dưới `src/app/[locale]/` với 3 route group:

- `(shop)` — storefront công khai.
- `(auth)` — login / register / forgot-password / reset-password.
- `(admin)` — quản trị, bảo vệ 2 lớp: `middleware.ts` (server, dựa cookie) + `AdminGuard` (client) — xem [Authorization](#authorization).

Quy tắc:

- **Thin routes**: `page.tsx`/`layout.tsx` chỉ orchestrate — không chứa business logic. Logic nằm trong `_lib/` của route group (`api/`, `components/`, `hooks/`, `schemas/`, `types/`, `data/`, `queries/`, `store/`). Thư mục gọi API đặt tên `api/` (không phải `actions/`) để tránh nhầm với Next.js Server Actions — các file này KHÔNG có `'use server'`, chỉ là wrapper gọi `http`/axios chạy phía client.
- **`_lib/` là private** — route group này không import chéo route group khác (enforce bằng `eslint-plugin-boundaries`).
- **Không `'use client'` trên `page.tsx`** — luôn là Server Component; client logic delegate vào `*Client.tsx` container (`ProductsClient`, `CartClient`, `CheckoutClient`...).
- **`(admin)` bắt buộc nest thêm 1 segment `admin/`**: `(admin)/admin/products/page.tsx` → `/{locale}/admin/products`, KHÔNG đặt `page.tsx` trực tiếp dưới `(admin)/`. Lý do: route group không xuất hiện trong URL — đặt trực tiếp dưới `(admin)/products/` sẽ đụng route với `(shop)/products/page.tsx` đã tồn tại (Next.js build error) và không khớp pattern `/admin/*` mà `middleware.ts` guard.

### Request lifecycle

```text
Browser request: /vi/products
        │
        ▼
middleware.ts                            # next-intl locale routing (mặc định vi) + guard
  │                                       # ⚠ Next.js 16.0.0 đã deprecate convention `middleware.ts`,
  │                                       #   đổi tên thành `proxy.ts` (codemod: `npx @next/codemod@canary
  │                                       #   middleware-to-proxy .`) — repo (Next `^16.2.10`) CHƯA migrate.
        │
        ▼
src/app/layout.tsx                       # root layout (fonts, <html>, tối giản)
        │
        ▼
src/app/[locale]/layout.tsx
  └─ NextIntlClientProvider
        └─ Providers  ('use client', src/app/providers.tsx)
              ├─ AuthRuntimeProvider      # src/core/session — đăng ký token/refresh vào shared/lib/http/runtime.ts
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
  └─ (admin)/layout.tsx  → AdminGuard bọc AdminSidebar + AdminNavbar + <main>{children}</main>
        │
        ▼
page.tsx (Server Component) của route tương ứng
```

### Component composition — các trang chính

**Trang chủ (`/[locale]/home`):**

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
        (mỗi Section độc lập — KHÔNG có 1 *Client.tsx container chung bọc cả trang)
```

**Danh sách sản phẩm (`/[locale]/products`):**

```text
products/page.tsx (Server)
  └─► ProductsClient ('use client')      # container: filter state + pagination
        ├─► ProductGrid (common/)
        └─► Pagination (common/)
```

**Giỏ hàng (`/[locale]/cart`):**

```text
cart/page.tsx (Server)
  └─► CartClient ('use client')
        ├─► useCart()                    # client state — Zustand (useCartStore)
        ├─► (rỗng) EmptyState UI          # khi items.length === 0
        └─► (có hàng) CartTable + CartSummary
```

**Checkout (`/[locale]/checkout`):**

```text
checkout/page.tsx (Server)
  └─► CheckoutClient ('use client')
        ├─► useCart()                    # đọc items, redirect /cart nếu rỗng
        ├─► useCreateOrder()              # mutation — React Query
        ├─► react-hook-form + zodResolver(checkoutSchema)
        └─► OrderSummary
```

**Đăng nhập / Đăng ký (`(auth)`):**

```text
login/page.tsx (Server)
  └─► LoginForm ('use client')
        ├─► react-hook-form + zodResolver(loginSchema)
        ├─► loginAction()   → xem "Nhánh A" ở API Client
        └─► ApiErrorAlert   # hiển thị lỗi qua useApiErrorMessage()
```

### `(admin)` route group — hiện trạng (2026-07-23)

Đã có, từ PR #26 (`feat(admin): scaffold admin core shell and session guards`, 2026-07-20):

```text
(admin)/
  ├─ layout.tsx                              # bọc AdminGuard, render AdminSidebar + AdminNavbar
  ├─ admin/page.tsx                          # redirect → ROUTES.ADMIN.PRODUCTS ("/admin/products")
  └─ _lib/components/layout/
       ├─ AdminNavbar.tsx
       └─ AdminSidebar.tsx
```

**Gap hiện tại**: không tồn tại `page.tsx` nào dưới `admin/products`, `admin/orders` (hay `categories`/`dashboard`/`users`) — `admin/page.tsx` redirect vào `/admin/products` nhưng route đó chưa có trang, nên hiện tại vào `/admin` sẽ ra 404. Phạm vi đã chốt cho đợt admin core đầu tiên chỉ gồm Products + Orders — xem [ADR-0003](../../adr/0003-admin-core-scope-thu-gon.md).

## Authentication

`auth-store.ts`, `AuthRuntimeProvider.tsx`, `auth-route-client.ts`, `useAuth.ts`, `AuthGuard.tsx`, `AdminGuard.tsx`, `roles.ts` đều nằm ở **`src/core/session/`** — không phải `(auth)/_lib` (private cho route group login/register) và không phải `src/shared/` (mang business rule riêng của auth, không đạt tiêu chuẩn shared boundary). Lý do: các thành phần này được dùng bởi toàn app (shop/checkout/profile/admin) qua `src/app/providers.tsx`, nên cần một vị trí cross-cutting riêng. Việc di chuyển này đã hoàn tất từ trước (PR #7) — tài liệu nào còn ghi khác đều đã lỗi thời.

### Luồng đăng nhập/đăng ký

```text
LoginForm / RegisterForm ('use client')
  └─► loginAction() / registerAction()      [(auth)/_lib/api/auth.ts]
        └─► callAuthRoute()                 [(auth)/_lib/http/auth-route-client.ts — fetch thuần, KHÔNG qua axios]
              └─► POST /api/auth/login       [Next.js Route Handler — src/app/api/auth/login/route.ts]
                    └─► fetch Django /api/auth/login/
                    └─► set-cookie: access_token (httpOnly), refresh_token (httpOnly), is_admin (httpOnly)
              └─► auth-store: setAccessToken() + setUser()   (Zustand useAuthStore, KHÔNG persist localStorage)
```

`route.ts` (login/register) gọi `isAdminRole(user.role)` (`src/core/session/roles.ts` — `role === 'admin' || role === 'staff'`) để set cookie `is_admin`, dùng bởi `middleware.ts` cho guard `/admin/*` — xem [Authorization](#authorization).

### Bootstrap provider

`Providers` (`src/app/providers.tsx`, `'use client'`) đăng ký `AuthRuntimeProvider` cho toàn app — provider này chỉ đăng ký callback `getAccessToken`/`refreshAccessToken` vào `shared/lib/http/runtime.ts` (contract trung tính, không phụ thuộc ngược vào auth cụ thể), không tự gọi refresh khi mount. Hệ quả (bootstrap sau F5, flash UI) xem [Bootstrap lại token sau F5](#bootstrap-lại-token-sau-f5).

### Middleware — chỉ hint locale + login, không phải authorization

`middleware.ts` redirect `/login?returnUrl=...` khi thiếu cookie `access_token` cho 4 nhóm path (`/admin/*`, `/checkout/*`, `/orders/*`, `/profile/*`), và redirect `/login`, `/register` về `/home` khi đã có `access_token`. Đây chỉ là UX hint dựa trên cookie tồn tại — không decode/verify JWT. Phần check role riêng cho `/admin/*` xem [Authorization](#authorization).

## Authorization

Cả 2 lớp guard dưới đây đều tự comment rõ mình **không phải authorization thật** — chỉ tránh flash UI sai cho người dùng hợp lệ. Backend Django phải tự enforce lại role/permission trên từng request `/api/admin/*`, không được tin dữ liệu/cookie phía FE gửi lên.

### Lớp 1 — `middleware.ts` (server, dựa cookie)

```ts
const ADMIN_PATTERN = /^\/(vi|en)\/admin/;
// ...
if (ADMIN_PATTERN.test(pathname)) {
  const isAdmin = request.cookies.get(USER_ROLE_COOKIE)?.value === 'true'; // USER_ROLE_COOKIE = 'is_admin'
  if (!isAdmin) return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
}
```

- Cookie `is_admin` được set bởi `src/app/api/auth/login/route.ts` và `register/route.ts`, giá trị `isAdminRole(user.role) ? 'true' : 'false'` — xoá khi logout (`src/app/api/auth/logout/route.ts`).
- Middleware **không decode/verify JWT**, chỉ đọc cookie tồn tại + giá trị chuỗi — cookie có thể bị giả mạo/chỉnh tay phía client, nên đây chỉ là "gợi ý UX" (comment gốc trong `middleware.ts`: _"Optimistic UX check — KHÔNG phải authorization thật"_).
- `middleware.ts` cũng guard chung 4 nhóm path (`/admin/*`, `/checkout/*`, `/orders/*`, `/profile/*`) yêu cầu cookie `access_token` tồn tại — nhưng chỉ pattern `/admin/*` có thêm bước check `is_admin` ở trên.

### Lớp 2 — `AdminGuard` (client component)

`src/core/session/AdminGuard.tsx` bọc toàn bộ `(admin)/layout.tsx`: đợi `useAuth()` hết `isInitializing` → chưa đăng nhập redirect `/login` → đã đăng nhập nhưng không phải admin (`isAdmin` từ `useAuth()`) redirect `/home` → trong lúc chờ render `PageLoader` (không leak nội dung admin trước khi xác nhận role).

### Gap còn lại

- Route ký Cloudinary (`src/app/api/admin/`) tự verify lại bằng cách gọi Django `GET /api/auth/me/` trước khi ký — **đúng mẫu** cần nhân rộng cho các route API nội bộ khác cần quyền admin, vì `middleware.ts` không cover `/api/*` (matcher loại trừ). Xem [ADR-0004](../../adr/0004-upload-anh-qua-signed-cloudinary-route.md).
- Chưa có trang thật dưới `/admin/products`, `/admin/orders` — cả 2 lớp guard ở trên đã sẵn sàng nhưng chưa có gì để bảo vệ ngoài `admin/page.tsx` (chỉ redirect). Xem [(admin) route group — hiện trạng](#admin-route-group--hiện-trạng-2026-07-23) và [ADR-0003](../../adr/0003-admin-core-scope-thu-gon.md).

## State ownership

- **Server state** — sở hữu bởi API: **TanStack Query** (`useProducts()`, `useOrders()`, `useProfile()`, `useOrder()`...). Cache key chuẩn hoá qua `shared/constants/query-keys.ts`. Config tại `shared/lib/query-client.ts`.
- **Client state** — chỉ tồn tại phía browser: **Zustand** (`create()`, không dùng middleware `persist` — xem [ADR-0006](../../adr/0006-zustand-thay-usesyncexternalstore-cho-client-state.md)).
  - Cart: `(shop)/_lib/hooks/useCart.ts` — `useCartStore` (`items: CartItem[]`), persist `localStorage` (key `cart-storage`) ghi thủ công trong mỗi action, không qua middleware `persist` của zustand.
  - Auth: `src/core/session/auth-store.ts` — `useAuthStore` (`{ token, user, status }`), KHÔNG persist localStorage (chỉ tồn tại trong memory).
- **Local UI state** — `useState`/`useReducer` trong component.

### Vì sao không dùng middleware `persist` của zustand cho cart

Middleware `persist` tự động rehydrate từ localStorage lúc store khởi tạo — với Next.js SSR, điều này dễ gây hydration mismatch (server render rỗng, client render đầu tiên đã có data từ localStorage, không khớp). Thay vào đó, `useCartStore` khởi tạo `items: []` (khớp SSR), và `useCart()` gọi `initCartFromStorage()` trong `useEffect` (chỉ chạy client-side, sau lần render đầu) để nạp dữ liệu thật — cùng nguyên lý né hydration mismatch mà bản cũ dùng tham số `getServerSnapshot` của `useSyncExternalStore`, chỉ khác cơ chế lưu trữ bên dưới.

### Vì sao auth store không nằm trong `shared/`

`auth-store.ts` là cross-cutting (dùng bởi toàn app — shop/checkout/profile/admin — qua `src/app/providers.tsx`), nhưng vẫn không đặt trong `src/shared/` vì nó mang state/business rule riêng của auth (rule loại bị cấm ở `shared/`, xem [`shared-structure.md`](./shared-structure.md)). Vị trí đúng là `src/core/session/` — một module cross-cutting tách riêng, không phải `(auth)/_lib` và không phải `shared/`. Việc di chuyển này đã xong (PR #7); tài liệu nào còn ghi khác đều đã lỗi thời.

### Cart: dữ liệu không đáng tin từ phía server

`CartItem` cache `price` phía browser, không có field `version` để migrate schema khi đổi cấu trúc. Server (khi tạo order) phải luôn coi đây là dữ liệu **không đáng tin**, tự kiểm tra lại giá/tồn kho/khuyến mãi — không suy ra giá cuối cùng chỉ từ payload FE gửi lên.

### Bootstrap lại token sau F5

`AuthRuntimeProvider` chỉ đăng ký callback `getAccessToken`/`refreshAccessToken` vào `shared/lib/http/runtime.ts` lúc mount — không tự gọi refresh ngay. Vì `auth-store` chỉ lưu trong memory (không persist), sau khi reload trang request đầu tiên sẽ luôn nhận 401 rồi mới kích hoạt refresh. Interceptor tại `shared/lib/http/client.ts` có single-flight refresh + retry nên không bị lặp vô hạn, nhưng luôn tốn 1 round-trip 401 và có thể gây flash UI "chưa đăng nhập" trong lúc chờ refresh. Chưa xử lý — cân nhắc khi có issue riêng.

## API Client

| Lớp              | Trách nhiệm                                           | File                             |
| :--------------- | :---------------------------------------------------- | :------------------------------- |
| **HTTP object**  | `http.get/post/put/patch/delete`, trả `response.data` | `shared/lib/http/client.ts`      |
| **Transport**    | Axios instance, interceptor token + error             | `shared/lib/http/client.ts`      |
| **Validation**   | Parse runtime cho API responses                       | `shared/lib/http/zod-helpers.ts` |
| **Error**        | Chuẩn hóa lỗi thành `ApiError`                        | `shared/lib/errors/`             |
| **Schema types** | Zod schema + `z.infer<>` cho contracts                | `shared/types/`                  |

**Luồng dữ liệu:** Component → TanStack Query hook → `http.*()` → Axios + interceptors → Backend (Django REST, prefix `/api/`) → Zod validation → typed data.

Không bao giờ gọi axios trực tiếp — luôn đi qua `http` object.

### Hai nhánh gọi API

```text
Nhánh A — auth cookie flow (chỉ login/register/logout/refresh)
  LoginForm / RegisterForm ('use client')
    └─► loginAction() / registerAction()      [(auth)/_lib/api/auth.ts]
          └─► callAuthRoute()                 [(auth)/_lib/http/auth-route-client.ts — fetch thuần, KHÔNG qua axios]
                └─► POST /api/auth/login       [Next.js Route Handler — src/app/api/auth/login/route.ts]
                      └─► fetch Django /api/auth/login/
                      └─► set-cookie: access_token + is_admin (httpOnly), refresh_token (httpOnly)
                └─► auth-store: setAccessToken() + setUser()   (Zustand useAuthStore)

Nhánh B — mọi API khác (product/order/profile/forgot-password/reset-password...)
  Component/Hook
    └─► api/xxx.ts   [(shop|auth)/_lib/api/*]
          └─► http.get/post/put/patch/delete<T>()   [shared/lib/http/client.ts]
                └─► axios + interceptor (đính access_token, chuẩn hoá lỗi → ApiError)
                └─► Django REST API
```

> ⚠ Tên thư mục `api/` đôi khi bị gọi nhầm là "actions" trong lời nói — nhưng các file này KHÔNG có directive `'use server'`, chỉ là wrapper gọi `http`/axios chạy phía client. Tránh nhầm với Next.js Server Actions.

### Luồng dữ liệu chuẩn trong 1 page

```text
page.tsx (Server Component, KHÔNG 'use client')
  └─► *Client.tsx  ('use client' container — vd: ProductsClient, CartClient, CheckoutClient)
        └─► useXxx() hook   (business logic + state)
              └─► api/xxx.ts  →  http client  →  Django REST API
                                                         ↑
                                     (mock: (shop)/_lib/data/*.ts khi API chưa sẵn sàng)
```

### Error handling

- HTTP error chuẩn hóa qua class `ApiError` (`shared/lib/errors/`) với helpers `isUnauthorized()`, `isForbidden()`, `isValidation()`.
- **Mutations** → toast (qua `notify` của `shared/lib/notification.ts`).
- **Queries** → Error Boundary.
- Route ký/admin (vd. upload ảnh) coi middleware/cookie là gợi ý UX, không phải authorization — Django là nguồn sự thật duy nhất; xem [Authorization](#authorization) và [ADR-0004](../../adr/0004-upload-anh-qua-signed-cloudinary-route.md).

## Tài liệu liên quan

| Nội dung                            | File                                                     |
| ----------------------------------- | -------------------------------------------------------- |
| Cây thư mục chi tiết module shop    | [`shop-module-structure.md`](./shop-module-structure.md) |
| Quy tắc boundary của `shared/`      | [`shared-structure.md`](./shared-structure.md)           |
| Design system, testing, performance | [`quality.md`](./quality.md)                             |
