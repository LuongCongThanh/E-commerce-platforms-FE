# Shared Module Foundation Implementation Plan

> Tài liệu này là plan implement cho foundation layer của `src/shared/`, được rút ra từ [shared-module-plan.md](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/docs/system/shared-module-plan.md:1) nhưng đã chuyển thành hướng dẫn thi công thực tế: làm gì trước, viết code thế nào, và test ra sao.

## Mục tiêu

Hoàn thiện phần foundation dùng chung cho các feature `auth`, `catalog`, `cart`, `checkout`, `orders`, gồm:

- constants
- shared types + Zod schemas
- lib helpers
- shared hooks

Plan này chưa làm shared UI components cấp cao như `ProductCard`, `CartDrawer`, `AddressForm`.

## Căn cứ kỹ thuật hiện tại

- Next: `16.2.4`
- React: `19.2.4`
- Zod: `4.3.6`
- Zustand: `5.0.12`
- TanStack Query: `5.99.1`
- Sonner: `2.0.7`
- Test runner: `Vitest`
- Coverage hiện enforce trên:
  - `src/shared/lib/**`
  - `src/shared/hooks/**`
- Threshold hiện tại trong [vitest.config.ts](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/vitest.config.ts:1):
  - `lines: 70`
  - `functions: 70`
  - `branches: 70`

## Nguyên tắc triển khai

- Không tạo lại file hoặc primitive đã tồn tại.
- Không để hai nguồn sự thật cho cùng một domain.
- Hook phải bám API thật của store hiện tại.
- Shared chỉ chứa logic tái sử dụng, không ôm business flow của feature.
- Mọi file mới trong `src/shared/lib/**` và `src/shared/hooks/**` phải có chiến lược coverage rõ ràng.

## Trạng thái repo cần chốt trước khi code

Các điểm dưới đây phải được xem như input cố định của plan:

- `accordion`, `radio-group`, `tabs`, `switch`, `slider`, `breadcrumb`, `aspect-ratio`, `progress` đã có trong `src/shared/components/ui/`.
- `ProductVariantSchema`, `ProductVariant` và `variants` đã có trong `src/shared/types/product.ts`.
- `CartItem` đang nằm trong `src/shared/stores/cart-store.ts`.
- `sonner` đã có trong dependencies.

## Phase 0: Audit trước khi implement

### Mục tiêu

Chặn rework và tránh viết theo assumption cũ.

### Cần kiểm tra

- `src/shared/constants/`
- `src/shared/types/`
- `src/shared/lib/`
- `src/shared/hooks/`
- `src/shared/stores/auth-store.ts`
- `src/shared/stores/cart-store.ts`
- `src/shared/components/ui/`

### Kết quả mong đợi

- Danh sách file cần tạo thật sự.
- Danh sách file cần sửa.
- Danh sách task trong `shared-module-plan.md` đã stale và không implement lại.

### Lệnh gợi ý

```bash
rg --files src/shared
rg -n "useAuthStore|useCartStore|ProductVariantSchema|ORDER_STATUS_LABEL" src/shared
```

## Phase 1: Constants

### File cần làm

- Tạo `src/shared/constants/routes.ts`
- Tạo `src/shared/constants/query-keys.ts`
- Sửa `src/shared/constants/app-config.ts`

### Cách viết code

#### `routes.ts`

- Export một object `ROUTES` duy nhất.
- Với route động, dùng function trả về string.
- Nhóm route theo domain nhỏ nếu cần: `AUTH`, `ACCOUNT`.
- Dùng `as const`.

Ví dụ định hướng:

```ts
export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  PRODUCT: (slug: string) => `/products/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
} as const;
```

#### `query-keys.ts`

- Export `QUERY_KEYS` duy nhất.
- Mọi key dùng tuple readonly.
- Dynamic key phải normalize id/slug về kiểu ổn định.

Ví dụ:

```ts
export const QUERY_KEYS = {
  PRODUCTS: ['products'] as const,
  PRODUCT: (slug: string) => ['products', slug] as const,
  ORDERS: ['orders'] as const,
  ORDER: (id: string | number) => ['orders', String(id)] as const,
} as const;
```

#### `app-config.ts`

- Chỉ thêm constant phụ trợ, không refactor lan rộng nếu chưa cần.
- `ORDER_STATUS_COLOR_MAP` phải match tập status thực tế từ `ORDER_STATUS_LABEL`.
- `SORT_OPTIONS` phải match filter schema thật sự dùng ở catalog.

### Cách test

- Constants thường không cần test riêng nếu chỉ là data tĩnh.
- Nếu có helper logic phụ trợ đi kèm, test trong `utils.test.ts` hoặc file test tương ứng.

### Done criteria

- Feature code không cần hardcode path.
- Query hooks không phải tự gõ lại key string.

## Phase 2: Shared types và Zod schemas

### File cần làm

- Tạo `src/shared/types/category.ts`
- Tạo `src/shared/types/address.ts`
- Tạo `src/shared/types/checkout.ts`
- Tạo `src/shared/types/filter.ts`
- Rà soát `src/shared/types/product.ts`

### Cách viết code

#### Quy tắc chung

- Mỗi file export:
  - `Schema`
  - `type` từ `z.infer`
- Dùng Zod v4 syntax tương thích repo.
- Không tạo schema chỉ để “đủ checklist”; schema phải có consumer rõ ràng.

#### `category.ts`

- Schema gọn, ưu tiên các field API đang dùng thật:
  - `id`
  - `name`
  - `slug`
  - `description?`
  - `productCount?`

#### `address.ts`

- Chứa `ShippingAddressSchema`.
- Có validate số điện thoại Việt Nam, nhưng không hardcode quá mức nếu backend có rule khác.
- Message lỗi nên là tiếng Việt nhất quán với form hiện tại.

#### `checkout.ts`

- Compose từ `ShippingAddressSchema`.
- `paymentMethod` phải bám khả năng thanh toán hiện tại của app.
- Nếu MVP chỉ có `cod`, ghi rõ trong schema và comment lý do.

#### `filter.ts`

- Đây là nguồn sự thật chính cho product filters.
- Không dùng `z.coerce.boolean()` trực tiếp cho `inStock`.
- Nên parse query params theo kiểu rõ ràng:
  - `'true' -> true`
  - `'false' -> false`
  - `undefined -> undefined`
- `page` và `pageSize` nên có default.

Ví dụ định hướng an toàn hơn:

```ts
const booleanString = z.union([z.boolean(), z.literal('true'), z.literal('false')]).transform(value => {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return value;
});
```

#### `product.ts`

- Không thêm lại `ProductVariantSchema` nếu đã có.
- Nếu còn `ProductFilters` interface cũ, refactor để dùng type xuất phát từ `filter.ts` hoặc xóa nếu không còn cần.

### Cách test

- Schema files không nhất thiết cần test unit riêng nếu logic validate đơn giản.
- Nhưng những rule có biến đổi dữ liệu hoặc parsing query params nên được test:
  - parse `inStock`
  - default `page`
  - invalid `minPrice` / `maxPrice`

### Done criteria

- Không còn duplicate source of truth cho filter types.
- Feature forms có thể import schema trực tiếp từ `src/shared/types/`.

## Phase 3: Shared lib helpers

### File cần làm

- Tạo `src/shared/lib/cloudinary.ts`
- Tạo `src/shared/lib/seo.ts`
- Tạo `src/shared/lib/notification.ts`
- Bổ sung `src/shared/lib/utils.ts`

### Cách viết code

#### `cloudinary.ts`

- Viết builder thuần, không dùng SDK.
- Input: `publicId`, options.
- Output: URL string.
- Nếu không có `publicId`, trả fallback path ổn định.
- Không để logic phụ thuộc runtime browser.

Gợi ý API:

```ts
interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg';
}
```

#### `seo.ts`

- Dùng `Metadata` type của Next hiện tại.
- Chỉ build object metadata, không đọc trực tiếp từ component.
- Hỗ trợ:
  - `title`
  - `description`
  - `image`
  - `url`
  - `noIndex`

#### `notification.ts`

- Nếu tạo wrapper cho `sonner`, giữ thật mỏng.
- Một object `notify` là đủ.
- Không duplicate quá nhiều với `useToast`.

Ví dụ:

```ts
export const notify = {
  success: (message: string, description?: string) => toast.success(message, { description }),
  error: (message: string, description?: string) => toast.error(message, { description }),
  info: (message: string, description?: string) => toast(message, { description }),
};
```

#### `utils.ts`

Bổ sung các helper thực sự có consumer:

- `buildQueryString`
- `parseSearchParams`
- `calculateDiscountPercent`
- `truncateText`
- `getOrderStatusLabel`
- `getOrderStatusColor`
- `validateVietnamesePhone`

Quy tắc viết:

- Pure functions.
- Input/output rõ ràng.
- Không phụ thuộc global state.
- Với helper format/query, ưu tiên deterministic behavior để dễ test.

### Cách test

#### `cloudinary.test.ts`

Case tối thiểu:

- empty `publicId` trả placeholder
- default transforms
- width / height
- custom crop
- custom quality

#### `seo.test.ts`

Case tối thiểu:

- title format đúng
- description được giữ nguyên
- canonical URL đúng
- open graph có title/image
- `noIndex` set robots đúng

#### `utils.test.ts`

Case tối thiểu:

- `buildQueryString` bỏ field rỗng
- `parseSearchParams` parse đúng page/filter
- `calculateDiscountPercent` đúng với giảm giá cơ bản
- `truncateText` không cắt khi text ngắn, có `...` khi text dài
- `getOrderStatusColor` fallback đúng
- `validateVietnamesePhone` pass/fail đúng

### Done criteria

- Mọi helper có logic đều có test.
- Coverage của `src/shared/lib/**` không tụt dưới threshold.

## Phase 4: Shared hooks

### File cần làm

- Tạo `src/shared/hooks/use-auth.ts`
- Tạo `src/shared/hooks/use-cart.ts`
- Tạo `src/shared/hooks/use-pagination.ts`
- Tạo `src/shared/hooks/use-product-filters.ts`
- Tạo `src/shared/hooks/use-toast.ts`

### Cách viết code

#### `use-auth.ts`

- `'use client'`
- Bọc `useAuthStore`.
- Expose:
  - `user`
  - `accessToken`
  - `isLoggedIn`
  - `isAdmin`
  - `login`
  - `logout`
- `logout` có thể redirect qua `ROUTES.AUTH.LOGIN` nếu flow hiện tại yêu cầu.
- Không nhét API call vào hook này.

#### `use-cart.ts`

- Bọc `useCartStore`.
- Mapping rõ tên hàm:
  - `addItem -> addToCart`
  - `removeItem -> removeCartItem`
- Expose computed `isEmpty`.
- Không duplicate lại logic total/itemCount nếu store đã tính sẵn.

#### `use-pagination.ts`

Trước khi code phải chốt 1 trong 2 hướng:

1. Local helper:
   - nhận `total`, `pageSize`
   - quản lý `page` bằng state nội bộ
2. URL-synced hook:
   - đọc/ghi search params
   - phù hợp hơn cho catalog/orders pages

Nếu chọn hướng 1, mô tả lại trong doc để tránh kỳ vọng sai.
Nếu chọn hướng 2, cần test cả logic sync.

#### `use-product-filters.ts`

- Dùng type/schema từ `src/shared/types/filter.ts`.
- Có:
  - `filters`
  - `setFilter`
  - `resetFilters`
  - `toQueryString`
- Khi đổi filter khác `page`, reset `page` về `1`.

#### `use-toast.ts`

- Chỉ là convenience layer quanh `sonner` hoặc `notification.ts`.
- Giữ API nhỏ.
- Không tạo thêm abstraction nếu `notify` đã đủ và app không cần hook.

### Cách test

#### `use-auth.test.ts`

Case tối thiểu:

- chưa có token -> `isLoggedIn = false`
- login -> set token/user
- `isAdmin` đúng theo `user.is_staff`
- logout -> clear state
- nếu có redirect -> assert `router.push`

#### `use-cart.test.ts`

Case tối thiểu:

- cart rỗng -> `isEmpty = true`
- add item -> total/itemCount đúng
- add nhiều item -> total cộng dồn
- remove item -> items giảm
- update quantity -> state đổi đúng
- clear cart -> reset toàn bộ

#### `use-pagination.test.ts`

Case tối thiểu:

- page khởi tạo
- totalPages tính đúng
- clamp page min/max
- `hasNext` / `hasPrev`
- nếu có sync URL thì test serialize/deserialize params

#### `use-product-filters.test.ts`

Case tối thiểu:

- default filters
- initial override
- `setFilter` update field đúng
- đổi filter khác `page` thì reset `page = 1`
- `resetFilters`
- `toQueryString` bỏ field undefined

### Done criteria

- Hooks hoạt động đúng với API thật của `auth-store` và `cart-store`.
- Hooks có logic đều có test.
- Thin wrapper nào không test phải có lý do rõ.

## Phase 5: Installation và verification

### Cài đặt

Theo trạng thái repo hiện tại, chưa cần cài thêm primitive base đã liệt kê trong `shared-module-plan.md`.

Chỉ cài thêm package nếu trong quá trình implement phát hiện thiếu thật sự. Khi đó:

```bash
npm install <package>
```

Hoặc nếu chỉ thêm dev dependency:

```bash
npm install -D <package>
```

### Chạy test theo từng bước

Sau mỗi phase lớn, chạy targeted tests:

```bash
npx vitest run src/shared/lib/cloudinary.test.ts
npx vitest run src/shared/lib/seo.test.ts
npx vitest run src/shared/lib/utils.test.ts
npx vitest run src/shared/hooks/use-auth.test.ts
npx vitest run src/shared/hooks/use-cart.test.ts
npx vitest run src/shared/hooks/use-pagination.test.ts
npx vitest run src/shared/hooks/use-product-filters.test.ts
```

### Kiểm tra cuối

```bash
npm run test
npm run test:coverage
npm run lint
```

## Definition of Done

- `routes.ts`, `query-keys.ts` được dùng như nguồn constant chính.
- `category.ts`, `address.ts`, `checkout.ts`, `filter.ts` tồn tại và export schema + type đúng.
- Không còn duplicate `ProductFilters` giữa nhiều file nếu không có lý do rõ ràng.
- `cloudinary.ts`, `seo.ts`, `notification.ts`, `utils.ts` sẵn sàng cho feature modules dùng lại.
- `use-auth.ts`, `use-cart.ts`, `use-pagination.ts`, `use-product-filters.ts`, `use-toast.ts` hoạt động đúng.
- `npm run test` pass.
- `npm run test:coverage` pass.
- `npm run lint` pass.

## Checklist thực thi

- [ ] Audit `src/shared/` và đánh dấu task thật sự còn thiếu.
- [ ] Hoàn thiện constants.
- [ ] Hoàn thiện shared schemas/types.
- [ ] Refactor về một nguồn sự thật cho product filters.
- [ ] Hoàn thiện lib helpers.
- [ ] Hoàn thiện shared hooks.
- [ ] Viết test cho toàn bộ logic trong `shared/lib/**` và `shared/hooks/**`.
- [ ] Chạy targeted tests.
- [ ] Chạy full test suite, coverage, lint.
- [ ] Chốt plan chỉ khi toàn bộ checks pass.

## Task Folder

Các task nhỏ để thực thi tuần tự đã được tách ra trong folder:

- [README.md](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/docs/superpowers/plans/2026-04-21-shared-module-foundation/README.md)
- [01-audit-and-constants.md](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/docs/superpowers/plans/2026-04-21-shared-module-foundation/01-audit-and-constants.md)
- [02-types-and-schemas.md](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/docs/superpowers/plans/2026-04-21-shared-module-foundation/02-types-and-schemas.md)
- [03-lib-helpers.md](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/docs/superpowers/plans/2026-04-21-shared-module-foundation/03-lib-helpers.md)
- [04-shared-hooks.md](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/docs/superpowers/plans/2026-04-21-shared-module-foundation/04-shared-hooks.md)
- [05-tests-and-verification.md](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/docs/superpowers/plans/2026-04-21-shared-module-foundation/05-tests-and-verification.md)

## Task Breakdown Theo File

### Bước 1: Audit và chốt phạm vi

- [ ] Kiểm tra `src/shared/components/ui/` để xác nhận không cần cài lại primitive đã có.
- [ ] Kiểm tra `src/shared/types/product.ts` để xác nhận `ProductVariantSchema` đã tồn tại.
- [ ] Kiểm tra `src/shared/stores/cart-store.ts` để xác nhận `CartItem` đang nằm trong store.
- [ ] Kiểm tra `src/shared/stores/auth-store.ts` và `src/shared/stores/cart-store.ts` để chốt API thật của hooks.
- [ ] Gạch bỏ trong quá trình implement mọi task đã stale từ tài liệu gốc.

### Bước 2: Constants

- [ ] Tạo `src/shared/constants/routes.ts`.
- [ ] Export `ROUTES` với đầy đủ route tĩnh và route động cần cho auth, catalog, cart, checkout, account/orders.
- [ ] Tạo `src/shared/constants/query-keys.ts`.
- [ ] Export `QUERY_KEYS` dùng tuple readonly cho product, category, order, profile.
- [ ] Mở `src/shared/constants/app-config.ts`.
- [ ] Thêm `ORDER_STATUS_COLOR_MAP`.
- [ ] Thêm `SORT_OPTIONS`.
- [ ] Kiểm tra `ORDER_STATUS_COLOR_MAP` khớp với `ORDER_STATUS_LABEL`.

### Bước 3: Types và schemas

- [ ] Tạo `src/shared/types/category.ts`.
- [ ] Tạo `CategorySchema` và `Category`.
- [ ] Tạo `src/shared/types/address.ts`.
- [ ] Tạo `ShippingAddressSchema` và `ShippingAddress`.
- [ ] Tạo `src/shared/types/checkout.ts`.
- [ ] Tạo `CheckoutFormSchema` và `CheckoutFormData`.
- [ ] Tạo `src/shared/types/filter.ts`.
- [ ] Tạo `ProductFilterSchema` và `ProductFilter`.
- [ ] Xử lý `inStock` bằng parse rõ ràng, không dùng `z.coerce.boolean()` trực tiếp.
- [ ] Mở `src/shared/types/product.ts`.
- [ ] Refactor `ProductFilters` cũ để không còn duplicate source of truth với `filter.ts`.

### Bước 4: Shared lib helpers

- [ ] Tạo `src/shared/lib/cloudinary.ts`.
- [ ] Implement `buildImageUrl(publicId, options?)`.
- [ ] Tạo `src/shared/lib/seo.ts`.
- [ ] Implement `buildMetadata(options)`.
- [ ] Tạo `src/shared/lib/notification.ts`.
- [ ] Implement `notify.success`, `notify.error`, `notify.info`, và nếu cần `notify.warning`.
- [ ] Mở `src/shared/lib/utils.ts`.
- [ ] Bổ sung `buildQueryString`.
- [ ] Bổ sung `parseSearchParams`.
- [ ] Bổ sung `calculateDiscountPercent`.
- [ ] Bổ sung `truncateText`.
- [ ] Bổ sung `getOrderStatusLabel`.
- [ ] Bổ sung `getOrderStatusColor`.
- [ ] Bổ sung `validateVietnamesePhone`.

### Bước 5: Shared hooks

- [ ] Tạo `src/shared/hooks/use-auth.ts`.
- [ ] Implement wrapper quanh `useAuthStore`.
- [ ] Expose `user`, `accessToken`, `isLoggedIn`, `isAdmin`, `login`, `logout`.
- [ ] Tạo `src/shared/hooks/use-cart.ts`.
- [ ] Implement wrapper quanh `useCartStore`.
- [ ] Expose `items`, `total`, `itemCount`, `isEmpty`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`.
- [ ] Tạo `src/shared/hooks/use-pagination.ts`.
- [ ] Chốt rõ đây là local helper hay URL-synced hook trước khi implement.
- [ ] Implement `page`, `setPage`, `totalPages`, `hasNext`, `hasPrev`.
- [ ] Tạo `src/shared/hooks/use-product-filters.ts`.
- [ ] Dùng type/schema từ `src/shared/types/filter.ts`.
- [ ] Implement `filters`, `setFilter`, `resetFilters`, `toQueryString`.
- [ ] Đảm bảo đổi filter khác `page` sẽ reset `page` về `1`.
- [ ] Tạo `src/shared/hooks/use-toast.ts`.
- [ ] Giữ `useToast` là convenience layer mỏng, không trùng trách nhiệm quá nhiều với `notification.ts`.

### Bước 6: Tests cho lib

- [ ] Tạo `src/shared/lib/cloudinary.test.ts`.
- [ ] Test empty `publicId`.
- [ ] Test default transforms.
- [ ] Test width, height, crop, quality.
- [ ] Tạo `src/shared/lib/seo.test.ts`.
- [ ] Test title format.
- [ ] Test description.
- [ ] Test canonical URL.
- [ ] Test open graph title/image.
- [ ] Test `noIndex`.
- [ ] Mở hoặc tạo `src/shared/lib/utils.test.ts`.
- [ ] Test `buildQueryString`.
- [ ] Test `parseSearchParams`.
- [ ] Test `calculateDiscountPercent`.
- [ ] Test `truncateText`.
- [ ] Test `getOrderStatusColor` fallback.
- [ ] Test `validateVietnamesePhone`.

### Bước 7: Tests cho hooks

- [ ] Tạo `src/shared/hooks/use-auth.test.ts`.
- [ ] Test trạng thái chưa login.
- [ ] Test login cập nhật token và user.
- [ ] Test `isAdmin`.
- [ ] Test logout clear state.
- [ ] Nếu có redirect, test `router.push`.
- [ ] Tạo `src/shared/hooks/use-cart.test.ts`.
- [ ] Test `isEmpty`.
- [ ] Test add item.
- [ ] Test total và itemCount.
- [ ] Test remove item.
- [ ] Test update quantity.
- [ ] Test clear cart.
- [ ] Tạo `src/shared/hooks/use-pagination.test.ts`.
- [ ] Test page mặc định.
- [ ] Test totalPages.
- [ ] Test clamp page min/max.
- [ ] Test `hasNext` và `hasPrev`.
- [ ] Nếu hook sync URL, test serialize và hydrate params.
- [ ] Tạo `src/shared/hooks/use-product-filters.test.ts`.
- [ ] Test default filters.
- [ ] Test initial overrides.
- [ ] Test `setFilter`.
- [ ] Test reset page khi đổi filter khác `page`.
- [ ] Test `resetFilters`.
- [ ] Test `toQueryString`.

### Bước 8: Coverage strategy cho thin wrappers

- [ ] Quyết định test mỏng hoặc exclude coverage cho `src/shared/lib/notification.ts`.
- [ ] Quyết định test mỏng hoặc exclude coverage cho `src/shared/hooks/use-toast.ts`.
- [ ] Không để hai file này làm fail `npm run test:coverage`.

### Bước 9: Verification cuối

- [ ] Chạy `npx vitest run src/shared/lib/cloudinary.test.ts`.
- [ ] Chạy `npx vitest run src/shared/lib/seo.test.ts`.
- [ ] Chạy `npx vitest run src/shared/lib/utils.test.ts`.
- [ ] Chạy `npx vitest run src/shared/hooks/use-auth.test.ts`.
- [ ] Chạy `npx vitest run src/shared/hooks/use-cart.test.ts`.
- [ ] Chạy `npx vitest run src/shared/hooks/use-pagination.test.ts`.
- [ ] Chạy `npx vitest run src/shared/hooks/use-product-filters.test.ts`.
- [ ] Chạy `npm run test`.
- [ ] Chạy `npm run test:coverage`.
- [ ] Chạy `npm run lint`.
- [ ] Chỉ đánh dấu hoàn thành Plan A khi toàn bộ lệnh trên pass.
