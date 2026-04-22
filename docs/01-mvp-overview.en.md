# 01. MVP Overview (EN)

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

| Item        | Definition                                              |
| ----------- | ------------------------------------------------------- |
| Product     | Frontend-first e-commerce platform for Vietnam market   |
| MVP target  | Real sales operations with COD and core admin workflows |
| Core users  | Shoppers, store operators, system admins                |
| Primary KPI | Conversion, checkout success, order processing SLA      |

## Purpose

This document defines the complete MVP business baseline: goals, scope, core journeys, acceptance criteria, KPIs, and the definition of success. It is the primary alignment artifact for BA and FE execution.

## Scope

In scope for MVP:

- Storefront: home, basic category discovery, product detail, basic search/filter.
- Auth: register, login, forgot/reset password (basic email flow).
- Cart and checkout: cart management, COD checkout, order confirmation.
- Customer order lifecycle: order history and order detail.
- Admin core: product/order management and order status processing.
- Foundational NFRs: responsive UI, basic SEO, baseline performance, error tracking.

Out of scope for MVP (deferred):

- Online payment gateway (VNPay/Momo/ZaloPay).
- Advanced loyalty, complex voucher engine, full flash-sale engine.
- Marketplace/multi-vendor model.
- Advanced BI dashboards.

## Decisions

- Execution strategy is "MVP first, hardening fast": prioritize COD cashflow.
- Use a module-driven architecture with thin App Router routes.
- Prioritize stable and fast admin capabilities for real order operations.
- Any feature beyond core flow moves to Post-MVP backlog.
- Success is measured by real operation readiness, not only UI completeness.

## Detailed Spec

### Business context and personas

- Persona 1 - Shopper:
  - Goal: quickly find relevant products and complete checkout on mobile.
  - Pain points: long checkout flow, unclear order visibility.
- Persona 2 - Store operator:
  - Goal: update products and process orders quickly with low error rate.
  - Pain points: fragmented manual workflows, poor order queue visibility.
- Persona 3 - Admin owner:
  - Goal: control operations quality and keep the system scalable.

### Goals and success outcomes

- Goal 1: Stable end-to-end purchase flow on mobile and desktop web.
- Goal 2: Operations can manage orders/products daily without dev dependency.
- Goal 3: BA/FE/QA can execute with consistent acceptance criteria.

### Core user journeys

1. Browse to product:
   - User enters home, explores categories, uses search/filter.
   - User opens PDP and selects variant/quantity.
2. Cart to checkout:
   - User adds items, reviews cart, updates quantity.
   - User enters shipping info, selects COD, confirms order.
3. Order visibility:
   - User sees order confirmation.
   - User checks order history and order detail.
4. Admin processing:
   - Admin receives new orders and updates status in defined workflow.

### Functional scope by module

- Shop module:
  - Home sections, minimal product listing, PDP, basic search/filter.
  - Clear CTA and basic stock state visibility.
- Auth module:
  - Register/login/logout, forgot/reset password.
  - Route guards for protected pages.
- Order module:
  - COD order creation, order confirmation, customer order history/detail.
- Admin module:
  - MVP-level product CRUD for operations.
  - Order list and status transitions by policy.
- System module:
  - Error boundaries, loading states, SEO metadata, monitoring hooks.

### Non-functional requirements (MVP level)

- SEO:
  - Proper metadata for Home/PDP/PLP.
  - Basic sitemap and robots support.
- Performance:
  - Target LCP < 3s on key pages under average network conditions.
  - Image optimization and unnecessary JS reduction.
- Accessibility:
  - Keyboard navigation on key forms and CTAs.
  - Baseline manual checklist aligned to core WCAG practices.
- Security:
  - No client-side secret leakage.
  - Basic protection against XSS/CSRF via framework defaults and conventions.
- Observability:
  - Sentry for error tracking.
  - Minimum logging for checkout failures.

### BA acceptance criteria by capability

- Catalog discovery:
  - Users can search products by keyword.
  - Users can apply basic filters/sorting.
- Cart:
  - Add/remove/update behaves correctly.
  - Totals are consistent.
- COD checkout:
  - Valid input creates an order successfully.
  - Failures show user-friendly messages and preserve critical input.
- Order management:
  - Customers see their own order history/details accurately.
  - Admin can update status with auditability.

### MVP KPIs and definition of success

- Funnel KPIs:
  - Add-to-cart rate.
  - Checkout completion rate.
  - COD order success rate.
- Operations KPIs:
  - Time-to-confirm order (internal SLA).
  - Manual intervention rate for failed orders.
- Quality KPIs:
  - Production error rate impacting checkout.
  - CI build/test success rate.

Definition of success:

- COD purchase flow works end-to-end in production.
- Operations team can process daily orders using admin core.
- Baseline KPI thresholds are met within the first 2-4 operating weeks.

## Acceptance Criteria

- This document is the baseline scope contract for BA/FE/QA.
- Every MVP requirement maps to module-level acceptance criteria.
- In-scope vs out-of-scope is locked to prevent scope creep.
- KPIs are measurable and unambiguous.

## Open Risks / Next Actions

Open risks:

- Scope creep from marketing/promo requests outside MVP.
- Missing real product data may distort realistic testing.
- Delays in backend contract finalization may impact FE schedule.

Next actions:

- [ ] Finalize API contracts for catalog/auth/order.
- [ ] Lock QA checklist for the three core journeys.
- [ ] Set up MVP KPI tracking dashboard for week one.
- [ ] Reassess scope after first production operation week.
