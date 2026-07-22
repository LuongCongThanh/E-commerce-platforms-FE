# Routing

> Tầng sống. Source of truth: `middleware.ts`, `src/app/[locale]/*`. Last verified: 2026-07-23.

## Route groups

App Router dưới `src/app/[locale]/` với 3 route group:

- `(shop)` — storefront công khai.
- `(auth)` — login / register / forgot-password / reset-password.
- `(admin)` — quản trị, bảo vệ 2 lớp: `middleware.ts` (server, dựa cookie) + `AdminGuard` (client) — xem [`authorization.md`](./authorization.md).

Quy tắc:

- **Thin routes**: `page.tsx`/`layout.tsx` chỉ orchestrate — không chứa business logic. Logic nằm trong `_lib/` của route group (`api/`, `components/`, `hooks/`, `schemas/`, `types/`, `data/`, `queries/`, `store/`). Thư mục gọi API đặt tên `api/` (không phải `actions/`) để tránh nhầm với Next.js Server Actions — các file này KHÔNG có `'use server'`, chỉ là wrapper gọi `http`/axios chạy phía client.
- **`_lib/` là private** — route group này không import chéo route group khác (enforce bằng `eslint-plugin-boundaries`).
- **Không `'use client'` trên `page.tsx`** — luôn là Server Component; client logic delegate vào `*Client.tsx` container (`ProductsClient`, `CartClient`, `CheckoutClient`...).
- **`(admin)` bắt buộc nest thêm 1 segment `admin/`**: `(admin)/admin/products/page.tsx` → `/{locale}/admin/products`, KHÔNG đặt `page.tsx` trực tiếp dưới `(admin)/`. Lý do: route group không xuất hiện trong URL — đặt trực tiếp dưới `(admin)/products/` sẽ đụng route với `(shop)/products/page.tsx` đã tồn tại (Next.js build error) và không khớp pattern `/admin/*` mà `middleware.ts` guard.

## Request lifecycle

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

## Component composition — các trang chính

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
        (mỗi Section độc lập — KHÔNG có 1 *Client.tsx container chung bọc cả trang)
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
        └─► (có hàng) CartTable + CartSummary
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
        ├─► loginAction()   → xem "Nhánh A" ở api-integration.md
        └─► ApiErrorAlert   # hiển thị lỗi qua useApiErrorMessage()
```

## `(admin)` route group — hiện trạng (2026-07-23)

Đã có, từ PR #26 (`feat(admin): scaffold admin core shell and session guards`, 2026-07-20):

```text
(admin)/
  ├─ layout.tsx                              # bọc AdminGuard, render AdminSidebar + AdminNavbar
  ├─ admin/page.tsx                          # redirect → ROUTES.ADMIN.PRODUCTS ("/admin/products")
  └─ _lib/components/layout/
       ├─ AdminNavbar.tsx
       └─ AdminSidebar.tsx
```

**Gap hiện tại**: không tồn tại `page.tsx` nào dưới `admin/products`, `admin/orders` (hay `categories`/`dashboard`/`users`) — `admin/page.tsx` redirect vào `/admin/products` nhưng route đó chưa có trang, nên hiện tại vào `/admin` sẽ ra 404. Phạm vi đã chốt cho đợt admin core đầu tiên chỉ gồm Products + Orders — xem [ADR-0003](../../adr/0003-admin-core-scope-thu-gon.md). Cơ chế bảo vệ 2 lớp (middleware + `AdminGuard`) xem [`authorization.md`](./authorization.md).

## Tài liệu liên quan

| Nội dung                         | File                                                     |
| -------------------------------- | -------------------------------------------------------- |
| Cây thư mục chi tiết module shop | [`shop-module-structure.md`](./shop-module-structure.md) |
| Quy tắc boundary của `shared/`   | [`shared-structure.md`](./shared-structure.md)           |
| Authorization / guard admin      | [`authorization.md`](./authorization.md)                 |
| API client, error handling       | [`api-integration.md`](./api-integration.md)             |
