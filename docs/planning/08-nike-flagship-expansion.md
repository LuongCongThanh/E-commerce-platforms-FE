# 08. Nike Flagship Expansion — Post-MVP Vision (VI)

> 📌 **Tài liệu planning đang hoạt động** — khác với `01-07` (đã snapshot lịch sử 06/2026, không còn cập nhật), tài liệu này là baseline cho milestone tiếp theo và sẽ được cập nhật cho tới khi milestone hoàn tất, sau đó mới snapshot.

Last updated: 2026-07-23
Source of truth: `01-mvp-overview.md` (baseline MVP đã chốt), `07-redesign-clean-commerce.md` (visual language hiện tại), `docs/architecture/tech-stack.md`, `CLAUDE.md`
Owner: Product Owner + FE Lead

## TOC

- [Purpose](#purpose)
- [Scope](#scope)
- [Decisions](#decisions)
- [Detailed Spec](#detailed-spec)
- [Cross-team Dependencies](#cross-team-dependencies)
- [Acceptance Criteria](#acceptance-criteria)
- [Open Risks / Next Actions](#open-risks--next-actions)

## Summary Table

| Item        | Definition                                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Product     | Nâng cấp storefront hiện có lên trải nghiệm "flagship" kiểu Nike — giữ nguyên Next.js frontend + Django backend                  |
| Milestone   | Post-MVP: multi-language mở rộng, AI search (lớp FE), CMS content (lớp FE), analytics, membership (lớp FE), PWA, scale-readiness |
| Core users  | Khách mua hàng đa ngôn ngữ, store operator, admin hệ thống                                                                       |
| Primary KPI | Search-to-purchase conversion, PWA install/return rate, membership engagement, Core Web Vitals ở tải cao                         |

## Purpose

Tài liệu này định nghĩa milestone kế tiếp sau MVP: nâng storefront hiện tại lên trải nghiệm flagship — lấy cảm hứng thị giác Nike (đã bắt đầu ở PDP theo `07-redesign-clean-commerce.md`) — và bổ sung các năng lực mới (đa ngôn ngữ mở rộng, AI search, CMS content, analytics, membership, PWA), đồng thời chuẩn bị kiến trúc FE cho quy mô lớn.

Tài liệu **chỉ speck chi tiết phần thuộc quyền sở hữu của repo frontend này**. Các năng lực cần hạ tầng/backend mới (search engine, CMS backend, analytics pipeline, membership rules engine, scale hạ tầng 1M user) được liệt kê ở [Cross-team Dependencies](#cross-team-dependencies) dưới dạng câu hỏi mở cho team backend/infra — không bịa chi tiết stack (vd. NestJS/Postgres/Redis/Elasticsearch) khi chưa có quyết định thật.

## Scope

In-scope (FE, repo này sở hữu và triển khai được ngay):

- Multi-language: mở rộng coverage next-intl hiện có (vi mặc định, en) — rà soát các màn hình/luồng còn hardcode tiếng Việt, khoá quy trình thêm ngôn ngữ mới.
- AI Search (lớp FE): UI tìm kiếm gợi ý ngữ nghĩa, ô search nâng cao, hiển thị kết quả liên quan — tiêu thụ một API search contract (TBD với backend).
- CMS (lớp FE): component render nội dung do CMS quản trị (landing page theo chiến dịch, banner, blog/editorial) — không xây công cụ soạn thảo.
- Analytics (lớp FE): instrumentation sự kiện chuẩn (page view, product view, add-to-cart, begin-checkout, purchase) gửi tới một provider (TBD).
- Membership (lớp FE): UI hiển thị hạng thành viên, điểm tích luỹ, ưu đãi cá nhân hoá — tiêu thụ dữ liệu từ backend, không tự tính điểm.
- PWA: web app manifest, service worker (cache shell + offline fallback cơ bản), tiêu chí installability.
- Scale-readiness (FE): chiến lược cache/ISR cho trang catalog, tối ưu ảnh, code-splitting theo route, ngân sách Core Web Vitals ở tải cao.

Out-of-scope cho milestone này (xem thêm [Cross-team Dependencies](#cross-team-dependencies)):

- Thiết kế/triển khai AI search engine, indexing pipeline.
- CMS backend, công cụ soạn thảo nội dung cho non-dev.
- Analytics pipeline/warehouse, dashboard BI.
- Membership rules engine, bảng điểm, DB schema liên quan.
- Hạ tầng scale (replication DB, caching layer, load balancing) cho 1M concurrent users.
- Loyalty/voucher engine phức tạp, marketplace/multi-vendor (vẫn out-of-scope kế thừa từ `01-mvp-overview.md`).

## Decisions

- Giữ nguyên stack: Next.js frontend + Django REST backend. **Không** rewrite backend sang NestJS hay đổi database.
- Milestone này là **additive** lên MVP đã chốt (`01-mvp-overview.md`), không thay đổi các luồng core đã hoạt động (catalog, auth, cart, checkout COD, order, admin core).
- Kế thừa visual language "clean commerce" đã redesign (`07-redesign-clean-commerce.md`) — không quay lại glassmorphism, không đổi CTA tối.
- Mọi năng lực cần backend mới đều bắt đầu bằng việc **chốt contract/API** với team backend trước khi FE triển khai UI thật; cho tới lúc đó FE có thể build UI với mock/feature flag.
- Tuân thủ conventions hiện có (`docs/architecture/conventions.md`), import qua `@/*`, client state qua Zustand (xem ADR-0006), HTTP qua `http` client, Zod validate response.
- Ưu tiên rollout theo tính độc lập kỹ thuật, không theo thứ tự "quan trọng nhất trước": PWA và Scale-readiness không phụ thuộc backend mới nên có thể làm sớm; AI Search/CMS/Analytics/Membership chờ contract.

## Detailed Spec

### Business context and personas

- Persona 1 — Shopper đa ngôn ngữ: cần trải nghiệm nhất quán dù chọn `vi` hay `en`, tìm sản phẩm nhanh qua search thông minh hơn.
- Persona 2 — Thành viên thân thiết: quan tâm hạng thành viên, điểm tích luỹ, ưu đãi cá nhân hoá; kỳ vọng quay lại qua PWA (icon trên màn hình chính, mở nhanh).
- Persona 3 — Content/Marketing operator: cần đăng landing page/banner theo chiến dịch mà không cần dev deploy (phụ thuộc CMS backend, FE chỉ render).
- Persona 4 — Admin/Ops: cần dữ liệu analytics để ra quyết định vận hành (phụ thuộc analytics backend, FE chỉ generate event).

### Goals and success outcomes

- Goal 1: Trải nghiệm tìm kiếm giảm friction, tăng tỷ lệ search-to-purchase.
- Goal 2: Storefront cài đặt được như app (PWA), tăng tỷ lệ quay lại.
- Goal 3: Nội dung chiến dịch (landing/banner) publish được mà không cần release code mới.
- Goal 4: Dữ liệu hành vi người dùng được ghi nhận đầy đủ, chuẩn hoá, phục vụ phân tích.
- Goal 5: Thành viên thấy rõ giá trị (hạng/điểm/ưu đãi), tăng engagement.
- Goal 6: Kiến trúc FE chịu tải tốt ở quy mô lớn hơn nhiều lần so với MVP.

### Core user journeys

1. Tìm kiếm thông minh: user gõ từ khoá mơ hồ → thấy gợi ý liên quan ngữ nghĩa (không chỉ khớp chuỗi) → vào đúng sản phẩm cần.
2. Cài đặt PWA: user được gợi ý "Thêm vào màn hình chính" → mở lại storefront như app, có shell offline cơ bản khi mất mạng.
3. Khám phá nội dung chiến dịch: user vào landing page theo mùa/sự kiện do CMS quản lý, không phải trang cứng trong code.
4. Theo dõi thành viên: user đăng nhập, thấy hạng/điểm hiện tại và ưu đãi tương ứng trên trang tài khoản.
5. Chuyển đổi ngôn ngữ: user đổi `vi` ↔ `en`, mọi màn hình (kể cả những màn hình mới ở milestone này) hiển thị đúng ngôn ngữ đã chọn.

### Functional scope by capability

- Multi-language:
  - Audit toàn bộ route/component còn hardcode tiếng Việt (đặc biệt các phần thêm sau MVP), đưa vào `src/lang/`.
  - Tài liệu hoá quy trình thêm locale mới (nếu có locale thứ 3 trong tương lai).
- AI Search (FE):
  - Search input hỗ trợ gợi ý real-time (debounce, loading state, empty state).
  - Trang kết quả hiển thị độ liên quan, không chỉ danh sách phẳng.
  - Định nghĩa contract kỳ vọng (request/response shape) để đàm phán với backend — FE giữ vai trò consumer qua `http` client + Zod schema như quy ước hiện có.
- CMS (FE):
  - Component render nội dung dạng block (hero, rich text, media, CTA) nhận dữ liệu từ CMS API.
  - Fallback an toàn khi CMS trả nội dung thiếu field (không vỡ trang).
- Analytics (FE):
  - Danh sách sự kiện chuẩn hoá: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`, `search`.
  - Lớp trừu tượng gửi event (1 module dùng chung trong `shared/lib/`) để dễ đổi provider sau này mà không sửa call site.
- Membership (FE):
  - Trang/section hiển thị hạng thành viên, điểm, danh sách ưu đãi cá nhân hoá trên account dashboard.
  - Trạng thái loading/error rõ ràng khi dữ liệu membership chưa sẵn sàng.
- PWA:
  - `manifest.json` (tên, icon, theme color, display mode).
  - Service worker: cache static shell, fallback offline cho route đã ghé thăm.
  - Đáp ứng tiêu chí installability (Lighthouse PWA checklist).
- Scale-readiness (FE):
  - Rà soát ISR/cache cho trang catalog (home, PLP, PDP) — tránh render toàn bộ theo request khi tải cao.
  - Ngân sách hiệu năng: LCP/INP/CLS theo Core Web Vitals, có ngưỡng cụ thể cao hơn baseline MVP (baseline MVP: LCP < 3s).
  - Rà soát bundle size, code-splitting theo route cho các trang mới (search, membership, CMS landing).

### Non-functional requirements (milestone level)

- Performance: ngân sách Core Web Vitals nghiêm ngặt hơn MVP, do kỳ vọng tải cao hơn.
- i18n: không có chuỗi hardcode mới ở các tính năng thuộc milestone này.
- Accessibility: kế thừa chuẩn WCAG cơ bản đã áp dụng ở MVP, áp dụng cho toàn bộ màn hình mới.
- Resilience: mọi tích hợp phụ thuộc backend mới (search/CMS/analytics/membership) phải có fallback/error state — không để trang trắng khi API chưa sẵn sàng.
- Observability: mở rộng error tracking hiện có (Sentry) để bao phủ các luồng mới.

## Cross-team Dependencies

Các mục sau **không được thiết kế chi tiết trong tài liệu này** vì nằm ngoài quyền sở hữu của repo frontend — cần team backend/infra chốt trước khi FE có thể tích hợp thật:

| Hạng mục                | Câu hỏi mở cần backend/infra trả lời                                                    |
| ----------------------- | --------------------------------------------------------------------------------------- |
| AI Search engine        | Dùng công nghệ nào (vd. Elasticsearch/OpenSearch/khác)? Contract API request/response?  |
| CMS backend             | Dùng headless CMS nào? Ai quản trị nội dung? API schema cho từng loại block?            |
| Analytics pipeline      | Provider nào (GA4/self-hosted/khác)? Schema sự kiện chuẩn hoá dùng chung toàn hệ thống? |
| Membership rules engine | Quy tắc tính điểm/hạng ở đâu? DB schema? API trả về cho FE là gì?                       |
| Scale infra (1M users)  | Chiến lược scale Django (horizontal/replica)? Caching layer (Redis)? CDN cho API?       |

Cho tới khi có câu trả lời, FE có thể build UI với mock data/feature flag, nhưng **không** release tính năng phụ thuộc ra production.

## Acceptance Criteria

- Mỗi capability trong Scope có journey rõ, functional spec rõ, và fallback rõ khi backend chưa sẵn sàng.
- Không có mục nào trong Cross-team Dependencies bị "âm thầm" thiết kế chi tiết như thể đã quyết định (tránh tài liệu tưởng tượng lệch thực tế).
- Multi-language, PWA, Scale-readiness có thể triển khai độc lập, không chờ backend mới.
- AI Search/CMS/Analytics/Membership chỉ chuyển sang triển khai thật sau khi contract với backend được chốt.
- Tài liệu này được cập nhật liên tục cho tới khi milestone hoàn tất, sau đó chuyển sang snapshot lịch sử theo đúng quy ước `docs/README.md`.

## Open Risks / Next Actions

Open risks:

- Scope creep: dễ bị kéo thêm yêu cầu ngoài 6 capability đã chốt (vd. loyalty engine phức tạp, marketplace) — giữ nguyên out-of-scope kế thừa từ MVP.
- Rủi ro tài liệu lệch thực tế nếu FE tự giả định contract backend rồi build theo giả định đó.
- Rủi ro hiệu năng: thêm nhiều tính năng mới (search, CMS, membership) có thể làm tăng bundle/LCP nếu không kiểm soát code-splitting.

Next actions:

- [ ] Làm việc với team backend để chốt contract API cho AI Search.
- [ ] Làm việc với team backend/content để chọn giải pháp CMS và schema block.
- [ ] Làm việc với team backend/data để chốt provider analytics và schema sự kiện.
- [ ] Làm việc với team backend để chốt API membership (hạng/điểm/ưu đãi).
- [ ] Audit hardcode tiếng Việt ở các phần thêm sau MVP.
- [ ] Lập Lighthouse PWA checklist baseline.
- [ ] Rà soát ISR/cache hiện tại cho catalog, đề xuất ngưỡng Core Web Vitals mới cho milestone này.
