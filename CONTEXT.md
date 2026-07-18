# CONTEXT — Glossary

Glossary thuật ngữ của project. Chỉ chứa định nghĩa — không chứa chi tiết implementation. Quyết định kiến trúc: xem `docs/adr/`.

## Domain

| Thuật ngữ           | Định nghĩa                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Product**         | Sản phẩm bán trên storefront, định danh bằng `slug`. Có giá gốc và có thể có giá sale (giá hiệu lực = giá sale nếu có).                              |
| **Variant**         | Phân loại của một Product (hiện tại là size, ví dụ S/M/L/XL hoặc size giày), mỗi variant có tồn kho riêng. Sản phẩm hết variant còn hàng = hết hàng. |
| **Badge**           | Nhãn hiển thị trên Product, chỉ nhận 4 giá trị: `best-seller`, `new`, `sale`, `low-stock`.                                                           |
| **Cart / CartItem** | Giỏ hàng phía client (không cần đăng nhập). Một CartItem = một cặp Product + Variant với số lượng; tối đa 99/món.                                    |
| **Order**           | Đơn hàng đã đặt. Vòng đời: `pending` → `confirmed` → `processing` → `shipped` → `delivered`, hoặc `cancelled`.                                       |
| **Payment method**  | Cách thanh toán: `cod` (mặc định, thanh toán khi nhận hàng), `vnpay`, `momo`, `zalopay`.                                                             |
| **Category**        | Danh mục sản phẩm, định danh bằng `slug`, dùng cho điều hướng và lọc.                                                                                |
| **Locale**          | Ngôn ngữ hiển thị: `vi` (mặc định) hoặc `en`. Mọi URL đều có prefix locale.                                                                          |
| **Shopper**         | Người mua trên storefront `(shop)` — không cần tài khoản để duyệt và thêm giỏ.                                                                       |
| **Admin**           | Người quản trị, truy cập khu vực `(admin)` được bảo vệ.                                                                                              |

## Quy trình & kiến trúc

| Thuật ngữ           | Định nghĩa                                                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Route group**     | Một trong ba khu vực của app: `(shop)`, `(auth)`, `(admin)` — mỗi khu sở hữu logic riêng trong `_lib/`.                                             |
| **Thin route**      | Page/layout chỉ làm wiring, không chứa business logic.                                                                                              |
| **Shared boundary** | Quy tắc: code chỉ vào `shared/` khi dùng bởi ≥2 route group và không mang business rule riêng của một module.                                       |
| **Quality gate**    | Điều kiện bắt buộc trước merge/release (lint, typecheck, test... — chạy trong CI).                                                                  |
| **Seam**            | Điểm cắm kiểm thử. Project dùng CI pipeline làm seam duy nhất, Playwright cho E2E/a11y/visual (ADR 0001).                                           |
| **Snapshot doc**    | Tài liệu chụp tại một thời điểm (`docs/planning/`, `docs/reports/`) — được phép cũ, không cần cập nhật.                                             |
| **Semantic token**  | Token đặt tên theo vai trò (`primary`, `muted`, `destructive`… theo chuẩn shadcn) — ngôn ngữ chính thức khi viết component, tự đổi theo light/dark. |
| **Palette scale**   | Dải màu thô 50→950 (primary/secondary/accent/neutral) — nguyên liệu để định nghĩa semantic token, không phải ngôn ngữ mặc định của component.       |
