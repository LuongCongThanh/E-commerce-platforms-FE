# Testing Patterns

**Analysis Date:** 2026-05-13

## Test Framework

**Unit/Integration Runner:**

- Vitest (acts as Jest-compatible runner)
- Config: `vitest.config.ts`
- `@vitejs/plugin-react` for JSX transform

**Assertion Library:**

- Vitest built-in `expect` (Jest-compatible API)
- `@testing-library/jest-dom` for DOM matchers (imported in setup)

**E2E Runner:**

- Playwright
- Config: `playwright.config.ts`
- No E2E test files written yet (directory `e2e/` does not exist)

**Run Commands:**

```bash
npm run test              # Vitest (run once, all unit tests)
npm run test:watch        # Vitest (watch mode)
npm run test:coverage     # Coverage with v8 provider — 90% threshold on shared/lib/** and shared/hooks/**
npm run test:e2e          # Playwright end-to-end (no tests written yet)
npx vitest run src/path/to/file.test.ts  # Run single test file
```

## Test File Organization

**Location:**

- Tests are placed in `__tests__/` subdirectories co-located with the code they test
- Pattern: `src/shared/hooks/__tests__/useCart.test.ts` tests `src/shared/hooks/useCart.ts`
- Pattern: `src/shared/lib/__tests__/utils.test.ts` tests `src/shared/lib/utils.ts`

**Naming:**

- Unit/hook test files: `<moduleName>.test.ts` (no `.tsx` even for hook tests)
- Matching the source filename exactly (e.g., `useCart.ts` → `useCart.test.ts`)

**Glob Pattern** (Vitest includes):

```
src/**/__tests__/**/*.{test,spec}.{ts,tsx}
```

**Directory Structure:**

```
src/
  shared/
    hooks/
      __tests__/
        useAuth.test.ts
        useCart.test.ts
        usePagination.test.ts
        useProductFilters.test.ts
        useToast.test.ts
      useAuth.ts
      useCart.ts
    lib/
      __tests__/
        cloudinary.test.ts
        notification.test.ts
        seo.test.ts
        utils.test.ts
  __tests__/
    setup.ts          ← global setup file
```

## Test Structure

**Suite Organization:**

```typescript
import { describe, expect, it } from 'vitest';

describe('moduleName or functionName', () => {
  it('describes the expected behaviour in plain English', () => {
    // arrange → act → assert
    expect(result).toBe(expectedValue);
  });
});
```

**Hook Tests:**

```typescript
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

describe('useHookName', () => {
  beforeEach(() => {
    // Reset store state between tests
    useStoreName.setState({ key: initialValue });
  });

  it('describes expected behaviour', () => {
    const { result } = renderHook(() => useHookName());
    act(() => result.current.someAction(arg));
    expect(result.current.someValue).toBe(expected);
  });
});
```

**Patterns:**

- `beforeEach` — reset Zustand store state directly via `useStoreName.setState({...})` to ensure test isolation
- `act()` — wraps all state-mutation calls (Zustand actions via hook) in single-line form: `act(() => result.current.fn())`
- Descriptive `it()` names written as full behavioural sentences (no terse abbreviations)
- Pure utility tests use a flat `describe` per function with multiple `it` cases
- `vi.clearAllMocks()` called in `beforeEach` when mocks are set up

## Setup File

Location: `src/__tests__/setup.ts`

The global setup file (loaded via `setupFiles` in `vitest.config.ts`) provides:

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Auto-cleanup after every test
afterEach(() => {
  cleanup();
});

// Browser API stubs
Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn().mockImplementation(...) });
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
vi.stubGlobal('scrollTo', vi.fn());
```

## Mocking

**Framework:** Vitest's built-in `vi` (Jest-compatible)

**Module Mocking:**

```typescript
// Mock a module before imports (order matters)
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock with hoisted setup (for modules used before mock declaration)
const { toastMock } = vi.hoisted(() => ({
  toastMock: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));
vi.mock('sonner', () => ({ toast: toastMock }));

import { notify } from '@/shared/lib/notification'; // imported after vi.mock
```

**Function Mocks:**

```typescript
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));
```

**Environment Variable Stubs:**

```typescript
beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', 'testcloud');
  vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'TestShop');
  vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://testshop.com');
});
```

**Auto-reset:** Vitest config sets `clearMocks: true`, `restoreMocks: true`, `unstubEnvs: true`, `unstubGlobals: true` — all mocks are automatically reset between tests.

**What to Mock:**

- External modules with side effects (`sonner`, `next/navigation`)
- Environment variables via `vi.stubEnv()`
- Browser APIs not available in jsdom (already stubbed in `setup.ts` for `matchMedia`, `ResizeObserver`, `IntersectionObserver`, `scrollTo`)

**What NOT to Mock:**

- Zustand store state — reset directly via `useStoreName.setState({...})` instead
- Pure utility functions — test them directly

## Fixtures and Factories

**Test Data:**

```typescript
// Inline object literals at top of test file (module scope)
const mockUser = {
  id: 1,
  email: 'user@test.com',
  firstName: 'User',
  lastName: 'Test',
  avatar: null,
  role: 'customer' as const,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
};

const item1 = { variantId: 'v1', productId: 'p1', name: 'Áo', image: '/img.jpg', price: 100000, quantity: 1 };
```

**Location:**

- Fixtures are defined inline at the top of each test file — no shared fixture directory
- Use `as const` type assertion for literal union values (e.g., `role: 'admin' as const`)

## Coverage

**Provider:** V8 (`coverage.provider: 'v8'`)

**Reporters:** `text` (console), `lcov` (for CI tooling)

**Output Directory:** `./coverage/unit`

**Scope — only these paths are measured:**

- `src/shared/lib/**/*.{ts,tsx}`
- `src/shared/hooks/**/*.{ts,tsx}`

**Thresholds** (all four dimensions enforced at 90%):

```
lines:      90%
functions:  90%
branches:   90%
statements: 90%
```

Note: The CLAUDE.md mentions 70% threshold but `vitest.config.ts` enforces 90%. Config file is authoritative.

**View Coverage:**

```bash
npm run test:coverage
# Report at: ./coverage/unit/index.html (lcov) or printed to console (text)
```

## Test Types

**Unit Tests:**

- Scope: pure utility functions in `src/shared/lib/**`
- Approach: direct function calls with inline fixture values
- No rendering required
- Examples: `utils.test.ts`, `cloudinary.test.ts`, `seo.test.ts`, `notification.test.ts`

**Hook Tests (Integration):**

- Scope: custom hooks in `src/shared/hooks/**`
- Approach: `renderHook()` from `@testing-library/react`, state mutations via `act()`
- Zustand store state reset in `beforeEach` via `setState`
- Examples: `useCart.test.ts`, `useAuth.test.ts`, `usePagination.test.ts`, `useProductFilters.test.ts`

**E2E Tests:**

- Framework: Playwright (`playwright.config.ts`)
- Test directory: `./e2e/` (does not yet contain any test files)
- Browsers: Chromium, Firefox, WebKit
- Base URL: `http://127.0.0.1:3000` (or `PLAYWRIGHT_BASE_URL` env var)
- Dev server auto-started by Playwright webServer config

**Component Tests:** Not used — no component-level test files exist.

## Common Patterns

**Async Testing:**

```typescript
// Not yet observed in test files — hooks with async actions are tested
// by wrapping synchronous Zustand state mutations in act()
// For truly async flows, use standard async/await in it() callbacks
it('does async thing', async () => {
  await act(async () => { ... });
});
```

**Error Testing:**

```typescript
// Enum/union fallback (from utils.test.ts):
expect(getOrderStatusColor('unknown' as never)).toBe('bg-gray-100 text-gray-600');
```

**Boolean Assertions:**

```typescript
expect(result.current.isEmpty).toBe(true); // always .toBe(true/false), never .toBeTruthy()
expect(result.current.user).toBeNull(); // for null values
expect(result.current.items).toHaveLength(0); // for array length
```

**Structural Assertions:**

```typescript
expect(result.current.filters).toEqual({ page: 1, pageSize: 20 }); // deep equality
expect(queryString).toContain('search='); // substring checks
expect(url).not.toContain('w_'); // negation
```

## ESLint in Test Files

Test files have relaxed ESLint rules (defined in `eslint.config.mjs`):

- `@typescript-eslint/no-explicit-any: 'off'`
- `@typescript-eslint/strict-boolean-expressions: 'off'`
- `@typescript-eslint/no-non-null-assertion: 'off'`
- `no-console: 'off'`
- `react/no-array-index-key: 'off'`
- `import/no-restricted-paths: 'off'`
- Jest plugin rules applied as proxy for test hygiene (`jest: { version: 29 }`)

---

_Testing analysis: 2026-05-13_
