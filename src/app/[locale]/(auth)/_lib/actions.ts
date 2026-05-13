import { API } from '@/shared/constants/api-endpoints';
import { ApiError } from '@/shared/lib/errors/api-error';
import { http } from '@/shared/lib/http/methods';
import { useAuthStore } from '@/shared/stores/auth-store';
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
    const message = typeof json.message === 'string' ? json.message : 'Đã có lỗi xảy ra';
    throw new ApiError({ message, status: res.status });
  }

  return json as T;
}

export async function loginAction(payload: LoginPayload): Promise<User> {
  const data = await callAuthRoute<{ user: User; access: string }>('/api/auth/login', payload);
  useAuthStore.getState().setAccessToken(data.access);
  useAuthStore.getState().setUser(data.user);
  return data.user;
}

export async function registerAction(payload: RegisterPayload): Promise<User> {
  const data = await callAuthRoute<{ user: User; access: string }>('/api/auth/register', payload);
  useAuthStore.getState().setAccessToken(data.access);
  useAuthStore.getState().setUser(data.user);
  return data.user;
}

export async function forgotPasswordAction(email: string): Promise<void> {
  await http.post<unknown>(API.AUTH.FORGOT_PASSWORD, { email });
}

export async function resetPasswordAction(payload: { token: string; uid: string; password: string }): Promise<void> {
  await http.post<AuthToken>(API.AUTH.RESET_PASSWORD, {
    token: payload.token,
    uid: payload.uid,
    new_password1: payload.password,
    new_password2: payload.password,
  });
}

export async function logoutAction(): Promise<void> {
  useAuthStore.getState().clearAuth();
  await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
}
