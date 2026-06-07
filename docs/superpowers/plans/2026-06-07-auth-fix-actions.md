# Auth Actions — Fix Error Parsing & Standardise Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix `callAuthRoute` to correctly parse Django error messages, and standardise `forgotPasswordAction` / `resetPasswordAction` to use the same helper as login/register.

**Architecture:** `callAuthRoute` is a thin `fetch` wrapper used by `loginAction` and `registerAction`. It currently reads `json.message` for errors but Django returns `json.detail`. Two other actions (`forgotPasswordAction`, `resetPasswordAction`) bypass `callAuthRoute` and call `http.post` — which adds an unnecessary auth-retry interceptor for these unauthenticated endpoints. Both issues are fixed by updating `callAuthRoute` and routing all auth actions through it.

**Tech Stack:** TypeScript, Vitest, `fetch` global (native Next.js).

---

## File Map

| Action | File                                                          |
| ------ | ------------------------------------------------------------- |
| Modify | `src/app/[locale]/(auth)/_lib/actions/auth.ts`                |
| Create | `src/app/[locale]/(auth)/_lib/actions/__tests__/auth.test.ts` |

---

### Task 1: Write failing tests for `callAuthRoute` error parsing

**Files:**

- Create: `src/app/[locale]/(auth)/_lib/actions/__tests__/auth.test.ts`

- [ ] **Step 1: Create the test file**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { forgotPasswordAction, loginAction } from '@/app/[locale]/(auth)/_lib/actions/auth';
import { ApiError } from '@/shared/lib/errors/api-error';

// Reset auth store between tests
beforeEach(async () => {
  const { clearAuth } = await import('@/app/[locale]/(auth)/_lib/store/auth-store');
  clearAuth();
  vi.resetAllMocks();
});

describe('loginAction', () => {
  it('throws ApiError with Django detail message on failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Thông tin đăng nhập không hợp lệ' }),
    } as Response);

    await expect(loginAction({ email: 'a@b.com', password: 'wrong' })).rejects.toMatchObject({
      message: 'Thông tin đăng nhập không hợp lệ',
      status: 401,
    });
  });

  it('falls back to json.message when detail is absent', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Email không hợp lệ' }),
    } as Response);

    await expect(loginAction({ email: 'bad', password: 'pw' })).rejects.toMatchObject({
      message: 'Email không hợp lệ',
      status: 400,
    });
  });

  it('falls back to generic message when neither detail nor message present', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    await expect(loginAction({ email: 'a@b.com', password: 'pw' })).rejects.toMatchObject({
      message: 'Đã có lỗi xảy ra',
      status: 500,
    });
  });

  it('sets access token and user in store on success', async () => {
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

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ user: mockUser, access: 'tok_123' }),
    } as Response);

    const { getAuthSnapshot } = await import('@/app/[locale]/(auth)/_lib/store/auth-store');
    await loginAction({ email: 'a@b.com', password: 'pw' });

    expect(getAuthSnapshot().token).toBe('tok_123');
    expect(getAuthSnapshot().user?.email).toBe('a@b.com');
  });
});

describe('forgotPasswordAction', () => {
  it('throws ApiError with Django detail message on failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Email không tồn tại' }),
    } as Response);

    await expect(forgotPasswordAction('x@x.com')).rejects.toMatchObject({
      message: 'Email không tồn tại',
      status: 400,
    });
  });

  it('resolves without error on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    } as Response);

    await expect(forgotPasswordAction('a@b.com')).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```
npx vitest run src/app/\[locale\]/\(auth\)/_lib/actions/__tests__/auth.test.ts
```

Expected: FAIL — `loginAction` error uses `json.message` not `json.detail`; `forgotPasswordAction` uses `http.post` (not `fetch`), so the mock doesn't intercept it.

---

### Task 2: Fix `callAuthRoute` and standardise all actions

**Files:**

- Modify: `src/app/[locale]/(auth)/_lib/actions/auth.ts`

- [ ] **Step 3: Update `actions/auth.ts`**

Replace the full file content with:

```ts
import { clearAuth, setAccessToken, setUser } from '@/app/[locale]/(auth)/_lib/store/auth-store';
import { API } from '@/shared/constants/api-endpoints';
import { ApiError } from '@/shared/lib/errors/api-error';
import type { AuthToken, User } from '@/shared/types/user';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

async function callAuthRoute<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as Record<string, unknown>;

  if (!res.ok) {
    // Django uses `detail`; fallback to `message`; then generic
    const message =
      (typeof json.detail === 'string' ? json.detail : null) ?? (typeof json.message === 'string' ? json.message : null) ?? 'Đã có lỗi xảy ra';
    throw new ApiError({ message, status: res.status });
  }

  return json as T;
}

export async function loginAction(payload: LoginPayload): Promise<User> {
  const data = await callAuthRoute<{ user: User; access: string }>(API.AUTH.LOGIN, payload);
  setAccessToken(data.access);
  setUser(data.user);
  return data.user;
}

export async function registerAction(payload: RegisterPayload): Promise<User> {
  const data = await callAuthRoute<{ user: User; access: string }>(API.AUTH.REGISTER, payload);
  setAccessToken(data.access);
  setUser(data.user);
  return data.user;
}

export async function forgotPasswordAction(email: string): Promise<void> {
  await callAuthRoute<unknown>(API.AUTH.FORGOT_PASSWORD, { email });
}

export async function resetPasswordAction(payload: { token: string; uid: string; password: string }): Promise<void> {
  await callAuthRoute<AuthToken>(API.AUTH.RESET_PASSWORD, {
    token: payload.token,
    uid: payload.uid,
    new_password1: payload.password,
    new_password2: payload.password,
  });
}

export async function logoutAction(): Promise<void> {
  clearAuth();
  await fetch(API.AUTH.LOGOUT, { method: 'POST' }).catch(() => undefined);
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```
npx vitest run src/app/\[locale\]/\(auth\)/_lib/actions/__tests__/auth.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Run full test suite to check for regressions**

```
npm run test
```

Expected: All tests PASS.

- [ ] **Step 6: Run lint**

```
npm run lint
```

Expected: No errors.

- [ ] **Step 7: Commit**

```
git add src/app/[locale]/\(auth\)/_lib/actions/auth.ts src/app/[locale]/\(auth\)/_lib/actions/__tests__/auth.test.ts
git commit -m "fix(auth): check django detail field in callAuthRoute; standardise forgotPassword/resetPassword"
```
