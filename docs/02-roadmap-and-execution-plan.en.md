# 02. Roadmap And Execution Plan (EN)

Last updated: 2026-04-24  
Source of truth: `01-mvp-overview.en.md`, current repository status, skill mapping priorities  
Owner: PM/BA Lead + Engineering Lead

## TOC

- [Purpose](#purpose)
- [Scope](#scope)
- [Decisions](#decisions)
- [Detailed Spec](#detailed-spec)
- [Acceptance Criteria](#acceptance-criteria)
- [Open Risks / Next Actions](#open-risks--next-actions)

## Summary Table

| Item              | Value                                       |
| ----------------- | ------------------------------------------- |
| Delivery model    | Phase-based with weekly checkpoints         |
| MVP window        | 4-6 weeks depending on execution capacity   |
| Core dependency   | API contract stability + QA gate discipline |
| Control mechanism | Milestone tracking + blocker protocol       |

## Purpose

This document translates MVP scope into an executable phase/sprint plan with explicit dependencies, quality gates, ownership, and progress tracking.

## Scope

Included:

- Phase roadmap: MVP, Post-MVP Phase 1, Phase 2, Later.
- Weekly/sprint execution plan for MVP.
- Entry/exit criteria and delivery gates.
- Risk register and mitigation plan.
- Simple RACI for BA/FE/QA/BE.
- Tracking model and blocker protocol.

Excluded:

- Code-level implementation details.
- Endpoint-level API wire contract definitions.

## Decisions

- Roadmap prioritizes real operational MVP outcomes first.
- Every phase enforces "quality before speed" gates.
- Scope does not expand until current phase exit criteria are met.
- Any unresolved blocker must be escalated within 24 hours.

## Detailed Spec

### Phase roadmap

1. MVP (Phase 0):
   - Outcomes: catalog + auth + cart + COD checkout + order visibility + admin core.
   - Timebox: 4-6 weeks.
2. Post-MVP Phase 1:
   - Outcomes: improved category/listing, account dashboard, address book.
3. Post-MVP Phase 2:
   - Outcomes: wishlist, admin optimization, quality/performance hardening.
4. Later:
   - Outcomes: campaign pages, content system, advanced growth features.

### MVP weekly execution plan

Week 1 - Foundation and contracts:

- Lock FE module-driven architecture and folder conventions.
- Finalize baseline API contracts (catalog/auth/order).
- Set up tracking dashboard and quality gates.

Week 2 - Core storefront and auth:

- Complete home/PDP/search/filter at MVP level.
- Complete register/login/forgot reset flow.
- Establish baseline tests (unit + smoke e2e).

Week 3 - Cart, checkout, order, admin core:

- Complete cart + COD checkout + order confirmation.
- Complete customer order history/detail.
- Complete admin core order status workflow.

Week 4 - Hardening and release readiness:

- Run regression across core journeys.
- Execute SEO/performance/accessibility checklist.
- Run production readiness review + launch checklist.

### Dependency map

- D1: API contracts must stabilize before FE form flow finalization.
- D2: Design tokens/conventions must stabilize before UI scaling.
- D3: Reliable test data is required before e2e regression.
- D4: Monitoring pipeline must be enabled before production smoke tests.

### Delivery gates (entry/exit criteria)

Gate A - Foundation complete:

- Entry: kickoff and locked MVP scope.
- Exit:
  - Architecture and conventions are approved.
  - API baseline contracts are reviewed.
  - CI passes lint/test/build.

Gate B - Feature complete:

- Entry: Gate A pass.
- Exit:
  - Core journeys pass end-to-end on staging.
  - BA acceptance is met per capability.
  - No high-severity blocker remains.

Gate C - Release ready:

- Entry: Gate B pass.
- Exit:
  - QA smoke + regression pass.
  - Monitoring and alerts are active.
  - Known issues are logged with explicit acceptance.

### Risk register and mitigation

| Risk               | Impact                | Likelihood | Mitigation                         | Owner      |
| ------------------ | --------------------- | ---------- | ---------------------------------- | ---------- |
| Scope creep        | Schedule slip         | High       | Change control + phased backlog    | BA Lead    |
| API contract churn | FE rework             | Medium     | Contract freeze per sprint         | FE/BE Lead |
| Test debt          | Production incidents  | Medium     | Mandatory quality gates            | QA Lead    |
| Resource overload  | Burnout, quality drop | Medium     | WIP limits + strict prioritization | PM         |

### RACI (simple)

| Workstream                     | BA  | FE  | QA  | BE  |
| ------------------------------ | --- | --- | --- | --- |
| Scope and acceptance           | A/R | C   | C   | C   |
| FE architecture and UI         | C   | A/R | C   | I   |
| API contract and behavior      | C   | C   | I   | A/R |
| Test strategy and verification | C   | C   | A/R | C   |
| Release readiness              | A   | R   | R   | R   |

Legend:

- A: Accountable
- R: Responsible
- C: Consulted
- I: Informed

### Tracking model and blocker protocol

- Tracking model:
  - Milestones by phase and weekly checkpoints.
  - Progress measured by deliverable completion + gate status.
  - Burn-down by strict priority backlog (P0-P3).
- Blocker protocol:
  1. Label issue as blocker immediately in tracker.
  2. Record impact, owner, and workaround ETA.
  3. Escalate within 24h if unresolved.
  4. Re-plan immediately if blocker affects critical path.

## Acceptance Criteria

- Roadmap defines clear phase outcomes.
- Execution plan includes dependencies, gates, RACI, and tracking model.
- No unresolved implementation-level decision remains for MVP planning.
- Risk and blocker management is actionable immediately.

## Open Risks / Next Actions

Open risks:

- Delayed API contract finalization.
- Underestimated effort on checkout/order edge cases.

Next actions:

- [ ] Assign gate owners and dates.
- [ ] Initialize tracking template with milestone/gate columns.
- [ ] Set recurring weekly risk/blocker review.
- [ ] Lock baseline QA checklist before feature-complete sprint.
