---
title: Documentation Information Architecture Migration
status: completed
audience: mixed
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-07
supersedes: null
related_adr: docs/adr/0001-documentation-information-architecture.md
---

# Documentation IA Migration — 2026-05-06

> Historical execution record. Migration chính đã hoàn tất. File này được giữ để tra cứu kết quả cuối cùng và các follow-up còn lại.

## Goal

Đưa filesystem `docs/` khớp với ADR 0001 và glossary trong `CONTEXT.md`: bỏ legacy wrappers, chuyển sang category-based IA, áp frontmatter chuẩn, và tách rõ canonical docs với tài liệu lịch sử/chuyển tiếp.

## Final Outcome

Trạng thái hiện tại của repo:

- `docs/` đã dùng category-based structure: `product/`, `architecture/`, `specs/`, `plans/`, `playbooks/`, `agents/`, `adr/`, `archive/`
- `docs/README.vi.md` là Documentation Map canonical cho human readers
- Reading order chính ưu tiên tài liệu đang sống theo nhu cầu đọc, không ưu tiên migration/history
- `docs/playbooks/agent-tooling-guide.vi.md` giữ vai trò decision guide
- `docs/playbooks/skills-catalog.vi.md` giữ vai trò catalog
- `docs/archive/` chỉ để tra cứu lịch sử
- `docs/_stubs/` chỉ là compatibility layer tạm thời, không thuộc canonical tree

## Canonical Structure

```text
docs/
├── README.vi.md
├── product/
├── architecture/
├── specs/
├── plans/
├── playbooks/
├── agents/
├── adr/
└── archive/
```

Canonical file highlights:

- `docs/product/mvp-overview.{vi,en}.md`
- `docs/architecture/technical-baseline.{vi,en}.md`
- `docs/architecture/implementation-conventions.{vi,en}.md`
- `docs/specs/storefront-core-design.vi.md`
- `docs/specs/cart-checkout-nav-design.vi.md`
- `docs/specs/premium-upgrade.vi.md`
- `docs/plans/priority-backlog.vi.md`
- `docs/plans/product-roadmap.vi.md`
- `docs/playbooks/agent-tooling-guide.vi.md`
- `docs/playbooks/skills-catalog.vi.md`
- `docs/playbooks/skill-inventory.vi.md`
- `docs/playbooks/skill-workflow-guide.en.md` as current vendor-style exception

## Transitional Rules

- `docs/_stubs/` được giữ để tương thích link cũ đến hết `2026-08-06`
- Sau mốc này, stubs được phép xóa
- `docs/_stubs/` không phải nơi đọc hay sửa tài liệu

## Decisions Captured

- Vietnamese `.vi.md` là source of truth mặc định
- `product/` và `architecture/` có thể giữ bản dịch `.en.md`
- `plans/`, `specs/`, `agents/`, `playbooks/` không bắt buộc dịch, trừ exception rõ ràng
- `archive/` không nằm trong reading order chính
- Root `docs/` nên tối giản; playbooks và catalogs sống trong `docs/playbooks/`

## Follow-up

- Sunset và xóa `docs/_stubs/` sau `2026-08-06`
- Nếu exception `docs/playbooks/skill-workflow-guide.en.md` tiếp tục tồn tại dài hạn, cân nhắc ghi lại bằng ADR hoặc policy note rõ hơn
- Khi thêm tài liệu mới, giữ đúng canonical categories và không tái tạo root-level guide trùng vai trò

## Reference

- ADR: `docs/adr/0001-documentation-information-architecture.md`
- Documentation Map: `docs/README.vi.md`
- Repository glossary: `CONTEXT.md`
