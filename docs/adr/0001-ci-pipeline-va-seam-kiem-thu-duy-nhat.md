# ADR 0001 — CI pipeline là seam duy nhất; Playwright cho E2E/a11y/visual; Storybook chỉ là documentation

## Status

Accepted — 2026-07-17

## Context

Project đã có nền tảng kiến trúc tốt (design tokens, Radix + CVA, HTTP layer, Zod contracts, unit test trên shared) nhưng chưa có kiểm tra chất lượng tự động nào chạy ngoài máy dev: không có CI, thư mục `e2e/` rỗng dù Playwright đã cấu hình, không có kiểm thử accessibility, visual regression hay performance budget.

Spec tổng thể: [issue #8](https://github.com/LuongCongThanh/E-commerce-platforms-FE/issues/8). Khi triển khai, cần quyết định các loại kiểm thử mới (E2E, a11y, visual, performance) đi qua những "seam" nào — càng ít seam, chi phí duy trì càng thấp.

## Decision

1. **CI pipeline (GitHub Actions) là seam duy nhất** cho mọi kiểm tra chất lượng. Pipeline chỉ orchestrate các npm scripts có sẵn — không có logic kiểm thử nào sống trong YAML. Mọi kiểm tra chạy được y hệt ở local bằng cùng lệnh.
2. **Playwright là seam duy nhất cho E2E, accessibility và visual regression.** A11y dùng axe-core tích hợp vào phiên Playwright; visual dùng cơ chế screenshot có sẵn của Playwright (project riêng, một browser, viewport cố định). Không thêm framework test mới, không dùng dịch vụ ngoài (Chromatic/Percy).
3. **Storybook chỉ đóng vai trò documentation/workshop** cho design system — không phải seam kiểm thử. Không dùng Storybook test runner.

## Consequences

- Thêm một loại kiểm tra mới = thêm một npm script + một job gọi script đó; không phát sinh hạ tầng mới.
- Lỗi CI luôn tái hiện được ở local bằng cùng lệnh, không cần debug YAML.
- Baseline screenshot commit vào repo — repo nặng hơn một chút, đổi lại không phụ thuộc dịch vụ ngoài.
- A11y chỉ được kiểm ở mức trang (qua Playwright), không ở mức component đơn lẻ; đủ cho giai đoạn hiện tại, có thể xét lại khi shared components được publish làm package.
- Phát hiện trong lúc triển khai bước 1: script `test:coverage` tham chiếu `scripts/coverage.mjs` không tồn tại, và coverage thực tế (~32%) không đạt threshold 99% trong `vitest.config.ts` — coverage gate chưa đưa vào CI, xử lý ở issue riêng.
