'use client';

import { useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';

import { clearAuth, getAuthSnapshot, setAccessToken, setUser, subscribeAuth } from '@/core/session/auth-store';
import { ROUTES } from '@/shared/constants/routes';
import type { User } from '@/shared/types/user';

export function login(token: string, userData: User): void {
  setAccessToken(token);
  setUser(userData);
}

function useAuthSnapshot() {
  return useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthSnapshot);
}

export function useIsLoggedIn(): boolean {
  const { token } = useAuthSnapshot();
  return token != null && token.length > 0;
}

export function useAuth() {
  const router = useRouter();
  const { token, user } = useAuthSnapshot();

  const isLoggedIn = token != null && token.length > 0;
  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  function logout(): void {
    clearAuth();
    router.push(ROUTES.AUTH.LOGIN);
  }

  return {
    user,
    accessToken: token,
    isLoggedIn,
    isAdmin,
    login,
    logout,
  };
}
