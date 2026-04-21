# Task 03: Lib Helpers

## Mục tiêu

Hoàn thiện các helper dùng chung cho image URL, metadata, notification và utility functions.

## Files

- Tạo `src/shared/lib/cloudinary.ts`
- Tạo `src/shared/lib/seo.ts`
- Tạo `src/shared/lib/notification.ts`
- Sửa `src/shared/lib/utils.ts`

## Cách viết code

- `cloudinary.ts`:
  - builder thuần
  - không dùng SDK
  - fallback khi thiếu `publicId`
- `seo.ts`:
  - return object `Metadata`
  - hỗ trợ `title`, `description`, `image`, `url`, `noIndex`
- `notification.ts`:
  - wrapper mỏng quanh `sonner`
  - ưu tiên object `notify`
- `utils.ts`:
  - chỉ thêm pure functions
  - deterministic, dễ test

## Utility cần có

- `buildQueryString`
- `parseSearchParams`
- `calculateDiscountPercent`
- `truncateText`
- `getOrderStatusLabel`
- `getOrderStatusColor`
- `validateVietnamesePhone`

## Checklist

- [ ] Tạo `cloudinary.ts`.
- [ ] Tạo `seo.ts`.
- [ ] Tạo `notification.ts`.
- [ ] Bổ sung các utility functions vào `utils.ts`.
- [ ] Giữ `notification.ts` mỏng, không trùng trách nhiệm quá nhiều với `useToast`.

## Verify

- Helpers đủ ổn định để feature modules import trực tiếp.
- `src/shared/lib/**` vẫn nằm trong coverage strategy.
