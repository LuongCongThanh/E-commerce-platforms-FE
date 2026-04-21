# Task 02: Types Và Schemas

## Mục tiêu

Hoàn thiện shared schemas cho category, address, checkout, filters và dọn duplicate types.

## Files

- Tạo `src/shared/types/category.ts`
- Tạo `src/shared/types/address.ts`
- Tạo `src/shared/types/checkout.ts`
- Tạo `src/shared/types/filter.ts`
- Sửa `src/shared/types/product.ts` nếu còn duplicate `ProductFilters`

## Cách viết code

- Mỗi file export:
  - `SomeSchema`
  - `type SomeType = z.infer<typeof SomeSchema>`
- Dùng Zod v4 syntax.
- `filter.ts` là nguồn sự thật chính cho product filters.
- Không dùng `z.coerce.boolean()` trực tiếp cho query string `inStock`.
- `page` và `pageSize` có default hợp lý.
- `checkout.ts` compose từ `ShippingAddressSchema`.

## Lưu ý

- Không thêm lại `ProductVariantSchema`.
- Nếu `ProductFilters` đang tồn tại trong `product.ts`, refactor về dùng type từ `filter.ts` hoặc xóa hẳn nếu không còn dùng.

## Checklist

- [ ] Tạo `category.ts`.
- [ ] Tạo `address.ts`.
- [ ] Tạo `checkout.ts`.
- [ ] Tạo `filter.ts`.
- [ ] Parse rõ ràng `inStock: true | false | undefined`.
- [ ] Refactor duplicate filter types trong `product.ts`.

## Verify

- Feature forms có thể import schema trực tiếp từ `src/shared/types/`.
- Không còn hai định nghĩa độc lập cho product filters.
