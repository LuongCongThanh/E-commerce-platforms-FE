# Shared Module Foundation Tasks

Folder này tách implementation plan thành các task nhỏ để dev hoặc agent chạy tuần tự.

## Thứ tự đề xuất

1. [01-audit-and-constants.md](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/docs/superpowers/plans/2026-04-21-shared-module-foundation/01-audit-and-constants.md)
2. [02-types-and-schemas.md](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/docs/superpowers/plans/2026-04-21-shared-module-foundation/02-types-and-schemas.md)
3. [03-lib-helpers.md](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/docs/superpowers/plans/2026-04-21-shared-module-foundation/03-lib-helpers.md)
4. [04-shared-hooks.md](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/docs/superpowers/plans/2026-04-21-shared-module-foundation/04-shared-hooks.md)
5. [05-tests-and-verification.md](/e:/my-pj/learn-python/E-commerce-platforms/Front-end/ecommerce-next/docs/superpowers/plans/2026-04-21-shared-module-foundation/05-tests-and-verification.md)

## Quy ước chung

- Không tạo lại primitive hoặc schema đã tồn tại trong repo.
- Không để duplicate source of truth.
- Hooks phải bám API thật của stores hiện tại.
- Mọi thay đổi trong `src/shared/lib/**` và `src/shared/hooks/**` phải có coverage strategy.
