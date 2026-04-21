# Task 01: Audit Và Constants

## Mục tiêu

Chốt đúng phạm vi còn thiếu và hoàn thiện constants dùng chung.

## Files

- Tạo `src/shared/constants/routes.ts`
- Tạo `src/shared/constants/query-keys.ts`
- Sửa `src/shared/constants/app-config.ts`

## Trước khi code

- Kiểm tra `src/shared/components/ui/` để xác nhận không cài lại primitive.
- Kiểm tra `src/shared/types/product.ts` để xác nhận `ProductVariantSchema` đã có.
- Kiểm tra `src/shared/stores/auth-store.ts` và `src/shared/stores/cart-store.ts` để biết API thật.

## Cách viết code

- `ROUTES`:
  - dùng object duy nhất
  - route động dùng function
  - dùng `as const`
- `QUERY_KEYS`:
  - dùng tuple readonly
  - dynamic key normalize `id` bằng `String(id)`
- `ORDER_STATUS_COLOR_MAP`:
  - bám tập status thật từ `ORDER_STATUS_LABEL`
- `SORT_OPTIONS`:
  - bám ordering values sẽ dùng trong `filter.ts`

## Checklist

- [ ] Audit `src/shared/` và loại các task stale.
- [ ] Tạo `routes.ts`.
- [ ] Tạo `query-keys.ts`.
- [ ] Thêm `ORDER_STATUS_COLOR_MAP`.
- [ ] Thêm `SORT_OPTIONS`.
- [ ] Kiểm tra constants mới không mâu thuẫn với config hiện có.

## Verify

- Feature code không cần hardcode path nữa.
- Query hooks không phải gõ lại string literals cho cache keys.
