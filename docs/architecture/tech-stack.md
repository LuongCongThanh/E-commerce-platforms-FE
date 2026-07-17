# Tech Stack

> Tầng sống — phải phản ánh đúng hiện trạng. Phiên bản cụ thể: xem `package.json` (nguồn sự thật duy nhất, tài liệu này không ghi version để tránh lệch).

Last verified: 2026-07-18

## Stack theo layer

| Layer            | Công nghệ                               | Lý do chọn                                                       |
| ---------------- | --------------------------------------- | ---------------------------------------------------------------- |
| App framework    | Next.js (App Router)                    | SSR/SEO tốt, route group pattern phù hợp module-driven           |
| UI runtime       | React 19                                | Hiệu năng tốt, ecosystem lớn                                     |
| Styling          | Tailwind CSS v4 + CVA + tailwind-merge  | Utility-first, variants qua CVA, không có `tailwind.config.ts`   |
| UI primitives    | Radix UI (shadcn-style wrappers)        | Accessibility có sẵn, wrap tại `shared/components/base/`         |
| Server state     | TanStack Query                          | Cache + retry nhất quán, config tại `shared/lib/query-client.ts` |
| Client state     | `useSyncExternalStore` (React built-in) | Store module-level, không cần thư viện ngoài                     |
| HTTP             | Axios (qua `http` object)               | Interceptor tập trung: token, `ApiError`, Sentry                 |
| Forms            | React Hook Form + @hookform/resolvers   | Form performance tốt, tích hợp Zod                               |
| Validation       | Zod v4                                  | Schema-first cho API contracts, env, form                        |
| i18n             | next-intl                               | Locale routing (`vi` mặc định, `en`), messages trong `src/lang/` |
| Monitoring       | Sentry (@sentry/nextjs)                 | Theo dõi lỗi production                                          |
| PWA              | Serwist (@serwist/next)                 | Service worker, offline page                                     |
| Toast            | Sonner                                  | Wrap qua `shared/lib/notification.ts`                            |
| Image CDN        | Cloudinary (`buildImageUrl()`)          | Transform on-the-fly                                             |
| Unit/integration | Vitest + Testing Library + MSW          | Nhanh, jsdom, mock network tầng handler                          |
| E2E              | Playwright                              | 3 browser; seam duy nhất cho E2E/a11y/visual (xem ADR 0001)      |
| Lint/format      | ESLint 9 (flat) + Prettier + Husky      | Enforce qua pre-commit (lint-staged) và CI                       |

## Kiến trúc API client

| Lớp              | Trách nhiệm                                           | File                             |
| :--------------- | :---------------------------------------------------- | :------------------------------- |
| **HTTP object**  | `http.get/post/put/patch/delete`, trả `response.data` | `shared/lib/http/client.ts`      |
| **Transport**    | Axios instance, interceptor token + error             | `shared/lib/http/client.ts`      |
| **Validation**   | Parse runtime cho API responses                       | `shared/lib/http/zod-helpers.ts` |
| **Error**        | Chuẩn hóa lỗi thành `ApiError`                        | `shared/lib/errors/`             |
| **Schema types** | Zod schema + `z.infer<>` cho contracts                | `shared/types/`                  |

**Luồng dữ liệu:** Component → TanStack Query hook → `http.*()` → Axios + interceptors → Backend (Django REST, prefix `/api/`) → Zod validation → typed data.

Không bao giờ gọi axios trực tiếp — luôn đi qua `http` object.

## Ranh giới state

- **Server state:** TanStack Query.
- **Client state:** `useSyncExternalStore` + module-level store — auth tại `(auth)/_lib/store/auth-store.ts`, cart tại `(shop)/_lib/hooks/useCart.ts`. Không dùng Zustand hay thư viện state ngoài (`zustand` còn trong `package.json` là dependency thừa — xem ghi chú cuối).
- **Local UI state:** `useState`/`useReducer` trong component.

## Quality gates

Trước merge (enforce bởi CI — `.github/workflows/ci.yml`):

- `npm run lint` pass.
- `npm run format:check` pass.
- `npm run typecheck` pass.
- `npm run test` pass.

Trước release:

- `npm run build` pass (hiện chạy ở pre-push hook).
- Core journeys có E2E coverage (`npm run test:e2e`) — đang triển khai theo issue #8.

## Ghi chú hiện trạng

- Coverage gate 99% trong `vitest.config.ts` chưa enforce được trong CI — xem issue #10.
- `zustand` có trong `package.json` nhưng không được import ở đâu trong `src/` — ứng viên gỡ bỏ.
