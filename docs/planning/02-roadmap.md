# 02. Roadmap, Execution Plan & Priority Backlog (VI)

> 📌 **Snapshot lịch sử (06/2026)** — tài liệu planning, không còn được cập nhật. Hiện trạng: xem [docs/README.md](../README.md) và [docs/architecture/](../architecture/). Đã gộp nội dung backlog (`05-priority-implementation-backlog.md` cũ) vào file này 2026-07-23 — cả hai đều là góc nhìn khác nhau của cùng một kế hoạch triển khai MVP (theo thời gian vs theo ưu tiên), không phải hai tài liệu độc lập.

Last updated: 2026-06-04  
Source of truth: [`01-mvp-overview.md`](./01-mvp-overview.md), current repo status, skill mapping priorities  
Owner: PM/BA Lead + Engineering Lead

## Summary Table

| Item              | Value                                       |
| ----------------- | ------------------------------------------- |
| Delivery model    | Phase-based with weekly checkpoints         |
| MVP window        | 4-6 tuần tùy năng lực thực thi              |
| Core dependency   | API contract stability + QA gate discipline |
| Control mechanism | Milestone tracking + blocker protocol       |

## Purpose

Tài liệu này chuyển scope MVP (`01-mvp-overview.md`) thành lộ trình theo phase/tuần **và** backlog theo thứ tự ưu tiên tuyệt đối (P0-P3) — hai góc nhìn bổ trợ cho cùng một kế hoạch triển khai, để đội dự án vừa biết "khi nào" vừa biết "cái gì trước, cái gì sau".

## Decisions

- Roadmap lấy MVP vận hành thật làm mốc ưu tiên cao nhất.
- Mọi phase đều có gate "quality before speed".
- Không mở rộng scope nếu chưa đạt exit criteria của phase hiện tại.
- Blocker được escalated trong vòng 24h, không để kéo dài âm thầm.
- Luôn ưu tiên xong P0 trước khi nhận bất kỳ task P1+; không thực hiện P3 khi P1/P2 chưa đạt quality gate.

## Phase roadmap

1. MVP (Phase 0): catalog + auth + cart + COD checkout + order visibility + admin core. Timebox: 4-6 tuần.
2. Post-MVP Phase 1: category/listing nâng cao, account dashboard, address book.
3. Post-MVP Phase 2: wishlist, optimization admin, quality/performance hardening.
4. Later: campaign pages, content system, advanced growth features.

## MVP weekly execution plan

**Week 1 — Foundation and contracts:** khóa kiến trúc FE module-driven + chuẩn thư mục; chốt API contract baseline (catalog/auth/order); dựng tracking dashboard và quality gates.

**Week 2 — Core storefront and auth:** hoàn thiện home/PDP/search/filter mức MVP; hoàn thiện register/login/forgot reset flow; thiết lập test baseline (unit + smoke e2e).

**Week 3 — Cart, checkout, order, admin core:** hoàn thiện cart + checkout COD + order confirmation; hoàn thiện customer order history/detail; hoàn thiện admin core xử lý trạng thái đơn.

**Week 4 — Hardening and release readiness:** regression test toàn luồng chính; SEO/performance/a11y checklist; production readiness review + launch checklist.

## Dependency map

- D1: API contracts phải ổn định trước khi FE hoàn thiện form flows.
- D2: Design tokens/conventions phải ổn định trước khi scale UI.
- D3: Test data chuẩn phải có trước khi chạy e2e regression.
- D4: Monitoring pipeline phải bật trước production smoke.

## Delivery gates (entry/exit criteria)

**Gate A — Foundation complete:** Entry: kickoff + MVP scope locked. Exit: kiến trúc và convention đã chốt; API baseline contract được review; CI chạy lint/test/build.

**Gate B — Feature complete:** Entry: Gate A pass. Exit: core journeys chạy end-to-end trên staging; acceptance BA cho từng capability đạt; không còn blocker severity cao.

**Gate C — Release ready:** Entry: Gate B pass. Exit: QA smoke + regression pass; monitoring/alerts hoạt động; known issues được log và chấp nhận rõ.

## Risk register and mitigation

| Risk               | Impact                | Likelihood | Mitigation                      | Owner      |
| ------------------ | --------------------- | ---------- | ------------------------------- | ---------- |
| Scope creep        | Trễ tiến độ           | High       | Change control + phase backlog  | BA Lead    |
| API contract churn | Rework FE             | Medium     | Contract freeze per sprint      | FE/BE Lead |
| Test debt          | Lỗi production        | Medium     | Mandatory quality gate          | QA Lead    |
| Resource overload  | Burnout, drop quality | Medium     | WIP limit + priority strictness | PM         |

## RACI (simple)

| Workstream                        | BA  | FE  | QA  | BE  |
| --------------------------------- | --- | --- | --- | --- |
| Scope/acceptance                  | A/R | C   | C   | C   |
| FE architecture and UI            | C   | A/R | C   | I   |
| API contract and service behavior | C   | C   | I   | A/R |
| Test strategy and verification    | C   | C   | A/R | C   |
| Release readiness                 | A   | R   | R   | R   |

Legend: A = Accountable, R = Responsible, C = Consulted, I = Informed.

## Tracking model and blocker protocol

- Milestone theo phase và weekly checkpoint. Progress đo bằng deliverable completion + gate status. Burn-down theo backlog ưu tiên (P0-P3).
- Blocker protocol: (1) gắn nhãn blocker trong tracker ngay khi phát hiện, (2) nêu impact/owner/ETA workaround, (3) escalate trong 24h nếu chưa tháo gỡ, (4) nếu blocker ảnh hưởng critical path, ưu tiên re-plan ngay.

---

## Priority backlog (P0–P3)

| Priority | Intent                                            |
| -------- | ------------------------------------------------- |
| P0       | Nền tảng bắt buộc để bắt đầu implement đúng hướng |
| P1       | Luồng cốt lõi tạo giá trị MVP trực tiếp           |
| P2       | Hardening và nâng độ tin cậy trước release        |
| P3       | Mở rộng sau MVP, không chặn launch                |

### P0 — Foundation and execution control

| ID    | Objective                             | Output                                           | Dependencies | Owner role | Acceptance checks                     |
| ----- | ------------------------------------- | ------------------------------------------------ | ------------ | ---------- | ------------------------------------- |
| P0-01 | Khóa scope MVP và acceptance baseline | Scope doc lock + acceptance checklist            | None         | BA         | In/out scope rõ, không mâu thuẫn      |
| P0-02 | Khóa kiến trúc module-driven          | Architecture decision record + module boundaries | P0-01        | FE         | Boundary rõ, route mỏng, ownership rõ |
| P0-03 | Khóa technical baseline               | Version matrix + quality gate policy             | P0-02        | FE         | Khớp package.json, gate rõ            |
| P0-04 | Thiết lập workflow tracking           | Milestone board + blocker protocol               | P0-01        | BA/PM      | Có owner, SLA blocker, cadence review |

### P1 — Core MVP build

| ID    | Objective        | Output                             | Dependencies | Owner role | Acceptance checks                              |
| ----- | ---------------- | ---------------------------------- | ------------ | ---------- | ---------------------------------------------- |
| P1-01 | Storefront core  | Home/PDP/search/filter MVP         | P0-\*        | FE         | Journey browse ổn định, Mega Menu đã implement |
| P1-02 | Auth core        | Register/login/forgot/reset        | P0-\*        | FE         | Auth flow hoạt động + guard cơ bản             |
| P1-03 | Cart core        | Add/update/remove cart + totals    | P1-01        | FE         | Tính toán giỏ chính xác                        |
| P1-04 | Checkout COD     | Checkout form + place order COD    | P1-02, P1-03 | FE + BE    | COD order tạo thành công, lỗi được xử lý       |
| P1-05 | Order visibility | Confirmation + history + detail    | P1-04        | FE         | User xem đúng order data                       |
| P1-06 | Admin core       | Product/order management tối thiểu | P1-04        | FE/BE      | Cập nhật trạng thái đơn thành công             |

### P2 — Hardening before release

| ID    | Objective                        | Output                                         | Dependencies | Owner role | Acceptance checks             |
| ----- | -------------------------------- | ---------------------------------------------- | ------------ | ---------- | ----------------------------- |
| P2-01 | Test hardening                   | Unit/integration/e2e baseline cho core flows   | P1-\*        | QA + FE    | Core regression pass          |
| P2-02 | Performance and SEO baseline     | Metadata, image optimization, CWV baseline     | P1-\*        | FE         | KPI hiệu năng tối thiểu đạt   |
| P2-03 | Accessibility and UX consistency | A11y checklist + UI consistency fixes          | P1-\*        | FE + QA    | Checklist pass cho flow chính |
| P2-04 | Observability readiness          | Sentry + error classification + alert baseline | P1-\*        | FE         | Lỗi critical được theo dõi    |

### P3 — Post-MVP expansion

| ID    | Objective                 | Output                                                  | Dependencies | Owner role | Acceptance checks                             |
| ----- | ------------------------- | ------------------------------------------------------- | ------------ | ---------- | --------------------------------------------- |
| P3-01 | Account enhancement       | Address book, profile settings nâng cao                 | P2-\*        | FE         | Luồng account mở rộng ổn định                 |
| P3-02 | Discovery enhancement     | Category hub/plp nâng cao                               | P2-\*        | FE         | Search and discovery KPI cải thiện            |
| P3-03 | Retention features        | Wishlist cơ bản                                         | P2-\*        | FE         | Wishlist journey hoạt động                    |
| P3-04 | Growth pages              | Campaign/content pages                                  | P2-\*        | FE/BA      | Nội dung marketing vận hành được              |
| P3-05 | Payment gateway UI wiring | Wire VNPay/Momo/ZaloPay UI vào checkout (lib đã có sẵn) | P2-\*        | FE/BE      | Ít nhất 1 gateway thanh toán online hoạt động |

### Sequencing rules

1. Không bỏ qua P0.
2. Trong cùng priority, ưu tiên item phụ thuộc thấp trước.
3. Item chặn doanh thu (checkout/order/admin) được ưu tiên cao nhất trong P1.
4. Không bắt đầu P3 nếu chưa pass gate release P2.

### Not now list (anti scope creep)

Voucher engine phức tạp, flash-sale engine thời gian thực, multi-vendor marketplace, advanced BI/reporting suite.

### Delivery readiness checklist (tại thời điểm snapshot 06/2026)

- P0: scope locked ✅, architecture locked ✅, version baseline locked ✅, tracking protocol active ⬜
- P1: storefront core ✅, auth core ✅, cart core ✅, checkout COD ✅, order visibility ✅, admin core vận hành được ⬜
- P2: core regression pass ⬜, SEO/performance/a11y baseline đạt ⬜, monitoring hoạt động production-like ⬜

> Trạng thái feature thực tế hiện nay (khác snapshot trên): xem bảng "Trạng thái feature" ở [`../architecture/frontend/shop-module-structure.md`](../architecture/frontend/shop-module-structure.md) và tiến độ `(admin)` ở [`../architecture/frontend/routing.md`](../architecture/frontend/routing.md#admin-route-group--hiện-trạng-2026-07-23).

## Open Risks / Next Actions

Open risks:

- Kéo dài chốt contract API.
- Under-estimation effort ở checkout/order edge cases.
- Nhảy task theo cảm tính làm vỡ thứ tự ưu tiên.
- Chưa đủ data thực để xác nhận readiness ở P2.

Next actions:

- [ ] Chốt owner cho từng gate và deadline tương ứng.
- [ ] Cài tracker template theo milestone/gate.
- [ ] Tạo phiên review cố định hằng tuần cho risk & blockers.
- [ ] Khóa baseline test checklist trước sprint feature complete.
- [ ] Chốt SLA xử lý blocker cho item critical path.
