import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/shared/stores/auth-store';

import { useAuth } from '@/shared/hooks/useAuth';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUser = { id: 1, email: 'user@test.com', name: 'User', is_staff: false };
const mockAdmin = { id: 2, email: 'admin@test.com', name: 'Admin', is_staff: true };

describe('useAuth', () => {
  beforeEach(() => {
    useAuthStore.setState({ accessToken: null, user: null });
    vi.clearAllMocks();
  });

  it('returns logged out state by default', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('updates auth state after login', () => {
    const { result } = renderHook(() => useAuth());

    act(() => result.current.login('token123', mockUser));

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user?.email).toBe('user@test.com');
  });

  it('returns admin flag from the current user', () => {
    const { result } = renderHook(() => useAuth());

    act(() => result.current.login('token123', mockAdmin));

    expect(result.current.isAdmin).toBe(true);
  });

  it('clears auth state and redirects on logout', () => {
    const { result } = renderHook(() => useAuth());

    act(() => result.current.login('token123', mockUser));
    act(() => result.current.logout());

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
