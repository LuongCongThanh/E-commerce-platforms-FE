# 01. MVP Overview (VI)

Last updated: 2026-04-24  
Source of truth: `package.json`, current repository structure, `docs/docs-mvp/skills-mapping.md` (legacy reference), this document set (`01-05`)  
Owner: Product Owner + BA Lead + FE Lead

## TOC

- [Purpose](#purpose)
- [Scope](#scope)
- [Decisions](#decisions)
- [Detailed Spec](#detailed-spec)
- [Acceptance Criteria](#acceptance-criteria)
- [Open Risks / Next Actions](#open-risks--next-actions)

## Summary Table

| Item        | Definition                                                 |
| ----------- | ---------------------------------------------------------- |
| Product     | Nền tảng e-commerce frontend-first cho thị trường Việt Nam |
| MVP target  | Bán hàng thực tế với COD, quản trị đơn/sản phẩm cơ bản     |
| Core users  | Khách mua hàng, vận hành cửa hàng, admin hệ thống          |
| Primary KPI | Conversion, checkout success, order processing SLA         |

## Purpose

Tài liệu này định nghĩa đầy đủ bức tranh MVP ở góc độ nghiệp vụ: mục tiêu, phạm vi, luồng chính, tiêu chí chấp nhận, KPI, và định nghĩa thành công. Đây là tài liệu chuẩn để BA/FE đồng thuận trước khi triển khai.

## Scope

In-scope cho MVP:

- Storefront: home, category discovery cơ bản, product detail, search/filter cơ bản.
- Auth: register, login, forgot/reset password (email flow mức cơ bản).
- Cart and checkout: giỏ hàng, checkout COD, xác nhận đơn.
- Order lifecycle (khách): xem lịch sử đơn, chi tiết đơn.
- Admin core: quản trị sản phẩm, đơn hàng, trạng thái đơn.
- NFR nền tảng: responsive, SEO cơ bản, performance baseline, error tracking.

Out-of-scope cho MVP (defer):

- Online payment gateway (VNPay/Momo/ZaloPay).
- Loyalty, voucher engine phức tạp, flash-sale engine đầy đủ.
- Marketplace/multi-vendor.
- Advanced BI dashboards.

## Decisions

- Triển khai theo chiến lược "MVP first, hardening fast": ưu tiên dòng tiền qua COD.
- Dùng kiến trúc module-driven, App Router thin routes.
- Admin ưu tiên giải pháp nhanh và ổn định để vận hành đơn hàng sớm.
- Mọi tính năng mới ngoài core flow được đẩy vào Post-MVP backlog.
- Success được đo bằng khả năng vận hành thật, không chỉ demo UI.

## Detailed Spec

### Business context and personas

- Persona 1 - Shopper:
  - Mục tiêu: tìm nhanh sản phẩm phù hợp, mua dễ trên mobile.
  - Pain points: quá nhiều bước checkout, thiếu minh bạch trạng thái đơn.
- Persona 2 - Store operator:
  - Mục tiêu: cập nhật sản phẩm, xử lý đơn nhanh, giảm sai sót trạng thái.
  - Pain points: thao tác thủ công rời rạc, khó theo dõi backlog đơn.
- Persona 3 - Admin owner:
  - Mục tiêu: kiểm soát vận hành, đảm bảo chất lượng và khả năng mở rộng.

### Goals and success outcomes

- Goal 1: End-to-end purchase flow hoạt động ổn định trên web mobile/desktop.
- Goal 2: Team vận hành quản lý đơn và sản phẩm hằng ngày không phụ thuộc dev.
- Goal 3: Tài liệu và tiêu chí nghiệm thu đủ rõ để BA/FE/QA thực thi nhất quán.

### Core user journeys

1. Browse to product:
   - User vào home, khám phá danh mục, dùng search/filter.
   - User mở PDP, chọn variant/số lượng.
2. Cart to checkout:
   - User add to cart, review giỏ hàng, cập nhật số lượng.
   - User nhập thông tin nhận hàng, chọn COD, xác nhận đặt hàng.
3. Order visibility:
   - User xem order confirmation.
   - User xem order history và order detail.
4. Admin processing:
   - Admin nhận đơn mới, cập nhật trạng thái theo workflow chuẩn.

### Functional scope by module

- Shop module:
  - Home sections, product listing tối thiểu, PDP, search/filter cơ bản.
  - Clear CTA và trạng thái tồn kho cơ bản.
- Auth module:
  - Register/login/logout, forgot/reset password.
  - Guard cho trang cần đăng nhập.
- Order module:
  - Create order COD, order confirmation, customer order history/detail.
- Admin module:
  - CRUD sản phẩm mức vận hành MVP.
  - Danh sách đơn, đổi trạng thái đơn theo policy.
- System module:
  - Error boundaries, loading states, metadata SEO, monitoring hooks.

### Non-functional requirements (MVP level)

- SEO:
  - Metadata chuẩn cho Home/PDP/PLP.
  - Sitemap và robots ở mức cơ bản.
- Performance:
  - LCP mục tiêu < 3s trên trang chính trong điều kiện mạng trung bình.
  - Tối ưu ảnh và giảm JS không cần thiết.
- Accessibility:
  - Keyboard navigation cho form/cta chính.
  - Tối thiểu đạt chuẩn kiểm thử thủ công theo checklist WCAG cơ bản.
- Security:
  - Không lộ secrets client-side.
  - Bảo vệ basic khỏi XSS/CSRF theo framework defaults + coding conventions.
- Observability:
  - Error tracking qua Sentry.
  - Log tối thiểu cho checkout failures.

### BA acceptance criteria by capability

- Catalog discovery:
  - Có thể tìm sản phẩm theo từ khóa.
  - Có thể lọc/sắp xếp cơ bản.
- Cart:
  - Add/remove/update item chính xác.
  - Tổng tiền hiển thị nhất quán.
- Checkout COD:
  - Tạo đơn thành công với dữ liệu hợp lệ.
  - Khi lỗi trả thông báo thân thiện và không mất dữ liệu quan trọng.
- Order management:
  - Customer thấy đúng lịch sử/chi tiết đơn của mình.
  - Admin cập nhật được trạng thái và lưu dấu vết thay đổi.

### MVP KPIs and definition of success

- Funnel KPIs:
  - Add-to-cart rate.
  - Checkout completion rate.
  - COD order success rate.
- Ops KPIs:
  - Time-to-confirm order (SLA nội bộ).
  - Tỷ lệ đơn lỗi cần can thiệp thủ công.
- Quality KPIs:
  - Tỷ lệ lỗi production ảnh hưởng checkout.
  - Build/test success rate trên CI.

Definition of success:

- Luồng mua hàng COD hoạt động end-to-end trên production.
- Đội vận hành xử lý đơn hàng hằng ngày trên admin core.
- KPI nền tảng đạt ngưỡng chấp nhận nội bộ trong 2-4 tuần đầu.

## Acceptance Criteria

- Tài liệu này là baseline được BA/FE/QA dùng làm chuẩn scope.
- Mọi yêu cầu MVP có thể trace tới module và acceptance rõ ràng.
- In-scope/out-of-scope được khóa, tránh scope creep.
- KPI có định nghĩa đo lường được, không mơ hồ.

## Open Risks / Next Actions

Open risks:

- Scope creep từ yêu cầu marketing/khuyến mãi ngoài MVP.
- Thiếu dữ liệu sản phẩm thật làm sai lệch test thực tế.
- Chậm trễ tích hợp backend contract có thể ảnh hưởng FE schedule.

Next actions:

- [ ] Chốt baseline API contract cho catalog/auth/order.
- [ ] Khóa checklist QA cho 3 journey cốt lõi.
- [ ] Thiết lập dashboard theo dõi KPI MVP tuần đầu.
- [ ] Review lại phạm vi sau tuần vận hành đầu tiên.
