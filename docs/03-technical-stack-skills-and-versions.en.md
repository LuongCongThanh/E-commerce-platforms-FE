# 03. Technical Stack, Skills And Versions (EN)

Last updated: 2026-04-24  
Source of truth: `package.json`, `skills-mapping.md` (legacy), engineering conventions in this document set  
Owner: FE Lead + BA Lead + Tech Lead

## TOC

- [Purpose](#purpose)
- [Scope](#scope)
- [Decisions](#decisions)
- [Detailed Spec](#detailed-spec)
- [Acceptance Criteria](#acceptance-criteria)
- [Open Risks / Next Actions](#open-risks--next-actions)

## Summary Table

| Item                | Value                              |
| ------------------- | ---------------------------------- |
| Framework core      | Next.js 16.2.4 + React 19.2.4      |
| State and data      | TanStack Query 5, Zustand 5, Axios |
| Form and validation | React Hook Form 7 + Zod 4          |
| Testing             | Vitest 4 + Playwright 1.59         |
| Monitoring          | Sentry Next.js 10.49               |

## Purpose

This document locks the official technical baseline: selected technologies, versions, rationale, BA/FE skill usage by phase, required quality gates, and chosen vs deferred technical decisions.

## Scope

Included:

- Version matrix sourced from current `package.json`.
- Layer-by-layer stack and rationale.
- BA/FE-focused skill matrix (must-have/nice-to-have) by phase.
- Mandatory quality gates: lint/test/build/e2e.
- Decision log for now vs later.

Excluded:

- Step-by-step installation instructions for each package.
- Full role matrix beyond BA and FE.

## Decisions

- If legacy docs conflict with versions, `package.json` wins.
- Prefer a lean stack that is sufficient for MVP and scalable later.
- BA/FE skill set is treated as an execution baseline, not optional guidance.
- Quality gates are minimum merge/release requirements.

## Detailed Spec

### Technical stack by layer

| Layer                  | Technology                                         | Why this choice                                                           |
| ---------------------- | -------------------------------------------------- | ------------------------------------------------------------------------- |
| App framework          | Next.js 16.2.4                                     | Stable App Router, strong fit for SSR/SEO and module-driven design        |
| UI runtime             | React 19.2.4, React DOM 19.2.4                     | Performance and ecosystem maturity                                        |
| Styling                | Tailwind CSS 4, tailwind-merge 3.5.0               | High UI delivery speed with utility-first consistency                     |
| Data fetching          | @tanstack/react-query 5.99.1                       | Consistent server-state and caching strategy                              |
| Client state           | Zustand 5.0.12                                     | Lightweight state for auth/cart/UI concerns                               |
| HTTP                   | Axios 1.15.0                                       | Centralized interceptors and error handling                               |
| Forms                  | React Hook Form 7.72.1 + @hookform/resolvers 5.2.2 | Strong form performance and clear validation integration                  |
| Validation             | Zod 4.3.6                                          | Type-safe schemas for FE contracts                                        |
| i18n                   | next-intl 4.9.1                                    | Structured localization support                                           |
| Monitoring             | @sentry/nextjs 10.49.0                             | Production error visibility                                               |
| Unit/integration tests | Vitest 4.1.4 + Testing Library                     | Fast and aligned with FE workflows                                        |
| E2E tests              | Playwright 1.59.1                                  | Reliable end-to-end flow verification                                     |
| Quality tooling        | ESLint 9.39.4 + Prettier 3.8.3 + Husky 9.1.7       | Enforced quality via `npm run format` (Prettier then ESLint) before merge |

### Selected version matrix

#### Runtime dependencies

| Package               | Version  |
| --------------------- | -------- |
| next                  | 16.2.4   |
| react                 | 19.2.4   |
| react-dom             | 19.2.4   |
| @tanstack/react-query | ^5.99.1  |
| @tanstack/react-table | ^8.21.3  |
| axios                 | ^1.15.0  |
| react-hook-form       | ^7.72.1  |
| zod                   | ^4.3.6   |
| zustand               | ^5.0.12  |
| tailwindcss           | ^4       |
| next-intl             | ^4.9.1   |
| @sentry/nextjs        | ^10.49.0 |
| @serwist/next         | ^9.5.7   |

#### Core dev dependencies

| Package            | Version |
| ------------------ | ------- |
| typescript         | ^5      |
| vitest             | ^4.1.4  |
| @playwright/test   | ^1.59.1 |
| eslint             | ^9.39.4 |
| prettier           | ^3.8.3  |
| husky              | ^9.1.7  |
| lint-staged        | ^16.4.0 |
| openapi-typescript | ^7.6.0  |
| orval              | ^7.4.1  |

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

#### Process & Tooling skills

Must-have:

- `concise-planning`
- `lint-and-validate`
- `git-pushing`

Nice-to-have:

- `kaizen`

#### FE skills

Must-have:

- `react-nextjs-development`
- `nextjs-app-router-patterns`
- `tailwind-patterns`
- `tanstack-query-expert`
- `zod-validation-expert`
- `zustand-store-ts`
- `ui-review`
- `form-cro`
- `seo-audit`

Nice-to-have:

- `web-performance-optimization`
- `accessibility-compliance-accessibility-audit`
- `fixing-motion-performance`
- `systematic-debugging`
- `frontend-design`

### Skill usage by phase

| Phase                   | BA focus skills                           | FE focus skills                                                                             | Tooling skills                |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------- |
| Planning and scope lock | acceptance-orchestrator, writing-plans    | nextjs-app-router-patterns, react-nextjs-development                                        | concise-planning, git-pushing |
| Core build              | api-documentation, architect-review       | tailwind-patterns, tanstack-query-expert, zod-validation-expert, zustand-store-ts, form-cro | lint-and-validate             |
| Hardening and release   | technical-change-tracker, analyze-project | ui-review, seo-audit, web-performance-optimization, accessibility audit, frontend-design    | kaizen, lint-and-validate     |

### Antigravity Skill Bundles — Project Fit Assessment

Mapping of Antigravity bundle skills to this e-commerce project. Each bundle is rated against current MVP scope.

| Bundle               | Rating     | Skills to use                                                                                    | Skills to skip                                                    | Reason                                                                                     |
| -------------------- | ---------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 🚀 Essentials        | ✅ Use all | `concise-planning`, `lint-and-validate`, `git-pushing`, `kaizen`                                 | —                                                                 | Baseline discipline for any solo/team project                                              |
| 🌐 Web Wizard        | ✅ Use all | `frontend-design`, `tailwind-patterns`, `form-cro`, `seo-audit`                                  | —                                                                 | Direct fit: Tailwind v4 + SSR + checkout forms + product SEO                               |
| 🐞 QA & Testing      | ✅ Use all | `test-driven-development`, `systematic-debugging`, `browser-automation`, `code-review-checklist` | `ab-test-setup`                                                   | Vitest + Playwright stack matches all skills except A/B (Phase 2)                          |
| 🖌️ Web Designer      | ⚠️ Partial | `ui-ux-pro-max`, `frontend-design`                                                               | `3d-web-experience`, `canvas-design`                              | Design system needed; 3D and static image tools irrelevant for e-commerce                  |
| 🌧️ DevOps & Cloud    | ⚠️ Partial | `docker-expert`, `environment-setup-guide`, `bash-linux`, `deployment-procedures`                | `aws-serverless`                                                  | Docker Compose + Vercel + Railway stack; no AWS Lambda needed at MVP                       |
| 📊 Data & Analytics  | ⚠️ Partial | `analytics-tracking`                                                                             | `d3-viz`, `ab-test-setup`                                         | GA4 + GTM is MVP scope; charts and A/B belong in Phase 2                                   |
| 🎨 Creative Director | ⚠️ Partial | `copy-editing`, `frontend-design`                                                                | `canvas-design`, `algorithmic-art`                                | Product copy quality matters; visual/generative art tools are irrelevant                   |
| 🛡️ Security Engineer | ⚠️ Partial | `ethical-hacking-methodology`, `burp-suite-testing`                                              | `linux-privilege-escalation`, `cloud-penetration-testing`         | Use for defensive OWASP review of auth/checkout only; server-level pentesting out of scope |
| 🦄 Startup Founder   | ⚠️ Partial | `landing-page-copy`                                                                              | `competitor-analysis`, `pitch-deck-creator`, `stripe-integration` | Product copy is useful; Stripe not used (COD + VNPAY); pitch deck not needed               |
| 🐍 Python Pro        | ❌ Skip    | —                                                                                                | All                                                               | This is the Next.js FE repo; Python/Django skills apply to backend repo only               |
| 🤖 Agent Architect   | ❌ Skip    | —                                                                                                | All                                                               | AI features are Phase 3+; no LLM/agent work in current MVP scope                           |
| 🎮 Indie Game Dev    | ❌ Skip    | —                                                                                                | All                                                               | Not relevant to e-commerce                                                                 |

### Technical quality gates

Merge gate requirements:

- `npm run format` must pass (enforces Prettier then ESLint).
- `npm run lint` must pass.
- `npm run test` must pass.
- `npm run build` must pass.
- Features touching core journey must include matching e2e coverage (`npm run test:e2e`).

Release gate requirements:

- Core journey regression suite passes.
- No unresolved high-severity issue without mitigation.
- Monitoring events for checkout/auth are verified.

### Decision log (chosen vs deferred)

Chosen now:

- COD-first checkout strategy.
- Module-driven FE architecture.
- Separation of server state (TanStack Query) and client state (Zustand).
- Mandatory minimum CI quality gates.

Deferred to later phases:

- Online payment gateway integrations.
- Advanced promotion engine.
- Full analytics/BI stack.
- Marketplace capabilities.

### API Client Architecture

| Layer                 | Responsibility                              | Tool                           |
| :-------------------- | :------------------------------------------ | :----------------------------- |
| **Domain API**        | Define specific endpoints and schemas       | `zod`, `api-client.ts`         |
| **Shared API Client** | Generic request handler with Zod validation | `api-client.ts`                |
| **Transport**         | Low-level HTTP requests and interceptors    | `axios`, `client.ts`           |
| **Auth Bridge**       | Manage tokens and refresh flow              | `api-auth.ts`, `auth-store.ts` |
| **Validation**        | Runtime response shape verification         | `zod`, `zod-helpers.ts`        |

**Flow**: Component → React Query Hook → Domain API → Shared API Client → Axios Instance → Backend → Zod Validation → Typed Data.

### Glossary (EN-VI sync)

| Term            | Meaning                                                 |
| --------------- | ------------------------------------------------------- |
| MVP             | Minimum viable release usable in real operations        |
| Thin routes     | Routes focus on wiring; business logic lives in modules |
| Quality gate    | Mandatory condition before merge/release                |
| Contract freeze | Temporary API interface lock within a cycle             |
| Scope creep     | Uncontrolled scope growth beyond approved plan          |

## Acceptance Criteria

- Version matrix matches current `package.json`.
- BA/FE skill matrix is phase-based and prioritized.
- Quality gates are actionable for merge and release.
- Decision log clearly separates now vs later decisions.

## Open Risks / Next Actions

Open risks:

- Package version drift without doc updates.
- Quality gates bypassed under deadline pressure.

Next actions:

- [ ] Add periodic version sync check against `package.json`.
- [ ] Add quality gate checklist into PR template.
- [ ] Revisit skill shortlist at phase boundaries.
- [ ] Extend glossary when introducing new terms.
