# Storefront Core (P1-01) — Design Spec

Date: 2026-04-27
Status: Approved
Owner: FE Lead

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

- **products.ts**: 16 products, 2–3 per category slug
  - Each product has variants: `[{S, stock:5}, {M, stock:10}, {L, stock:0}, {XL, stock:3}]`
  - Some products have `salePrice` (30% of products)
  - Some have `badges: ['new']` or `['best-seller']`
- **categories.ts**: Re-export from `home.ts` (ao, quan, giay, tui, phu-kien, sale)
- `home.ts` stays unchanged — `bestSellersData` and `newArrivalsData` are kept as `HomeProductHighlight[]`

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

- Already exists. Change: all `Section*.tsx` components call `useHomeData()` instead of importing data directly.
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

## Acceptance Criteria

- [ ] Home page: all 5 sections render data via hooks (no direct data import in components)
- [ ] `/categories/ao` shows only products with `categorySlug: 'ao'`
- [ ] Price filter applied → only products within range shown
- [ ] Sort by price asc → products ordered lowest to highest
- [ ] URL reflects filter state: `/categories/ao?sort=price_asc&min_price=200000`
- [ ] Pagination: page 2 shows next 12 products
- [ ] `/search?q=áo` shows matching products with count
- [ ] `/search?q=xxxxxxxxxxx` shows empty state
- [ ] PDP: no variant selected → "Thêm vào giỏ" disabled
- [ ] PDP: select L (stock=0) → button disabled, "Hết hàng" badge
- [ ] PDP: select M (stock=10) → quantity max=10, "Còn 10 sản phẩm" shown
- [ ] PDP: add to cart → Sonner toast appears
- [ ] PDP: "Mua ngay" → cart updated + redirect `/checkout`
- [ ] PDP: related products section shows 4 items from same category
- [ ] `npm run lint` passes
- [ ] `npm run build` passes (no TypeScript errors)
