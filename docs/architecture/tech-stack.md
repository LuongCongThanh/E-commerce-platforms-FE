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

## Kiến trúc chi tiết

- API client, error handling, state ownership (server/client, vì sao auth store không ở `shared/`, note `zustand` thừa): [`frontend/runtime.md`](./frontend/runtime.md)
- Quality gates, coverage gap (issue #10): [`frontend/quality.md`](./frontend/quality.md)
