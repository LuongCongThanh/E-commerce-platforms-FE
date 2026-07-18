import { callAuthRoute } from '@/app/[locale]/(auth)/_lib/http/auth-route-client';
import { API } from '@/shared/constants/api-endpoints';
import type { User } from '@/shared/types/user';

type Listener = () => void;

export interface AuthSnapshot {
  token: string | null;
  user: User | null;
}

let snapshot: AuthSnapshot = { token: null, user: null };
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
  snapshot = { ...snapshot, user };
  notify();
}

export function clearAuth(): void {
  snapshot = { token: null, user: null };
  notify();
}

export async function refreshAccessToken(): Promise<string> {
  const data = await callAuthRoute<{ access: string }>(API.AUTH.REFRESH);

  setAccessToken(data.access);
  return data.access;
}
