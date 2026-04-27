import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

import type { User } from '@/shared/types/user';

interface AuthState {
  accessToken: string | null;
  user: User | null;
}

interface AuthActions {
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  subscribeWithSelector(
    persist(
      set => ({
        accessToken: null,
        user: null,
        setAccessToken: token => set({ accessToken: token }),
        setUser: user => set({ user }),
        clearAuth: () => set({ accessToken: null, user: null }),
      }),
      { name: 'auth-storage', partialize: state => ({ user: state.user }) }
    )
  )
);
