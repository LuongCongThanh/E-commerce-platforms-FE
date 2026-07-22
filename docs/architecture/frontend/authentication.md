# Authentication UI Flow

> Tầng sống. Source of truth: `src/core/session/`, `src/app/api/auth/*`, `src/app/providers.tsx`. Last verified: 2026-07-23.

## Vị trí runtime auth (cross-cutting, không phải `(auth)/_lib` hay `shared/`)

`auth-store.ts`, `AuthRuntimeProvider.tsx`, `auth-route-client.ts`, `useAuth.ts`, `AuthGuard.tsx`, `AdminGuard.tsx`, `roles.ts` đều nằm ở **`src/core/session/`** — không phải `(auth)/_lib` (private cho route group login/register) và không phải `src/shared/` (mang business rule riêng của auth, không đạt tiêu chuẩn shared boundary). Lý do: các thành phần này được dùng bởi toàn app (shop/checkout/profile/admin) qua `src/app/providers.tsx`, nên cần một vị trí cross-cutting riêng. Việc di chuyển này đã hoàn tất từ trước (PR #7) — tài liệu nào còn ghi khác đều đã lỗi thời.

## Luồng đăng nhập/đăng ký

```text
LoginForm / RegisterForm ('use client')
  └─► loginAction() / registerAction()      [(auth)/_lib/api/auth.ts]
        └─► callAuthRoute()                 [(auth)/_lib/http/auth-route-client.ts — fetch thuần, KHÔNG qua axios]
              └─► POST /api/auth/login       [Next.js Route Handler — src/app/api/auth/login/route.ts]
                    └─► fetch Django /api/auth/login/
                    └─► set-cookie: access_token (httpOnly), refresh_token (httpOnly), is_admin (httpOnly)
              └─► auth-store: setAccessToken() + setUser()   (useSyncExternalStore, KHÔNG persist localStorage)
```

`route.ts` (login/register) gọi `isAdminRole(user.role)` (`src/core/session/roles.ts` — `role === 'admin' || role === 'staff'`) để set cookie `is_admin`, dùng bởi `middleware.ts` cho guard `/admin/*` — xem [`authorization.md`](./authorization.md).

## Bootstrap provider

`Providers` (`src/app/providers.tsx`, `'use client'`) đăng ký `AuthRuntimeProvider` cho toàn app — provider này chỉ đăng ký callback `getAccessToken`/`refreshAccessToken` vào `shared/lib/http/runtime.ts` (contract trung tính, không phụ thuộc ngược vào auth cụ thể), không tự gọi refresh khi mount. Hệ quả (bootstrap sau F5, flash UI) xem [`state-management.md`](./state-management.md#bootstrap-lại-token-sau-f5).

## Middleware — chỉ hint locale + login, không phải authorization

`middleware.ts` redirect `/login?returnUrl=...` khi thiếu cookie `access_token` cho 4 nhóm path (`/admin/*`, `/checkout/*`, `/orders/*`, `/profile/*`), và redirect `/login`, `/register` về `/home` khi đã có `access_token`. Đây chỉ là UX hint dựa trên cookie tồn tại — không decode/verify JWT. Phần check role riêng cho `/admin/*` xem [`authorization.md`](./authorization.md).

## Trang liên quan

```text
login/page.tsx (Server)
  └─► LoginForm ('use client')
        ├─► react-hook-form + zodResolver(loginSchema)
        ├─► loginAction()
        └─► ApiErrorAlert   # hiển thị lỗi qua useApiErrorMessage()
```
