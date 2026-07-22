# Coding Conventions

> Tầng sống — quy ước bắt buộc khi viết code trong repo này. Kiến trúc chi tiết (routing, module structure, state, API, auth, design system, testing): [`frontend/README.md`](./frontend/README.md).

Last verified: 2026-07-18

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

## React

- Không dùng array index làm `key` — dùng id/slug/nội dung unique.

## Tailwind v4

- `mask-[...]` thay vì `[mask-image:...]`; `bg-size-[...]` thay vì `bg-[size:...]`.
- Ưu tiên utility chuẩn v4 hơn arbitrary value.
- Class được Prettier tự sort (`prettier-plugin-tailwindcss`).

> Design system, testing: xem [`frontend/quality.md`](./frontend/quality.md). Error handling: xem [`frontend/runtime.md`](./frontend/runtime.md#error-handling).

## i18n

- Namespace theo module, messages trong `src/lang/vi/` và `src/lang/en/` (mỗi namespace 1 file JSON).
- Không hardcode copy đa ngôn ngữ trong component.
- Tiền tệ VND qua `formatCurrency`, ngày `dd/MM/yyyy` qua `formatDate` (date-fns, locale vi) — cả hai ở `shared/lib/utils.ts`.

## SEO

- Mọi page chính có metadata qua `buildMetadata()` (`shared/lib/seo.ts`).

## Commit & PR

- Pre-commit: lint-staged (ESLint + Prettier) + typecheck + unit tests. Pre-push: production build.
- Quy ước đầy đủ về branching, commit message (Conventional Commits, enforced bằng commitlint), PR process và merge strategy: xem [`CONTRIBUTING.md`](../../CONTRIBUTING.md).
