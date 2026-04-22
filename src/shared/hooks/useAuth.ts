'use client';

import { useRouter } from 'next/navigation';

import { ROUTES } from '@/shared/constants/routes';
import { useAuthStore } from '@/shared/stores/auth-store';

type AuthStoreState = ReturnType<typeof useAuthStore.getState>;
type AuthUser = NonNullable<AuthStoreState['user']>;

interface UseAuthResult {
  user: AuthStoreState['user'];
  accessToken: AuthStoreState['accessToken'];
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
}

export function useAuth(): UseAuthResult {
  const router = useRouter();
  const { user, accessToken, setAccessToken, setUser, clearAuth } = useAuthStore();

  const isLoggedIn = accessToken != null && accessToken.length > 0;
  const isAdmin = user?.is_staff ?? false;

  function login(token: string, userData: AuthUser): void {
    setAccessToken(token);
    setUser(userData);
  }

  function logout(): void {
    clearAuth();
    router.push(ROUTES.AUTH.LOGIN);
  }

  return {
    user,
    accessToken,
    isLoggedIn,
    isAdmin,
    login,
    logout,
  };
}
