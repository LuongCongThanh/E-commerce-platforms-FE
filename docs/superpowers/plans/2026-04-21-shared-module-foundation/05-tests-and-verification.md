# Task 05: Tests Và Verification

## Mục tiêu

Đảm bảo mọi logic trong `src/shared/lib/**` và `src/shared/hooks/**` có test đủ để pass coverage và tránh regression.

## Files test

- `src/shared/lib/cloudinary.test.ts`
- `src/shared/lib/seo.test.ts`
- `src/shared/lib/utils.test.ts`
- `src/shared/hooks/use-auth.test.ts`
- `src/shared/hooks/use-cart.test.ts`
- `src/shared/hooks/use-pagination.test.ts`
- `src/shared/hooks/use-product-filters.test.ts`

## Test cases tối thiểu

### Lib

- `cloudinary.test.ts`
  - [ ] empty `publicId`
  - [ ] default transforms
  - [ ] width / height / crop / quality
- `seo.test.ts`
  - [ ] title format
  - [ ] description
  - [ ] canonical URL
  - [ ] open graph image
  - [ ] `noIndex`
- `utils.test.ts`
  - [ ] `buildQueryString`
  - [ ] `parseSearchParams`
  - [ ] `calculateDiscountPercent`
  - [ ] `truncateText`
  - [ ] `getOrderStatusColor`
  - [ ] `validateVietnamesePhone`

### Hooks

- `use-auth.test.ts`
  - [ ] initial state
  - [ ] login
  - [ ] `isAdmin`
  - [ ] logout
  - [ ] redirect nếu có
- `use-cart.test.ts`
  - [ ] `isEmpty`
  - [ ] add item
  - [ ] total
  - [ ] itemCount
  - [ ] remove item
  - [ ] update quantity
  - [ ] clear cart
- `use-pagination.test.ts`
  - [ ] initial page
  - [ ] totalPages
  - [ ] clamp min/max
  - [ ] `hasNext` / `hasPrev`
  - [ ] URL sync nếu có
- `use-product-filters.test.ts`
  - [ ] defaults
  - [ ] initial overrides
  - [ ] `setFilter`
  - [ ] reset page on filter change
  - [ ] `resetFilters`
  - [ ] `toQueryString`

## Thin wrappers

- [ ] Chọn test mỏng hoặc exclude coverage có chủ đích cho `notification.ts`.
- [ ] Chọn test mỏng hoặc exclude coverage có chủ đích cho `use-toast.ts`.

## Lệnh verify

```bash
npx vitest run src/shared/lib/cloudinary.test.ts
npx vitest run src/shared/lib/seo.test.ts
npx vitest run src/shared/lib/utils.test.ts
npx vitest run src/shared/hooks/use-auth.test.ts
npx vitest run src/shared/hooks/use-cart.test.ts
npx vitest run src/shared/hooks/use-pagination.test.ts
npx vitest run src/shared/hooks/use-product-filters.test.ts
npm run test
npm run test:coverage
npm run lint
```

## Done criteria

- Tất cả tests pass.
- Coverage pass theo `vitest.config.ts`.
- Lint pass.
