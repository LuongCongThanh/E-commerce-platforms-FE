---
title: Grill Session Decisions — 2026-05-06
status: active
audience: mixed
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-06
---

# Grill Session Decisions — 2026-05-06

Tổng kết các quyết định đã chốt trong grill session ngày 2026-05-06, covering 3 kế hoạch: Storefront P1-01, MVP Implementation Plan, và Docs IA Migration.

---

## Storefront P1-01

| Quyết định              | Lựa chọn                                                         |
| ----------------------- | ---------------------------------------------------------------- |
| Thứ tự build            | PDP trước → Categories → Search bỏ khỏi MVP                      |
| Mock data strategy      | Hoàn thiện UI với mock data trước, swap real API sau             |
| Guest cart              | Cho phép add to cart không cần login                             |
| Cart sync khi login     | Không sync lên server (MVP) — giữ localStorage                   |
| Out-of-stock variant    | Disable option + disable AddToCartButton                         |
| Variant → image mapping | `imageIndex` trên variant, trỏ vào product images array          |
| Categories page         | Grid sản phẩm thuần túy — không sort, không filter               |
| Filter/sort             | Implement cùng lúc với Meilisearch integration (backend)         |
| Search page             | Bỏ khỏi MVP hoàn toàn                                            |
| Search engine           | Meilisearch, gọi qua Django backend (không expose key ra client) |

---

## MVP Implementation Plan

### Thứ tự P1

Storefront → Auth → Cart → Checkout → Orders → Admin

### Auth (P1-02)

| Quyết định          | Lựa chọn                                                                      |
| ------------------- | ----------------------------------------------------------------------------- |
| Forms cần build     | Đủ 4: Login + Register + Forgot Password + Reset Password                     |
| Post-login redirect | Về trang trước via `callbackUrl` query param (`/login?callbackUrl=/checkout`) |
| Reset password URL  | `/reset-password?token=xxx` (query param, theo Django convention)             |

### Cart (P1-03)

| Quyết định      | Lựa chọn                                           |
| --------------- | -------------------------------------------------- |
| Quantity update | Optimistic update ngay lập tức — không confirm     |
| Xóa sản phẩm    | Xóa thẳng — không confirm dialog, không undo toast |

### Checkout (P1-04)

| Quyết định             | Lựa chọn                                                                    |
| ---------------------- | --------------------------------------------------------------------------- |
| Layout                 | 1 trang duy nhất — không multi-step stepper (MVP chỉ có COD)                |
| Địa chỉ giao hàng      | Luôn nhập mới — không saved addresses (address book để Phase 1)             |
| Post-checkout redirect | `/checkout/success` với order summary (ID + sản phẩm + tổng tiền + địa chỉ) |

### Orders (P1-05)

| Quyết định     | Lựa chọn                                             |
| -------------- | ---------------------------------------------------- |
| Pagination     | 10 đơn/trang                                         |
| Order timeline | 4 bước: Đặt hàng → Xác nhận → Đang giao → Đã giao    |
| Cancel order   | Chỉ được hủy ở trạng thái "Đặt hàng" (chưa xác nhận) |

### Admin (P1-06)

| Quyết định        | Lựa chọn                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| Scope             | Order management + Dashboard stats (bỏ Product CRUD — dùng Django admin) |
| Dashboard metrics | 4 số: Tổng đơn hàng + Doanh thu hôm nay + Đơn chờ xử lý + Tổng sản phẩm  |
| Order actions     | Update status + xem detail + cancel thay user                            |

### P2 Hardening

| Quyết định          | Lựa chọn                                                    |
| ------------------- | ----------------------------------------------------------- |
| Timing              | Song song với P1 — không đợi P1 xong hoàn toàn              |
| Coverage threshold  | Giữ nguyên 70% chỉ cho `shared/lib/**` và `shared/hooks/**` |
| Lighthouse baseline | Desktop VÀ Mobile đều phải >75                              |

---

## Docs IA Migration

| Quyết định                                        | Lựa chọn                                               |
| ------------------------------------------------- | ------------------------------------------------------ |
| `skill-workflow-guide.en` dịch sang vi            | Defer — giữ exception ADR 0002, tạo issue sau          |
| `Next.js 16` reference trong premium_upgrade_plan | Đúng (project dùng Next.js 16.2.4) — không cần sửa     |
| CONTEXT.md frontmatter                            | Thêm YAML example block (7 core fields)                |
| Stub expiration tracking                          | GitHub issue với due date 2026-08-06 + label `cleanup` |
| Commit strategy                                   | 1 commit duy nhất cho toàn bộ migration                |
| CLAUDE.md/AGENTS.md update                        | Trong cùng commit migration — atomic                   |
