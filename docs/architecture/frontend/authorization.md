# Authorization

> Tầng sống. Source of truth: `middleware.ts`, `src/core/session/AdminGuard.tsx`, `src/core/session/roles.ts`. Last verified: 2026-07-23.

## Nguyên tắc: FE chỉ làm optimistic UX check, Django là nguồn sự thật

Cả 2 lớp guard dưới đây đều tự comment rõ mình **không phải authorization thật** — chỉ tránh flash UI sai cho người dùng hợp lệ. Backend Django phải tự enforce lại role/permission trên từng request `/api/admin/*`, không được tin dữ liệu/cookie phía FE gửi lên.

## Lớp 1 — `middleware.ts` (server, dựa cookie)

```ts
const ADMIN_PATTERN = /^\/(vi|en)\/admin/;
// ...
if (ADMIN_PATTERN.test(pathname)) {
  const isAdmin = request.cookies.get(USER_ROLE_COOKIE)?.value === 'true'; // USER_ROLE_COOKIE = 'is_admin'
  if (!isAdmin) return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
}
```

- Cookie `is_admin` được set bởi `src/app/api/auth/login/route.ts` và `register/route.ts`, giá trị `isAdminRole(user.role) ? 'true' : 'false'` (`isAdminRole`: `role === 'admin' || role === 'staff'`) — xoá khi logout (`src/app/api/auth/logout/route.ts`).
- Middleware **không decode/verify JWT**, chỉ đọc cookie tồn tại + giá trị chuỗi — cookie có thể bị giả mạo/chỉnh tay phía client, nên đây chỉ là "gợi ý UX" (comment gốc trong `middleware.ts`: _"Optimistic UX check — KHÔNG phải authorization thật"_).
- `middleware.ts` cũng guard chung 4 nhóm path (`/admin/*`, `/checkout/*`, `/orders/*`, `/profile/*`) yêu cầu cookie `access_token` tồn tại (redirect `/login?returnUrl=...` nếu thiếu) — nhưng chỉ pattern `/admin/*` có thêm bước check `is_admin` ở trên.

## Lớp 2 — `AdminGuard` (client component)

`src/core/session/AdminGuard.tsx` bọc toàn bộ `(admin)/layout.tsx`:

- Đợi `useAuth()` hết `isInitializing`.
- Chưa đăng nhập → redirect `/login`.
- Đã đăng nhập nhưng không phải admin (`isAdmin` từ `useAuth()`) → redirect `/home`.
- Trong lúc chờ: render `PageLoader` (không leak nội dung admin trước khi xác nhận role).

## Gap còn lại

- Route ký Cloudinary (`src/app/api/admin/`) tự verify lại bằng cách gọi Django `GET /api/auth/me/` trước khi ký — **đúng mẫu** cần nhân rộng cho các route API nội bộ khác cần quyền admin, vì `middleware.ts` không cover `/api/*` (matcher loại trừ). Xem [ADR-0004](../../adr/0004-upload-anh-qua-signed-cloudinary-route.md).
- Chưa có trang thật dưới `/admin/products`, `/admin/orders` — cả 2 lớp guard ở trên đã sẵn sàng nhưng chưa có gì để bảo vệ ngoài `admin/page.tsx` (chỉ redirect). Xem [`routing.md`](./routing.md#admin-route-group--hiện-trạng-2026-07-23) và [ADR-0003](../../adr/0003-admin-core-scope-thu-gon.md) (phạm vi đợt đầu: Products + Orders).
