# Frontend Architecture — Chỉ mục

> Tầng sống — mọi mục dưới đây phải phản ánh đúng hiện trạng code; sai là bug (cùng quy tắc duy trì với [`docs/README.md`](../../README.md)).

Thư mục này còn 3 file, tổ chức theo các hạng mục **Giai đoạn 2 — Front-end Architecture** mô tả tại [`docs/workflow.md`](../../workflow.md) — chỉ mượn phần phân loại, không áp dụng phần stack/skill cụ thể trong file đó (file đó mô tả stack NestJS/PostgreSQL không khớp repo này). Ban đầu tách thành 10 file theo đúng 1 hạng mục = 1 file, nhưng 5 hạng mục (Routing/State/API/Auth/Authorization) kể cùng một câu chuyện runtime và 3 hạng mục còn lại (Design system/Testing/Performance) quá ngắn để đứng riêng — nên gộp lại 2026-07-23.

| File                                                     | Hạng mục (Giai đoạn 2, workflow.md)                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [`shared-structure.md`](./shared-structure.md)           | Module structure — ranh giới `src/shared/`                                                  |
| [`shop-module-structure.md`](./shop-module-structure.md) | Module structure — cây thư mục `(shop)`                                                     |
| [`runtime.md`](./runtime.md)                             | Routing, State ownership, API client, Error handling, Authentication UI flow, Authorization |
| [`quality.md`](./quality.md)                             | Design System integration, Front-end testing, Performance                                   |

Không nằm trong hạng mục trên (vẫn ở `docs/architecture/` gốc):

- [`../tech-stack.md`](../tech-stack.md) — bảng công nghệ theo layer + quality gates.
- [`../conventions.md`](../conventions.md) — import/naming/typing/i18n/commit (quy ước code thuần, không phải quyết định kiến trúc).
