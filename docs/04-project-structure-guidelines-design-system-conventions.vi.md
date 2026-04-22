# 04. Project Structure, Guidelines, Design System, Conventions (VI)

Last updated: 2026-04-24  
Source of truth: current `src/` structure, architecture decisions in this doc set, FE standards  
Owner: FE Lead + Architect Reviewer

## TOC

- [Purpose](#purpose)
- [Scope](#scope)
- [Decisions](#decisions)
- [Detailed Spec](#detailed-spec)
- [Acceptance Criteria](#acceptance-criteria)
- [Open Risks / Next Actions](#open-risks--next-actions)

## Summary Table

| Item                   | Standard                                                |
| ---------------------- | ------------------------------------------------------- |
| Architecture style     | App Router thin routes + module-driven                  |
| Shared boundary        | `src/shared/*` only for cross-module reusable assets    |
| Design system baseline | Token-first, reusable primitives, responsive-first      |
| Convention policy      | Naming, imports, typing, testing, SEO, commit standards |

## Purpose

Tài liệu này mô tả chuẩn cấu trúc dự án và nguyên tắc coding/UI để mọi thành viên implement nhất quán, giảm rework, và dễ mở rộng.

## Scope

Bao gồm:

- Target project tree cho MVP và mở rộng.
- Kiến trúc module ownership và shared boundaries.
- Coding guidelines và conventions.
- Design-system rules (token, typography, spacing, components, responsive).
- Convention cho testing, i18n, SEO metadata, commit.

Không bao gồm:

- UI mockups chi tiết theo màn hình.
- API schema chi tiết backend.

## Decisions

- Route chỉ làm orchestration, không chứa business logic nặng.
- Mọi logic feature nằm trong `modules/*`.
- Shared chỉ chứa phần tái sử dụng đa module, không chứa logic đặc thù 1 feature.
- Design system triển khai theo token và component contracts rõ ràng.
- Convention là bắt buộc để merge.

## Detailed Spec

### Target project tree

```text
src/
  app/
    [locale]/
      (shop)/
      (auth)/
      (account)/
      (admin)/
    api/
    layout.tsx
    providers.tsx
  modules/
    shop/
    auth/
    checkout/
    orders/
    admin/
  shared/
    components/
    hooks/
    lib/
    constants/
    types/
    stores/
  i18n/
  tests/
```

### Architecture rules

- App Router responsibilities:
  - Page/layout ở `app/*` chỉ compose module containers.
  - Route-level metadata/loading/error ở mức phân đoạn.
- Module ownership:
  - `modules/shop`: listing, PDP, search, filter.
  - `modules/auth`: login/register/forgot.
  - `modules/checkout`: cart + checkout.
  - `modules/orders`: order history/detail/confirmation.
  - `modules/admin`: quản trị sản phẩm và đơn.
- Shared boundary:
  - Được dùng chung từ 2 module trở lên mới đưa vào `shared`.
  - Cấm import ngược từ shared vào module-specific private internals.

### Coding guidelines

- Naming:
  - File component: `kebab-case.tsx`.
  - Component export: `PascalCase`.
  - Hook: `use-*.ts`.
  - Constants: `UPPER_SNAKE_CASE` cho static constants.
- Imports:
  - Ưu tiên alias theo layer.
  - Tránh deep relative path phức tạp.
- Typing:
  - Không dùng `any` nếu không có lý do bắt buộc.
  - Ưu tiên schema-first với Zod cho data ở boundary.
- Error handling:
  - HTTP errors normalize về shape chung.
  - UI chỉ render thông báo thân thiện, không lộ stack nội bộ.
- State boundaries:
  - Server state: TanStack Query.
  - Client state: Zustand.
  - Local UI state: component-level state.

### Design system standards

- Token system:
  - Color tokens: semantic (`primary`, `accent`, `danger`, `muted`).
  - Spacing scale: chuẩn hóa theo bậc nhất quán.
  - Radius/shadow tokens thống nhất toàn app.
- Typography:
  - Heading scale rõ (H1-H6).
  - Body text có base size và line-height chuẩn.
- Component rules:
  - Tách primitive và feature component.
  - Mọi component public phải có props contract rõ.
- Responsive rules:
  - Mobile-first.
  - Breakpoint strategy thống nhất qua toàn hệ.
  - Không hardcode pixel tùy tiện ở nhiều nơi.

### Testing conventions

- Unit tests:
  - Cho utils, hooks, state store.
- Integration tests:
  - Cho module containers và luồng form chính.
- E2E tests:
  - Core journeys: browse -> cart -> checkout -> order visibility.
- Coverage strategy:
  - Ưu tiên logic nghiệp vụ cốt lõi hơn thin wrappers.

### i18n conventions

- Namespace theo module.
- Key naming nhất quán và có fallback strategy.
- Không hardcode user-facing copy ở component nếu là nội dung đa ngôn ngữ.

### SEO metadata conventions

- Mọi page chính có metadata định nghĩa rõ.
- PDP/PLP có title/description theo ngữ cảnh dữ liệu.
- Có sitemap/robots theo baseline production.

### Commit and PR conventions

- Commit format theo conventional commits.
- PR phải có:
  - Scope rõ.
  - Test evidence.
  - Risk notes.
  - Rollback notes nếu ảnh hưởng flow chính.

## Acceptance Criteria

- Cấu trúc project và ownership đủ rõ để implement không mơ hồ.
- Design system có quy tắc token/component/responsive cụ thể.
- Coding/testing/i18n/SEO/commit conventions có thể dùng trực tiếp.
- Rule shared boundary ngăn được coupling sai kiến trúc.

## Open Risks / Next Actions

Open risks:

- Tăng tốc giao tính năng có thể phá conventions.
- Shared phình to thành "misc bucket" nếu không review kỹ.

Next actions:

- [ ] Tạo checklist kiến trúc trong PR template.
- [ ] Đặt rule lint/import boundary theo layer.
- [ ] Review định kỳ các component shared mỗi sprint.
- [ ] Đồng bộ guideline với onboarding docs nội bộ.
