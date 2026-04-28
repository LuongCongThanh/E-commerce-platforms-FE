# 05. Priority Implementation Backlog (EN)

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
| P0       | Mandatory foundation before implementation starts |
| P1       | Core MVP value-delivery flows                     |
| P2       | Hardening and release reliability                 |
| P3       | Post-MVP expansion, non-blocking for launch       |

## Purpose

This backlog provides an implementation-ready, strict-priority sequence so the team can execute immediately without re-deciding scope or order of work.

## Scope

Included:

- P0/P1/P2/P3 backlog ordered by execution priority.
- Each item includes objective, output, dependencies, owner role, acceptance checks.
- BA/FE skill mapping per work cluster.
- Not-now list to prevent scope creep.

Excluded:

- File-by-file low-level coding tasks.

## Decisions

- P0 must be completed before taking any P1+ work.
- P3 work is blocked until P1/P2 quality gates pass.
- This backlog is the default sequence for zero-to-MVP implementation.
- Any request outside this list requires change-control review.

## Detailed Spec

### P0 - Foundation and execution control

| ID    | Objective                              | Output                                           | Dependencies | Owner role | Acceptance checks                                 | Skill mapping                              |
| ----- | -------------------------------------- | ------------------------------------------------ | ------------ | ---------- | ------------------------------------------------- | ------------------------------------------ |
| P0-01 | Lock MVP scope and acceptance baseline | Scope lock doc + acceptance checklist            | None         | BA         | In/out scope is explicit and consistent           | BA: acceptance-orchestrator, writing-plans |
| P0-02 | Lock module-driven architecture        | Architecture decision record + module boundaries | P0-01        | FE         | Clear boundaries, thin routes, explicit ownership | FE: nextjs-app-router-patterns             |
| P0-03 | Lock technical baseline                | Version matrix + quality gate policy             | P0-02        | FE         | Matches package.json, gates are explicit          | FE: react-nextjs-development               |
| P0-04 | Set workflow tracking                  | Milestone board + blocker protocol               | P0-01        | BA/PM      | Owner, blocker SLA, review cadence defined        | BA: technical-change-tracker               |

### P1 - Core MVP build

| ID    | Objective        | Output                              | Dependencies | Owner role | Acceptance checks                                      | Skill mapping                                    |
| ----- | ---------------- | ----------------------------------- | ------------ | ---------- | ------------------------------------------------------ | ------------------------------------------------ |
| P1-01 | Storefront core  | Home/PDP/search/filter at MVP level | P0-\*        | FE         | Browse journey is stable, Luxury Mega Menu implemented | FE: tailwind-patterns, ui-review                 |
| P1-02 | Auth core        | Register/login/forgot/reset         | P0-\*        | FE         | Auth flow works with basic guard                       | FE: zod-validation-expert                        |
| P1-03 | Cart core        | Add/update/remove + totals          | P1-01        | FE         | Cart behavior and totals are correct                   | FE: zustand-store-ts                             |
| P1-04 | COD checkout     | Checkout form + COD order placement | P1-02, P1-03 | FE + BE    | COD order succeeds, errors are handled                 | FE: tanstack-query-expert, BA: api-documentation |
| P1-05 | Order visibility | Confirmation + history + detail     | P1-04        | FE         | Users see accurate order data                          | FE: react-nextjs-development                     |
| P1-06 | Admin core       | Minimum product/order management    | P1-04        | FE/BE      | Order status transitions work                          | BA: architect-review                             |

### P2 - Hardening before release

| ID    | Objective                        | Output                                       | Dependencies | Owner role | Acceptance checks              | Skill mapping                      |
| ----- | -------------------------------- | -------------------------------------------- | ------------ | ---------- | ------------------------------ | ---------------------------------- |
| P2-01 | Test hardening                   | Unit/integration/e2e baseline for core flows | P1-\*        | QA + FE    | Core regression passes         | FE: systematic-debugging           |
| P2-02 | Performance and SEO baseline     | Metadata, image optimization, CWV baseline   | P1-\*        | FE         | Minimum performance KPIs met   | FE: web-performance-optimization   |
| P2-03 | Accessibility and UX consistency | A11y checklist + UI consistency fixes        | P1-\*        | FE + QA    | Main journey checklist passes  | FE: accessibility audit, ui-review |
| P2-04 | Observability readiness          | Sentry + error taxonomy + baseline alerts    | P1-\*        | FE         | Critical errors are observable | BA: analyze-project                |

### P3 - Post-MVP expansion

| ID    | Objective             | Output                                     | Dependencies | Owner role | Acceptance checks                 | Skill mapping                |
| ----- | --------------------- | ------------------------------------------ | ------------ | ---------- | --------------------------------- | ---------------------------- |
| P3-01 | Account enhancement   | Address book and advanced profile settings | P2-\*        | FE         | Extended account flow is stable   | FE: react-nextjs-development |
| P3-02 | Discovery enhancement | Advanced category hub/plp                  | P2-\*        | FE         | Search/discovery KPIs improve     | FE: tanstack-query-expert    |
| P3-03 | Retention features    | Basic wishlist                             | P2-\*        | FE         | Wishlist journey works end-to-end | FE: zustand-store-ts         |
| P3-04 | Growth pages          | Campaign/content pages                     | P2-\*        | FE/BA      | Marketing content is operational  | BA: wiki-page-writer         |

### Sequencing rules

1. Never skip P0.
2. Within same priority, execute lower-dependency items first.
3. Revenue-blocking items (checkout/order/admin) lead P1 order.
4. Do not start P3 until P2 release gate passes.

### Not now list (anti scope creep)

- Online payment gateways (VNPay/Momo/ZaloPay).
- Complex voucher engine.
- Real-time flash-sale engine.
- Multi-vendor marketplace.
- Advanced BI/reporting suite.

### Delivery readiness checklist (per priority)

- P0 done:
  - [ ] Scope locked
  - [x] Architecture locked
  - [x] Version baseline locked
  - [ ] Tracking protocol active
- P1 done:
  - [/] Core customer journeys run end-to-end (Mega Menu in progress)
  - [ ] Admin core can process live orders
- P2 done:
  - [ ] Core regression passes
  - [ ] SEO/performance/a11y baseline achieved
  - [ ] Monitoring works in production-like conditions

## Acceptance Criteria

- Backlog is strict-priority and implementation-ready.
- Every item has objective/output/dependency/owner/acceptance definition.
- BA/FE skill mapping is explicit per work cluster.
- Not-now list is present for scope control.

## Open Risks / Next Actions

Open risks:

- Priority drift from ad-hoc task switching.
- Insufficient real data for release hardening validation.

Next actions:

- [ ] Create execution board by P0/P1/P2/P3 plus gate status.
- [ ] Assign named owner for each backlog item.
- [ ] Define blocker SLA for critical path work.
- [ ] Revalidate not-now list on every change request.
