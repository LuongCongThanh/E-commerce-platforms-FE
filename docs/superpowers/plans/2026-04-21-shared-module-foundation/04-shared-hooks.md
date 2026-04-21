# Task 04: Shared Hooks

## Mục tiêu

Hoàn thiện hooks dùng chung bám đúng `auth-store`, `cart-store` và filter state.

## Files

- Tạo `src/shared/hooks/use-auth.ts`
- Tạo `src/shared/hooks/use-cart.ts`
- Tạo `src/shared/hooks/use-pagination.ts`
- Tạo `src/shared/hooks/use-product-filters.ts`
- Tạo `src/shared/hooks/use-toast.ts`

## Cách viết code

- `use-auth.ts`:
  - `'use client'`
  - expose `user`, `accessToken`, `isLoggedIn`, `isAdmin`, `login`, `logout`
- `use-cart.ts`:
  - mapping rõ từ API store sang API hook
  - expose `isEmpty`
- `use-pagination.ts`:
  - phải chốt rõ là local helper hay URL-synced hook
- `use-product-filters.ts`:
  - dùng types từ `src/shared/types/filter.ts`
  - đổi filter khác `page` thì reset `page = 1`
- `use-toast.ts`:
  - convenience layer mỏng

## Checklist

- [ ] Tạo `use-auth.ts`.
- [ ] Tạo `use-cart.ts`.
- [ ] Chốt scope của `use-pagination.ts`.
- [ ] Tạo `use-pagination.ts`.
- [ ] Tạo `use-product-filters.ts`.
- [ ] Tạo `use-toast.ts`.
- [ ] Kiểm tra hooks bám API thật của stores hiện tại.

## Verify

- Hook không duplicate business logic vốn đã có trong store.
- Không import vòng giữa hooks và types.
