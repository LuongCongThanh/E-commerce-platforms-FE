---
title: Documentation Information Architecture
status: accepted
date: 2026-04-24
supersedes: null
---

# ADR-0001: Documentation Information Architecture

## Context

Repository documentation đã tích lũy ở nhiều vị trí (`docs/`, `docs-be/`, `docs-mvp/`) mà không có tổ chức rõ ràng. File được đặt tên theo thứ tự đọc (`01-`, `02-`...) thay vì theo chủ đề bền vững. Vietnamese và English versions của cùng file tồn tại song song không có rule rõ ràng về loại nào là source of truth. Tài liệu cho agent tools (`AGENTS.md`, `CLAUDE.md`) bị trộn lẫn với tài liệu dành cho người đọc. Không có entry point rõ ràng giúp người mới biết bắt đầu đọc từ đâu. Document lifecycle (active/completed/superseded) không được khai báo, khiến người đọc không biết tin tài liệu nào.

## Decision

Tổ chức lại tài liệu theo các nguyên tắc sau:

**1. Category-based structure** — thư mục `docs/` được chia theo mục đích của tài liệu:

- `product/` — product overview, MVP scope, business context
- `architecture/` — technical baseline, implementation conventions, constraints
- `specs/` — feature-level design specs (behaviour, UX, interactions)
- `plans/` — execution plans với lịch trình và phụ thuộc
- `agents/` — agent configuration (machine-readable policies cho skills)
- `playbooks/` — hướng dẫn vận hành cho người đọc
- `adr/` — Architecture Decision Records

**2. Stable filenames** — tên file phản ánh chủ đề bền vững, không phải vị trí trong chuỗi đọc. Ngoại lệ: `plans/` dùng date prefix (`YYYY-MM-DD-topic.md`) để giữ thứ tự thời gian.

**3. Vietnamese là source of truth** — file `.vi.md` là bản gốc, được cập nhật trước. File `.en.md` là bản dịch.

**4. Selective translation** — chỉ `README`, `product/`, và `architecture/` cần bản dịch tiếng Anh. Các category còn lại (`specs/`, `plans/`, `agents/`, `playbooks/`) chỉ dịch khi có nhu cầu cụ thể.

**5. Mandatory frontmatter** — mọi tài liệu quan trọng phải có YAML frontmatter với 7 fields: `title`, `status`, `audience`, `language`, `language_role`, `owner`, `last_updated`.

**6. Phased migration** — thay đổi được thực hiện theo từng phase (không big-bang), dùng Temporary Stubs ở đường dẫn cũ cho đến khi migration hoàn chỉnh.

**7. Documentation Map** — `docs/README.vi.md` là entry point duy nhất, giải thích cấu trúc và reading order.

**8. ADR format** — mọi ADR phải tuân theo **ADR Format** được định nghĩa trong CONTEXT.md: YAML frontmatter + 4 sections (Context, Decision, Consequences, Alternatives Considered). Xem template tại `docs/adr/_template.md`.

## Consequences

**Tích cực:**

- Người mới có thể tìm đúng tài liệu không cần hỏi.
- Maintenance overhead giảm vì không còn dịch mọi thứ.
- Document lifecycle rõ ràng — không còn tài liệu "zombie" không biết có còn dùng không.
- Agent skills có nguồn domain language nhất quán qua CONTEXT.md.

**Trade-offs:**

- Migration sprint cần ~2-4 giờ để move files, đổi tên, thêm frontmatter.
- Các link cũ trỏ vào đường dẫn đã đổi cần Temporary Stubs trong 3 tháng.
- Quyết định "vi là source of truth" có thể bất tiện nếu có collaborator ngoài chỉ đọc tiếng Anh — giải quyết bằng translation selective cho product/ và architecture/.

**Execution status:**

- Migration plan: `docs/plans/2026-05-06-docs-ia-migration.md`

## Alternatives Considered

**A. Giữ numbered filenames (`01-`, `02-`...) với category subfolders**
Bị loại: numbered prefix giả vờ có "thứ tự chuẩn" trong khi thứ tự đó không còn ý nghĩa sau onboarding. Khi thêm tài liệu mới sẽ phải renumber hoặc chấp nhận gap.

**B. Tất cả tài liệu đều bilingual (vi + en)**
Bị loại: 220KB text bị double thành 440KB. Mỗi content change cần update 2 file. Đặc biệt với `plans/` và `specs/` có vòng đời ngắn, cost dịch không tương xứng với benefit.

**C. Tách riêng "agent docs" và "human docs" hoàn toàn sang 2 folder song song**
Bị loại: agent config (`agents/`) và human docs chia sẻ domain context — tách hoàn toàn tạo ra risk drift giữa 2 bộ. Giữ chung trong `docs/` với phân loại rõ trong frontmatter (`audience: agent | human | mixed`) là đủ.

**D. Dùng wiki (Confluence/Notion) thay vì markdown trong repo**
Bị loại: tài liệu cần được version-control cùng code để ADRs và specs có thể link tới commit/PR. Wiki ngoài tạo drift ngay khi code thay đổi mà không có PR.
