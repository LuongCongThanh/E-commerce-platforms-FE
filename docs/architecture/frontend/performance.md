# Performance

> Tầng sống. Last verified: 2026-07-23.

Chưa có ngân sách performance chính thức (Core Web Vitals budget, bundle size budget) hay chiến lược cache/ISR cho catalog được ghi thành quyết định — đây là khoảng trống thật, không phải phần quên viết tài liệu.

## Đã có

- `npm run analyze` — bundle size analysis (xem `CLAUDE.md`).
- Image CDN qua Cloudinary (`buildImageUrl()`, `shared/lib/cloudinary.ts`) — transform on-the-fly, không tự host ảnh gốc.
- PWA qua Serwist (`@serwist/next`) — service worker, offline page (mức cơ bản, chưa có chiến lược cache theo route).

## Kế hoạch (chưa triển khai)

"Scale-readiness (FE)" đã được đưa vào scope milestone kế tiếp — xem [`docs/planning/08-nike-flagship-expansion.md`](../../planning/08-nike-flagship-expansion.md): chiến lược cache/ISR cho trang catalog, tối ưu ảnh, code-splitting theo route, ngân sách Core Web Vitals ở tải cao. Tài liệu này sẽ được cập nhật khi milestone đó có quyết định cụ thể (ADR riêng nếu cần).
