# Quality: Design System, Testing, Performance

> Tầng sống. Last verified: 2026-07-23.

Gộp 3 hạng mục (Design System integration, Front-end testing, Performance — theo Giai đoạn 2 của [`../../workflow.md`](../../workflow.md)) vào một file vì mỗi hạng mục riêng lẻ chỉ 15-40 dòng, không đủ nặng để đứng thành file độc lập. Routing/state/API/auth nằm ở [`runtime.md`](./runtime.md); cấu trúc module ở [`shared-structure.md`](./shared-structure.md)/[`shop-module-structure.md`](./shop-module-structure.md).

## Design System

- **Token-first**: color scale + semantic tokens định nghĩa trong `@theme` tại `src/app/globals.css`; không hardcode màu/radius lẻ tẻ.
- **Visual identity: clean commerce** (từ 2026-07) — phẳng, nền trắng, card `rounded-xl border bg-card shadow-sm`, CTA tối (semantic `--primary` = neutral đậm). Glassmorphism (`glass`/`spatial-*`) đã gỡ bỏ hoàn toàn — xem [`docs/planning/07-redesign-clean-commerce.md`](../../planning/07-redesign-clean-commerce.md) (đã snapshot).
- **Semantic token (chuẩn shadcn) là ngôn ngữ chính thức khi viết component**: `bg-primary`, `text-muted-foreground`, `bg-popover`… Palette scale (`brand-*`, `neutral-*`…) chỉ dùng để định nghĩa semantic vars trong `:root`/`.dark` và cho bề mặt decorative cần sắc độ cụ thể.
- **Dải `brand-*` (cam-đỏ)** chỉ dành cho giá, sale, badge khuyến mãi — KHÔNG dùng cho CTA/nav. Không còn scale `primary-*` (đã đổi tên thành `brand`).
- Radius: dùng bộ shadcn (`rounded-sm/md/lg/xl` từ `--radius`); không tạo radius token riêng lẻ.
- Theme: **light-only** — `.dark` vars giữ sẵn trong `globals.css` nhưng chưa bật toggle (`defaultTheme="light"`, `enableSystem={false}`).
- Motion: chỉ fade/translate nhẹ ≤300ms; không animation vô hạn, không 3D transform, không parallax.
- Tách primitive (`shared/components/base/`, track upstream shadcn/ui — xem [ADR-0005](../../adr/0005-base-components-track-upstream-shadcn.md)) khỏi feature component (`(group)/_lib/components/`).
- Mobile-first, breakpoint thống nhất.
- Cú pháp Tailwind v4 (arbitrary value, sort class...) là coding convention thuần — xem [`../conventions.md`](../conventions.md#tailwind-v4).
- Badge sản phẩm dùng union `BadgeValue` (`'best-seller' | 'new' | 'sale' | 'low-stock'`) — không tự chế thêm giá trị mới ngoài union này.

## Testing

**Seam duy nhất: CI pipeline.** Theo [ADR-0001](../../adr/0001-ci-pipeline-va-seam-kiem-thu-duy-nhat.md): **CI pipeline (GitHub Actions) là seam duy nhất** cho mọi kiểm tra chất lượng — pipeline chỉ orchestrate npm script có sẵn, mọi kiểm tra chạy y hệt ở local. **Playwright là seam duy nhất cho E2E, accessibility (axe-core) và visual regression** — không thêm framework test mới, không dùng dịch vụ ngoài (Chromatic/Percy). Storybook (nếu có) chỉ đóng vai trò documentation, không phải seam kiểm thử.

- **Unit / integration**: Vitest + Testing Library + MSW (mock network tầng handler). Test trong `__tests__/` cạnh module. Test hành vi bên ngoài, không test implementation details.
- **E2E**: Playwright, 3 browser. Core journeys — chưa hoàn tất — spec gốc ở issue #8 (đã đóng, không còn track chủ động; xem ADR-0001).

### Quality gates

Trước merge (enforce bởi CI — `.github/workflows/ci.yml`): `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test` đều phải pass.

Trước release: `npm run build` pass (hiện chạy ở pre-push hook); core journeys có E2E coverage (`npm run test:e2e`) — chưa hoàn tất — spec gốc ở issue #8 (đã đóng, không còn track chủ động; xem ADR-0001).

### Ghi chú hiện trạng

- Coverage gate 99% trong `vitest.config.ts` chưa enforce được trong CI — xem issue #10.
- `npm run test:coverage` hiện hỏng: script tham chiếu `scripts/coverage.mjs` không tồn tại, và coverage thực tế đo ngày 2026-07-17 chỉ ~32% — không đạt threshold 99%. Coverage gate chưa đưa vào CI, xử lý ở issue riêng (#10).

## Performance

Chưa có ngân sách performance chính thức (Core Web Vitals budget, bundle size budget) hay chiến lược cache/ISR cho catalog được ghi thành quyết định — đây là khoảng trống thật, không phải phần quên viết tài liệu.

**Đã có:**

- `npm run analyze` — bundle size analysis (xem `CLAUDE.md`).
- Image CDN qua Cloudinary (`buildImageUrl()`, `shared/lib/cloudinary.ts`) — transform on-the-fly, không tự host ảnh gốc.
- PWA qua Serwist (`@serwist/next`) — service worker, offline page (mức cơ bản, chưa có chiến lược cache theo route).

**Kế hoạch (chưa triển khai):** "Scale-readiness (FE)" đã được đưa vào scope milestone kế tiếp — xem [`docs/planning/08-nike-flagship-expansion.md`](../../planning/08-nike-flagship-expansion.md): chiến lược cache/ISR cho trang catalog, tối ưu ảnh, code-splitting theo route, ngân sách Core Web Vitals ở tải cao. Tài liệu này sẽ được cập nhật khi milestone đó có quyết định cụ thể (ADR riêng nếu cần).
