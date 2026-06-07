# 04. Project Structure, Guidelines, Design System, Conventions (VI)

Last updated: 2026-06-04  
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
        _lib/
          actions/          # Server actions (order.ts, product.ts, profile.ts)
          components/       # UI components — private to shop
            common/         # Shared across ≥2 shop features (ProductGrid, Pagination…)
            home/           # Home page sections
            products/       # Product listing & detail
            categories/     # Category + filter
            cart/           # Cart view
            checkout/       # Checkout flow
            orders/         # Order history & detail
            profile/        # Profile page
            search/         # Search results
          data/             # Mock data thuần (thay thế bằng API khi backend sẵn sàng)
          queries/          # Query helpers trên mock data (getProductBySlug, getCategoryBySlug)
          hooks/            # Feature-specific hooks (useProducts, useCreateOrder…)
          schemas/          # Zod form schemas (checkout.ts, filter.ts, profile.ts)
          types/            # Feature-local types (ProductDisplay, HomeSection…)
        page.tsx
        layout.tsx
        categories/[slug]/page.tsx
        products/[slug]/page.tsx
        cart/page.tsx
        checkout/page.tsx
        orders/[id]/page.tsx
      (auth)/
        _lib/
          actions/          # Auth server actions (auth.ts)
          components/       # Auth form components (LoginForm, RegisterForm…)
          schemas/          # Zod form schemas (auth.ts)
        layout.tsx
        login/page.tsx
        register/page.tsx
        forgot-password/page.tsx
      (admin)/              # Protected admin panel
      layout.tsx
      loading.tsx
      error.tsx
    api/
      auth/                 # Next.js Route Handlers (login/logout/refresh/register)
    page.tsx                # Root redirect
  shared/
    components/
      base/                 # Radix primitive wrappers (Button, Input, Dialog…)
      common/               # Cross-feature components (PaginationNav, EmptyState…)
      commerce/             # Commerce-specific (ProductCard, CategoryCard…)
      marketing/            # Marketing sections (SectionHeading, CountdownTimer…)
      skeletons/            # Loading skeleton components
    hooks/                  # Cross-feature hooks (useAuth, useCart, useDebounce, useLocalStorage…)
    lib/
      http/                 # client.ts, api-auth.ts, api-types.ts, zod-helpers.ts
      errors/               # ApiError class, error-codes
      guards/               # AuthGuard client component
      monitoring/           # Sentry integration
      payment/              # VNPay / Momo / ZaloPay lib
      cloudinary.ts         # buildImageUrl() — Cloudinary URL builder
      seo.ts                # buildMetadata() — Next.js Metadata factory
      notification.ts       # notify object wrapping Sonner toast
    constants/              # api-endpoints.ts, routes.ts, query-keys.ts, app-config.ts, nav-categories.ts, payment-config.ts
    types/                  # Zod schemas + z.infer<> types
  i18n/
    request.ts
  lang/                     # Translation files: lang/vi/, lang/en/ (mỗi namespace 1 file JSON)
  __tests__/                # Global test setup và helpers
```

### Architecture rules

- App Router responsibilities:
  - Page/layout ở `app/[locale]/(feature)/` chỉ orchestrate — không chứa business logic nặng.
  - Logic feature nằm trong `_lib/` — bao gồm `actions/`, `components/`, `hooks/`, `schemas/`, `types/`, `data/`.
  - Route-level metadata/loading/error được đặt tại mức segment tương ứng.
- Feature ownership (route group pattern):
  - `(shop)/_lib/`: listing, PDP, search, filter, cart, checkout, orders.
  - `(auth)/_lib/`: login, register, forgot/reset password.
  - `(admin)/`: quản trị sản phẩm và đơn (protected by middleware).
- Shared boundary:
  - Chỉ đưa vào `shared/` khi được dùng từ 2 route group trở lên.
  - `shared/` không được import từ bất kỳ `(feature)/` route group nào.
  - `_lib/` của một route group là private — route group khác không import chéo.

### Coding guidelines

- Naming:
  - File component: ưu tiên giữ theo naming đã dùng ổn định trong repo; với shared UI primitives hiện tại có thể là `PascalCase.tsx` hoặc tên gốc từ thư viện wrapper, nhưng phải nhất quán trong cùng một nhóm.
  - Component export: `PascalCase`.
  - Hook file: `useCamelCase.ts`.
  - Utility / constants / types file: `camelCase.ts` theo từng nhóm.
  - Constants: `UPPER_SNAKE_CASE` cho static constants.
- Imports:
  - Ưu tiên alias theo layer (ví dụ: `@/shared`, `@/modules`).
  - Tránh deep relative path phức tạp.
  - **Auto-sorting**: Sử dụng `simple-import-sort` (ESLint) đồng bộ với setting VS Code để đảm bảo thứ tự import nhất quán.
- Typing:
  - Không dùng `any` nếu không có lý do bắt buộc.
  - Ưu tiên schema-first với Zod cho data ở boundary.
  - **Strict Guards**: Bắt buộc tuân thủ rule `no-unnecessary-condition`, `no-floating-promises`, và `strict-boolean-expressions`.
- Xử lý lỗi (Error handling):
  - Chuẩn hóa HTTP error thông qua class `ApiError` (`src/shared/lib/errors/api-error.ts`).
  - Hiển thị thông báo qua Toast (cho Mutations) hoặc Error Boundary (cho Queries).
  - Phân loại lỗi bằng `ErrorCode` để xử lý logic FE (ví dụ: `AUTH_INVALID_CREDENTIALS`).
- Sử dụng API Client:
  - Sử dụng `http` từ `@/shared/lib/http/client` (`http.get`, `http.post`, `http.put`, `http.patch`, `http.delete`).
  - Không bao giờ gọi axios trực tiếp — luôn đi qua `http` object.
  - Authentication được xử lý tự động qua interceptors trong `client.ts`.
- State boundaries:
  - Server state: TanStack Query.
  - Client state: `useSyncExternalStore` (React built-in) + module-level stores — auth trong `shared/lib/http/api-auth.ts`, cart trong `shared/hooks/useCart.ts`. Không dùng Zustand hay thư viện state ngoài.
  - Local UI state: component-level `useState`/`useReducer`.

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
  - **Premium UI**: Sử dụng pattern Luxury Minimalist (ví dụ: Mega Menu với Framer Motion, adaptive mobile navigation).
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
