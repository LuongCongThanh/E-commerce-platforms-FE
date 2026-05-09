---
title: Priority Implementation Backlog
status: active
audience: human
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-09
---

# Priority Implementation Backlog

> **Đọc trước khi nhận task:** Không nhảy level. P0 phải xong trước P1. P1 chặn P2. P2 chặn P3. Item nào chặn doanh thu (checkout/order/admin) được ưu tiên cao nhất trong P1.

---

## Priority Levels

| Level  | Ý nghĩa                                              |
| ------ | ---------------------------------------------------- |
| **P0** | Nền tảng bắt buộc — không có thì implement sai hướng |
| **P1** | Core MVP — tạo giá trị trực tiếp cho người dùng      |
| **P2** | Hardening — đủ tin cậy để release production         |
| **P3** | Post-MVP — không chặn launch                         |

---

## P0 — Foundation

| ID    | Objective                    | Output                             | Status     | Owner |
| ----- | ---------------------------- | ---------------------------------- | ---------- | ----- |
| P0-01 | Khóa scope MVP               | Scope doc + acceptance checklist   | ✅ Done    | BA    |
| P0-02 | Khóa kiến trúc module-driven | ADR + module boundaries            | ✅ Done    | FE    |
| P0-03 | Khóa technical baseline      | Version matrix + quality gate      | ✅ Done    | FE    |
| P0-04 | Thiết lập workflow tracking  | Milestone board + blocker protocol | ⏳ Pending | BA/PM |

---

## P1 — Core MVP Build

| ID    | Objective        | Output                             | Status         | Dependencies | Acceptance                                   |
| ----- | ---------------- | ---------------------------------- | -------------- | ------------ | -------------------------------------------- |
| P1-01 | Storefront core  | Home/PDP/search/filter + Mega Menu | 🔄 In progress | P0-\*        | Browse journey ổn định, Mega Menu hoàn thiện |
| P1-02 | Auth core        | Register/login/forgot/reset        | ✅ Done        | P0-\*        | Auth flow hoạt động + guard                  |
| P1-03 | Cart core        | Add/update/remove + totals         | ✅ Done        | P1-01        | Tính toán chính xác, persist                 |
| P1-04 | Checkout COD     | Checkout form + place order        | 🔄 In progress | P1-02, P1-03 | COD order tạo thành công, lỗi được xử lý     |
| P1-05 | Order visibility | Confirmation + history + detail    | 🔄 In progress | P1-04        | Customer xem đúng order data của mình        |
| P1-06 | Admin core       | Order management + dashboard stats | 🔄 In progress | P1-04        | Cập nhật trạng thái đơn và xem số liệu vận hành thành công |

**Critical path hiện tại:** P1-01 (Mega Menu) → P1-04 → P1-05 → P1-06

---

## P2 — Hardening Before Release

| ID    | Objective                      | Output                              | Status     | Dependencies | Acceptance                                            |
| ----- | ------------------------------ | ----------------------------------- | ---------- | ------------ | ----------------------------------------------------- |
| P2-01 | Test hardening                 | Unit/integration/e2e cho core flows | ⏳ Pending | P1-\*        | Core regression pass, 70% coverage shared/lib + hooks |
| P2-02 | Performance & SEO baseline     | Metadata, image opt, CWV            | ⏳ Pending | P1-\*        | LCP < 3s, metadata đúng cho Home/PDP/PLP              |
| P2-03 | Accessibility & UX consistency | A11y checklist + UI fixes           | ⏳ Pending | P1-\*        | Keyboard nav cho form/CTA chính pass                  |
| P2-04 | Observability                  | Sentry + error classification       | ⏳ Pending | P1-\*        | Lỗi critical được track, checkout failures logged     |

---

## P3 — Post-MVP Expansion

| ID    | Objective                                          | Dependencies |
| ----- | -------------------------------------------------- | ------------ |
| P3-01 | Account enhancement (address book, profile)        | P2-\*        |
| P3-02 | Discovery enhancement (category hub, PLP nâng cao) | P2-\*        |
| P3-03 | Wishlist cơ bản                                    | P2-\*        |
| P3-04 | Campaign/content pages                             | P2-\*        |

---

## Not-Now List (Anti Scope Creep)

Những thứ này **không** vào sprint hiện tại, bất kể áp lực:

- Online payment gateway (VNPay/Momo/ZaloPay) — code stub đã có ở `shared/lib/payment/`, chưa wire vào
- Voucher/coupon engine phức tạp
- Flash-sale engine realtime
- Multi-vendor marketplace
- Advanced BI/reporting suite
- Social login (Google/Facebook)

---

## Release Gate Checklist

### P0 Gate ✅

- [x] Scope locked
- [x] Architecture locked
- [x] Version baseline locked
- [ ] Tracking protocol active

### P1 Gate 🔄

- [ ] Core customer journey end-to-end ổn định (cần live backend verification cho checkout/order)
- [ ] Admin core xử lý đơn vận hành được (cần verify với backend sống)

### P2 Gate ⏳

- [ ] Core regression pass (test coverage đạt threshold)
- [ ] SEO/performance/a11y baseline đạt
- [ ] Monitoring hoạt động production-like

---

## Sequencing Rules

1. Không skip P0 dù bất cứ lý do gì.
2. Trong cùng level, ưu tiên item có ít dependency nhất trước.
3. **Item chặn doanh thu** (P1-04 checkout, P1-05 order, P1-06 admin) được ưu tiên cao nhất trong P1.
4. Không bắt đầu P3 khi P2 gate chưa pass.
5. Mọi change request ngoài backlog này phải qua change-control — không tự thêm vào.
