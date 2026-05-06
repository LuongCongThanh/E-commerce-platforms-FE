---
title: FE Constraints & Conventions
status: active
audience: human
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-06
---

# FE Constraints & Conventions

> Đây là tài liệu đọc bắt buộc trước khi viết bất kỳ dòng code nào. Mọi rule ở đây đều được enforce bởi ESLint, TypeScript strict, hoặc pre-commit hook — vi phạm sẽ fail build.

---

## 1. Stack & Versions

| Layer          | Công nghệ             | Phiên bản       | Ghi chú                                                                       |
| -------------- | --------------------- | --------------- | ----------------------------------------------------------------------------- |
| Framework      | Next.js               | 15 (App Router) | Đọc `node_modules/next/dist/docs/` trước khi code — API thay đổi nhiều từ v14 |
| Language       | TypeScript            | 5.x strict      | `strict: true` trong tsconfig — không bypass                                  |
| Styling        | Tailwind CSS          | **v4**          | Không có `tailwind.config.ts` — cấu hình qua CSS vars                         |
| Components     | Shadcn/ui + Radix     | Latest          | Wrapper ở `shared/components/base/`                                           |
| State (server) | TanStack Query        | v5              | Config ở `shared/lib/query-client.ts`                                         |
| State (client) | Zustand               | Latest          | `subscribeWithSelector` + `persist`                                           |
| Forms          | React Hook Form + Zod | Latest          | Validate tại boundary, không inline                                           |
| HTTP           | Axios (wrapped)       | —               | Chỉ dùng `http` object từ `shared/lib/http/methods.ts`                        |
| i18n           | next-intl             | Latest          | Locale mặc định: `vi`. Messages: `src/messages/`                              |
| Linting        | ESLint flat config    | —               | `eslint.config.mjs`                                                           |
| Formatting     | Prettier              | —               | `printWidth:150`, `semi:true`, `arrowParens:'avoid'`, `endOfLine:'lf'`        |

---

## 2. Import Convention — Rule số 1

**Cấm tuyệt đối** dùng `../` để đi lên thư mục. Luôn dùng alias `@/*` (map sang `src/*`).

```ts
// ❌ FAIL — ESLint no-restricted-imports
import { Foo } from '../_lib/types';
import { bar } from '../../shared/lib/http/client';

// ✅ ĐÚNG
import { Foo } from '@/app/[locale]/(shop)/_lib/types/product';
import { bar } from '@/shared/lib/http/methods';
```

**Import cùng thư mục** (`./foo`) vẫn được phép. Chỉ cấm đi lên (`../`).

**Import order** được enforce bởi `simple-import-sort`. Prettier tự sort khi commit.

**Cross-feature imports bị cấm:** `shared/` không được import từ `app/(shop)/`, `app/(auth)/`, v.v. Feature chỉ được import từ `shared/`.

---

## 3. TypeScript Strict — Những lỗi thường gặp

### 3.1 Strict Booleans

```ts
// ❌ FAIL — value có thể undefined, không thể dùng như boolean
const enabled: boolean | undefined;
if (enabled) { ... }

// ✅
if (enabled === true) { ... }
```

```ts
// ❌ FAIL — object nullable
const user: User | null;
if (user) { ... }

// ✅
if (user !== null) { ... }
```

### 3.2 Không dùng `=== true` với `boolean` thuần

```ts
// ❌ Redundant — isLoading là boolean thuần
if (isLoading === true) { ... }

// ✅
if (isLoading) { ... }
```

### 3.3 Template literals phải là string

```ts
// ❌ FAIL
`ID: ${item.id}` // nếu id là number
`Count: ${items.length}` // nếu length là number
// ✅
`ID: ${item.id.toString()}``Count: ${items.length.toString()}`;
```

---

## 4. Tailwind CSS v4 — Patterns khác v3

### Cấm dùng arbitrary value khi có utility chuẩn

```html
<!-- ❌ v3 style — không dùng trong codebase này -->
<div class="[mask-image:linear-gradient(...)]">
  <div class="bg-[size:200%]">
    <!-- ✅ v4 utility -->
    <div class="mask-[linear-gradient(...)]">
      <div class="bg-size-[200%]"></div>
    </div>
  </div>
</div>
```

### Keys trong list — không dùng index

```tsx
// ❌ FAIL — index làm key
{
  items.map((item, i) => <Item key={i} />);
}

// ✅ Dùng stable ID
{
  items.map(item => <Item key={item.id} />);
}
```

### CVA cho component variants

```ts
import { cva } from 'class-variance-authority';
// Xem pattern trong shared/components/base/Button.tsx
```

---

## 5. HTTP Client

Chỉ dùng `http` object từ `@/shared/lib/http/methods`. Không import axios trực tiếp.

```ts
import { http } from '@/shared/lib/http/methods';

// Luôn returns response.data trực tiếp
const data = await http.get<Product[]>('/api/products');
const order = await http.post<Order>('/api/orders', payload);
```

Lỗi được transform thành `ApiError` bởi interceptor. Kiểm tra với helpers:

```ts
import { ApiError } from '@/shared/lib/errors/api-error';

catch (err) {
  if (err instanceof ApiError) {
    if (err.isUnauthorized()) { /* 401 */ }
    if (err.isValidation()) { /* 422 */ }
  }
}
```

API endpoints là constants, không hardcode string:

```ts
import { API_ENDPOINTS } from '@/shared/constants/api-endpoints';
// Parameterized: API_ENDPOINTS.product(slug)
```

---

## 6. Zustand Stores

Hai stores toàn cục, cả hai persist sang localStorage:

| Store          | File                         | Persist gì                    |
| -------------- | ---------------------------- | ----------------------------- |
| `useAuthStore` | `@/shared/stores/auth-store` | `user` (không persist token)  |
| `useCartStore` | `@/shared/stores/cart-store` | `items`, `total`, `itemCount` |

Không tạo store mới nếu state có thể giải quyết bằng React Query (server state) hoặc local `useState`.

---

## 7. React Query

Config tại `@/shared/lib/query-client.ts`:

- Retry: **0 lần** cho lỗi < 500, **2 lần** cho server errors (5xx).
- Query keys toàn cục: `@/shared/constants/query-keys`.
- Shop-specific keys: `@/app/[locale]/(shop)/_lib/query-keys`.
- **Server Components** dùng plain functions từ `queries.ts` — không dùng hooks.
- **Client Components** dùng hooks từ `_lib/hooks/`.

---

## 8. Route Groups & Middleware

```
src/app/[locale]/
├── (shop)/    ← public storefront, không cần auth
├── (auth)/    ← login/register/forgot/reset
└── (admin)/   ← protected — middleware kiểm tra cookie access_token
```

`middleware.ts` xử lý 2 việc: locale routing (next-intl) và admin auth guard. Không thêm logic vào middleware trừ khi liên quan 2 việc đó.

Locale mặc định `vi` — URL không có prefix (`/san-pham/...`). Locale `en` có prefix (`/en/san-pham/...`).

---

## 9. Zod & Type Safety

Schemas validate API responses tại runtime. Types được infer qua `z.infer<>` — không viết type thủ công cho API data.

```ts
// shared/types/product.ts
export const ProductSchema = z.object({ ... });
export type Product = z.infer<typeof ProductSchema>;
```

Validate response trong HTTP layer (zod-helpers), không trong component.

---

## 10. Localization

```ts
import { useTranslations } from 'next-intl';
import { formatCurrency, formatDate } from '@/shared/lib/utils';

// Currency: VND
formatCurrency(150000); // → "150.000 ₫"

// Date: date-fns với vi locale
formatDate(order.createdAt); // → "06 tháng 5, 2026"
```

Không hardcode text tiếng Việt hay Anh trong JSX — luôn dùng translation keys.

---

## 11. SEO & Metadata

Mỗi page phải có `generateMetadata()` hoặc static `metadata` export. Dùng helpers từ `@/shared/lib/seo`:

```ts
export async function generateMetadata({ params }) {
  return buildProductMetadata(product); // từ shared/lib/seo.ts
}
```

---

## 12. Environment Variables

Validate bằng Zod tại `@/shared/lib/env.ts`. Không đọc `process.env` trực tiếp trong components — import từ `env.ts`.

```ts
import { env } from '@/shared/lib/env';
env.NEXT_PUBLIC_API_URL; // type-safe
```

---

## 13. Commands nhanh

```bash
npm run dev          # Turbopack dev server
npm run lint         # ESLint check
npm run format       # Prettier apply
npm run test         # Vitest once
npm run test:watch   # Vitest watch
npm run build        # Production build (Webpack)
```

Pre-commit hook: ESLint + Prettier tự chạy trên `*.{ts,tsx}` trước mỗi commit.
