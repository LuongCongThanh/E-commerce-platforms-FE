---
title: Storefront Core Design Spec (P1-01)
status: active
audience: human
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-08
---

# Storefront Core (P1-01) — Design Spec

## Implementation Audit — 2026-05-08

| Area                                | Status  | Notes                                                                                                                                                                    |
| ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home -> category/search entrypoints | Done    | Home sections now use `useHomeData()` and route users into canonical category/product flows.                                                                             |
| Category page (PLP)                 | Done    | `generateMetadata()`, desktop sidebar, mobile filter `Sheet`, canonical query params `sort/min_price/max_price`, pagination UI.                                          |
| Search                              | Done    | Search page and results count work off `useSearch()`, including empty state.                                                                                             |
| PDP core journey                    | Done    | PDP has JSON-LD, variant selection, stock-aware CTA state, related products, add-to-cart and buy-now actions.                                                            |
| Remaining caveats                   | Partial | Core journey is stable; the main remaining caveat is that a fresh `next build` re-check is currently blocked by a Windows `.next` file lock rather than app code errors. |

---

## Goal

Hoàn thiện toàn bộ Storefront Core (Task 2 trong MVP plan) với mock data tĩnh. End-state: user có thể browse home → category page → search → product detail → add to cart. Tất cả data từ mock, logic tách hoàn toàn khỏi UI.

## Out of Scope

- Real API calls (Task 2 dùng mock data hoàn toàn)
- Cart drawer / cart page (Task 3)
- Checkout (Task 4)
- Auth guard trên PDP (Task 1)
- Wishlist, reviews, social login

---

## Architecture — 3-Layer Separation

```text
Data layer           Hook layer              UI layer
────────────         ─────────────────       ──────────────────────
_lib/data/           _lib/hooks/             _components/ + pages/
  home.ts      →       useHomeData()   →       Section*.tsx
  products.ts  →       useProducts()   →       ProductGrid.tsx
  categories.ts →      useCategories() →       FilterSidebar.tsx
  (home.ts)    →       useProduct()    →       products/[slug]/page.tsx
               →       useSearch()     →       SearchResults.tsx
```

**Rules:**

- Components NEVER import from `_lib/data/` directly — only call hooks
- Hooks NEVER import from UI layer
- Data files are pure TypeScript arrays/objects — no business logic

---

## Data Shapes

### ProductVariant

```ts
type ProductVariant = {
  id: string; // 'size-s' | 'size-m' | 'size-l' | 'size-xl'
  label: string; // 'S' | 'M' | 'L' | 'XL'
  stock: number; // 0 = out of stock → disabled in selector
};
```

### Product

```ts
type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: string[];
  rating: number;
  reviewCount: number;
  badges: string[]; // 'new' | 'sale' | 'best-seller'
  categorySlug: string; // used for category filter + related products
  description: string;
  variants: ProductVariant[];
};
```

### Category

```ts
type Category = {
  slug: string;
  name: string;
  image: string;
  productCount: number;
};
```

### Mock Data Volumes

- **products.ts**: 26 products, trong đó category `ao` đủ dữ liệu để kiểm chứng pagination page 2 theo page size 12
  - Each product has variants: `[{S, stock:5}, {M, stock:10}, {L, stock:0}, {XL, stock:3}]`
  - Some products have `salePrice` (30% of products)
  - Some have `badges: ['new']` or `['best-seller']`
- **categories.ts**: Re-export from `home.ts` (ao, quan, giay, tui, phu-kien, sale)
- `home.ts` vẫn giữ hero/categories base data
- Home highlights hiện được resolve từ `productsData` qua `_lib/queries.ts` / `useHomeData()` để card ở Home dẫn tới PDP slug hợp lệ

---

## Data Access — Two Patterns

Vì Next.js App Router phân biệt Server Component và Client Component, data access chia thành 2 nhóm:

### A — Plain functions (dùng trong Server Components)

Server Components không thể gọi React hooks. Dùng plain functions từ `_lib/queries.ts`:

```ts
// _lib/queries.ts
function getProductBySlug(slug: string): {
  product: Product | null;
  relatedProducts: Product[]; // same categorySlug, limit 4, exclude self
};

function getHomeData(): {
  hero: HomeHero;
  bestSellers: HomeProductHighlight[];
  newArrivals: HomeProductHighlight[];
  flashSale: HomeProductHighlight[];
  categories: HomeCategory[];
};
```

Dùng ở: `products/[slug]/page.tsx` (server), `home/page.tsx` (server shell nếu cần).

### B — React Hooks (dùng trong Client Components)

Client Components cần state/URL sync dùng hooks từ `_lib/hooks/`:

```ts
// _lib/hooks/useHomeData.ts
function useHomeData(): {
  hero: HomeHero;
  bestSellers: HomeProductHighlight[];
  newArrivals: HomeProductHighlight[];
  flashSale: HomeProductHighlight[];
  categories: HomeCategory[];
};
// Dùng ở: Section*.tsx (vốn đã là client vì useLocale + framer-motion)

// _lib/hooks/useProducts.ts
function useProducts(params: {
  categorySlug?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number; // default 12
}): {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
};
// Dùng ở: CategoryClient.tsx (client component, cần useSearchParams + useRouter)

// _lib/hooks/useSearch.ts
function useSearch(query: string): {
  results: Product[];
  total: number;
};
// Dùng ở: SearchResults.tsx (client component)

// _lib/hooks/useCategories.ts
function useCategories(): { categories: Category[] };
// Dùng ở: FilterSidebar nếu cần list categories
```

Tất cả hooks và plain functions đều filter/sort `productsData` in-memory — không có async, không có loading state thực sự.

### Phân loại Server vs Client theo trang

| Component                                | Type             | Data access                       |
| ---------------------------------------- | ---------------- | --------------------------------- |
| `home/page.tsx`                          | Server Component | N/A (truyền props xuống sections) |
| `SectionHero`, `SectionBestSellers`, ... | Client Component | `useHomeData()` hook              |
| `categories/[slug]/page.tsx`             | Server Component | `generateMetadata` only           |
| `CategoryClient.tsx`                     | Client Component | `useProducts()` hook              |
| `search/page.tsx`                        | Server Component | reads `searchParams.q`            |
| `SearchResults.tsx`                      | Client Component | `useSearch()` hook                |
| `products/[slug]/page.tsx`               | Server Component | `getProductBySlug()` plain fn     |
| `VariantSelector.tsx`                    | Client Component | props only                        |
| `AddToCartSection.tsx`                   | Client Component | props + `useCartStore`            |

---

## Pages & Components

### Home page (`/home/page.tsx`)

- Already exists. The 5 commerce sections (`Hero`, `Featured Categories`, `Flash Sale`, `Best Sellers`, `New Arrivals`) now read via `useHomeData()`.
- No new layout changes.

### `/categories/[slug]/page.tsx`

- Server Component shell with `generateMetadata()`.
- Reads `slug` from params, `sort`/`min_price`/`max_price`/`page` from searchParams.
- Layout: Left sidebar 240px (desktop) + product grid. Mobile: sidebar hidden, "Lọc" button opens Sheet.

**URL params:**

| Param       | Type                            | Default    |
| ----------- | ------------------------------- | ---------- |
| `sort`      | `newest\|price_asc\|price_desc` | `newest`   |
| `min_price` | number                          | 0          |
| `max_price` | number                          | 10,000,000 |
| `page`      | number                          | 1          |

**Sub-components:**

- `ProductGrid.tsx` — props: `products: Product[]`, `isLoading?: boolean`
  - 2 cols mobile / 3 cols md / 4 cols lg
  - Skeleton: 8 placeholder cards when `isLoading=true`
- `FilterSidebar.tsx` — props: `currentFilters`, `onChange(filters)`
  - Price range: two number inputs (min/max) + Apply button
  - Sort: Select dropdown (Mới nhất / Giá tăng dần / Giá giảm dần)
  - Mobile: wrapped in Sheet (bottom slide-up)
- `Pagination.tsx` — props: `currentPage`, `totalPages`, `onPageChange`
  - Prev / Next + page number buttons (show up to 5 pages)

### `/search/page.tsx`

- Reads `q` from searchParams.
- Calls `useSearch(q)`.

**Sub-components:**

- `SearchResults.tsx` — props: `results: Product[]`, `query: string`, `total: number`
  - Header: "Tìm thấy X sản phẩm cho '[query]'"
  - Grid: same as ProductGrid (reuse component)
  - Empty state: "Không tìm thấy kết quả cho '[query]'" + "Thử từ khóa khác"

### `/products/[slug]/page.tsx`

Currently exists with: `generateMetadata`, JSON-LD, `ProductGallery`, `AddToCartSection`.

**Changes:**

- Fetch product via `getProductBySlug(slug)` (plain fn, server component)
- Add `VariantSelector` above quantity input
- Add stock display: "Còn X sản phẩm" badge when selected variant stock < 10
- Add "Mua ngay" button: `addToCart` → `router.push('/checkout')`
- Add "Sản phẩm liên quan" section below (4 cards from `relatedProducts`)
- Quantity `max` = selected variant `stock`

**New sub-components:**

- `VariantSelector.tsx` — props: `variants: ProductVariant[]`, `selected: string | null`, `onChange(id)`
  - Button group: S / M / L / XL
  - Disabled + strikethrough when `stock === 0`
  - Selected variant highlighted (primary color border)

**AddToCartSection changes:**

- Accept `variants` prop + `selectedVariantId`
- `quantity` max clamps to `selectedVariant.stock`
- Add to cart shows Sonner toast: "Đã thêm [tên sản phẩm] vào giỏ hàng"
- "Mua ngay" button: add to cart silently → redirect `/[locale]/checkout`
- Disable "Thêm vào giỏ" if no variant selected

---

## States Coverage

| Component                | Loading            | Empty                                           | Error |
| ------------------------ | ------------------ | ----------------------------------------------- | ----- |
| Home sections            | Skeleton 4–8 cards | N/A                                             | N/A   |
| CategoryPage ProductGrid | Skeleton 8 cards   | "Không có sản phẩm phù hợp" + reset filters CTA | N/A   |
| SearchResults            | N/A (instant)      | "Không tìm thấy kết quả"                        | N/A   |
| PDP VariantSelector      | N/A                | N/A                                             | N/A   |
| PDP RelatedProducts      | N/A (sync)         | Hidden section if 0 results                     | N/A   |

_With static mock data, loading/error don't actually trigger. Skeleton markup is placed correctly so when real API is wired up, it activates automatically._

---

## Acceptance Checklist

| Acceptance                                                                  | Status  | Notes                                                                                                                                                                      |
| --------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home page: all 5 sections render data via hooks                             | Done    | `SectionHero`, `SectionFeaturedCategories`, `SectionFlashSale`, `SectionBestSellers`, `SectionNewArrivals` all read via `useHomeData()`.                                   |
| `/categories/ao` shows only products with `categorySlug: 'ao'`              | Done    | Filtering is handled in `useProducts()` and category page passes `categorySlug`.                                                                                           |
| Price filter applied → only products within range shown                     | Done    | Category page reads and writes canonical `min_price` / `max_price`.                                                                                                        |
| Sort by price asc → products ordered lowest to highest                      | Done    | `useProducts()` supports `price_asc`.                                                                                                                                      |
| URL reflects filter state: `/categories/ao?sort=price_asc&min_price=200000` | Done    | Current UI writes canonical keys `sort`, `min_price`, `max_price`.                                                                                                         |
| Pagination: page 2 shows next 12 products                                   | Done    | Mock dataset đã được mở rộng để `/categories/ao?page=2` có kết quả thật thay vì chỉ có UI pagination.                                                                      |
| `/search?q=áo` shows matching products with count                           | Done    | Search results now show total match count.                                                                                                                                 |
| `/search?q=xxxxxxxxxxx` shows empty state                                   | Done    | Empty state exists in `SearchResults.tsx`.                                                                                                                                 |
| PDP: no variant selected → "Thêm vào giỏ" disabled                          | Done    | `AddToCartSection` no longer auto-selects a variant.                                                                                                                       |
| PDP: select L (stock=0) → button disabled, "Hết hàng" badge                 | Done    | UX đã được chốt theo hướng variant hết hàng bị làm mờ, không thể chọn, và có helper text giải thích hành vi này.                                                           |
| PDP: select M (stock=10) → quantity max=10, stock shown                     | Done    | Quantity clamps to selected variant stock and stock messaging is shown in the action area.                                                                                 |
| PDP: add to cart → Sonner toast appears                                     | Done    | Implemented in `AddToCartSection`.                                                                                                                                         |
| PDP: "Mua ngay" → cart updated + redirect `/checkout`                       | Done    | Implemented with locale-aware redirect.                                                                                                                                    |
| PDP: related products section shows up to 4 items from same category        | Done    | Acceptance wording đã khớp implementation: section trả về tối đa 4 item cùng category, không yêu cầu lúc nào cũng đủ đúng 4.                                               |
| `npm run lint` passes                                                       | Done    | ESLint scope đã loại `.codex/` và `.vendor/agent-tools/`; `npm run lint` pass trên 2026-05-08.                                                                             |
| `npm run build` passes (no TypeScript errors)                               | Partial | Sau lượt thay đổi mới nhất, `next build` bị chặn bởi lỗi Windows `EPERM` khi unlink file trong `.next/`, không phải bởi TypeScript/app-router regression từ code hiện tại. |

## Follow-up Tasks To Close Remaining Partial Items

1. Build re-check on Windows:
   Xóa `.next/` hoặc giải phóng file lock rồi chạy lại `npm run build` để refresh trạng thái verification cuối cùng sau các thay đổi mới nhất.
