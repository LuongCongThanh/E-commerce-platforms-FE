# E-commerce Next.js Frontend

Frontend-first e-commerce platform for the Vietnam market — built on Next.js App Router with a module-driven architecture.

> **Full documentation lives in [`docs/`](./docs/).**

## Quick Start

```bash
npm install
npm run dev        # Dev server (Turbopack) → http://localhost:3000
```

## Commands

```bash
# Development
npm run dev             # Start dev server (Turbopack)
npm run build           # Production build
npm run start           # Start production server

# Code quality
npm run lint            # ESLint
npm run format          # Prettier (apply)
npm run format:check    # Prettier (check only)

# Testing
npm run test            # Vitest (run once)
npm run test:watch      # Vitest (watch mode)
npm run test:coverage   # Coverage — 70% threshold on shared/lib/** and shared/hooks/**
npm run test:e2e        # Playwright end-to-end

# Utilities
npm run analyze         # Bundle size analysis
```

## Tech Stack

| Layer            | Technology                                  |
| ---------------- | ------------------------------------------- |
| Framework        | Next.js 16.2.4 + React 19.2.4               |
| Styling          | Tailwind CSS 4 + CVA                        |
| Server state     | TanStack Query 5                            |
| Client state     | Zustand 5                                   |
| HTTP             | Axios 1.15 with centralized interceptors    |
| Forms            | React Hook Form 7 + Zod 4                   |
| i18n             | next-intl 4 (`vi` default, `en` secondary)  |
| Monitoring       | Sentry Next.js 10                           |
| Unit/integration | Vitest 4 + Testing Library                  |
| E2E              | Playwright 1.59                             |
| Quality tooling  | ESLint 9 + Prettier 3 + Husky + lint-staged |

## Architecture

### Routing

App Router under `src/app/[locale]/` with three route groups:

- `(shop)` — public storefront
- `(auth)` — login / register
- `(admin)` — protected admin panel

`middleware.ts` handles locale routing (next-intl) and server-side admin auth guard.

### Module-driven structure

```text
src/
  app/[locale]/         # Thin routes — orchestration only
  modules/              # Feature business logic
    shop/
    auth/
    checkout/
    orders/
    admin/
  shared/               # Cross-module reusables only
    components/ui/      # Radix primitive wrappers
    lib/http/           # Axios client + interceptors
    lib/errors/         # ApiError class
    lib/guards/         # AuthGuard client component
    stores/             # Zustand (auth-store, cart-store)
    types/              # Zod schemas + inferred TS types
    constants/          # API path constants
```

### Import convention — always use `@/*` alias

```ts
// WRONG — triggers ESLint error
import { Foo } from '../_lib/types';

// CORRECT
import { Foo } from '@/shared/lib/http/client';
```

## MVP Scope

**In scope:**

- Storefront: home, category discovery, product detail, search/filter
- Auth: register, login, forgot/reset password
- Cart and COD checkout with order confirmation
- Customer order history and order detail
- Admin: product CRUD + order status workflow
- Foundational NFRs: responsive UI, basic SEO, error tracking

**Out of scope (deferred):** online payment gateways, advanced loyalty/voucher engine, marketplace/multi-vendor, advanced BI dashboards.

## Delivery Phases

| Phase         | Outcomes                                                             |
| ------------- | -------------------------------------------------------------------- |
| MVP (Phase 0) | catalog + auth + cart + COD checkout + order visibility + admin core |
| Phase 1       | Improved listing, account dashboard, address book                    |
| Phase 2       | Wishlist, admin optimization, performance hardening                  |
| Later         | Campaign pages, content system, advanced growth features             |

## Quality Gates

**Merge gate** — all must pass before merging:

```bash
npm run lint
npm run test
npm run build
```

**Release gate** — additionally requires:

- Core journey e2e regression pass
- No unresolved high-severity issues
- Monitoring events for checkout/auth verified

## Documentation

| File                                                                                           | Contents                                            |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [01-mvp-overview](./docs/01-mvp-overview.en.md)                                                | Business scope, personas, KPIs, acceptance criteria |
| [02-roadmap-and-execution-plan](./docs/02-roadmap-and-execution-plan.en.md)                    | Phase plan, delivery gates, RACI, risk register     |
| [03-technical-stack](./docs/03-technical-stack-skills-and-versions.en.md)                      | Version matrix, skill matrix, decision log          |
| [04-project-structure](./docs/04-project-structure-guidelines-design-system-conventions.en.md) | Folder conventions, design system, coding standards |
| [05-priority-backlog](./docs/05-priority-implementation-backlog.en.md)                         | Prioritized implementation backlog                  |
