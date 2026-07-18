# ADR 0003 — Admin core đợt này chỉ gồm Products + Orders, chưa làm Users/Dashboard

## Status

Accepted — 2026-07-18

## Context

`API.ADMIN` (`shared/constants/api-endpoints.ts`) đã định nghĩa sẵn contract cho cả 4 nhóm: Products, Orders, Users, Dashboard stats — và backend Django đã implement đầy đủ. Route group `(admin)` thì chưa tồn tại. Một người đọc sau này thấy Users/Dashboard đã có API sẵn có thể thắc mắc tại sao không làm luôn một thể.

`docs/planning/01-mvp-overview.md` (đã khóa) chỉ định nghĩa admin core MVP là "quản trị sản phẩm, đơn hàng, trạng thái đơn" — không nhắc Users hay Dashboard.

## Decision

Đợt xây dựng `(admin)` route group đầu tiên chỉ implement **Product CRUD** (kèm variants + upload ảnh) và **Order list + đổi trạng thái**. Users management và Dashboard stats — dù endpoint đã sẵn sàng — bị hoãn sang backlog kế tiếp, để giữ đúng scope MVP đã khóa và tránh việc admin core phình to hơn ý định ban đầu.

## Consequences

- `(admin)` route group ban đầu chỉ có `/admin/products` và `/admin/orders`, không có `/admin` landing/dashboard riêng.
- Khi làm Users/Dashboard sau này, không cần thiết kế lại contract — chỉ cần thêm route + UI tiêu thụ endpoint đã có.
