# Design System Integration

> Tầng sống. Last verified: 2026-07-18.

- **Token-first**: color scale + semantic tokens định nghĩa trong `@theme` tại `src/app/globals.css`; không hardcode màu/radius lẻ tẻ.
- **Visual identity: clean commerce** (từ 2026-07) — phẳng, nền trắng, card `rounded-xl border bg-card shadow-sm`, CTA tối (semantic `--primary` = neutral đậm). Glassmorphism (`glass`/`spatial-*`) đã gỡ bỏ hoàn toàn — xem [`docs/planning/07-redesign-clean-commerce.md`](../../planning/07-redesign-clean-commerce.md) (đã snapshot).
- **Semantic token (chuẩn shadcn) là ngôn ngữ chính thức khi viết component**: `bg-primary`, `text-muted-foreground`, `bg-popover`… Palette scale (`brand-*`, `neutral-*`…) chỉ dùng để định nghĩa semantic vars trong `:root`/`.dark` và cho bề mặt decorative cần sắc độ cụ thể.
- **Dải `brand-*` (cam-đỏ)** chỉ dành cho giá, sale, badge khuyến mãi — KHÔNG dùng cho CTA/nav. Không còn scale `primary-*` (đã đổi tên thành `brand`).
- Radius: dùng bộ shadcn (`rounded-sm/md/lg/xl` từ `--radius`); không tạo radius token riêng lẻ.
- Theme: **light-only** — `.dark` vars giữ sẵn trong `globals.css` nhưng chưa bật toggle (`defaultTheme="light"`, `enableSystem={false}`).
- Motion: chỉ fade/translate nhẹ ≤300ms; không animation vô hạn, không 3D transform, không parallax.
- Tách primitive (`shared/components/base/`, track upstream shadcn/ui — xem [ADR-0005](../../adr/0005-base-components-track-upstream-shadcn.md)) khỏi feature component (`(group)/_lib/components/`).
- Mobile-first, breakpoint thống nhất.

Cú pháp Tailwind v4 (arbitrary value, sort class...) là coding convention thuần — xem [`../conventions.md`](../conventions.md#tailwind-v4).

## Badge

Badge sản phẩm dùng union `BadgeValue` (`'best-seller' | 'new' | 'sale' | 'low-stock'`) — không tự chế thêm giá trị mới ngoài union này.
