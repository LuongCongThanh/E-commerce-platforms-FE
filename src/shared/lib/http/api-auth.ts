import { useAuthStore } from '@/shared/stores/auth-store';
import type { User } from '@/shared/types/user';

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export function setAccessToken(token: string | null): void {
  if (token === null) {
    useAuthStore.getState().clearAuth();
  } else {
    useAuthStore.getState().setAccessToken(token);
  }
}

export function setUser(user: User): void {
  useAuthStore.getState().setUser(user);
}

export function clearAuth(): void {
  useAuthStore.getState().clearAuth();
}

export async function refreshAccessToken(): Promise<string> {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Unable to refresh token');
  }

  const data = (await res.json()) as { access: string };
  setAccessToken(data.access);
  return data.access;
}
