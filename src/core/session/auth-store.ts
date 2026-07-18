import { callAuthRoute } from '@/core/session/auth-route-client';
import { API } from '@/shared/constants/api-endpoints';
import { http } from '@/shared/lib/http/client';
import type { User } from '@/shared/types/user';

type Listener = () => void;

export type AuthStatus = 'initializing' | 'authenticated' | 'anonymous';

export interface AuthSnapshot {
  token: string | null;
  user: User | null;
  status: AuthStatus;
}

let snapshot: AuthSnapshot = { token: null, user: null, status: 'initializing' };
const listeners = new Set<Listener>();

function notify(): void {
  listeners.forEach((listener) => {
    listener();
  });
}

export function subscribeAuth(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAuthSnapshot(): AuthSnapshot {
  return snapshot;
}

export function getAccessToken(): string | null {
  return snapshot.token;
}

export function setAccessToken(token: string | null): void {
  snapshot = { ...snapshot, token };
  notify();
}

export function setUser(user: User): void {
  snapshot = { ...snapshot, user, status: 'authenticated' };
  notify();
}

export function clearAuth(): void {
  snapshot = { token: null, user: null, status: 'anonymous' };
  notify();
}

export async function refreshAccessToken(): Promise<string> {
  const data = await callAuthRoute<{ access: string }>(API.AUTH.REFRESH);

  setAccessToken(data.access);
  return data.access;
}

// Chạy 1 lần lúc app mount (AuthRuntimeProvider) để phục hồi session sau F5 —
// refresh token httpOnly cookie vẫn còn nhưng access token trong memory đã mất.
export async function bootstrapAuth(): Promise<void> {
  try {
    await refreshAccessToken();
    const user = await http.get<User>(API.PROFILE.ME);
    setUser(user);
  } catch {
    clearAuth();
  }
}
