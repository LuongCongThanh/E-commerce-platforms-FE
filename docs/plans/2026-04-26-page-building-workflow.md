# Page-Building Workflow — MVP E-commerce (Vietnam)

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Provide a repeatable, step-by-step workflow for building every MVP page — from route scaffolding through data layer, UI, i18n, SEO, testing, and review gates.

**Architecture:** App Router thin routes (`src/app/[locale]/`) composing module containers (`src/modules/`). Business logic lives in modules; shared utilities in `src/shared/`. No `../` imports — use `@/*` alias everywhere.

**Tech Stack:** Next.js 16 · React 19 · Tailwind v4 · TanStack Query v5 · Zustand v5 · Zod v4 · React Hook Form 7 · next-intl 4 · Vitest 4 · Playwright 1.59 · Sentry

---

## MVP Page Registry

| Priority | Page                        | Route                       | Module             | Group       |
| -------- | --------------------------- | --------------------------- | ------------------ | ----------- |
| P1-01    | Home                        | `/`                         | `modules/shop`     | `(shop)`    |
| P1-01    | Product Listing / Search    | `/search` or `/c/[slug]`    | `modules/shop`     | `(shop)`    |
| P1-01    | Product Detail (PDP)        | `/p/[slug]`                 | `modules/shop`     | `(shop)`    |
| P1-02    | Login                       | `/login`                    | `modules/auth`     | `(auth)`    |
| P1-02    | Register                    | `/register`                 | `modules/auth`     | `(auth)`    |
| P1-02    | Forgot Password             | `/forgot-password`          | `modules/auth`     | `(auth)`    |
| P1-02    | Reset Password              | `/reset-password`           | `modules/auth`     | `(auth)`    |
| P1-03    | Cart                        | `/cart`                     | `modules/checkout` | `(shop)`    |
| P1-04    | Checkout                    | `/checkout`                 | `modules/checkout` | `(shop)`    |
| P1-05    | Order Confirmation          | `/orders/[id]/confirmation` | `modules/orders`   | `(account)` |
| P1-05    | Order History               | `/orders`                   | `modules/orders`   | `(account)` |
| P1-05    | Order Detail                | `/orders/[id]`              | `modules/orders`   | `(account)` |
| P1-06    | Admin — Product List        | `/admin/products`           | `modules/admin`    | `(admin)`   |
| P1-06    | Admin — Product Create/Edit | `/admin/products/[id]`      | `modules/admin`    | `(admin)`   |
| P1-06    | Admin — Order List          | `/admin/orders`             | `modules/admin`    | `(admin)`   |
| P1-06    | Admin — Order Detail        | `/admin/orders/[id]`        | `modules/admin`    | `(admin)`   |

---

## The 7-Phase Page Workflow

Apply this workflow **once per page**. Each phase ends with a commit.

```
Phase 1 → Route scaffold
Phase 2 → Zod types + API hook
Phase 3 → Module container (skeleton)
Phase 4 → UI sections + Tailwind
Phase 5 → i18n strings
Phase 6 → SEO metadata
Phase 7 → Tests + review gate
```

---

## Phase 1 — Route Scaffold

**Skills:** `nextjs-app-router-patterns`, `react-nextjs-development`

### Task 1.1: Create the route file

**Files:**

- Create: `src/app/[locale]/(GROUP)/PAGE_PATH/page.tsx`
- Create: `src/app/[locale]/(GROUP)/PAGE_PATH/loading.tsx`
- Create: `src/app/[locale]/(GROUP)/PAGE_PATH/error.tsx`

**Step 1: Write the page shell**

```tsx
// src/app/[locale]/(shop)/p/[slug]/page.tsx
import type { Metadata } from 'next';
import { ProductDetailContainer } from '@/modules/shop/product-detail/product-detail-container';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ProductDetailContainer slug={slug} />;
}
```

**Step 2: Write the loading skeleton**

```tsx
// src/app/[locale]/(shop)/p/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="bg-muted h-64 rounded" />
      <div className="bg-muted h-8 w-2/3 rounded" />
      <div className="bg-muted h-4 w-1/3 rounded" />
    </div>
  );
}
```

**Step 3: Write the error boundary**

```tsx
// src/app/[locale]/(shop)/p/[slug]/error.tsx
'use client';
import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="p-4 text-center">
      <p className="text-danger text-sm">Đã xảy ra lỗi. Vui lòng thử lại.</p>
      <button onClick={reset} className="text-primary mt-2 text-sm underline">
        Thử lại
      </button>
    </div>
  );
}
```

**Step 4: Verify no TS errors**

```bash
npx tsc --noEmit
```

Expected: no output (zero errors).

**Step 5: Commit**

```bash
git add src/app/[locale]/...
git commit -m "feat(shop): scaffold product-detail route shell"
```

---

## Phase 2 — Zod Types + API Hook

**Skills:** `zod-validation-expert`, `tanstack-query-expert`

### Task 2.1: Define Zod schema in shared/types

**Files:**

- Create or update: `src/shared/types/product.ts`
- Update: `src/shared/constants/api-endpoints.ts`

**Step 1: Write failing Vitest test for the schema**

```ts
// src/shared/types/__tests__/product.test.ts
import { describe, it, expect } from 'vitest';
import { ProductSchema } from '@/shared/types/product';

describe('ProductSchema', () => {
  it('parses a valid product payload', () => {
    const raw = {
      id: 1,
      name: 'Test Product',
      slug: 'test-product',
      price: 199000,
      images: [{ url: '/img.jpg', alt: 'img' }],
      stock: 10,
    };
    const result = ProductSchema.safeParse(raw);
    expect(result.success).toBe(true);
  });

  it('rejects a product with missing slug', () => {
    const raw = { id: 1, name: 'No Slug', price: 0 };
    expect(ProductSchema.safeParse(raw).success).toBe(false);
  });
});
```

**Step 2: Run — expect FAIL**

```bash
npx vitest run src/shared/types/__tests__/product.test.ts
```

Expected: `FAIL` — `ProductSchema` not found.

**Step 3: Implement the schema**

```ts
// src/shared/types/product.ts
import { z } from 'zod';

export const ProductImageSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
});

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  images: z.array(ProductImageSchema).default([]),
  stock: z.number().default(0),
  description: z.string().optional(),
  categorySlug: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
```

**Step 4: Run — expect PASS**

```bash
npx vitest run src/shared/types/__tests__/product.test.ts
```

Expected: `PASS`.

**Step 5: Add API endpoint constant**

```ts
// src/shared/constants/api-endpoints.ts (add to existing file)
export const PRODUCT_ENDPOINTS = {
  detail: (slug: string) => `/api/products/${slug}`,
  list: '/api/products',
} as const;
```

**Step 6: Create TanStack Query hook in module**

```ts
// src/modules/shop/product-detail/use-product-detail.ts
import { useQuery } from '@tanstack/react-query';
import { http } from '@/shared/lib/http/client';
import { ProductSchema } from '@/shared/types/product';
import { PRODUCT_ENDPOINTS } from '@/shared/constants/api-endpoints';

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const data = await http.get(PRODUCT_ENDPOINTS.detail(slug));
      return ProductSchema.parse(data);
    },
    staleTime: 1000 * 60 * 5,
  });
}
```

**Step 7: Write hook test**

```ts
// src/modules/shop/product-detail/__tests__/use-product-detail.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useProductDetail } from '@/modules/shop/product-detail/use-product-detail';
import { createQueryWrapper } from '@/tests/utils/query-wrapper';

vi.mock('@/shared/lib/http/client', () => ({
  http: {
    get: vi.fn().mockResolvedValue({
      id: 1,
      name: 'Test',
      slug: 'test',
      price: 100000,
      images: [],
      stock: 5,
    }),
  },
}));

describe('useProductDetail', () => {
  it('returns parsed product data', async () => {
    const { result } = renderHook(() => useProductDetail('test'), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.slug).toBe('test');
  });
});
```

**Step 8: Run — expect PASS**

```bash
npx vitest run src/modules/shop/product-detail/__tests__/use-product-detail.test.ts
```

**Step 9: Commit**

```bash
git add src/shared/types/ src/shared/constants/ src/modules/shop/product-detail/
git commit -m "feat(shop): add product schema, endpoint, and detail query hook"
```

---

## Phase 3 — Module Container (Skeleton)

**Skills:** `react-nextjs-development`, `react-best-practices`

### Task 3.1: Build the module container

**Files:**

- Create: `src/modules/MODULE/PAGE/PAGE-container.tsx`

**Step 1: Write the container with loading/error/data states**

```tsx
// src/modules/shop/product-detail/product-detail-container.tsx
'use client';
import { useProductDetail } from './use-product-detail';
import { ProductDetailSkeleton } from './product-detail-skeleton';
import { ProductDetailView } from './product-detail-view';

interface Props {
  slug: string;
}

export function ProductDetailContainer({ slug }: Props) {
  const { data, isLoading, isError } = useProductDetail(slug);

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError || !data) {
    return <div className="text-danger p-4 text-center text-sm">Không tìm thấy sản phẩm.</div>;
  }

  return <ProductDetailView product={data} />;
}
```

**Step 2: Create skeleton**

```tsx
// src/modules/shop/product-detail/product-detail-skeleton.tsx
export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4 md:flex md:gap-8 md:space-y-0">
      <div className="bg-muted h-80 w-full rounded-lg md:w-1/2" />
      <div className="flex-1 space-y-3">
        <div className="bg-muted h-7 w-3/4 rounded" />
        <div className="bg-muted h-5 w-1/3 rounded" />
        <div className="bg-muted h-10 w-1/2 rounded" />
      </div>
    </div>
  );
}
```

**Step 3: Create view stub (to be fleshed out in Phase 4)**

```tsx
// src/modules/shop/product-detail/product-detail-view.tsx
import type { Product } from '@/shared/types/product';

interface Props {
  product: Product;
}

export function ProductDetailView({ product }: Props) {
  return (
    <div data-testid="product-detail">
      <h1>{product.name}</h1>
    </div>
  );
}
```

**Step 4: Run lint + tsc**

```bash
npm run lint && npx tsc --noEmit
```

Expected: no errors.

**Step 5: Commit**

```bash
git add src/modules/shop/product-detail/
git commit -m "feat(shop): add product-detail container, skeleton, and view stub"
```

---

## Phase 4 — UI Sections + Tailwind

**Skills:** `tailwind-patterns`, `frontend-design`, `ui-review`

### Task 4.1: Implement the view with Tailwind v4

**Reference design constraints from `docs/04-project-structure-guidelines-design-system-conventions.en.md`:**

- Mobile-first breakpoints
- Semantic color tokens (`primary`, `accent`, `danger`, `muted`)
- Explicit heading hierarchy

**Step 1: Flesh out the view component**

```tsx
// src/modules/shop/product-detail/product-detail-view.tsx
'use client';
import { useState } from 'react';
import type { Product } from '@/shared/types/product';
import { formatCurrency } from '@/shared/lib/utils';
import { AddToCartButton } from '@/modules/checkout/cart/add-to-cart-button';

interface Props {
  product: Product;
}

export function ProductDetailView({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:flex md:gap-10">
      {/* Image gallery */}
      <div className="md:w-1/2">
        <div className="bg-muted aspect-square overflow-hidden rounded-xl">
          {product.images[selectedImage] && (
            <img
              src={product.images[selectedImage].url}
              alt={product.images[selectedImage].alt ?? product.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`size-16 overflow-hidden rounded-lg border-2 ${i === selectedImage ? 'border-primary' : 'border-transparent'}`}
              >
                <img src={img.url} alt={img.alt ?? ''} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="mt-6 flex-1 md:mt-0">
        <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-primary text-2xl font-semibold">{formatCurrency(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-muted text-sm line-through">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>

        {product.stock === 0 ? (
          <p className="text-danger mt-2 text-sm">Hết hàng</p>
        ) : (
          <p className="text-muted mt-2 text-sm">Còn hàng ({product.stock})</p>
        )}

        {product.description && <p className="text-foreground/80 mt-4 text-sm leading-relaxed">{product.description}</p>}

        <div className="mt-6">
          <AddToCartButton product={product} disabled={product.stock === 0} />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Run build to catch Tailwind + JSX errors**

```bash
npm run build 2>&1 | head -50
```

Expected: successful compilation (or only pre-existing warnings).

**Step 3: Self-review checklist (ui-review gate)**

```
[ ] Mobile-first — tested at 375px
[ ] Uses semantic color tokens only (primary/accent/danger/muted), no hex codes
[ ] Heading hierarchy correct (h1 on page title)
[ ] All interactive elements have visible focus ring
[ ] Images have alt text
[ ] Disabled state for out-of-stock is visible
```

**Step 4: Commit**

```bash
git add src/modules/shop/product-detail/product-detail-view.tsx
git commit -m "feat(shop): implement product-detail view with Tailwind v4"
```

---

## Phase 5 — i18n Strings

**Skills:** `i18n-localization`

### Task 5.1: Add translation keys

**Files:**

- Modify: `src/messages/vi.json`
- Modify: `src/messages/en.json`

**Namespace convention:** `<module>.<page>.<key>` — e.g., `shop.productDetail.outOfStock`

**Step 1: Add keys to vi.json**

```json
{
  "shop": {
    "productDetail": {
      "outOfStock": "Hết hàng",
      "inStock": "Còn hàng ({count})",
      "addToCart": "Thêm vào giỏ",
      "notFound": "Không tìm thấy sản phẩm."
    }
  }
}
```

**Step 2: Add keys to en.json**

```json
{
  "shop": {
    "productDetail": {
      "outOfStock": "Out of stock",
      "inStock": "In stock ({count})",
      "addToCart": "Add to cart",
      "notFound": "Product not found."
    }
  }
}
```

**Step 3: Replace hardcoded strings in view**

```tsx
// in product-detail-view.tsx
import { useTranslations } from 'next-intl';

export function ProductDetailView({ product }: Props) {
  const t = useTranslations('shop.productDetail');
  // Replace:  "Hết hàng"  →  t('outOfStock')
  // Replace:  "Còn hàng"  →  t('inStock', { count: product.stock })
  // etc.
```

**Step 4: Verify no hardcoded vi strings remain**

```bash
grep -rn "Hết hàng\|Còn hàng\|Thêm vào" src/modules/shop/product-detail/
```

Expected: no output.

**Step 5: Commit**

```bash
git add src/messages/ src/modules/shop/product-detail/
git commit -m "feat(shop): add i18n keys for product-detail page"
```

---

## Phase 6 — SEO Metadata

**Skills:** `nextjs-app-router-patterns`, `nextjs-best-practices`

### Task 6.1: Add dynamic metadata to route

**Files:**

- Modify: `src/app/[locale]/(shop)/p/[slug]/page.tsx`

**Step 1: Add generateMetadata export**

```tsx
// src/app/[locale]/(shop)/p/[slug]/page.tsx
import type { Metadata } from 'next';
import { http } from '@/shared/lib/http/client';
import { ProductSchema } from '@/shared/types/product';
import { PRODUCT_ENDPOINTS } from '@/shared/constants/api-endpoints';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const data = await http.get(PRODUCT_ENDPOINTS.detail(slug));
    const product = ProductSchema.parse(data);
    return {
      title: product.name,
      description: product.description ?? `Mua ${product.name} tại cửa hàng`,
      openGraph: {
        title: product.name,
        description: product.description ?? '',
        images: product.images[0] ? [{ url: product.images[0].url }] : [],
        locale,
        type: 'website',
      },
    };
  } catch {
    return { title: 'Sản phẩm' };
  }
}
```

**Step 2: Verify metadata is correct with Next.js dev server**

```bash
npm run dev
# Open: http://localhost:3000/vi/p/some-slug
# Check: <title> and <meta name="description"> in DevTools > Elements
```

**Step 3: Commit**

```bash
git add src/app/[locale]/\(shop\)/p/
git commit -m "feat(shop): add dynamic SEO metadata for PDP"
```

---

## Phase 7 — Tests + Review Gate

**Skills:** `testing-qa`, `e2e-testing`, `systematic-debugging`, `lint-and-validate`

### Task 7.1: Unit tests for the view component

```tsx
// src/modules/shop/product-detail/__tests__/product-detail-view.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProductDetailView } from '@/modules/shop/product-detail/product-detail-view';

const mockProduct = {
  id: 1,
  name: 'Áo thun',
  slug: 'ao-thun',
  price: 150000,
  images: [],
  stock: 3,
};

describe('ProductDetailView', () => {
  it('shows product name', () => {
    render(<ProductDetailView product={mockProduct} />);
    expect(screen.getByRole('heading', { name: 'Áo thun' })).toBeInTheDocument();
  });

  it('shows out-of-stock state when stock is 0', () => {
    render(<ProductDetailView product={{ ...mockProduct, stock: 0 }} />);
    expect(screen.getByText(/hết hàng/i)).toBeInTheDocument();
  });
});
```

**Run:**

```bash
npx vitest run src/modules/shop/product-detail/__tests__/product-detail-view.test.tsx
```

Expected: PASS.

### Task 7.2: E2E test for the PDP journey

```ts
// src/tests/e2e/product-detail.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('shows product info and add-to-cart button', async ({ page }) => {
    await page.goto('/vi/p/test-product-slug');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: /thêm vào giỏ/i })).toBeVisible();
  });

  test('shows out-of-stock state', async ({ page }) => {
    await page.goto('/vi/p/out-of-stock-slug');
    await expect(page.getByText(/hết hàng/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /thêm vào giỏ/i })).toBeDisabled();
  });
});
```

**Run:**

```bash
npm run test:e2e -- --grep "Product Detail"
```

### Task 7.3: Full quality gate

```bash
npm run lint          # must pass
npm run format:check  # must pass
npm run test          # must pass
npm run build         # must pass
```

### Task 7.4: Review gate checklist

```
[ ] All unit tests pass (coverage > 70% on hooks and utils)
[ ] E2E happy path passes for this page's core journey
[ ] No TypeScript errors (tsc --noEmit)
[ ] No ESLint errors or warnings
[ ] build succeeds without warnings
[ ] Mobile layout verified at 375px
[ ] SEO: <title>, <meta description>, OG tags present
[ ] i18n: no hardcoded user-visible strings in vi
[ ] Error state renders without crashing
[ ] Loading skeleton present and matches layout shape
```

**Step: Final commit**

```bash
git add .
git commit -m "feat(shop): complete product-detail page — tests, i18n, SEO, review gate"
```

---

## Per-Page Application Guide

Repeat the 7-phase workflow for each page. Quick reference:

### P1-01 Storefront

| Page       | Module path                    | Data hook          | Zustand store | Key Zod type        |
| ---------- | ------------------------------ | ------------------ | ------------- | ------------------- |
| Home       | `modules/shop/home/`           | `useHomeData`      | —             | `HomeSectionSchema` |
| PLP/Search | `modules/shop/product-list/`   | `useProductList`   | —             | `ProductListSchema` |
| PDP        | `modules/shop/product-detail/` | `useProductDetail` | —             | `ProductSchema`     |

### P1-02 Auth

| Page            | Module path                     | Data hook                   | Form            | Key Zod schema   |
| --------------- | ------------------------------- | --------------------------- | --------------- | ---------------- |
| Login           | `modules/auth/login/`           | `useLoginMutation`          | React Hook Form | `LoginSchema`    |
| Register        | `modules/auth/register/`        | `useRegisterMutation`       | React Hook Form | `RegisterSchema` |
| Forgot Password | `modules/auth/forgot-password/` | `useForgotPasswordMutation` | React Hook Form | `ForgotSchema`   |
| Reset Password  | `modules/auth/reset-password/`  | `useResetPasswordMutation`  | React Hook Form | `ResetSchema`    |

### P1-03/04 Cart + Checkout

| Page     | Module path                  | Data hook                | Zustand store | Key Zod type                        |
| -------- | ---------------------------- | ------------------------ | ------------- | ----------------------------------- |
| Cart     | `modules/checkout/cart/`     | —                        | `cart-store`  | `CartItemSchema`                    |
| Checkout | `modules/checkout/checkout/` | `useCreateOrderMutation` | `cart-store`  | `CheckoutFormSchema`, `OrderSchema` |

### P1-05 Orders

| Page         | Module path                    | Data hook        | Key Zod type      |
| ------------ | ------------------------------ | ---------------- | ----------------- |
| Confirmation | `modules/orders/confirmation/` | `useOrderDetail` | `OrderSchema`     |
| History      | `modules/orders/order-list/`   | `useOrderList`   | `OrderListSchema` |
| Detail       | `modules/orders/order-detail/` | `useOrderDetail` | `OrderSchema`     |

### P1-06 Admin

| Page         | Module path                   | Data hook                  | Key Zod type        |
| ------------ | ----------------------------- | -------------------------- | ------------------- |
| Product List | `modules/admin/product-list/` | `useAdminProductList`      | `ProductSchema`     |
| Product Form | `modules/admin/product-form/` | `useUpsertProductMutation` | `ProductFormSchema` |
| Order List   | `modules/admin/order-list/`   | `useAdminOrderList`        | `AdminOrderSchema`  |
| Order Detail | `modules/admin/order-detail/` | `useAdminOrderDetail`      | `AdminOrderSchema`  |

---

## Form Pages — Extra Phase 2.5

For pages with forms (Auth, Checkout, Admin Product Form), insert this phase between Phase 2 and Phase 3:

### Task 2.5: React Hook Form + Zod integration

```ts
// Example: modules/auth/login/use-login-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

export function useLoginForm() {
  return useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });
}
```

**Test the schema:**

```ts
describe('LoginSchema', () => {
  it('rejects invalid email', () => {
    expect(LoginSchema.safeParse({ email: 'not-email', password: '123456' }).success).toBe(false);
  });
  it('rejects short password', () => {
    expect(LoginSchema.safeParse({ email: 'a@b.com', password: '123' }).success).toBe(false);
  });
  it('accepts valid credentials', () => {
    expect(LoginSchema.safeParse({ email: 'a@b.com', password: '123456' }).success).toBe(true);
  });
});
```

---

## Skill Activation Per Phase

| Phase              | Primary skill to invoke      | Secondary skill            |
| ------------------ | ---------------------------- | -------------------------- |
| 1 — Route scaffold | `nextjs-app-router-patterns` | `react-nextjs-development` |
| 2 — Data layer     | `tanstack-query-expert`      | `zod-validation-expert`    |
| 2.5 — Forms        | `zod-validation-expert`      | `react-best-practices`     |
| 3 — Container      | `react-nextjs-development`   | `react-best-practices`     |
| 4 — UI             | `tailwind-patterns`          | `frontend-design`          |
| 5 — i18n           | `i18n-localization`          | —                          |
| 6 — SEO            | `nextjs-app-router-patterns` | `nextjs-best-practices`    |
| 7 — Tests          | `testing-qa`                 | `e2e-testing`              |
| Review gate        | `ui-review`                  | `lint-and-validate`        |

---

## Shared Test Utility (create once, reuse everywhere)

```ts
// src/tests/utils/query-wrapper.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}
```

---

## Anti-Patterns to Avoid

| Anti-pattern                             | Why it breaks            | Fix                                  |
| ---------------------------------------- | ------------------------ | ------------------------------------ |
| Business logic in `page.tsx`             | Violates thin-route rule | Move to module container             |
| `import from '../../shared'`             | ESLint will error        | Use `@/shared/...`                   |
| Hardcoded `#FF0000` in Tailwind          | Breaks token system      | Use `text-danger`                    |
| `any` type on API response               | Breaks runtime safety    | Parse with Zod schema                |
| No loading state                         | CLS / broken UX          | Always add skeleton                  |
| No error state                           | Silent failures          | Always add error fallback            |
| Shared component used by only one module | Premature extraction     | Keep in module until second consumer |

---

## Open Risks / Blockers

- [ ] API contracts with Django BE must be finalized before Phase 2 (data layer)
- [ ] Confirm `formatCurrency` exists in `src/shared/lib/utils.ts` before Phase 4
- [ ] Confirm TanStack Query `createQueryWrapper` test utility exists before Phase 7
- [ ] Agree on semantic color token names (`primary`, `muted`, `danger`, `accent`) in Tailwind config
