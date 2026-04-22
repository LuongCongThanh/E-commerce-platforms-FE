# 03. Technical Stack, Skills And Versions (VI)

Last updated: 2026-04-24  
Source of truth: `package.json`, `skills-mapping.md` (legacy), engineering conventions in this doc set  
Owner: FE Lead + BA Lead + Tech Lead

## TOC
- [Purpose](#purpose)
- [Scope](#scope)
- [Decisions](#decisions)
- [Detailed Spec](#detailed-spec)
- [Acceptance Criteria](#acceptance-criteria)
- [Open Risks / Next Actions](#open-risks--next-actions)

## Summary Table
| Item | Value |
|---|---|
| Framework core | Next.js 16.2.4 + React 19.2.4 |
| State and data | TanStack Query 5, Zustand 5, Axios |
| Form and validation | React Hook Form 7 + Zod 4 |
| Testing | Vitest 4 + Playwright 1.59 |
| Monitoring | Sentry Next.js 10.49 |

## Purpose
Tài liệu này khóa cấu hình kỹ thuật chính thức cho dự án: công nghệ, phiên bản, lý do chọn, skill BA/FE cần dùng theo phase, quality gates kỹ thuật, và decision log cho hạng mục defer.

## Scope
Bao gồm:
- Version matrix lấy từ `package.json` hiện tại.
- Tech stack theo layer và rationale.
- Skill matrix tập trung BA + FE (must-have/nice-to-have) theo phase.
- Quality gates bắt buộc: lint/test/build/e2e.
- Decision log: chọn ngay và defer.

Không bao gồm:
- Hướng dẫn cài đặt chi tiết từng package.
- Skill matrix đầy đủ cho mọi role ngoài BA/FE.

## Decisions
- Nếu docs cũ mâu thuẫn phiên bản, ưu tiên `package.json`.
- Ưu tiên stack tối giản nhưng đủ cho MVP + mở rộng phase sau.
- Skill BA/FE là bộ bắt buộc vận hành quy trình giao việc và nghiệm thu.
- Quality gates là tiêu chuẩn merge/release tối thiểu.

## Detailed Spec
### Technical stack by layer
| Layer | Technology | Why this choice |
|---|---|---|
| App framework | Next.js 16.2.4 | App Router ổn định, phù hợp SSR/SEO và module-driven |
| UI runtime | React 19.2.4, React DOM 19.2.4 | Hiệu năng tốt, ecosystem lớn |
| Styling | Tailwind CSS 4, tailwind-merge 3.5.0 | Tốc độ phát triển UI cao, chuẩn utility-first |
| Data fetching | @tanstack/react-query 5.99.1 | Quản lý server state và cache nhất quán |
| Client state | Zustand 5.0.12 | Gọn nhẹ cho auth/cart/UI state |
| HTTP | Axios 1.15.0 | Interceptor, error handling tập trung |
| Forms | React Hook Form 7.72.1 + @hookform/resolvers 5.2.2 | Form performance tốt, tích hợp validation rõ |
| Validation | Zod 4.3.6 | Type-safe schema cho FE contracts |
| i18n | next-intl 4.9.1 | Chuẩn hóa localization |
| Monitoring | @sentry/nextjs 10.49.0 | Theo dõi lỗi production |
| Testing unit/integration | Vitest 4.1.4 + Testing Library | Nhanh, phù hợp FE workflows |
| E2E testing | Playwright 1.59.1 | Kiểm thử luồng nghiệp vụ đầu-cuối |
| Quality tooling | ESLint 9.39.4 + Prettier 3.8.3 + Husky 9.1.7 | Cưỡng chế chất lượng trước merge |

### Selected version matrix
#### Runtime dependencies
| Package | Version |
|---|---|
| next | 16.2.4 |
| react | 19.2.4 |
| react-dom | 19.2.4 |
| @tanstack/react-query | ^5.99.1 |
| @tanstack/react-table | ^8.21.3 |
| axios | ^1.15.0 |
| react-hook-form | ^7.72.1 |
| zod | ^4.3.6 |
| zustand | ^5.0.12 |
| tailwindcss | ^4 |
| next-intl | ^4.9.1 |
| @sentry/nextjs | ^10.49.0 |
| @serwist/next | ^9.5.7 |

#### Dev dependencies (core)
| Package | Version |
|---|---|
| typescript | ^5 |
| vitest | ^4.1.4 |
| @playwright/test | ^1.59.1 |
| eslint | ^9.39.4 |
| prettier | ^3.8.3 |
| husky | ^9.1.7 |
| lint-staged | ^16.4.0 |

### Skill matrix focused on BA and FE
#### BA skills
Must-have:
- `acceptance-orchestrator`
- `writing-plans`
- `api-documentation`
- `wiki-page-writer`
- `architect-review`

Nice-to-have:
- `technical-change-tracker`
- `analyze-project`
- `analytics-tracking`
- `ai-seo`

#### FE skills
Must-have:
- `react-nextjs-development`
- `nextjs-app-router-patterns`
- `tailwind-patterns`
- `tanstack-query-expert`
- `zod-validation-expert`
- `zustand-store-ts`
- `ui-review`

Nice-to-have:
- `web-performance-optimization`
- `accessibility-compliance-accessibility-audit`
- `fixing-motion-performance`
- `systematic-debugging`

### Skill usage by phase
| Phase | BA focus skills | FE focus skills |
|---|---|---|
| Planning and scope lock | acceptance-orchestrator, writing-plans | nextjs-app-router-patterns, react-nextjs-development |
| Core build | api-documentation, architect-review | tailwind-patterns, tanstack-query-expert, zod-validation-expert, zustand-store-ts |
| Hardening and release | technical-change-tracker, analyze-project | ui-review, web-performance-optimization, accessibility audit |

### Technical quality gates
Gate rules before merge:
- `npm run lint` must pass.
- `npm run test` must pass.
- `npm run build` must pass.
- Tính năng ảnh hưởng flow chính phải có e2e tương ứng (`npm run test:e2e`).

Gate rules before release:
- Regression cho core journeys pass.
- Không còn lỗi severity cao chưa có mitigation.
- Monitoring events cho checkout/auth flow được xác thực.

### Decision log (chosen vs deferred)
Chosen now:
- COD-first checkout.
- Module-driven FE architecture.
- Query + store separation (TanStack Query vs Zustand).
- CI quality gates tối thiểu.

Deferred to phase later:
- Online payment gateways.
- Advanced promo engine.
- Full analytics/BI stack.
- Marketplace capabilities.

### Glossary (VI-EN sync)
| Term | Meaning |
|---|---|
| MVP | Phiên bản khả dụng tối thiểu để vận hành thật |
| Thin routes | Route chỉ giữ nhiệm vụ wiring, logic ở module |
| Quality gate | Điều kiện bắt buộc trước merge/release |
| Contract freeze | Khóa giao diện API trong một chu kỳ |
| Scope creep | Mở rộng phạm vi ngoài kế hoạch đã chốt |

## Acceptance Criteria
- Version matrix phản ánh đúng `package.json` hiện tại.
- Skill matrix BA/FE có phân must-have/nice-to-have và theo phase.
- Quality gates mô tả được tiêu chuẩn merge/release.
- Decision log thể hiện rõ chọn ngay và defer.

## Open Risks / Next Actions
Open risks:
- Package drift khi nâng cấp không cập nhật docs.
- Team bỏ qua quality gate khi deadline gấp.

Next actions:
- [ ] Thêm check định kỳ đối chiếu version docs với `package.json`.
- [ ] Đưa quality gate vào PR template.
- [ ] Review lại shortlist skills mỗi cuối phase.
- [ ] Cập nhật glossary khi thêm thuật ngữ mới.
