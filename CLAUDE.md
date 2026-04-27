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
npm run format          # Prettier (apply)
npm run format:check    # Prettier (check only)

# Testing
npm run test            # Vitest (run once)
npm run test:watch      # Vitest (watch mode)
npm run test:coverage   # Coverage — 70% threshold on shared/lib/** and shared/hooks/**
npm run test:e2e        # Playwright end-to-end

# Utilities
npm run analyze         # Bundle size analysis
```

Run a single test file: `npx vitest run src/path/to/file.test.ts`

## Architecture

### Routing

App Router under `src/app/[locale]/` with three route groups:

- `(shop)` — public storefront
- `(auth)` — login / register
- `(admin)` — protected admin panel

`middleware.ts` handles two responsibilities: locale routing via **next-intl** (default locale `vi`) and server-side admin auth guard (checks `access_token` cookie).

### Shared Layer (`src/shared/`)

All cross-feature utilities live here:

| Path                         | Purpose                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| `components/ui/`             | Shadcn-style Radix primitive wrappers                                                    |
| `lib/http/`                  | Axios client + interceptors (auth token injection, `ApiError` transform, Sentry for 5xx) |
| `lib/errors/`                | `ApiError` class with helpers: `isUnauthorized()`, `isForbidden()`, `isValidation()`     |
| `lib/guards/`                | `AuthGuard` client component for route protection                                        |
| `lib/query-client.ts`        | React Query config — skip retry <500, retry 2× for server errors                         |
| `stores/`                    | Zustand stores (`auth-store`, `cart-store`) persisted to localStorage                    |
| `types/`                     | Zod schemas + `z.infer<>` TypeScript types for API contracts                             |
| `constants/api-endpoints.ts` | API path constants — functions for parameterized routes                                  |

### State Management

- **Zustand** (`subscribeWithSelector` + `persist`) for client state (auth tokens, cart)
- **React Query** for all server state; configured in `shared/lib/query-client.ts`

### HTTP Client

`shared/lib/http/` exports an `http` object:

```ts
http.get<T>(url, params?)
http.post<T>(url, body?)
http.put<T>(url, body?)
http.patch<T>(url, body?)
http.delete<T>(url)
```

Always returns `response.data` directly. Errors are transformed to `ApiError` by interceptor.

### Type Safety

Zod schemas in `shared/types/` validate API responses at runtime. TypeScript types are inferred via `z.infer<>`. `strict: true` in tsconfig. Import alias: `@/*` → `src/*`.

Enforced ESLint rules for Type Safety:

- **Strict Booleans**: Conditionals must use explicit boolean values (e.g., `if (val === true)` for `boolean | undefined` or `if (val !== null)` for nullable objects).
- **Boolean Literals**: Avoid redundant `=== true` for strict `boolean` types (e.g., use `if (val)` instead of `if (val === true)`).
- **Template Expressions**: Always convert non-string values to string in template literals (e.g., `${i.toString()}`).

### Styling

- **Tailwind CSS v4** — no `tailwind.config.ts`
- **CVA** (Class Variance Authority) for component variants
- Prettier auto-sorts Tailwind classes via `prettier-plugin-tailwindcss`

### Localization

**next-intl** with messages in `src/messages/` (`vi` default, `en` secondary). `formatCurrency`, `formatDate`, `slugify` in `shared/lib/utils.ts`. Dates use `date-fns` with Vietnamese locale; currency as VND.

### Environment

Variables validated with Zod in `shared/lib/env.ts`. Public vars use `NEXT_PUBLIC_` prefix. Backend is Django REST API (`/api/` prefix).

## Tooling

| Tool        | Config file                                                                                |
| ----------- | ------------------------------------------------------------------------------------------ |
| ESLint      | `eslint.config.mjs` (flat config)                                                          |
| Prettier    | `.prettierrc.mjs` — `semi:true`, `printWidth:150`, `arrowParens:'avoid'`, `endOfLine:'lf'` |
| Husky       | `.husky/pre-commit` → runs lint-staged                                                     |
| lint-staged | Defined in `package.json` — ESLint + Prettier on `*.{ts,tsx}`                              |

ESLint enforces: `@/*` alias imports (no `../` relative parents), no cross-feature imports (shared cannot import from app features), import order via `simple-import-sort`.

## Import Convention — ALWAYS use `@/*` alias

**Never** use `../` or `../../` to go up directories. Every import must use the `@/*` alias (maps to `src/*`).

```ts
// ✗ WRONG — triggers no-restricted-imports ESLint error
import { Foo } from '../_lib/types';
import { bar } from '../client';

// ✓ CORRECT
import { Foo } from '@/app/[locale]/(shop)/_lib/types';
import { bar } from '@/shared/lib/http/client';
```

Same-directory imports (`./foo`) are allowed. Only upward traversal (`../`) is banned.

## Code Conventions

### React Best Practices

- **Keys**: Never use array index in `key` props. Use unique, stable identifiers from data (e.g., `id`, `slug`, or the content itself if unique).

### Tailwind CSS v4 Patterns

- **Masking**: Use `mask-[...]` instead of `[mask-image:...]`.
- **Background Size**: Use `bg-size-[...]` instead of `bg-[size:...]`.
- **Naming**: Prefer standard Tailwind v4 utility-first naming over arbitrary value notation where possible.

### Product & Commerce

- **Badges**: Use the shared `BadgeValue` union type (`'best-seller' | 'new' | 'sale' | 'low-stock'`) for all product badges. Align feature-specific product types with shared `Product` schema where possible.
