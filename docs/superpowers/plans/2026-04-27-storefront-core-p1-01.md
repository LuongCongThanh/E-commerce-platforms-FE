# Storefront Core (P1-01) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện Storefront Core với mock data tĩnh — home sections dùng hooks, thêm trang categories + search, nâng cấp PDP với VariantSelector + stock + toast + "Mua ngay".

**Architecture:** 3-layer tách biệt: `_lib/data/` (arrays tĩnh) → `_lib/hooks/` + `_lib/queries.ts` (business logic) → `_components/` + pages (UI). Components không bao giờ import trực tiếp từ `_lib/data/`. Server Components dùng plain functions từ `queries.ts`; Client Components dùng React hooks từ `_lib/hooks/`.

**Tech Stack:** Next.js 15 App Router · TypeScript strict · React hooks (useMemo) · Tailwind CSS v4 · Shadcn/Radix (Sheet) · Sonner (toast) · Framer Motion · next-intl · Vitest + Testing Library

---

## File Map

### Tạo mới

```text
src/app/[locale]/(shop)/
  _lib/
    types/
      product.ts                              ← ProductVariant, Product types
      category.ts                             ← re-export HomeCategory as Category
    data/
      products.ts                             ← 16 mock products với variants
      categories.ts                           ← re-export homeCategoriesData
    queries.ts                                ← getProductBySlug, getHomeData, getCategoryBySlug
    hooks/
      useHomeData.ts                          ← wrap bestSellers/newArrivals/flashSale/categories
      useProducts.ts                          ← filter+sort+paginate productsData
      useSearch.ts                            ← search by name
      useCategories.ts                        ← return all categories
  _components/
    ProductGrid.tsx                           ← shared grid dùng bởi categories + search
    Pagination.tsx                            ← prev/next + page numbers
    products/
      VariantSelector.tsx                     ← size buttons S/M/L/XL, disabled khi stock=0
  categories/
    [slug]/
      page.tsx                                ← Server Component: generateMetadata + Suspense
      _components/
        CategoryClient.tsx                    ← Client: useSearchParams + useProducts + render
        FilterSidebar.tsx                     ← sort dropdown + price range inputs
  search/
    page.tsx                                  ← Server Component: đọc searchParams.q
    _components/
      SearchResults.tsx                       ← Client: useSearch + render grid + empty state
```

### Sửa đổi

```text
  _lib/hooks/
    useHomeFlashSaleCountdown.ts              ← không đổi
  _components/
    home/
      SectionFeaturedCategories.tsx           ← dùng useHomeData() thay homeCategoriesData
      SectionBestSellers.tsx                  ← dùng useHomeData() thay bestSellersData
      SectionNewArrivals.tsx                  ← dùng useHomeData() thay newArrivalsData
      SectionFlashSale.tsx                    ← dùng useHomeData() thay bestSellersData.slice
    products/
      AddToCartSection.tsx                    ← prop Product thay HomeProductHighlight,
                                                 VariantSelector, stock limit, toast, Mua ngay
  products/[slug]/page.tsx                    ← getProductBySlug(), VariantSelector, related
```

### Test files

```text
  _lib/queries.test.ts
  _lib/hooks/useProducts.test.ts
  _lib/hooks/useSearch.test.ts
```

---

## Task 1: Types + Mock Data

**Files:**

- Create: `src/app/[locale]/(shop)/_lib/types/product.ts`
- Create: `src/app/[locale]/(shop)/_lib/types/category.ts`
- Create: `src/app/[locale]/(shop)/_lib/data/products.ts`
- Create: `src/app/[locale]/(shop)/_lib/data/categories.ts`

- [ ] **Step 1: Tạo `types/product.ts`**

```ts
// src/app/[locale]/(shop)/_lib/types/product.ts
export type ProductVariant = {
  id: string;
  label: string;
  stock: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: string[];
  rating: number;
  reviewCount: number;
  badges: string[];
  categorySlug: string;
  description: string;
  variants: ProductVariant[];
};
```

- [ ] **Step 2: Tạo `types/category.ts`**

```ts
// src/app/[locale]/(shop)/_lib/types/category.ts
export type { HomeCategory as Category } from '@/app/[locale]/(shop)/_lib/types/home';
```

- [ ] **Step 3: Tạo `data/products.ts`** — 16 sản phẩm với variants

```ts
// src/app/[locale]/(shop)/_lib/data/products.ts
import type { Product, ProductVariant } from '@/app/[locale]/(shop)/_lib/types/product';

const defaultVariants: ProductVariant[] = [
  { id: 'size-s', label: 'S', stock: 5 },
  { id: 'size-m', label: 'M', stock: 10 },
  { id: 'size-l', label: 'L', stock: 0 },
  { id: 'size-xl', label: 'XL', stock: 3 },
];

const shoeVariants: ProductVariant[] = [
  { id: 'size-s', label: '38', stock: 3 },
  { id: 'size-m', label: '39', stock: 8 },
  { id: 'size-l', label: '40', stock: 0 },
  { id: 'size-xl', label: '41', stock: 5 },
];

export const productsData: Product[] = [
  // Áo
  {
    id: 1,
    name: 'Áo thun basic trắng',
    slug: 'ao-thun-basic-trang',
    price: 250_000,
    salePrice: null,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.5,
    reviewCount: 120,
    badges: ['best-seller'],
    categorySlug: 'ao',
    description: 'Áo thun basic chất liệu cotton 100%, thoáng mát, phù hợp mặc hàng ngày.',
    variants: defaultVariants,
  },
  {
    id: 2,
    name: 'Áo polo nam cao cấp',
    slug: 'ao-polo-nam-cao-cap',
    price: 450_000,
    salePrice: 350_000,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.3,
    reviewCount: 85,
    badges: ['sale'],
    categorySlug: 'ao',
    description: 'Áo polo nam chất liệu piqué cao cấp, form regular fit.',
    variants: defaultVariants,
  },
  {
    id: 3,
    name: 'Áo sơ mi linen dài tay',
    slug: 'ao-so-mi-linen-dai-tay',
    price: 550_000,
    salePrice: null,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.7,
    reviewCount: 56,
    badges: ['new'],
    categorySlug: 'ao',
    description: 'Áo sơ mi linen tự nhiên, thấm hút tốt, phong cách lịch sự.',
    variants: defaultVariants,
  },
  // Quần
  {
    id: 4,
    name: 'Quần jeans slim fit xanh',
    slug: 'quan-jeans-slim-fit-xanh',
    price: 650_000,
    salePrice: null,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.4,
    reviewCount: 98,
    badges: [],
    categorySlug: 'quan',
    description: 'Quần jeans slim fit co giãn 4 chiều, thoải mái vận động.',
    variants: defaultVariants,
  },
  {
    id: 5,
    name: 'Quần short thể thao nam',
    slug: 'quan-short-the-thao-nam',
    price: 300_000,
    salePrice: 220_000,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.2,
    reviewCount: 142,
    badges: ['sale'],
    categorySlug: 'quan',
    description: 'Quần short thể thao chất liệu quick-dry, khô nhanh.',
    variants: defaultVariants,
  },
  {
    id: 6,
    name: 'Quần khaki beige',
    slug: 'quan-khaki-beige',
    price: 480_000,
    salePrice: null,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.6,
    reviewCount: 63,
    badges: ['new'],
    categorySlug: 'quan',
    description: 'Quần khaki màu beige lịch sự, phù hợp văn phòng và đi chơi.',
    variants: defaultVariants,
  },
  // Giày
  {
    id: 7,
    name: 'Giày sneaker trắng basic',
    slug: 'giay-sneaker-trang-basic',
    price: 850_000,
    salePrice: null,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.8,
    reviewCount: 201,
    badges: ['best-seller'],
    categorySlug: 'giay',
    description: 'Giày sneaker trắng classic, dễ phối đồ, đế cao su bền bỉ.',
    variants: shoeVariants,
  },
  {
    id: 8,
    name: 'Giày chạy bộ lightweight',
    slug: 'giay-chay-bo-lightweight',
    price: 1_200_000,
    salePrice: 950_000,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.6,
    reviewCount: 78,
    badges: ['sale'],
    categorySlug: 'giay',
    description: 'Giày chạy bộ siêu nhẹ, đệm khí EVA, chống sốc tốt.',
    variants: [
      { id: 'size-s', label: '38', stock: 2 },
      { id: 'size-m', label: '39', stock: 6 },
      { id: 'size-l', label: '40', stock: 4 },
      { id: 'size-xl', label: '41', stock: 0 },
    ],
  },
  {
    id: 9,
    name: 'Giày lười da thật',
    slug: 'giay-luoi-da-that',
    price: 1_500_000,
    salePrice: null,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.9,
    reviewCount: 45,
    badges: ['new'],
    categorySlug: 'giay',
    description: 'Giày lười da bò thật, lót da mềm, sang trọng và bền.',
    variants: [
      { id: 'size-s', label: '38', stock: 1 },
      { id: 'size-m', label: '39', stock: 4 },
      { id: 'size-l', label: '40', stock: 2 },
      { id: 'size-xl', label: '41', stock: 3 },
    ],
  },
  // Túi xách
  {
    id: 10,
    name: 'Túi tote canvas nâu',
    slug: 'tui-tote-canvas-nau',
    price: 350_000,
    salePrice: null,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.4,
    reviewCount: 167,
    badges: ['best-seller'],
    categorySlug: 'tui',
    description: 'Túi tote canvas bền, sức chứa lớn, thích hợp đi học và đi chơi.',
    variants: defaultVariants,
  },
  {
    id: 11,
    name: 'Balo laptop 15 inch',
    slug: 'balo-laptop-15-inch',
    price: 750_000,
    salePrice: 599_000,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.7,
    reviewCount: 93,
    badges: ['sale'],
    categorySlug: 'tui',
    description: 'Balo laptop 15 inch chống nước, nhiều ngăn tiện dụng.',
    variants: [
      { id: 'size-s', label: 'S', stock: 7 },
      { id: 'size-m', label: 'M', stock: 12 },
      { id: 'size-l', label: 'L', stock: 3 },
      { id: 'size-xl', label: 'XL', stock: 0 },
    ],
  },
  // Phụ kiện
  {
    id: 12,
    name: 'Thắt lưng da thật đen',
    slug: 'that-lung-da-that-den',
    price: 280_000,
    salePrice: null,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.3,
    reviewCount: 55,
    badges: [],
    categorySlug: 'phu-kien',
    description: 'Thắt lưng da bò thật, khóa kim loại chắc chắn, nhiều size.',
    variants: defaultVariants,
  },
  {
    id: 13,
    name: 'Vớ cotton cổ ngắn (5 đôi)',
    slug: 'vot-cotton-co-ngan-5-doi',
    price: 120_000,
    salePrice: null,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.5,
    reviewCount: 312,
    badges: ['best-seller'],
    categorySlug: 'phu-kien',
    description: 'Bộ 5 đôi vớ cotton cổ ngắn, thoáng khí, kháng khuẩn.',
    variants: [
      { id: 'size-s', label: 'S', stock: 20 },
      { id: 'size-m', label: 'M', stock: 30 },
      { id: 'size-l', label: 'L', stock: 15 },
      { id: 'size-xl', label: 'XL', stock: 10 },
    ],
  },
  {
    id: 14,
    name: 'Mũ lưỡi trai snapback',
    slug: 'mu-luoi-trai-snapback',
    price: 220_000,
    salePrice: 170_000,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.1,
    reviewCount: 88,
    badges: ['sale', 'new'],
    categorySlug: 'phu-kien',
    description: 'Mũ snapback adjustable, chất liệu polyester bền màu.',
    variants: [
      { id: 'size-s', label: 'S', stock: 5 },
      { id: 'size-m', label: 'M', stock: 8 },
      { id: 'size-l', label: 'L', stock: 0 },
      { id: 'size-xl', label: 'XL', stock: 6 },
    ],
  },
  // Sale
  {
    id: 15,
    name: 'Áo khoác dù mỏng xanh navy',
    slug: 'ao-khoac-du-mong-xanh-navy',
    price: 800_000,
    salePrice: 480_000,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.4,
    reviewCount: 134,
    badges: ['sale'],
    categorySlug: 'sale',
    description: 'Áo khoác dù mỏng chống nước nhẹ, gấp gọn tiện mang theo.',
    variants: defaultVariants,
  },
  {
    id: 16,
    name: 'Quần jogger kaki xám',
    slug: 'quan-jogger-kaki-xam',
    price: 520_000,
    salePrice: 390_000,
    images: ['/images/products/placeholder.jpg'],
    rating: 4.3,
    reviewCount: 76,
    badges: ['sale'],
    categorySlug: 'sale',
    description: 'Quần jogger kaki form tapered, thun eo và cổ chân co giãn.',
    variants: defaultVariants,
  },
];
```

- [ ] **Step 4: Tạo `data/categories.ts`**

```ts
// src/app/[locale]/(shop)/_lib/data/categories.ts
export { homeCategoriesData as categoriesData } from '@/app/[locale]/(shop)/_lib/data/home';
```

- [ ] **Step 5: Commit**

```bash
git add src/app/\[locale\]/\(shop\)/_lib/types/ src/app/\[locale\]/\(shop\)/_lib/data/products.ts src/app/\[locale\]/\(shop\)/_lib/data/categories.ts
git commit -m "feat(shop): add Product types and 16-item mock data"
```

---

## Task 2: Data Access Layer + Tests

**Files:**

- Create: `src/app/[locale]/(shop)/_lib/queries.ts`
- Create: `src/app/[locale]/(shop)/_lib/hooks/useHomeData.ts`
- Create: `src/app/[locale]/(shop)/_lib/hooks/useProducts.ts`
- Create: `src/app/[locale]/(shop)/_lib/hooks/useSearch.ts`
- Create: `src/app/[locale]/(shop)/_lib/hooks/useCategories.ts`
- Test: `src/app/[locale]/(shop)/_lib/queries.test.ts`
- Test: `src/app/[locale]/(shop)/_lib/hooks/useProducts.test.ts`
- Test: `src/app/[locale]/(shop)/_lib/hooks/useSearch.test.ts`

- [ ] **Step 1: Viết test cho `queries.ts` trước (TDD — sẽ fail)**

```ts
// src/app/[locale]/(shop)/_lib/queries.test.ts
import { describe, expect, it } from 'vitest';

import { productsData } from '@/app/[locale]/(shop)/_lib/data/products';
import { getCategoryBySlug, getHomeData, getProductBySlug } from '@/app/[locale]/(shop)/_lib/queries';

describe('getProductBySlug', () => {
  it('returns matching product', () => {
    const slug = productsData[0].slug;
    const { product } = getProductBySlug(slug);
    expect(product?.slug).toBe(slug);
  });

  it('returns null for unknown slug', () => {
    const { product } = getProductBySlug('not-a-real-slug');
    expect(product).toBeNull();
  });

  it('returns related products from same category, excluding self', () => {
    const target = productsData.find(p => productsData.filter(q => q.categorySlug === p.categorySlug).length > 1)!;
    const { relatedProducts } = getProductBySlug(target.slug);
    expect(relatedProducts.every(p => p.categorySlug === target.categorySlug)).toBe(true);
    expect(relatedProducts.every(p => p.slug !== target.slug)).toBe(true);
  });

  it('limits related products to 4', () => {
    const { relatedProducts } = getProductBySlug(productsData[0].slug);
    expect(relatedProducts.length).toBeLessThanOrEqual(4);
  });

  it('returns empty relatedProducts when product not found', () => {
    const { relatedProducts } = getProductBySlug('not-found');
    expect(relatedProducts).toEqual([]);
  });
});

describe('getHomeData', () => {
  it('returns all four data groups', () => {
    const data = getHomeData();
    expect(data.bestSellers.length).toBeGreaterThan(0);
    expect(data.newArrivals.length).toBeGreaterThan(0);
    expect(data.flashSale.length).toBeGreaterThan(0);
    expect(data.categories.length).toBeGreaterThan(0);
  });

  it('flashSale has at most 4 items', () => {
    const { flashSale } = getHomeData();
    expect(flashSale.length).toBeLessThanOrEqual(4);
  });
});

describe('getCategoryBySlug', () => {
  it('returns category for known slug', () => {
    const cat = getCategoryBySlug('ao');
    expect(cat?.slug).toBe('ao');
  });

  it('returns null for unknown slug', () => {
    const cat = getCategoryBySlug('nonexistent');
    expect(cat).toBeNull();
  });
});
```

- [ ] **Step 2: Chạy test — xác nhận fail**

```bash
npx vitest run src/app/\[locale\]/\(shop\)/_lib/queries.test.ts
```

Expected: FAIL — "Cannot find module '@/app/[locale]/(shop)/\_lib/queries'"

- [ ] **Step 3: Tạo `queries.ts`**

```ts
// src/app/[locale]/(shop)/_lib/queries.ts
import { bestSellersData, homeCategoriesData, newArrivalsData } from '@/app/[locale]/(shop)/_lib/data/home';
import { productsData } from '@/app/[locale]/(shop)/_lib/data/products';
import type { HomeCategory, HomeProductHighlight } from '@/app/[locale]/(shop)/_lib/types/home';
import type { Product } from '@/app/[locale]/(shop)/_lib/types/product';

export function getProductBySlug(slug: string): {
  product: Product | null;
  relatedProducts: Product[];
} {
  const product = productsData.find(p => p.slug === slug) ?? null;
  const relatedProducts = product ? productsData.filter(p => p.categorySlug === product.categorySlug && p.slug !== slug).slice(0, 4) : [];
  return { product, relatedProducts };
}

export function getHomeData(): {
  bestSellers: HomeProductHighlight[];
  newArrivals: HomeProductHighlight[];
  flashSale: HomeProductHighlight[];
  categories: HomeCategory[];
} {
  return {
    bestSellers: bestSellersData,
    newArrivals: newArrivalsData,
    flashSale: bestSellersData.slice(0, 4),
    categories: homeCategoriesData,
  };
}

export function getCategoryBySlug(slug: string): HomeCategory | null {
  return homeCategoriesData.find(c => c.slug === slug) ?? null;
}
```

- [ ] **Step 4: Chạy test queries — xác nhận pass**

```bash
npx vitest run src/app/\[locale\]/\(shop\)/_lib/queries.test.ts
```

Expected: PASS — 7 tests

- [ ] **Step 5: Viết test cho `useProducts.ts` (TDD — sẽ fail)**

```ts
// src/app/[locale]/(shop)/_lib/hooks/useProducts.test.ts
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { productsData } from '@/app/[locale]/(shop)/_lib/data/products';
import { useProducts } from '@/app/[locale]/(shop)/_lib/hooks/useProducts';

describe('useProducts', () => {
  it('returns at most pageSize products by default', () => {
    const { result } = renderHook(() => useProducts());
    expect(result.current.products.length).toBeLessThanOrEqual(12);
  });

  it('total reflects full unfiltered count', () => {
    const { result } = renderHook(() => useProducts());
    expect(result.current.total).toBe(productsData.length);
  });

  it('filters by categorySlug', () => {
    const slug = 'ao';
    const { result } = renderHook(() => useProducts({ categorySlug: slug }));
    expect(result.current.products.every(p => p.categorySlug === slug)).toBe(true);
    expect(result.current.total).toBe(productsData.filter(p => p.categorySlug === slug).length);
  });

  it('sorts by price_asc', () => {
    const { result } = renderHook(() => useProducts({ sortBy: 'price_asc', pageSize: 100 }));
    const prices = result.current.products.map(p => p.salePrice ?? p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('sorts by price_desc', () => {
    const { result } = renderHook(() => useProducts({ sortBy: 'price_desc', pageSize: 100 }));
    const prices = result.current.products.map(p => p.salePrice ?? p.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it('filters by price range', () => {
    const { result } = renderHook(() => useProducts({ minPrice: 200_000, maxPrice: 500_000, pageSize: 100 }));
    result.current.products.forEach(p => {
      const price = p.salePrice ?? p.price;
      expect(price).toBeGreaterThanOrEqual(200_000);
      expect(price).toBeLessThanOrEqual(500_000);
    });
  });

  it('returns empty array when no products match price range', () => {
    const { result } = renderHook(() => useProducts({ minPrice: 99_999_999 }));
    expect(result.current.products).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it('paginates correctly with pageSize', () => {
    const { result } = renderHook(() => useProducts({ page: 1, pageSize: 4 }));
    expect(result.current.products.length).toBeLessThanOrEqual(4);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(Math.ceil(productsData.length / 4));
  });

  it('clamps currentPage to totalPages if page exceeds total', () => {
    const { result } = renderHook(() => useProducts({ page: 9999, pageSize: 12 }));
    expect(result.current.currentPage).toBe(result.current.totalPages);
  });
});
```

- [ ] **Step 6: Chạy test — xác nhận fail**

```bash
npx vitest run src/app/\[locale\]/\(shop\)/_lib/hooks/useProducts.test.ts
```

Expected: FAIL — "Cannot find module '...useProducts'"

- [ ] **Step 7: Tạo `hooks/useProducts.ts`**

```ts
// src/app/[locale]/(shop)/_lib/hooks/useProducts.ts
'use client';

import { useMemo } from 'react';

import { productsData } from '@/app/[locale]/(shop)/_lib/data/products';
import type { Product } from '@/app/[locale]/(shop)/_lib/types/product';

export type SortBy = 'newest' | 'price_asc' | 'price_desc';

interface UseProductsParams {
  categorySlug?: string;
  sortBy?: SortBy;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export function useProducts({
  categorySlug,
  sortBy = 'newest',
  minPrice = 0,
  maxPrice = 10_000_000,
  page = 1,
  pageSize = 12,
}: UseProductsParams = {}) {
  return useMemo(() => {
    let filtered: Product[] = productsData;

    if (categorySlug) {
      filtered = filtered.filter(p => p.categorySlug === categorySlug);
    }

    filtered = filtered.filter(p => {
      const effectivePrice = p.salePrice ?? p.price;
      return effectivePrice >= minPrice && effectivePrice <= maxPrice;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'price_asc') return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
      if (sortBy === 'price_desc') return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
      return b.id - a.id;
    });

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage - 1) * pageSize;
    const products = sorted.slice(start, start + pageSize);

    return { products, total, totalPages, currentPage };
  }, [categorySlug, sortBy, minPrice, maxPrice, page, pageSize]);
}
```

- [ ] **Step 8: Chạy test useProducts — xác nhận pass**

```bash
npx vitest run src/app/\[locale\]/\(shop\)/_lib/hooks/useProducts.test.ts
```

Expected: PASS — 9 tests

- [ ] **Step 9: Viết test cho `useSearch.ts` (TDD — sẽ fail)**

```ts
// src/app/[locale]/(shop)/_lib/hooks/useSearch.test.ts
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useSearch } from '@/app/[locale]/(shop)/_lib/hooks/useSearch';

describe('useSearch', () => {
  it('returns empty results for empty query', () => {
    const { result } = renderHook(() => useSearch(''));
    expect(result.current.results).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it('returns empty results for whitespace-only query', () => {
    const { result } = renderHook(() => useSearch('   '));
    expect(result.current.results).toEqual([]);
  });

  it('finds products containing query in name (case-insensitive)', () => {
    const { result } = renderHook(() => useSearch('áo'));
    expect(result.current.total).toBeGreaterThan(0);
    result.current.results.forEach(p => {
      expect(p.name.toLowerCase()).toContain('áo');
    });
  });

  it('returns empty results for no match', () => {
    const { result } = renderHook(() => useSearch('xxxxxxxxxxx'));
    expect(result.current.results).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it('total matches results length', () => {
    const { result } = renderHook(() => useSearch('quần'));
    expect(result.current.total).toBe(result.current.results.length);
  });
});
```

- [ ] **Step 10: Chạy test — xác nhận fail**

```bash
npx vitest run src/app/\[locale\]/\(shop\)/_lib/hooks/useSearch.test.ts
```

Expected: FAIL — "Cannot find module '...useSearch'"

- [ ] **Step 11: Tạo `hooks/useSearch.ts`**

```ts
// src/app/[locale]/(shop)/_lib/hooks/useSearch.ts
'use client';

import { useMemo } from 'react';

import { productsData } from '@/app/[locale]/(shop)/_lib/data/products';

export function useSearch(query: string) {
  return useMemo(() => {
    if (!query.trim()) return { results: [], total: 0 };
    const q = query.toLowerCase();
    const results = productsData.filter(p => p.name.toLowerCase().includes(q));
    return { results, total: results.length };
  }, [query]);
}
```

- [ ] **Step 12: Chạy tất cả tests — xác nhận pass**

```bash
npx vitest run src/app/\[locale\]/\(shop\)/_lib/hooks/useSearch.test.ts
npx vitest run src/app/\[locale\]/\(shop\)/_lib/queries.test.ts src/app/\[locale\]/\(shop\)/_lib/hooks/useProducts.test.ts src/app/\[locale\]/\(shop\)/_lib/hooks/useSearch.test.ts
```

Expected: PASS — tất cả tests

- [ ] **Step 13: Tạo `hooks/useHomeData.ts`**

```ts
// src/app/[locale]/(shop)/_lib/hooks/useHomeData.ts
'use client';

import { useMemo } from 'react';

import { bestSellersData, homeCategoriesData, newArrivalsData } from '@/app/[locale]/(shop)/_lib/data/home';

export function useHomeData() {
  return useMemo(
    () => ({
      bestSellers: bestSellersData,
      newArrivals: newArrivalsData,
      flashSale: bestSellersData.slice(0, 4),
      categories: homeCategoriesData,
    }),
    []
  );
}
```

- [ ] **Step 14: Tạo `hooks/useCategories.ts`**

```ts
// src/app/[locale]/(shop)/_lib/hooks/useCategories.ts
'use client';

import { useMemo } from 'react';

import { homeCategoriesData } from '@/app/[locale]/(shop)/_lib/data/home';

export function useCategories() {
  return useMemo(() => ({ categories: homeCategoriesData }), []);
}
```

- [ ] **Step 15: Commit**

```bash
git add src/app/\[locale\]/\(shop\)/_lib/
git commit -m "feat(shop): add data access layer — queries, hooks, and tests"
```

---

## Task 3: Refactor Home Sections → useHomeData()

**Files:**

- Modify: `src/app/[locale]/(shop)/_components/home/SectionFeaturedCategories.tsx`
- Modify: `src/app/[locale]/(shop)/_components/home/SectionBestSellers.tsx`
- Modify: `src/app/[locale]/(shop)/_components/home/SectionNewArrivals.tsx`
- Modify: `src/app/[locale]/(shop)/_components/home/SectionFlashSale.tsx`

- [ ] **Step 1: Update `SectionFeaturedCategories.tsx`** — xóa import `homeCategoriesData`, thêm hook

```tsx
// src/app/[locale]/(shop)/_components/home/SectionFeaturedCategories.tsx
import { useLocale } from 'next-intl';

import { useHomeData } from '@/app/[locale]/(shop)/_lib/hooks/useHomeData';
import { CategoryCard } from '@/shared/components/commerce/CategoryCard';
import { SectionHeading } from '@/shared/components/marketing/SectionHeading';

export const SectionFeaturedCategories = (): React.JSX.Element => {
  const locale = useLocale();
  const { categories } = useHomeData();

  return (
    <section className="container mx-auto px-4 py-12">
      <SectionHeading title="Danh mục nổi bật" />
      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {categories.map(cat => (
          <CategoryCard key={cat.slug} name={cat.name} image={cat.image} productCount={cat.productCount} href={`/${locale}/categories/${cat.slug}`} />
        ))}
      </div>
    </section>
  );
};
```

> **Note:** Link đã đổi từ `/products?category=` → `/categories/[slug]` để khớp với route mới.

- [ ] **Step 2: Update `SectionBestSellers.tsx`**

```tsx
// src/app/[locale]/(shop)/_components/home/SectionBestSellers.tsx
import { useLocale } from 'next-intl';

import { useHomeData } from '@/app/[locale]/(shop)/_lib/hooks/useHomeData';
import { ProductCard } from '@/shared/components/commerce/ProductCard';
import { SectionHeading } from '@/shared/components/marketing/SectionHeading';

export const SectionBestSellers = (): React.JSX.Element => {
  const locale = useLocale();
  const { bestSellers } = useHomeData();

  return (
    <section className="container mx-auto px-4 py-12">
      <SectionHeading title="Sản phẩm bán chạy" ctaLabel="Xem tất cả" ctaHref={`/${locale}/products`} />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {bestSellers.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            salePrice={product.salePrice}
            images={product.images}
            rating={product.rating}
            reviewCount={product.reviewCount}
            badges={product.badges}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
};
```

- [ ] **Step 3: Update `SectionNewArrivals.tsx`**

```tsx
// src/app/[locale]/(shop)/_components/home/SectionNewArrivals.tsx
import { useLocale } from 'next-intl';

import { useHomeData } from '@/app/[locale]/(shop)/_lib/hooks/useHomeData';
import { ProductCard } from '@/shared/components/commerce/ProductCard';
import { SectionHeading } from '@/shared/components/marketing/SectionHeading';

export const SectionNewArrivals = (): React.JSX.Element => {
  const locale = useLocale();
  const { newArrivals } = useHomeData();

  return (
    <section className="container mx-auto px-4 py-12">
      <SectionHeading title="Hàng mới về" ctaLabel="Xem thêm" ctaHref={`/${locale}/products`} />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {newArrivals.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            salePrice={product.salePrice}
            images={product.images}
            rating={product.rating}
            reviewCount={product.reviewCount}
            badges={product.badges}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Update `SectionFlashSale.tsx`**

```tsx
// src/app/[locale]/(shop)/_components/home/SectionFlashSale.tsx
'use client';

import { useLocale } from 'next-intl';

import { useHomeData } from '@/app/[locale]/(shop)/_lib/hooks/useHomeData';
import { useHomeFlashSaleCountdown } from '@/app/[locale]/(shop)/_lib/hooks/useHomeFlashSaleCountdown';
import { ProductCard } from '@/shared/components/commerce/ProductCard';
import { CountdownTimer } from '@/shared/components/marketing/CountdownTimer';

export const SectionFlashSale = (): React.JSX.Element => {
  const locale = useLocale();
  const { targetDate } = useHomeFlashSaleCountdown();
  const { flashSale } = useHomeData();

  return (
    <section className="bg-destructive/90">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-destructive-foreground text-2xl font-bold tracking-tight">Flash Sale</h2>
            <span className="rounded-full bg-white px-3 py-0.5 text-xs font-semibold text-red-600">Hôm nay thôi</span>
          </div>
          <CountdownTimer targetDate={targetDate} variant="compact" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {flashSale.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              salePrice={product.salePrice}
              images={product.images}
              rating={product.rating}
              reviewCount={product.reviewCount}
              badges={product.badges}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 5: Chạy lint**

```bash
npm run lint
```

Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/app/\[locale\]/\(shop\)/_components/home/
git commit -m "refactor(home): replace direct data imports with useHomeData hook"
```

---

## Task 4: Shared Components — ProductGrid + Pagination

**Files:**

- Create: `src/app/[locale]/(shop)/_components/ProductGrid.tsx`
- Create: `src/app/[locale]/(shop)/_components/Pagination.tsx`

- [ ] **Step 1: Tạo `ProductGrid.tsx`**

```tsx
// src/app/[locale]/(shop)/_components/ProductGrid.tsx
'use client';

import { useLocale } from 'next-intl';

import type { Product } from '@/app/[locale]/(shop)/_lib/types/product';
import { ProductCard } from '@/shared/components/commerce/ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-xl">
      <div className="aspect-square w-full rounded-xl bg-neutral-200 dark:bg-neutral-700" />
      <div className="mt-3 space-y-2 px-1">
        <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  const locale = useLocale();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold text-neutral-600 dark:text-neutral-400">Không có sản phẩm phù hợp</p>
        <p className="mt-2 text-sm text-neutral-400">Thử thay đổi bộ lọc để xem thêm sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.slug}
          price={product.price}
          salePrice={product.salePrice}
          images={product.images}
          rating={product.rating}
          reviewCount={product.reviewCount}
          badges={product.badges}
          locale={locale}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Tạo `Pagination.tsx`**

```tsx
// src/app/[locale]/(shop)/_components/Pagination.tsx
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = (): number[] => {
    const maxVisible = 5;
    const pages: number[] = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const btnBase = 'flex size-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors';
  const btnInactive =
    'border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800';
  const btnActive = 'border-primary-500 bg-primary-500 text-white';

  return (
    <div className="flex items-center justify-center gap-1">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} aria-label="Trang trước" className={cn(btnBase, btnInactive)}>
        <ChevronLeft className="size-4" />
      </button>

      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-label={`Trang ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
          className={cn(btnBase, page === currentPage ? btnActive : btnInactive)}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Trang sau"
        className={cn(btnBase, btnInactive)}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/\(shop\)/_components/ProductGrid.tsx src/app/\[locale\]/\(shop\)/_components/Pagination.tsx
git commit -m "feat(shop): add shared ProductGrid and Pagination components"
```

---

## Task 5: Categories Page

**Files:**

- Create: `src/app/[locale]/(shop)/categories/[slug]/page.tsx`
- Create: `src/app/[locale]/(shop)/categories/[slug]/_components/FilterSidebar.tsx`
- Create: `src/app/[locale]/(shop)/categories/[slug]/_components/CategoryClient.tsx`

> **Prerequisite:** Nếu chưa có Shadcn `Sheet`: chạy `npx shadcn@latest add sheet` trước.

- [ ] **Step 1: Tạo `FilterSidebar.tsx`**

```tsx
// src/app/[locale]/(shop)/categories/[slug]/_components/FilterSidebar.tsx
'use client';

import { useState } from 'react';

import { SlidersHorizontal } from 'lucide-react';

import type { SortBy } from '@/app/[locale]/(shop)/_lib/hooks/useProducts';
import { Button } from '@/shared/components/base/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/Sheet';

interface FilterSidebarProps {
  sortBy: SortBy;
  minPrice: number;
  maxPrice: number;
  onApply: (filters: { sortBy: SortBy; minPrice: number; maxPrice: number }) => void;
}

function FilterForm({ sortBy, minPrice, maxPrice, onApply }: FilterSidebarProps) {
  const [localSort, setLocalSort] = useState<SortBy>(sortBy);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">Sắp xếp</h3>
        <select
          value={localSort}
          onChange={e => setLocalSort(e.target.value as SortBy)}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">Khoảng giá (đ)</h3>
        <div className="space-y-2">
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Từ</label>
            <input
              type="number"
              value={localMin}
              min={0}
              onChange={e => setLocalMin(Number(e.target.value))}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Đến</label>
            <input
              type="number"
              value={localMax}
              min={0}
              onChange={e => setLocalMax(Number(e.target.value))}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
        </div>
      </div>

      <Button className="w-full" onClick={() => onApply({ sortBy: localSort, minPrice: localMin, maxPrice: localMax })}>
        Áp dụng
      </Button>
    </div>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-700">
          <h2 className="mb-5 font-semibold">Bộ lọc</h2>
          <FilterForm {...props} />
        </div>
      </aside>

      {/* Mobile: Sheet */}
      <div className="mb-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <SlidersHorizontal className="size-4" />
              Lọc &amp; Sắp xếp
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-2xl px-6 pb-8">
            <SheetHeader>
              <SheetTitle>Bộ lọc</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FilterForm {...props} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Tạo `CategoryClient.tsx`**

```tsx
// src/app/[locale]/(shop)/categories/[slug]/_components/CategoryClient.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { useLocale } from 'next-intl';

import type { SortBy } from '@/app/[locale]/(shop)/_lib/hooks/useProducts';
import { useProducts } from '@/app/[locale]/(shop)/_lib/hooks/useProducts';
import { Pagination } from '@/app/[locale]/(shop)/_components/Pagination';
import { ProductGrid } from '@/app/[locale]/(shop)/_components/ProductGrid';
import { FilterSidebar } from './FilterSidebar';

interface CategoryClientProps {
  categorySlug: string;
  categoryName: string;
}

export function CategoryClient({ categorySlug, categoryName }: CategoryClientProps) {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const sortBy = (searchParams.get('sort') ?? 'newest') as SortBy;
  const minPrice = Number(searchParams.get('min_price') ?? 0);
  const maxPrice = Number(searchParams.get('max_price') ?? 10_000_000);
  const page = Number(searchParams.get('page') ?? 1);

  const { products, total, totalPages, currentPage } = useProducts({
    categorySlug,
    sortBy,
    minPrice,
    maxPrice,
    page,
  });

  const pushParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => params.set(k, v));
    router.push(`/${locale}/categories/${categorySlug}?${params.toString()}`);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{categoryName}</h1>
        <span className="text-sm text-neutral-500">{total} sản phẩm</span>
      </div>

      <div className="flex gap-8">
        <FilterSidebar
          sortBy={sortBy}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onApply={filters =>
            pushParams({
              sort: filters.sortBy,
              min_price: String(filters.minPrice),
              max_price: String(filters.maxPrice),
              page: '1',
            })
          }
        />

        <div className="flex-1">
          <ProductGrid products={products} />
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={p => pushParams({ page: String(p) })} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Tạo `categories/[slug]/page.tsx`**

```tsx
// src/app/[locale]/(shop)/categories/[slug]/page.tsx
import { Suspense } from 'react';

import type { Metadata } from 'next';

import { getCategoryBySlug } from '@/app/[locale]/(shop)/_lib/queries';
import { CategoryClient } from './_components/CategoryClient';

interface CategoryPageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: 'Danh mục | ANTIGRAVITY.STORE' };
  return {
    title: `${category.name} | ANTIGRAVITY.STORE`,
    description: `Khám phá bộ sưu tập ${category.name} chính hãng tại ANTIGRAVITY.STORE.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const categoryName = category?.name ?? slug;

  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />}>
        <CategoryClient categorySlug={slug} categoryName={categoryName} />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 4: Chạy lint**

```bash
npm run lint
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/app/\[locale\]/\(shop\)/categories/
git commit -m "feat(shop): add categories/[slug] page with filter sidebar and pagination"
```

---

## Task 6: Search Page

**Files:**

- Create: `src/app/[locale]/(shop)/search/page.tsx`
- Create: `src/app/[locale]/(shop)/search/_components/SearchResults.tsx`

- [ ] **Step 1: Tạo `SearchResults.tsx`**

```tsx
// src/app/[locale]/(shop)/search/_components/SearchResults.tsx
'use client';

import { useSearch } from '@/app/[locale]/(shop)/_lib/hooks/useSearch';
import { ProductGrid } from '@/app/[locale]/(shop)/_components/ProductGrid';

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const { results, total } = useSearch(query);

  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold text-neutral-600 dark:text-neutral-400">Nhập từ khóa để tìm kiếm</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-neutral-600 dark:text-neutral-400">
        Tìm thấy <span className="font-semibold text-neutral-900 dark:text-white">{total}</span> sản phẩm cho &ldquo;
        <span className="font-semibold">{query}</span>&rdquo;
      </p>
      <ProductGrid products={results} />
    </div>
  );
}
```

- [ ] **Step 2: Tạo `search/page.tsx`**

```tsx
// src/app/[locale]/(shop)/search/page.tsx
import type { Metadata } from 'next';

import { SearchResults } from './_components/SearchResults';

interface SearchPageProps {
  readonly searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q = '' } = await searchParams;
  return {
    title: q ? `Tìm kiếm "${q}" | ANTIGRAVITY.STORE` : 'Tìm kiếm | ANTIGRAVITY.STORE',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">{q ? `Kết quả tìm kiếm cho "${q}"` : 'Tìm kiếm sản phẩm'}</h1>
      <SearchResults query={q} />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/\(shop\)/search/
git commit -m "feat(shop): add search page with SearchResults and empty state"
```

---

## Task 7: PDP Enhancements — VariantSelector + AddToCartSection + page.tsx

**Files:**

- Create: `src/app/[locale]/(shop)/_components/products/VariantSelector.tsx`
- Modify: `src/app/[locale]/(shop)/_components/products/AddToCartSection.tsx`
- Modify: `src/app/[locale]/(shop)/products/[slug]/page.tsx`

- [ ] **Step 1: Tạo `VariantSelector.tsx`**

```tsx
// src/app/[locale]/(shop)/_components/products/VariantSelector.tsx
'use client';

import type { ProductVariant } from '@/app/[locale]/(shop)/_lib/types/product';
import { cn } from '@/shared/lib/utils';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selected: string | null;
  onChange: (id: string) => void;
}

export function VariantSelector({ variants, selected, onChange }: VariantSelectorProps) {
  const selectedVariant = variants.find(v => v.id === selected);

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-500">Size{selectedVariant ? `: ${selectedVariant.label}` : ''}</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map(variant => {
          const isOutOfStock = variant.stock === 0;
          const isSelected = selected === variant.id;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => !isOutOfStock && onChange(variant.id)}
              disabled={isOutOfStock}
              aria-label={`Size ${variant.label}${isOutOfStock ? ' — Hết hàng' : ''}`}
              aria-pressed={isSelected}
              className={cn(
                'relative flex size-11 items-center justify-center rounded-lg border text-sm font-semibold transition-all',
                isSelected && !isOutOfStock
                  ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400'
                  : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-700',
                isOutOfStock && 'cursor-not-allowed opacity-40'
              )}
            >
              {variant.label}
              {isOutOfStock && (
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                  <span className="absolute h-px w-[130%] rotate-45 bg-neutral-400" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {selected === null && <p className="mt-2 text-xs text-neutral-400">Vui lòng chọn size</p>}
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `AddToCartSection.tsx`**

```tsx
// src/app/[locale]/(shop)/_components/products/AddToCartSection.tsx
'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus, ShoppingCart, Zap } from 'lucide-react';
import { toast } from 'sonner';

import type { Product } from '@/app/[locale]/(shop)/_lib/types/product';
import { Button } from '@/shared/components/base/Button';
import { useCartStore } from '@/shared/stores/cart-store';
import { VariantSelector } from './VariantSelector';

interface AddToCartSectionProps {
  readonly product: Product;
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const router = useRouter();
  const locale = useLocale();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
  const maxQuantity = selectedVariant?.stock ?? 1;
  const isOutOfStock = selectedVariant !== undefined && selectedVariant.stock === 0;
  const canAdd = selectedVariant !== undefined && !isOutOfStock;

  const handleVariantChange = (id: string) => {
    setSelectedVariantId(id);
    setQuantity(1);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.min(maxQuantity, Math.max(1, prev + delta)));
  };

  const addItem = () => {
    if (!selectedVariant) return;
    addToCart({
      productId: String(product.id),
      variantId: selectedVariant.id,
      name: product.name,
      image: product.images[0],
      price: product.salePrice ?? product.price,
      quantity,
    });
  };

  const handleAddToCart = () => {
    addItem();
    setIsAdded(true);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem();
    router.push(`/${locale}/checkout`);
  };

  return (
    <div className="space-y-6">
      {/* Variant selector */}
      <VariantSelector variants={product.variants} selected={selectedVariantId} onChange={handleVariantChange} />

      {/* Stock indicator */}
      {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock < 10 && (
        <p className="text-sm font-medium text-orange-500">Còn {selectedVariant.stock} sản phẩm</p>
      )}
      {isOutOfStock && <p className="text-sm font-medium text-red-500">Hết hàng</p>}

      {/* Quantity */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-500">Số lượng</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-xl border border-white/10 bg-neutral-100 p-1 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              aria-label="Giảm số lượng"
              className="flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-12 text-center font-bold">{quantity}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= maxQuantity || !selectedVariant}
              aria-label="Tăng số lượng"
              className="flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>
          {selectedVariant && <span className="text-sm text-neutral-500">/ {selectedVariant.stock} có sẵn</span>}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="relative h-14 flex-1 overflow-hidden transition-all active:scale-95"
          onClick={handleAddToCart}
          disabled={!canAdd || isAdded}
        >
          <AnimatePresence mode="wait">
            {isAdded ? (
              <motion.div
                key="success"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Check className="size-5" />
                Đã thêm vào giỏ
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="size-5" />
                {canAdd ? 'Thêm vào giỏ hàng' : 'Chọn size trước'}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        <Button size="lg" variant="outline" className="h-14 px-6 font-semibold" onClick={handleBuyNow} disabled={!canAdd}>
          <Zap className="mr-2 size-5" />
          Mua ngay
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update `products/[slug]/page.tsx`** — dùng `getProductBySlug`, thêm related products

```tsx
// src/app/[locale]/(shop)/products/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft, RotateCcw, ShieldCheck, Star, Truck } from 'lucide-react';

import { AddToCartSection } from '@/app/[locale]/(shop)/_components/products/AddToCartSection';
import { ProductGallery } from '@/app/[locale]/(shop)/_components/products/ProductGallery';
import { ProductGrid } from '@/app/[locale]/(shop)/_components/ProductGrid';
import { getProductBySlug } from '@/app/[locale]/(shop)/_lib/queries';
import { Badge } from '@/shared/components/base/Badge';
import { cn, formatCurrency } from '@/shared/lib/utils';

interface ProductPageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { product } = getProductBySlug(slug);
  if (!product) return { title: 'Sản phẩm không tồn tại' };
  return {
    title: `${product.name} | ANTIGRAVITY.STORE`,
    description: `Mua ${product.name} chính hãng tại ANTIGRAVITY.STORE. Giá tốt, giao hàng nhanh toàn quốc.`,
    openGraph: {
      title: product.name,
      description: `Mua ${product.name} chính hãng tại ANTIGRAVITY.STORE.`,
      images: [product.images[0]],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const { product, relatedProducts } = getProductBySlug(slug);

  if (!product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { '@type': 'Brand', name: 'Antigravity' },
    offers: {
      '@type': 'Offer',
      url: `https://antigravity.store/${locale}/products/${slug}`,
      priceCurrency: 'VND',
      price: product.salePrice ?? product.price,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <div className="relative min-h-screen pb-20 pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto px-4">
        <Link
          href={`/${locale}/categories/${product.categorySlug}`}
          className="hover:text-primary-500 mb-8 flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh mục
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} />

          <div className="flex flex-col">
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                {product.badges.map(badge => (
                  <Badge key={badge} variant="secondary" className="capitalize">
                    {badge}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={`star-${i}`}
                    className={cn('size-4', i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300')}
                  />
                ))}
                <span className="ml-2 text-sm font-medium text-neutral-500">
                  {product.rating} ({product.reviewCount} đánh giá)
                </span>
              </div>
            </div>

            <div className="mb-8 flex items-baseline gap-4">
              {product.salePrice !== null ? (
                <>
                  <span className="text-primary-500 text-3xl font-bold">{formatCurrency(product.salePrice)}</span>
                  <span className="text-xl text-neutral-400 line-through">{formatCurrency(product.price)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
              )}
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-500">Mô tả sản phẩm</h3>
              <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">{product.description}</p>
            </div>

            <AddToCartSection product={product} />

            <div className="mt-12 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
              {[
                { icon: Truck, title: 'Giao hàng nhanh', sub: '2-4 ngày làm việc' },
                { icon: RotateCcw, title: 'Đổi trả 30 ngày', sub: 'Miễn phí đổi trả' },
                { icon: ShieldCheck, title: 'Bảo hành 1 năm', sub: 'Chính hãng 100%' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="bg-primary-500/10 text-primary-500 flex size-10 items-center justify-center rounded-full">
                    <Icon className="size-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold">{title}</p>
                    <p className="text-neutral-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 text-xl font-bold">Sản phẩm liên quan</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Chạy lint**

```bash
npm run lint
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/app/\[locale\]/\(shop\)/_components/products/ src/app/\[locale\]/\(shop\)/products/
git commit -m "feat(shop): enhance PDP with VariantSelector, stock display, toast, Mua ngay, related products"
```

---

## Task 8: Lint, Build, Final Check

- [ ] **Step 1: Chạy toàn bộ unit tests**

```bash
npm run test
```

Expected: tất cả tests pass (queries, useProducts, useSearch), không có test fail.

- [ ] **Step 2: Chạy lint**

```bash
npm run lint
```

Expected: 0 errors, 0 warnings

- [ ] **Step 3: Chạy build**

```bash
npm run build
```

Expected: build thành công, không có TypeScript errors. Output cuối cùng phải là `✓ Compiled successfully`.

- [ ] **Step 4: Verify acceptance criteria thủ công** — mở browser vào dev server (`npm run dev`):

```
✓ / (home) — 5 sections hiển thị dữ liệu, không có lỗi console
✓ /vi/categories/ao — chỉ hiện sản phẩm categorySlug='ao'
✓ /vi/categories/ao?sort=price_asc — sản phẩm sắp xếp giá tăng dần
✓ /vi/categories/ao?min_price=200000&max_price=500000 — chỉ hiện sản phẩm trong tầm giá
✓ /vi/search?q=áo — hiển thị kết quả và số lượng
✓ /vi/search?q=xxxxxxxxxxx — empty state "Không tìm thấy"
✓ /vi/products/ao-thun-basic-trang — VariantSelector hiện 4 sizes, L bị disabled
✓ Chọn M → quantity max=10, "Còn 10 sản phẩm" KHÔNG hiện (>10)
✓ Chọn S → "Còn 5 sản phẩm" hiện (stock<10)
✓ Không chọn size → "Thêm vào giỏ" disabled, hiện "Chọn size trước"
✓ Chọn size → Add to cart → Sonner toast hiện
✓ "Mua ngay" → redirect /checkout
✓ Related products section hiện 4 sản phẩm cùng category
```

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore(shop): storefront core P1-01 complete — all acceptance criteria pass"
```
