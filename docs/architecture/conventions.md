# Coding Conventions

> Tầng sống — quy ước bắt buộc khi viết code trong repo này. Chi tiết cấu trúc từng vùng: [shared-structure.md](./shared-structure.md), [shop-module-structure.md](./shop-module-structure.md).

Last verified: 2026-07-18

## Kiến trúc

- **Thin routes:** page/layout trong `app/[locale]/(group)/` chỉ orchestrate — không chứa business logic. Logic nằm trong `_lib/` của route group (`api/`, `components/`, `hooks/`, `schemas/`, `types/`, `data/`, `queries/`, `store/`). Đặt tên `api/` (không phải `actions/`) — tránh nhầm với Next.js Server Actions vì các file này không có `'use server'`.
- **Route group ownership:** `(shop)` storefront, `(auth)` đăng nhập/đăng ký, `(admin)` quản trị (middleware guard qua cookie `access_token`). `_lib/` của một group là private — group khác không import chéo.
- **Shared boundary:** một file chỉ vào `src/shared/` khi (1) không mang business rule của một module và (2) được dùng thực tế bởi ≥2 route group / flow độc lập. `shared/` không được import từ bất kỳ route group nào (enforce bằng `eslint-plugin-boundaries`). Quy tắc đầy đủ: [shared-structure.md](./shared-structure.md).

## Imports

- **Chỉ dùng alias `@/*`** (map về `src/*`) — cấm mọi relative import (`./`, `../`), kể cả cùng thư mục (enforce bằng ESLint).
- Thứ tự import tự động qua `simple-import-sort`.

## Naming

- Component file + export: `PascalCase`.
- Hook file: `useCamelCase.ts`.
- Utility / constants / types file: `kebab-case.ts` hoặc `camelCase.ts` — nhất quán trong cùng nhóm.
- Static constants: `UPPER_SNAKE_CASE`.

## Typing

- `strict: true`; không dùng `any` nếu không có lý do bắt buộc.
- Schema-first với Zod ở mọi boundary (API response, env, form).
- ESLint enforce: `strict-boolean-expressions` (so sánh tường minh với `boolean | undefined` và nullable), không `=== true` thừa với strict boolean, template literal phải convert non-string (`${i.toString()}`).

## Error handling

- HTTP error chuẩn hóa qua class `ApiError` (`shared/lib/errors/`) với helpers `isUnauthorized()`, `isForbidden()`, `isValidation()`.
- Mutations → toast (qua `notify` của `shared/lib/notification.ts`); Queries → Error Boundary.

## React

- Không dùng array index làm `key` — dùng id/slug/nội dung unique.
- Badge sản phẩm dùng union `BadgeValue` (`'best-seller' | 'new' | 'sale' | 'low-stock'`).

## Tailwind v4

- `mask-[...]` thay vì `[mask-image:...]`; `bg-size-[...]` thay vì `bg-[size:...]`.
- Ưu tiên utility chuẩn v4 hơn arbitrary value.
- Class được Prettier tự sort (`prettier-plugin-tailwindcss`).

## Design system

- Token-first: color scale + semantic tokens định nghĩa trong `@theme` tại `src/app/globals.css`; không hardcode màu/radius lẻ tẻ.
- Tách primitive (`shared/components/base/`) khỏi feature component (`(group)/_lib/components/`).
- Mobile-first, breakpoint thống nhất.

## Testing

- Unit: utils, hooks, store (Vitest + Testing Library, test trong `__tests__/` cạnh module).
- Test hành vi bên ngoài, không test implementation details.
- E2E: core journeys qua Playwright — seam duy nhất cho E2E/a11y/visual (ADR 0001).

## i18n

- Namespace theo module, messages trong `src/lang/vi/` và `src/lang/en/` (mỗi namespace 1 file JSON).
- Không hardcode copy đa ngôn ngữ trong component.
- Tiền tệ VND qua `formatCurrency`, ngày `dd/MM/yyyy` qua `formatDate` (date-fns, locale vi) — cả hai ở `shared/lib/utils.ts`.

## SEO

- Mọi page chính có metadata qua `buildMetadata()` (`shared/lib/seo.ts`).

## Commit & PR

- Pre-commit: lint-staged (ESLint + Prettier) + typecheck + unit tests. Pre-push: production build.
- Quy ước đầy đủ về branching, commit message (Conventional Commits, enforced bằng commitlint), PR process và merge strategy: xem [`CONTRIBUTING.md`](../../CONTRIBUTING.md).
