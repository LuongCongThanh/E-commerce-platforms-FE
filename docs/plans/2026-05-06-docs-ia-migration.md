---
title: Documentation Information Architecture Migration
status: active
audience: mixed
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-06
supersedes: null
related_adr: docs/adr/0001-documentation-information-architecture.md
---

# Documentation IA Migration — 2026-05-06

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax. Execute strictly in order — later tasks depend on earlier ones (frontmatter standard, category folders, etc.). Do not parallelize across phases.

**Goal:** Đưa filesystem khớp với ADR 0001 và CONTEXT.md glossary. Loại bỏ legacy structure (`docs-mvp/`, `superpowers/` wrapper), chuyển sang category-based IA, áp frontmatter chuẩn, dọn translation thừa.

**Out of scope:** Không sửa nội dung tài liệu (chỉ chuyển vị trí, thêm metadata). Không refactor product domain glossary. Không tạo tài liệu mới ngoài stubs + template + ADR rewrite.

**Why now:** Glossary và ADR đã thiết kế xong, nhưng filesystem nợ execution. Mỗi tài liệu mới được viết theo cấu trúc cũ làm debt sâu hơn. Càng để lâu, stub redirect càng dày, link rot càng nhiều.

---

## Target Structure

```
docs/
├── README.md                    ← Documentation Map (mới)
├── CONTEXT.md → ../CONTEXT.md   ← (giữ nguyên ở root, không di chuyển)
├── product/
│   ├── mvp-overview.vi.md
│   └── mvp-overview.en.md
├── architecture/
│   ├── technical-baseline.vi.md
│   ├── technical-baseline.en.md
│   ├── implementation-conventions.vi.md
│   └── implementation-conventions.en.md
├── specs/
│   ├── premium-upgrade.vi.md
│   ├── 2026-04-27-storefront-core-design.vi.md
│   └── 2026-04-28-cart-checkout-orders-nav-design.vi.md
├── plans/
│   ├── 2026-04-26-method-http-workflow.md
│   ├── 2026-04-26-page-building-workflow.md
│   ├── 2026-04-27-mvp-implementation-plan.md
│   ├── 2026-04-27-storefront-core-p1-01.md
│   ├── 2026-05-06-docs-ia-migration.md   ← plan này, sau move
│   ├── product-roadmap.vi.md             ← từ 02-roadmap
│   └── priority-backlog.vi.md            ← từ 05-priority-implementation-backlog
├── playbooks/
│   ├── skill-inventory.vi.md             ← từ skill_update.vi
│   └── skill-workflow-guide.{vi,en}.md   ← từ 06-skill-workflow-guide
├── agents/                       ← giữ nguyên
│   ├── domain.md
│   ├── issue-tracker.md
│   └── triage-labels.md
├── adr/
│   ├── _template.md              ← mới
│   ├── 0001-documentation-information-architecture.md   ← rewrite
│   └── 0002-skill-workflow-guide-english-source.md      ← exception ADR
├── archive/
│   └── 2026-mvp-planning/        ← từ docs-mvp/
└── _stubs/                       ← Temporary Stubs trỏ về vị trí mới
```

---

## Phase 0 — Standards & Templates (chặn các phase sau)

- [ ] **0.1** Thêm entry `ADR Format` vào `CONTEXT.md` → định nghĩa: ADR phải có YAML frontmatter (`status`, `date`, `supersedes`); body có sections **Context**, **Decision**, **Consequences**, **Alternatives Considered**.
- [ ] **0.2** Thêm entry `Frontmatter Schema Example` vào `CONTEXT.md` (nếu chưa có ví dụ cụ thể) — show YAML block với 7 core fields đã định nghĩa.
- [ ] **0.3** Tạo `docs/adr/_template.md` theo format vừa định nghĩa.
- [ ] **0.4** Refactor `docs/adr/0001-documentation-information-architecture.md`:
  - Thêm YAML frontmatter (`status: accepted`, `date: 2026-04-24`, etc.)
  - Tách body thành Context / Decision / Consequences / Alternatives Considered
  - Giữ nguyên decision content (không thay đổi semantics).
- [ ] **0.5** Tạo `docs/adr/0002-skill-workflow-guide-english-source.md` — ADR ghi exception: `06-skill-workflow-guide` được giữ tiếng Anh làm source-of-truth (vì content vendor upstream), `language_role: source-of-truth` cho `.en` của riêng file này.

**Gate:** Không chuyển sang Phase 1 nếu chưa có template ADR + entry CONTEXT.md mới. Lý do: các phase sau cần frontmatter chuẩn để áp dụng.

---

## Phase 1 — Tạo cấu trúc folder

- [ ] **1.1** `mkdir -p docs/{product,architecture,specs,plans,playbooks,archive,_stubs}`
- [ ] **1.2** Tạo `docs/README.md` (Documentation Map) — danh sách category, reading order, trust rules. Có frontmatter chuẩn.

---

## Phase 2 — Move file 01-05 (numbered → stable filename)

Mỗi task: (a) move file, (b) thêm YAML frontmatter, (c) tạo Temporary Stub ở vị trí cũ.

- [ ] **2.1** `01-mvp-overview.{vi,en}.md` → `docs/product/mvp-overview.{vi,en}.md`
- [ ] **2.2** `02-roadmap-and-execution-plan.vi.md` → `docs/plans/product-roadmap.vi.md`. **Xóa** `02-roadmap-and-execution-plan.en.md` (plans không cần dịch).
- [ ] **2.3** `03-technical-stack-skills-and-versions.{vi,en}.md` → `docs/architecture/technical-baseline.{vi,en}.md`
- [ ] **2.4** `04-project-structure-guidelines-design-system-conventions.{vi,en}.md` → `docs/architecture/implementation-conventions.{vi,en}.md`
- [ ] **2.5** `05-priority-implementation-backlog.vi.md` → `docs/plans/priority-backlog.vi.md`. **Xóa** `05-priority-implementation-backlog.en.md`.

**Frontmatter cho mỗi file** (ví dụ template):

```yaml
---
title: <human title>
status: active
audience: mixed
language: vi # hoặc en
language_role: source-of-truth # hoặc translation
owner: <Role, không phải tên người>
last_updated: 2026-05-06
---
```

---

## Phase 3 — Move orphan files

- [ ] **3.1** `premium_upgrade_plan.md` → `docs/specs/premium-upgrade.vi.md` + thêm frontmatter (`status: active`, `audience: mixed`).
- [ ] **3.2** `skill_update.vi.md` → `docs/playbooks/skill-inventory.vi.md` + thêm frontmatter.
- [ ] **3.3** **Xóa** `skill_update.en.md` (113KB — playbook không bắt buộc dịch theo Translation Coverage Rule).
- [ ] **3.4** `06-skill-workflow-guide.en.md` → `docs/playbooks/skill-workflow-guide.en.md` + thêm frontmatter (`language_role: source-of-truth`, có exception ADR 0002 hỗ trợ). **Không** force dịch sang vi trong sprint này — defer thành task riêng nếu cần.

---

## Phase 4 — Move plans/specs ra khỏi superpowers wrapper

- [ ] **4.1** `mv docs/superpowers/plans/* docs/plans/`
- [ ] **4.2** `mv docs/superpowers/specs/* docs/specs/`
- [ ] **4.3** Đổi tên specs theo Stable Spec Filename rule (CONTEXT.md line 154):
  - `2026-04-27-storefront-core-design.md` → `storefront-core-design.vi.md` (bỏ date prefix vì spec phải stable, không dated)
  - `2026-04-28-cart-checkout-orders-nav-design.md` → `cart-checkout-nav-design.vi.md`
- [ ] **4.4** Plans **giữ** date prefix (Dated Plan Filename rule).
- [ ] **4.5** Thêm frontmatter cho từng file plan/spec đã move.
- [ ] **4.6** `rmdir docs/superpowers/` sau khi đã trống.
- [ ] **4.7** Move plan này (`2026-05-06-docs-ia-migration.md`) ra `docs/plans/` ở bước cuối — tự cập nhật path của chính mình.

---

## Phase 5 — Archive docs-mvp

- [ ] **5.1** `mv docs-mvp/ docs/archive/2026-mvp-planning/`
- [ ] **5.2** Tạo `docs/archive/2026-mvp-planning/README.md` ghi: "Frozen 2026-05-06. Source of truth đã chuyển sang `docs/product/mvp-overview.vi.md`. Không cập nhật folder này nữa."
- [ ] **5.3** Tìm và sửa mọi link nội bộ trỏ tới `docs-mvp/` hoặc `docs/docs-mvp/` (đặc biệt: `docs/01-mvp-overview.vi.md` line 4 từng tham chiếu `docs/docs-mvp/skills-mapping.md`).

**Note:** Bỏ `docs-be/` ngoài phạm vi sprint này — đã thống nhất là rác, sẽ xóa task riêng. Tạo issue tracker entry để không quên.

---

## Phase 6 — Temporary Stubs

Theo glossary line 146 (Temporary Stub: short transitional document trỏ về canonical location).

- [ ] **6.1** Cho mỗi đường dẫn cũ đã move trong Phase 2, 3, 4, tạo file 1-line ở `docs/_stubs/<old-path>.md` với nội dung: `> This document moved to [new-path](../new-path). Update your bookmarks.`
- [ ] **6.2** Stubs có expiration: thêm comment `<!-- expires: 2026-08-06 -->` (3 tháng). Sau ngày đó được phép xóa stub.

---

## Phase 7 — Verification

- [ ] **7.1** `grep -r "docs-mvp\|docs/superpowers\|01-mvp-overview\|02-roadmap\|premium_upgrade_plan" docs/ src/ *.md` — không còn tham chiếu nào (trừ trong stubs và archive).
- [ ] **7.2** Mỗi file trong `docs/{product,architecture,specs,plans,playbooks}/` có YAML frontmatter với 7 core fields.
- [ ] **7.3** Mỗi `.en.md` trong plans/specs/agents/playbooks **không tồn tại** (trừ exception trong ADR 0002).
- [ ] **7.4** `docs/README.md` (Documentation Map) liệt kê đúng cấu trúc thực tế.
- [ ] **7.5** ADR 0001 có frontmatter + 4 sections.
- [ ] **7.6** Commit theo conventional commits: `docs: migrate to category-based information architecture (ADR 0001)` — một commit duy nhất cho dễ revert.

---

## Acceptance Criteria

- Filesystem `docs/` khớp với Target Structure trên.
- ADR 0001 status `accepted` + đầy đủ 4 sections.
- CONTEXT.md có entry "ADR Format".
- 7/7 verification checks pass.
- Không có file `.en.md` nào ngoài 4 file được phép (3 trong product+architecture + 1 exception trong playbooks).
- `docs-mvp/` không còn ở root, đã ở `docs/archive/`.
- `docs/superpowers/` đã bị xóa.

---

## Risks

- **R1 — Link rot:** Tài liệu/code có thể hardcode đường dẫn cũ. → Mitigation: Phase 6 stubs + Phase 7.1 grep verification.
- **R2 — Vendor exception drift:** ADR 0002 cho `skill-workflow-guide.en` được phép giữ `.en` source-of-truth. Nếu sau này có file vendor khác cũng vậy mà không update ADR → policy drift. → Mitigation: Khi thêm file vendor-sourced thứ 2, replace ADR 0002 bằng generic rule.
- **R3 — Reviewer overload:** Migration commit động chạm ~15-20 file. → Mitigation: Commit duy nhất, message rõ ràng, link tới plan này. Không trộn content edit vào commit migration.

---

## Open Questions (cần resolve trước khi execute)

- [ ] **Q1:** `06-skill-workflow-guide.en.md` có cần dịch sang `.vi` ngay, hay defer? **Đề xuất:** defer (tạo issue), giữ exception ADR 0002.
- [ ] **Q2:** Có cần một YAML frontmatter ví dụ trong CONTEXT.md không, hay text definition đủ? **Đề xuất:** Có — example block giảm ambiguity cho người mới.
- [ ] **Q3:** `premium_upgrade_plan.md` có tham chiếu `Next.js 16` (line 9) trong khi project hiện dùng `Next.js 15`. Migrate có rename hay sửa nội dung? **Đề xuất:** Chỉ rename trong sprint này, content edit là task riêng.

---

## Next Actions Sau Migration

- Issue: Xóa `docs-be/` (out of scope sprint này).
- Issue: Dịch `skill-workflow-guide.en` sang vi (Q1) hoặc đóng exception (cập nhật ADR 0002).
- Issue: Update CLAUDE.md / AGENTS.md nếu có tham chiếu đường dẫn cũ.
- Plan tiếp theo: `2026-MM-DD-premium-upgrade-rollout.md` — execution plan cho premium upgrade (spec đã có).
