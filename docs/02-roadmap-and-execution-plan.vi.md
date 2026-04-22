# 02. Roadmap And Execution Plan (VI)

Last updated: 2026-04-24  
Source of truth: `01-mvp-overview.vi.md`, current repo status, skill mapping priorities  
Owner: PM/BA Lead + Engineering Lead

## TOC

- [Purpose](#purpose)
- [Scope](#scope)
- [Decisions](#decisions)
- [Detailed Spec](#detailed-spec)
- [Acceptance Criteria](#acceptance-criteria)
- [Open Risks / Next Actions](#open-risks--next-actions)

## Summary Table

| Item              | Value                                       |
| ----------------- | ------------------------------------------- |
| Delivery model    | Phase-based with weekly checkpoints         |
| MVP window        | 4-6 tuần tùy năng lực thực thi              |
| Core dependency   | API contract stability + QA gate discipline |
| Control mechanism | Milestone tracking + blocker protocol       |

## Purpose

Tài liệu này chuyển scope MVP thành lộ trình và kế hoạch thực thi theo phase/sprint, có dependency rõ, gate rõ, trách nhiệm rõ, và cách theo dõi tiến độ thống nhất.

## Scope

Bao gồm:

- Roadmap theo phase: MVP, Post-MVP Phase 1, Phase 2, Later.
- Kế hoạch triển khai theo tuần/sprint cho MVP.
- Entry/exit criteria, delivery gates.
- Risk register và mitigation plan.
- RACI vai trò BA/FE/QA/BE.
- Tracking model và blocker protocol.

Không bao gồm:

- Chi tiết implementation ở mức code.
- Thiết kế contract API chi tiết từng endpoint.

## Decisions

- Roadmap lấy MVP vận hành thật làm mốc ưu tiên cao nhất.
- Mọi phase đều có gate "quality before speed".
- Không mở rộng scope nếu chưa đạt exit criteria của phase hiện tại.
- Blocker được escalated trong vòng 24h, không để kéo dài âm thầm.

## Detailed Spec

### Phase roadmap

1. MVP (Phase 0):
   - Outcomes: catalog + auth + cart + COD checkout + order visibility + admin core.
   - Timebox: 4-6 tuần.
2. Post-MVP Phase 1:
   - Outcomes: category/listing nâng cao, account dashboard, address book.
3. Post-MVP Phase 2:
   - Outcomes: wishlist, optimization admin, quality/performance hardening.
4. Later:
   - Outcomes: campaign pages, content system, advanced growth features.

### MVP weekly execution plan

Week 1 - Foundation and contracts:

- Khóa kiến trúc FE module-driven và chuẩn thư mục.
- Chốt API contract baseline (catalog/auth/order).
- Dựng tracking dashboard và quality gates.

Week 2 - Core storefront and auth:

- Hoàn thiện home/PDP/search/filter mức MVP.
- Hoàn thiện register/login/forgot reset flow.
- Thiết lập test baseline (unit + smoke e2e).

Week 3 - Cart, checkout, order, admin core:

- Hoàn thiện cart + checkout COD + order confirmation.
- Hoàn thiện customer order history/detail.
- Hoàn thiện admin core xử lý trạng thái đơn.

Week 4 - Hardening and release readiness:

- Regression test toàn luồng chính.
- SEO/performance/a11y checklist.
- Production readiness review + launch checklist.

### Dependency map

- D1: API contracts phải ổn định trước khi FE hoàn thiện form flows.
- D2: Design tokens/conventions phải ổn định trước khi scale UI.
- D3: Test data chuẩn phải có trước khi chạy e2e regression.
- D4: Monitoring pipeline phải bật trước production smoke.

### Delivery gates (entry/exit criteria)

Gate A - Foundation complete:

- Entry: kickoff và MVP scope locked.
- Exit:
  - Kiến trúc và convention đã chốt.
  - API baseline contract được review.
  - CI chạy lint/test/build.

Gate B - Feature complete:

- Entry: Gate A pass.
- Exit:
  - Core journeys chạy end-to-end trên staging.
  - Acceptance BA cho từng capability đạt.
  - Không còn blocker severity cao.

Gate C - Release ready:

- Entry: Gate B pass.
- Exit:
  - QA smoke + regression pass.
  - Monitoring/alerts hoạt động.
  - Known issues được log và chấp nhận rõ.

### Risk register and mitigation

| Risk               | Impact                | Likelihood | Mitigation                      | Owner      |
| ------------------ | --------------------- | ---------- | ------------------------------- | ---------- |
| Scope creep        | Trễ tiến độ           | High       | Change control + phase backlog  | BA Lead    |
| API contract churn | Rework FE             | Medium     | Contract freeze per sprint      | FE/BE Lead |
| Test debt          | Lỗi production        | Medium     | Mandatory quality gate          | QA Lead    |
| Resource overload  | Burnout, drop quality | Medium     | WIP limit + priority strictness | PM         |

### RACI (simple)

| Workstream                        | BA  | FE  | QA  | BE  |
| --------------------------------- | --- | --- | --- | --- |
| Scope/acceptance                  | A/R | C   | C   | C   |
| FE architecture and UI            | C   | A/R | C   | I   |
| API contract and service behavior | C   | C   | I   | A/R |
| Test strategy and verification    | C   | C   | A/R | C   |
| Release readiness                 | A   | R   | R   | R   |

Legend:

- A: Accountable
- R: Responsible
- C: Consulted
- I: Informed

### Tracking model and blocker protocol

- Tracking model:
  - Milestone theo phase và weekly checkpoint.
  - Progress đo bằng deliverable completion + gate status.
  - Burn-down theo backlog ưu tiên (P0-P3).
- Blocker protocol:
  1. Gắn nhãn blocker trong tracker ngay khi phát hiện.
  2. Nêu impact, owner, ETA workaround.
  3. Escalate trong 24h nếu chưa tháo gỡ.
  4. Nếu blocker ảnh hưởng critical path, ưu tiên re-plan ngay.

## Acceptance Criteria

- Roadmap có phase rõ và outcome rõ.
- Execution plan có phụ thuộc, gate, RACI, tracking model đầy đủ.
- Không còn quyết định mở cho implementer trong phạm vi MVP.
- Có cơ chế quản lý rủi ro và blocker có thể vận hành ngay.

## Open Risks / Next Actions

Open risks:

- Kéo dài chốt contract API.
- Under-estimation effort ở checkout/order edge cases.

Next actions:

- [ ] Chốt owner cho từng gate và deadline tương ứng.
- [ ] Cài tracker template theo milestone/gate.
- [ ] Tạo phiên review cố định hằng tuần cho risk & blockers.
- [ ] Khóa baseline test checklist trước sprint feature complete.
