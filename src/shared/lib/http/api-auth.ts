import type { User } from '@/shared/types/user';

type Listener = () => void;

export interface AuthSnapshot {
  token: string | null;
  user: User | null;
}

let _snapshot: AuthSnapshot = { token: null, user: null };
const _listeners = new Set<Listener>();

function notify(): void {
  _listeners.forEach(l => { l(); });
}

export function subscribeAuth(listener: Listener): () => void {
  _listeners.add(listener);
  return () => {
    _listeners.delete(listener);
  };
}

export function getAuthSnapshot(): AuthSnapshot {
  return _snapshot;
}

export function getAccessToken(): string | null {
  return _snapshot.token;
}

export function setAccessToken(token: string | null): void {
  _snapshot = { ..._snapshot, token };
  notify();
}

export function setUser(user: User): void {
  _snapshot = { ..._snapshot, user };
  notify();
}

export function clearAuth(): void {
  _snapshot = { token: null, user: null };
  notify();
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
