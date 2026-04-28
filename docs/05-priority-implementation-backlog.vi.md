# 05. Priority Implementation Backlog (VI)

Last updated: 2026-04-24  
Source of truth: `01-04` docs in this set, `package.json`, BA/FE skill mapping  
Owner: PM + BA Lead + FE Lead

## TOC

- [Purpose](#purpose)
- [Scope](#scope)
- [Decisions](#decisions)
- [Detailed Spec](#detailed-spec)
- [Acceptance Criteria](#acceptance-criteria)
- [Open Risks / Next Actions](#open-risks--next-actions)

## Summary Table

| Priority | Intent                                            |
| -------- | ------------------------------------------------- |
| P0       | Nền tảng bắt buộc để bắt đầu implement đúng hướng |
| P1       | Luồng cốt lõi tạo giá trị MVP trực tiếp           |
| P2       | Hardening và nâng độ tin cậy trước release        |
| P3       | Mở rộng sau MVP, không chặn launch                |

## Purpose

Tài liệu này cung cấp backlog triển khai theo thứ tự ưu tiên tuyệt đối để đội dự án có thể đi vào implementation ngay, không cần tự quyết định lại scope hay thứ tự công việc.

## Scope

Bao gồm:

- Danh sách công việc P0/P1/P2/P3 theo thứ tự thực thi.
- Mỗi item có objective, output, dependencies, owner role, acceptance checks.
- Mapping skills BA/FE cho từng cụm công việc.
- Not-now list để kiểm soát scope.

Không bao gồm:

- Low-level task breakdown theo từng file code.

## Decisions

- Luôn ưu tiên xong P0 trước khi nhận bất kỳ task P1+.
- Không được thực hiện P3 khi P1/P2 chưa đạt quality gate.
- Backlog này là thứ tự chuẩn cho build mới từ zero đến MVP-ready.
- Mọi change request ngoài backlog phải qua change-control.

## Detailed Spec

### P0 - Foundation and execution control

| ID    | Objective                             | Output                                           | Dependencies | Owner role | Acceptance checks                     | Skill mapping                              |
| ----- | ------------------------------------- | ------------------------------------------------ | ------------ | ---------- | ------------------------------------- | ------------------------------------------ |
| P0-01 | Khóa scope MVP và acceptance baseline | Scope doc lock + acceptance checklist            | None         | BA         | In/out scope rõ, không mâu thuẫn      | BA: acceptance-orchestrator, writing-plans |
| P0-02 | Khóa kiến trúc module-driven          | Architecture decision record + module boundaries | P0-01        | FE         | Boundary rõ, route mỏng, ownership rõ | FE: nextjs-app-router-patterns             |
| P0-03 | Khóa technical baseline               | Version matrix + quality gate policy             | P0-02        | FE         | Khớp package.json, gate rõ            | FE: react-nextjs-development               |
| P0-04 | Thiết lập workflow tracking           | Milestone board + blocker protocol               | P0-01        | BA/PM      | Có owner, SLA blocker, cadence review | BA: technical-change-tracker               |

### P1 - Core MVP build

| ID    | Objective        | Output                             | Dependencies | Owner role | Acceptance checks                                     | Skill mapping                                    |
| ----- | ---------------- | ---------------------------------- | ------------ | ---------- | ----------------------------------------------------- | ------------------------------------------------ |
| P1-01 | Storefront core  | Home/PDP/search/filter MVP         | P0-\*        | FE         | Journey browse ổn định, Luxury Mega Menu đã implement | FE: tailwind-patterns, ui-review                 |
| P1-02 | Auth core        | Register/login/forgot/reset        | P0-\*        | FE         | Auth flow hoạt động + guard cơ bản                    | FE: zod-validation-expert                        |
| P1-03 | Cart core        | Add/update/remove cart + totals    | P1-01        | FE         | Tính toán giỏ chính xác                               | FE: zustand-store-ts                             |
| P1-04 | Checkout COD     | Checkout form + place order COD    | P1-02, P1-03 | FE + BE    | COD order tạo thành công, lỗi được xử lý              | FE: tanstack-query-expert, BA: api-documentation |
| P1-05 | Order visibility | Confirmation + history + detail    | P1-04        | FE         | User xem đúng order data                              | FE: react-nextjs-development                     |
| P1-06 | Admin core       | Product/order management tối thiểu | P1-04        | FE/BE      | Cập nhật trạng thái đơn thành công                    | BA: architect-review                             |

### P2 - Hardening before release

| ID    | Objective                        | Output                                         | Dependencies | Owner role | Acceptance checks             | Skill mapping                      |
| ----- | -------------------------------- | ---------------------------------------------- | ------------ | ---------- | ----------------------------- | ---------------------------------- |
| P2-01 | Test hardening                   | Unit/integration/e2e baseline cho core flows   | P1-\*        | QA + FE    | Core regression pass          | FE: systematic-debugging           |
| P2-02 | Performance and SEO baseline     | Metadata, image optimization, CWV baseline     | P1-\*        | FE         | KPI hiệu năng tối thiểu đạt   | FE: web-performance-optimization   |
| P2-03 | Accessibility and UX consistency | A11y checklist + UI consistency fixes          | P1-\*        | FE + QA    | Checklist pass cho flow chính | FE: accessibility audit, ui-review |
| P2-04 | Observability readiness          | Sentry + error classification + alert baseline | P1-\*        | FE         | Lỗi critical được theo dõi    | BA: analyze-project                |

### P3 - Post-MVP expansion

| ID    | Objective             | Output                                  | Dependencies | Owner role | Acceptance checks                  | Skill mapping                |
| ----- | --------------------- | --------------------------------------- | ------------ | ---------- | ---------------------------------- | ---------------------------- |
| P3-01 | Account enhancement   | Address book, profile settings nâng cao | P2-\*        | FE         | Luồng account mở rộng ổn định      | FE: react-nextjs-development |
| P3-02 | Discovery enhancement | Category hub/plp nâng cao               | P2-\*        | FE         | Search and discovery KPI cải thiện | FE: tanstack-query-expert    |
| P3-03 | Retention features    | Wishlist cơ bản                         | P2-\*        | FE         | Wishlist journey hoạt động         | FE: zustand-store-ts         |
| P3-04 | Growth pages          | Campaign/content pages                  | P2-\*        | FE/BA      | Nội dung marketing vận hành được   | BA: wiki-page-writer         |

### Sequencing rules

1. Không bỏ qua P0.
2. Trong cùng priority, ưu tiên item phụ thuộc thấp trước.
3. Item chặn doanh thu (checkout/order/admin) được ưu tiên cao nhất trong P1.
4. Không bắt đầu P3 nếu chưa pass gate release P2.

### Not now list (anti scope creep)

- Online payment gateways (VNPay/Momo/ZaloPay).
- Voucher engine phức tạp.
- Flash-sale engine thời gian thực.
- Multi-vendor marketplace.
- Advanced BI/reporting suite.

### Delivery readiness checklist (per priority)

- P0 done:
  - [ ] Scope locked
  - [x] Architecture locked
  - [x] Version baseline locked
  - [ ] Tracking protocol active
- P1 done:
  - [/] Core customer journey end-to-end chạy ổn định (Mega Menu đang hoàn thiện)
  - [ ] Admin core xử lý đơn vận hành được
- P2 done:
  - [ ] Core regression pass
  - [ ] SEO/performance/a11y baseline đạt
  - [ ] Monitoring hoạt động production-like

## Acceptance Criteria

- Backlog có thứ tự ưu tiên tuyệt đối và triển khai được ngay.
- Mỗi item có đầy đủ objective/output/dependency/owner/acceptance.
- Có mapping BA/FE skills theo công việc.
- Có not-now list để kiểm soát phạm vi.

## Open Risks / Next Actions

Open risks:

- Nhảy task theo cảm tính làm vỡ thứ tự ưu tiên.
- Chưa đủ data thực để xác nhận readiness ở P2.

Next actions:

- [ ] Tạo board theo cột P0/P1/P2/P3 và trạng thái gate.
- [ ] Gán owner cụ thể cho từng backlog item.
- [ ] Chốt SLA xử lý blocker cho item critical path.
- [ ] Review lại not-now list mỗi lần có change request.
