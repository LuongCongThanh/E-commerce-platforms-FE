# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# Development
npm run dev             # Start dev server (Turbopack)
npm run build           # Production build (Webpack)
npm run start           # Start production server

# Code quality
npm run lint            # ESLint (flat config)
npm run typecheck       # TypeScript (tsc --noEmit)
npm run format          # Prettier (apply)
npm run format:check    # Prettier (check only)

# Testing
npm run test            # Vitest (run once)
npm run test:watch      # Vitest (watch mode)
npm run test:e2e        # Playwright end-to-end
# LƯU Ý: test:coverage đang hỏng (scripts/coverage.mjs không tồn tại) — xem issue #10

# Utilities
npm run analyze         # Bundle size analysis
```

Run a single test file: `npx vitest run src/path/to/file.test.ts`

CI (`.github/workflows/ci.yml`) chạy lint + format:check + typecheck + unit tests trên mọi PR và push vào `master`. CI dùng Node 24 (khớp toolchain dev).

## Tài liệu chi tiết — đọc trước khi làm việc trong vùng liên quan

| Chủ đề                                                                                                                        | File                                   |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Bản đồ toàn bộ tài liệu                                                                                                       | `docs/README.md`                       |
| Glossary thuật ngữ domain                                                                                                     | `CONTEXT.md`                           |
| Tech stack theo layer                                                                                                         | `docs/architecture/tech-stack.md`      |
| Coding conventions đầy đủ                                                                                                     | `docs/architecture/conventions.md`     |
| Frontend architecture: module structure, routing, state, API client, auth, authorization, design system, testing, performance | `docs/architecture/frontend/README.md` |
| Quyết định kiến trúc                                                                                                          | `docs/adr/`                            |
| Git flow: branching, commit, PR, merge strategy                                                                               | `CONTRIBUTING.md`                      |

## Architecture (tóm tắt)

### Routing

App Router dưới `src/app/[locale]/` với ba route group:

- `(shop)` — storefront công khai
- `(auth)` — login / register
- `(admin)` — admin panel được bảo vệ

`middleware.ts` lo hai việc: locale routing qua **next-intl** (mặc định `vi`) và guard phía server bằng cookie `access_token` cho `admin/`, `checkout/`, `orders/`, `profile/` — riêng `admin/*` còn check thêm cookie role (`is_admin`). Đây chỉ là optimistic UX check (không decode/verify JWT), authorization thật do Django enforce lại; chi tiết: `docs/architecture/frontend/runtime.md#authorization`.

### Ownership — quy tắc quan trọng nhất

- Logic của mỗi route group nằm trong `_lib/` của nó (`api/`, `components/`, `hooks/`, `schemas/`, `store/`...). `_lib/` là private — không import chéo giữa các group.
- `src/shared/` chỉ chứa code dùng bởi ≥2 route group, không mang business rule riêng: `components/base/` (Radix wrappers), `components/common/`, `hooks/` (generic), `lib/` (http, errors, monitoring, seo, cloudinary, notification, utils, env, query-client), `constants/`, `types/`.
- **Auth session runtime (`auth-store.ts`, `AuthRuntimeProvider.tsx`, `auth-route-client.ts`) ở `src/core/session/`** — cross-cutting, dùng bởi `src/app/providers.tsx` cho toàn app nên KHÔNG đặt trong `(auth)/_lib` private; cart ở `(shop)/_lib/hooks/useCart.ts`. Không cái nào ở `shared/` (đã refactor tại PR #7, đừng tin tài liệu cũ nói ngược lại).
- ESLint (`eslint-plugin-boundaries`) enforce: shared không import từ route groups.

### State & HTTP

- Server state: **React Query** (`shared/lib/query-client.ts`). Client state: **Zustand** (`create()`, không dùng middleware `persist` — persist localStorage thủ công để né hydration-timing issue với Next.js SSR, xem ADR-0006).
- HTTP qua `http` object (`shared/lib/http/client.ts`): `http.get/post/put/patch/delete<T>()`, trả `response.data`, lỗi thành `ApiError`. Không gọi axios trực tiếp.
- Zod schemas validate API responses runtime; types qua `z.infer<>`; `strict: true`.

## Import Convention — ALWAYS use `@/*` alias

**Never** dùng relative import (`./foo`, `../bar`) — mọi import đều qua alias `@/*` (map `src/*`), kể cả cùng thư mục. ESLint sẽ chặn.

## Code Conventions (những rule hay vi phạm nhất)

- **Keys:** không dùng array index làm `key` — dùng id/slug.
- **Strict booleans:** so sánh tường minh (`val === true` cho `boolean | undefined`, `val !== null` cho nullable); nhưng không `=== true` thừa với strict boolean.
- **Template literals:** convert non-string (`${i.toString()}`).
- **Tailwind v4:** `mask-[...]`, `bg-size-[...]`; không có `tailwind.config.ts`; CVA cho variants; Prettier tự sort class.
- **Badges:** dùng union `BadgeValue` (`'best-seller' | 'new' | 'sale' | 'low-stock'`).
- Đầy đủ: `docs/architecture/conventions.md`.

## Localization

**next-intl**, messages trong `src/lang/` (`vi` mặc định, `en`). Tiền tệ VND qua `formatCurrency`, ngày qua `formatDate` (`shared/lib/utils.ts`).

## Environment

Env vars validate bằng Zod trong `shared/lib/env.ts` (bắt buộc: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`). Public vars prefix `NEXT_PUBLIC_`. Backend là Django REST API (prefix `/api/`).

## Tooling

| Tool        | Config                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------ |
| ESLint      | `eslint.config.mjs` (flat config)                                                          |
| Prettier    | `.prettierrc.mjs` — `semi:true`, `printWidth:150`, `arrowParens:'avoid'`, `endOfLine:'lf'` |
| Husky       | pre-commit → lint-staged + typecheck + unit tests; pre-push → production build             |
| lint-staged | `lint-staged.config.mjs`                                                                   |

## Agent skills

- **Issue tracker:** GitHub Issues (`LuongCongThanh/E-commerce-platforms-FE`). Xem `docs/agents/issue-tracker.md`.
- **Triage labels:** `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. Xem `docs/agents/triage-labels.md`.
- **Domain docs:** single-context — `CONTEXT.md` ở root + `docs/adr/`. Xem `docs/agents/domain.md`.
- **Skills overview:** mục đích và thời điểm dùng của từng skill trong `.claude/skills/`. Xem `docs/agents/skills-overview.md`.
