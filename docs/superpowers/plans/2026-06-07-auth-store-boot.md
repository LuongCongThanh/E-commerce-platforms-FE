# Auth Store Boot — Session Hydration on Page Load Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the flash-of-logged-out state on hard reload by adding a `boot()` function to auth-store that hydrates user session from server cookies before the first render.

**Architecture:** Add `/api/auth/session` Next.js route that reads the `access_token` cookie and fetches the current user from Django. Add `boot()` to `auth-store.ts` — it calls this route and populates the store. `AuthRuntimeProvider` calls `boot()` on mount (before registering the HTTP adapter). No changes to forms or hooks.

**Tech Stack:** TypeScript, Next.js Route Handlers, Vitest.

---

## File Map

| Action | File                                                              |
| ------ | ----------------------------------------------------------------- |
| Create | `src/app/api/auth/session/route.ts`                               |
| Modify | `src/app/[locale]/(auth)/_lib/store/auth-store.ts`                |
| Modify | `src/app/[locale]/(auth)/_lib/components/AuthRuntimeProvider.tsx` |
| Create | `src/app/[locale]/(auth)/_lib/store/__tests__/auth-store.test.ts` |

---

### Task 1: Create `/api/auth/session` Next.js route

**Files:**

- Create: `src/app/api/auth/session/route.ts`

This route reads the `access_token` cookie and fetches user data from Django. If `access_token` is missing or invalid (401), it tries the `refresh_token` to get a fresh one. Returns `{ access, user }` or 401.

- [ ] **Step 1: Create the route file**

```ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { User } from '@/shared/types/user';

interface DjangoUserResponse {
  data: User;
}

interface DjangoRefreshResponse {
  data: string;
}

const DJANGO_URL = process.env.DJANGO_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const SECURE = process.env.NODE_ENV === 'production';

async function fetchUser(accessToken: string): Promise<User | null> {
  const res = await fetch(`${DJANGO_URL}/api/auth/me/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as DjangoUserResponse;
  return json.data;
}

async function refreshToken(refreshTokenValue: string): Promise<string | null> {
  const res = await fetch(`${DJANGO_URL}/api/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshTokenValue }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as DjangoRefreshResponse;
  return json.data;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  let accessToken = request.cookies.get('access_token')?.value ?? null;
  const refreshTokenValue = request.cookies.get('refresh_token')?.value ?? null;

  // Try current access token first
  if (accessToken !== null) {
    const user = await fetchUser(accessToken);
    if (user !== null) {
      return NextResponse.json<{ access: string; user: User }>({ access: accessToken, user });
    }
  }

  // Access token expired — try refresh
  if (refreshTokenValue !== null) {
    accessToken = await refreshToken(refreshTokenValue);
    if (accessToken !== null) {
      const user = await fetchUser(accessToken);
      if (user !== null) {
        const response = NextResponse.json<{ access: string; user: User }>({ access: accessToken, user });
        response.cookies.set('access_token', accessToken, {
          httpOnly: true,
          secure: SECURE,
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });
        return response;
      }
    }
  }

  return NextResponse.json({ message: 'Phiên đăng nhập đã hết hạn' }, { status: 401 });
}
```

- [ ] **Step 2: Verify file created at correct path**

```
dir "src\app\api\auth\session\route.ts"
```

---

### Task 2: Add `boot()` to auth-store

**Files:**

- Modify: `src/app/[locale]/(auth)/_lib/store/auth-store.ts`

- [ ] **Step 3: Write failing test for `boot()`**

Create `src/app/[locale]/(auth)/_lib/store/__tests__/auth-store.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { boot, clearAuth, getAuthSnapshot } from '@/app/[locale]/(auth)/_lib/store/auth-store';

const mockUser = {
  id: 1,
  email: 'a@b.com',
  firstName: 'A',
  lastName: 'B',
  avatar: null,
  role: 'customer' as const,
  isActive: true,
  createdAt: '2024-01-01',
};

beforeEach(() => {
  clearAuth();
  vi.resetAllMocks();
});

describe('boot()', () => {
  it('populates store when session endpoint returns user', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access: 'tok_boot', user: mockUser }),
    } as Response);

    await boot();

    expect(getAuthSnapshot().token).toBe('tok_boot');
    expect(getAuthSnapshot().user?.email).toBe('a@b.com');
  });

  it('leaves store empty when session endpoint returns 401', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Phiên đăng nhập đã hết hạn' }),
    } as Response);

    await boot();

    expect(getAuthSnapshot().token).toBeNull();
    expect(getAuthSnapshot().user).toBeNull();
  });

  it('leaves store empty when fetch throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network error'));

    await boot();

    expect(getAuthSnapshot().token).toBeNull();
  });
});
```

- [ ] **Step 4: Run test to confirm it fails**

```
npx vitest run "src/app/\[locale\]/\(auth\)/_lib/store/__tests__/auth-store.test.ts"
```

Expected: FAIL — `boot` is not exported from auth-store.

- [ ] **Step 5: Add `boot()` to `auth-store.ts`**

Append to `src/app/[locale]/(auth)/_lib/store/auth-store.ts`:

```ts
export async function boot(): Promise<void> {
  try {
    const res = await fetch('/api/auth/session', { credentials: 'include' });
    if (!res.ok) return;
    const data = (await res.json()) as { access: string; user: User };
    setAccessToken(data.access);
    setUser(data.user);
  } catch {
    // No session — stay logged out
  }
}
```

- [ ] **Step 6: Run test to confirm it passes**

```
npx vitest run "src/app/\[locale\]/\(auth\)/_lib/store/__tests__/auth-store.test.ts"
```

Expected: All 3 tests PASS.

---

### Task 3: Call `boot()` from `AuthRuntimeProvider`

**Files:**

- Modify: `src/app/[locale]/(auth)/_lib/components/AuthRuntimeProvider.tsx`

- [ ] **Step 7: Update `AuthRuntimeProvider.tsx`**

```tsx
'use client';

import { useEffect } from 'react';

import { boot, clearAuth, getAccessToken, refreshAccessToken } from '@/app/[locale]/(auth)/_lib/store/auth-store';
import { registerHttpRuntimeAdapter } from '@/shared/lib/http/runtime';

export function AuthRuntimeProvider({ children }: { readonly children: React.ReactNode }): React.JSX.Element {
  useEffect(() => {
    // Hydrate session from cookies on mount — eliminates flash-of-logged-out on hard reload
    void boot();

    return registerHttpRuntimeAdapter({
      getAccessToken,
      refreshAccessToken,
      onRefreshFailure: () => {
        clearAuth();
      },
    });
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 8: Run full test suite**

```
npm run test
```

Expected: All tests PASS.

- [ ] **Step 9: Run lint**

```
npm run lint
```

Expected: No errors.

- [ ] **Step 10: Commit**

```
git add src/app/api/auth/session/route.ts src/app/[locale]/\(auth\)/_lib/store/auth-store.ts src/app/[locale]/\(auth\)/_lib/store/__tests__/auth-store.test.ts src/app/[locale]/\(auth\)/_lib/components/AuthRuntimeProvider.tsx
git commit -m "feat(auth): add boot() to auth-store; hydrate session on page load via /api/auth/session"
```
