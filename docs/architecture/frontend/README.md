# Frontend Architecture — Chỉ mục

> Tầng sống — mọi mục dưới đây phải phản ánh đúng hiện trạng code; sai là bug (cùng quy tắc duy trì với [`docs/README.md`](../../README.md)).

Thư mục này tổ chức theo các hạng mục **Giai đoạn 2 — Front-end Architecture** mô tả tại [`docs/workflow.md`](../../workflow.md) — chỉ mượn phần phân loại, không áp dụng phần stack/skill cụ thể trong file đó (file đó mô tả stack NestJS/PostgreSQL không khớp repo này).

| Hạng mục (Giai đoạn 2, workflow.md) | Tài liệu                                                                                                                                                  |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Module structure                    | [`shared-structure.md`](./shared-structure.md) (ranh giới `src/shared/`), [`shop-module-structure.md`](./shop-module-structure.md) (cây thư mục `(shop)`) |
| Routing                             | [`routing.md`](./routing.md)                                                                                                                              |
| State ownership                     | [`state-management.md`](./state-management.md)                                                                                                            |
| API client                          | [`api-integration.md`](./api-integration.md)                                                                                                              |
| Authentication UI flow              | [`authentication.md`](./authentication.md)                                                                                                                |
| Authorization                       | [`authorization.md`](./authorization.md)                                                                                                                  |
| Error handling                      | xem [`api-integration.md`](./api-integration.md#error-handling)                                                                                           |
| Design System integration           | [`design-system.md`](./design-system.md)                                                                                                                  |
| Performance                         | [`performance.md`](./performance.md)                                                                                                                      |
| Front-end testing                   | [`testing.md`](./testing.md)                                                                                                                              |

Không nằm trong hạng mục trên (vẫn ở `docs/architecture/` gốc):

- [`../tech-stack.md`](../tech-stack.md) — bảng công nghệ theo layer + quality gates.
- [`../conventions.md`](../conventions.md) — import/naming/typing/i18n/commit (quy ước code thuần, không phải quyết định kiến trúc).

## Lịch sử

Trước 2026-07-23, các tài liệu này gộp trong `docs/architecture/system-diagram.md` (sơ đồ ASCII runtime) + rải rác trong `tech-stack.md`/`conventions.md`. Đã tách theo hạng mục ở trên để mỗi câu hỏi kiến trúc có một file trả lời duy nhất, đồng thời cập nhật lại các phần đã lỗi thời (trạng thái `(admin)`, vị trí `AuthRuntimeProvider`, cơ chế guard admin) — xem lịch sử qua `git log --follow` từng file nếu cần bản ASCII gốc.
