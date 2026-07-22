# Front-end Testing

> Tầng sống. Last verified: 2026-07-18.

## Seam duy nhất: CI pipeline

Theo [ADR-0001](../../adr/0001-ci-pipeline-va-seam-kiem-thu-duy-nhat.md): **CI pipeline (GitHub Actions) là seam duy nhất** cho mọi kiểm tra chất lượng — pipeline chỉ orchestrate npm script có sẵn, mọi kiểm tra chạy y hệt ở local. **Playwright là seam duy nhất cho E2E, accessibility (axe-core) và visual regression** — không thêm framework test mới, không dùng dịch vụ ngoài (Chromatic/Percy). Storybook (nếu có) chỉ đóng vai trò documentation, không phải seam kiểm thử.

## Unit / integration

- Vitest + Testing Library + MSW (mock network tầng handler).
- Test trong `__tests__/` cạnh module.
- Test hành vi bên ngoài, không test implementation details.

## E2E

- Playwright, 3 browser.
- Core journeys — đang triển khai theo issue #8.

## Quality gates

Trước merge (enforce bởi CI — `.github/workflows/ci.yml`):

- `npm run lint` pass.
- `npm run format:check` pass.
- `npm run typecheck` pass.
- `npm run test` pass.

Trước release:

- `npm run build` pass (hiện chạy ở pre-push hook).
- Core journeys có E2E coverage (`npm run test:e2e`) — đang triển khai theo issue #8.

## Ghi chú hiện trạng

- Coverage gate 99% trong `vitest.config.ts` chưa enforce được trong CI — xem issue #10.
- `npm run test:coverage` hiện hỏng: script tham chiếu `scripts/coverage.mjs` không tồn tại, và coverage thực tế đo ngày 2026-07-17 chỉ ~32% — không đạt threshold 99%. Coverage gate chưa đưa vào CI, xử lý ở issue riêng (#10).
