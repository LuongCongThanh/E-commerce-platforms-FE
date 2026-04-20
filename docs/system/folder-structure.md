# E-Commerce Frontend — Tài liệu tổng quan

> Stack: Next.js 16 · TypeScript · Tailwind v4 · TanStack Query · Zustand · Axios · Zod · RHF · Shadcn/UI · next-intl

---

## Tài liệu

| File                                               | Nội dung                                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [setup.md](./setup.md)                             | Lệnh cài thư viện, tạo folder, config file — **bắt đầu từ đây**                      |
| [architecture.md](./architecture.md)               | Cây thư mục, Auth Guard, Payment Flow, Data Flow, Loading/Error, .gitignore, PWA     |
| [design-system.md](./design-system.md)             | Brand Colors, Typography, Responsive, Shadcn/UI setup, TanStack Table                |
| [frontend-guidelines.md](./frontend-guidelines.md) | State Management rules, Auth Mutex, Testing Strategy, Monitoring, Naming Conventions |

---

## Cây thư mục nhanh

```
ecommerce-next/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/          # Login, Register, Forgot Password
│   │   │   │   ├── _components/ # UI components của auth
│   │   │   │   └── _lib/        # actions, hooks, schemas, types
│   │   │   ├── (shop)/          # Customer: products, cart, checkout, orders, profile
│   │   │   │   ├── _components/
│   │   │   │   └── _lib/
│   │   │   └── (admin)/         # Admin: dashboard, products, orders, users, categories
│   │   │       ├── _components/
│   │   │       └── _lib/
│   │   └── api/                 # Route Handlers → proxy Django + payment webhooks
│   ├── shared/
│   │   ├── components/          # ui/ (Shadcn), layouts/, skeletons/
│   │   ├── hooks/               # useDebounce, useLocalStorage, useMediaQuery
│   │   ├── lib/                 # http/, payment/, errors/, guards/, monitoring/, pwa/
│   │   ├── stores/              # cart-store, auth-store (Zustand)
│   │   ├── types/               # product, order, user, payment, api
│   │   └── constants/           # api-endpoints, payment-config, app-config
│   ├── __tests__/               # setup, helpers, integration tests
│   ├── i18n/                    # request config, routing helpers
│   └── lang/                    # en/, vi/, common.json, home.json...
├── public/
│   ├── icons/                   # PWA icons
│   └── manifest.json
├── middleware.ts                 # next-intl + /admin auth guard
└── next.config.ts                # withPWA + withBundleAnalyzer
```

---

## Nguyên tắc cốt lõi

```
Server state (API data)        → TanStack Query
Client-only state (cart, auth) → Zustand
Form state                     → React Hook Form
URL state (filter, page)       → useSearchParams
UI state cục bộ                → useState

shared/  không import từ feature
feature/ không import từ feature khác
page.tsx chỉ compose — không có business logic
```

## Naming quick sync

- Folder: `kebab-case`
- Component file: `PascalCase`
- Other file names: `kebab-case`
- Component name: `PascalCase`
- Hook file: `kebab-case` với tiền tố `use-`
- Store file: `kebab-case` với hậu tố `-store`
- Schema file: `kebab-case` với hậu tố `-schema` hoặc file gom `schemas.ts`
- Util file: `kebab-case` với hậu tố `-utils` hoặc file gom `utils.ts`
- Constant file: `kebab-case` với hậu tố `-config`, `-constants`, hoặc `-enum`
- New component và code TypeScript mới: ưu tiên arrow function
