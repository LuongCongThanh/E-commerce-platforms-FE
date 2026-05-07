---
title: Documentation Map
status: active
audience: human
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-08
---

# Documentation Map

> Điểm vào duy nhất cho toàn bộ tài liệu dự án. Đọc theo thứ tự nếu bạn mới join.

---

## Đọc theo thứ tự (Senior FE Developer — onboarding)

| Bước | Tài liệu                                                                                             | Mục đích                                                                   | Thời gian đọc              |
| ---- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------- |
| 1    | [FE Constraints & Conventions](architecture/fe-constraints.vi.md)                                    | Rules bắt buộc — import alias, TypeScript strict, Tailwind v4, HTTP client | ~15 phút                   |
| 2    | [FE Module Map](architecture/fe-module-map.vi.md)                                                    | Codebase layout — module nào làm gì, file nào ở đâu                        | ~10 phút                   |
| 3    | [Priority Backlog](plans/priority-backlog.vi.md)                                                     | Feature nào đã xong, đang làm, chưa làm — tránh làm lại                    | ~5 phút                    |
| 4    | [Agent Tooling Guide](playbooks/agent-tooling-guide.vi.md)                                           | Khi nào dùng superpowers, GSD, RTK, caveman                                | ~10 phút                   |
| 5    | [Agent Tooling Usage Guide](playbooks/agent-tooling-usage-guide.vi.md)                               | Cách dùng thực tế từng công cụ: lệnh, prompt mẫu, troubleshooting          | ~15 phút                   |
| 6    | [Skills Catalog](playbooks/skills-catalog.vi.md)                                                     | Catalog skill/tool có sẵn và cách gọi nhanh                                | ~10 phút                   |
| 7    | [Storefront Core Design Spec](specs/storefront-core-design.vi.md)                                    | Behaviour spec cho home/PDP/search                                         | Khi implement P1-01        |
| 8    | [Cart, Checkout, Orders & Nav Spec](specs/cart-checkout-nav-design.vi.md)                            | Behaviour spec cho cart/checkout/orders/mega menu                          | Khi implement P1-03..P1-05 |

**Domain language:** Xem [CONTEXT.md](../CONTEXT.md) ở root — định nghĩa tất cả thuật ngữ domain (Customer vs User, Cart vs Order, v.v.)

---

## Cấu trúc thư mục

```
docs/
├── README.md                  ← Bạn đang đọc đây
├── architecture/              ← Stack rules, module map, technical decisions
│   ├── fe-constraints.vi.md   ← Constraints & coding conventions (BẮT BUỘC ĐỌC TRƯỚC)
│   └── fe-module-map.vi.md    ← Codebase navigation guide
├── plans/                     ← Execution plans (dated filenames)
│   └── priority-backlog.vi.md ← P0/P1/P2/P3 backlog + current status
├── specs/                     ← Feature specs (stable filenames)
│   ├── storefront-core-design.vi.md
│   └── cart-checkout-nav-design.vi.md
├── product/                   ← Product overview docs (eng + vi)
├── playbooks/                 ← Operational guides cho skills/workflows
├── agents/                    ← Agent configuration
│   ├── domain.md
│   ├── issue-tracker.md
│   └── triage-labels.md
├── adr/                       ← Architecture Decision Records
│   ├── _template.md
│   └── 0001-documentation-information-architecture.md
├── archive/                   ← Frozen historical docs
│   └── 2026-mvp-planning/     ← Legacy planning docs (tháng 4/2026)
```

**Compatibility note:** `docs/_stubs/` chỉ là lớp tương thích tạm thời cho đường dẫn cũ. Sunset ngày `2026-08-06`. Không đọc hoặc sửa tài liệu tại đó.

---

## Trust Rules

| Rule                    | Chi tiết                                                  |
| ----------------------- | --------------------------------------------------------- |
| **Source of truth**     | File `.vi.md` luôn là bản gốc. File `.en.md` là bản dịch. |
| **Phải dịch sang .en**  | `product/` và `architecture/` — vì audience mixed vi/en   |
| **Không bắt buộc dịch** | `plans/`, `specs/`, `agents/`, `playbooks/`               |
| **Status: active**      | Tài liệu đang áp dụng — cập nhật khi codebase thay đổi    |
| **Status: completed**   | Đã xong, giữ làm lịch sử, không cập nhật nữa              |
| **Status: superseded**  | Bị thay thế bởi tài liệu mới — có link sang successor     |

---

## ADRs

| ADR                                                        | Quyết định                                                                                      |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [0001](adr/0001-documentation-information-architecture.md) | Documentation information architecture — category structure, filename rules, translation policy |

---

## Cập nhật tài liệu

- Khi sửa code ảnh hưởng đến architecture → cập nhật `fe-constraints.vi.md` hoặc `fe-module-map.vi.md`.
- Khi task P1/P2 hoàn thành → cập nhật status trong `priority-backlog.vi.md`.
- Khi có quyết định hard-to-reverse → tạo ADR mới theo `adr/_template.md`.
- Không commit tài liệu lỗi thời mà không cập nhật `last_updated`.
