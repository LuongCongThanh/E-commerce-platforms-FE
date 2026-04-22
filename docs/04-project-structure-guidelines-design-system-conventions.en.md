# 04. Project Structure, Guidelines, Design System, Conventions (EN)

Last updated: 2026-04-24  
Source of truth: current `src/` structure, architecture decisions in this document set, FE standards  
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

This document defines the project structure and implementation conventions to ensure consistent delivery, reduced rework, and scalable architecture growth.

## Scope

Included:

- Target project tree for MVP and expansion.
- Module ownership and shared boundaries.
- Coding guidelines and conventions.
- Design-system rules (tokens, typography, spacing, components, responsive).
- Testing, i18n, SEO metadata, and commit conventions.

Excluded:

- Pixel-level UI mockups by screen.
- Detailed backend API schema definitions.

## Decisions

- Routes orchestrate; they do not host heavy business logic.
- Feature logic lives in `modules/*`.
- `shared/*` is reserved for true cross-module reuse only.
- Design system is token-driven with explicit component contracts.
- Conventions are mandatory for merge.

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
  - Pages/layouts under `app/*` should compose module containers.
  - Route-level metadata/loading/error should stay at segment boundaries.
- Module ownership:
  - `modules/shop`: listing, PDP, search, filter.
  - `modules/auth`: login/register/forgot.
  - `modules/checkout`: cart + checkout.
  - `modules/orders`: order history/detail/confirmation.
  - `modules/admin`: product and order administration.
- Shared boundary:
  - Move to `shared` only when reused by at least two modules.
  - No reverse coupling from shared into module-private internals.

### Coding guidelines

- Naming:
  - Component file: `kebab-case.tsx`.
  - Component export: `PascalCase`.
  - Hook file: `use-*.ts`.
  - Static constants: `UPPER_SNAKE_CASE`.
- Imports:
  - Prefer layer aliases.
  - Avoid complex deep relative paths.
- Typing:
  - Avoid `any` unless explicitly justified.
  - Prefer schema-first boundaries with Zod.
- Error handling:
  - Normalize HTTP error shape.
  - Render user-friendly messages without internal stack details.
- State boundaries:
  - Server state: TanStack Query.
  - Client shared state: Zustand.
  - Local view state: component-level state.

### Design system standards

- Token system:
  - Semantic color tokens (`primary`, `accent`, `danger`, `muted`).
  - Consistent spacing scale.
  - Unified radius and shadow tokens.
- Typography:
  - Explicit heading hierarchy (H1-H6).
  - Standard body text base size and line-height.
- Component rules:
  - Separate primitives from feature components.
  - Public components require explicit props contracts.
- Responsive rules:
  - Mobile-first implementation.
  - Shared breakpoint strategy across the app.
  - Avoid arbitrary hardcoded pixels across multiple places.

### Testing conventions

- Unit tests:
  - Utilities, hooks, stores.
- Integration tests:
  - Module containers and key forms.
- E2E tests:
  - Core journeys: browse -> cart -> checkout -> order visibility.
- Coverage strategy:
  - Prioritize business-critical logic over thin wrappers.

### i18n conventions

- Namespace by module.
- Consistent key naming with fallback strategy.
- Avoid hardcoded user-facing strings for localized content.

### SEO metadata conventions

- Define metadata for key pages.
- PDP/PLP metadata should reflect page data context.
- Keep sitemap/robots baseline for production.

### Commit and PR conventions

- Use conventional commit format.
- PR must include:
  - Explicit scope.
  - Test evidence.
  - Risk notes.
  - Rollback notes for critical flow changes.

## Acceptance Criteria

- Project structure and ownership are implementation-ready.
- Design system rules are concrete for tokens/components/responsive.
- Coding/testing/i18n/SEO/commit conventions are directly usable.
- Shared boundary rules effectively prevent architectural coupling drift.

## Open Risks / Next Actions

Open risks:

- Fast feature delivery may bypass conventions.
- Shared layer can become an ungoverned "misc bucket".

Next actions:

- [ ] Add architecture checklist to PR template.
- [ ] Enforce layer boundaries via lint/import rules.
- [ ] Schedule shared component review every sprint.
- [ ] Sync these conventions with onboarding documentation.
