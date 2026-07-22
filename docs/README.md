# docs/ — Bản đồ tài liệu

Tài liệu chia 2 tầng: **tầng sống** (phải luôn đúng với code — sai là bug) và **tầng lịch sử** (snapshot tại thời điểm, được phép cũ).

## Tầng sống

| Đọc gì                                                                                                                        | Ở đâu                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Glossary thuật ngữ domain                                                                                                     | [`CONTEXT.md`](../CONTEXT.md) (root)                                   |
| Tech stack theo layer                                                                                                         | [`architecture/tech-stack.md`](./architecture/tech-stack.md)           |
| Quy ước code: imports, naming, typing, i18n, SEO, commit                                                                      | [`architecture/conventions.md`](./architecture/conventions.md)         |
| Frontend architecture: module structure, routing, state, API client, auth, authorization, design system, testing, performance | [`architecture/frontend/README.md`](./architecture/frontend/README.md) |
| Quyết định kiến trúc (ADR)                                                                                                    | [`adr/`](./adr/)                                                       |
| Git flow: branching, commit, PR, merge strategy                                                                               | [`CONTRIBUTING.md`](../CONTRIBUTING.md) (root)                         |
| Hướng dẫn cho AI agent (issue tracker, triage labels, domain docs)                                                            | [`agents/`](./agents/)                                                 |

## Tầng lịch sử

| Gì                                                                    | Ở đâu                                                                  |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Bộ planning MVP (overview, roadmap, backlog... — 06/2026)             | [`planning/`](./planning/)                                             |
| Research tham khảo cho redesign/milestone (không phải stage planning) | [`planning/nike-ui-ux-analysis.md`](./planning/nike-ui-ux-analysis.md) |
| Báo cáo snapshot có ngày (test report, UI/UX review)                  | [`reports/`](./reports/)                                               |

## Quy tắc duy trì

- Sửa code làm lệch tầng sống → sửa doc trong cùng PR.
- Báo cáo mới → thêm vào `reports/` với ngày trong tên file (`YYYY-MM-DD-<tên>.md`), không sửa báo cáo cũ.
- Tài liệu planning xong vai trò → chuyển vào `planning/` kèm banner snapshot.
