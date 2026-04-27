import { API } from '@/shared/constants/api-endpoints';
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

interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

function setSessionCookie(token: string): void {
  if (typeof document === 'undefined') return;
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `access_token=${token}; path=/; max-age=${maxAge.toString()}; SameSite=Lax`;
}

export function clearSessionCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
}

export async function loginAction(payload: LoginPayload): Promise<User> {
  const data = await http.post<AuthResponse>(API.AUTH.LOGIN, payload);
  useAuthStore.getState().setAccessToken(data.access);
  useAuthStore.getState().setUser(data.user);
  setSessionCookie(data.access);
  return data.user;
}

export async function registerAction(payload: RegisterPayload): Promise<User> {
  const data = await http.post<AuthResponse>(API.AUTH.REGISTER, payload);
  useAuthStore.getState().setAccessToken(data.access);
  useAuthStore.getState().setUser(data.user);
  setSessionCookie(data.access);
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

export function logoutAction(): void {
  useAuthStore.getState().clearAuth();
  clearSessionCookie();
}
