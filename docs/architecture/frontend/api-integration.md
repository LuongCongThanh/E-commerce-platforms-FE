# API Client

> Tầng sống. Last verified: 2026-07-23.

## Kiến trúc

| Lớp              | Trách nhiệm                                           | File                             |
| :--------------- | :---------------------------------------------------- | :------------------------------- |
| **HTTP object**  | `http.get/post/put/patch/delete`, trả `response.data` | `shared/lib/http/client.ts`      |
| **Transport**    | Axios instance, interceptor token + error             | `shared/lib/http/client.ts`      |
| **Validation**   | Parse runtime cho API responses                       | `shared/lib/http/zod-helpers.ts` |
| **Error**        | Chuẩn hóa lỗi thành `ApiError`                        | `shared/lib/errors/`             |
| **Schema types** | Zod schema + `z.infer<>` cho contracts                | `shared/types/`                  |

**Luồng dữ liệu:** Component → TanStack Query hook → `http.*()` → Axios + interceptors → Backend (Django REST, prefix `/api/`) → Zod validation → typed data.

Không bao giờ gọi axios trực tiếp — luôn đi qua `http` object.

## Hai nhánh gọi API

Auth cookie flow (login/register/logout/refresh) đi khác đường với mọi API còn lại:

```text
Nhánh A — auth cookie flow (chỉ login/register/logout/refresh)
  LoginForm / RegisterForm ('use client')
    └─► loginAction() / registerAction()      [(auth)/_lib/api/auth.ts]
          └─► callAuthRoute()                 [(auth)/_lib/http/auth-route-client.ts — fetch thuần, KHÔNG qua axios]
                └─► POST /api/auth/login       [Next.js Route Handler — src/app/api/auth/login/route.ts]
                      └─► fetch Django /api/auth/login/
                      └─► set-cookie: access_token + is_admin (httpOnly), refresh_token (httpOnly)
                └─► auth-store: setAccessToken() + setUser()   (useSyncExternalStore)

Nhánh B — mọi API khác (product/order/profile/forgot-password/reset-password...)
  Component/Hook
    └─► api/xxx.ts   [(shop|auth)/_lib/api/*]
          └─► http.get/post/put/patch/delete<T>()   [shared/lib/http/client.ts]
                └─► axios + interceptor (đính access_token, chuẩn hoá lỗi → ApiError)
                └─► Django REST API
```

> ⚠ Tên thư mục `api/` (`(auth)/_lib/api/auth.ts`, `(shop)/_lib/api/{order,product,profile}.ts`) đôi khi bị gọi nhầm là "actions" trong lời nói — nhưng các file này KHÔNG có directive `'use server'`, chỉ là wrapper gọi `http`/axios chạy phía client. Tránh nhầm với Next.js Server Actions.

## Luồng dữ liệu chuẩn trong 1 page

```text
page.tsx (Server Component, KHÔNG 'use client')
  └─► *Client.tsx  ('use client' container — vd: ProductsClient, CartClient, CheckoutClient)
        └─► useXxx() hook   (business logic + state)
              └─► api/xxx.ts  →  http client  →  Django REST API
                                                         ↑
                                     (mock: (shop)/_lib/data/*.ts khi API chưa sẵn sàng)
```

## Error handling

- HTTP error chuẩn hóa qua class `ApiError` (`shared/lib/errors/`) với helpers `isUnauthorized()`, `isForbidden()`, `isValidation()`.
- **Mutations** → toast (qua `notify` của `shared/lib/notification.ts`).
- **Queries** → Error Boundary.
- Route ký/admin (vd. upload ảnh) coi middleware/cookie là gợi ý UX, không phải authorization — Django là nguồn sự thật duy nhất; xem [`authorization.md`](./authorization.md) và [ADR-0004](../../adr/0004-upload-anh-qua-signed-cloudinary-route.md).
