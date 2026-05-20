import { beforeEach, describe, expect, it } from 'vitest';

import { useAuthStore } from '@/shared/stores/auth-store';

const mockUser = {
  id: 1,
  email: 'user@test.com',
  firstName: 'User',
  lastName: 'Test',
  avatar: null,
  role: 'customer' as const,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ accessToken: null, user: null });
  });

  it('starts with null token and user', () => {
    const { accessToken, user } = useAuthStore.getState();

    expect(accessToken).toBeNull();
    expect(user).toBeNull();
  });

  it('stores the access token via setAccessToken', () => {
    useAuthStore.getState().setAccessToken('tok_abc');

    expect(useAuthStore.getState().accessToken).toBe('tok_abc');
  });

  it('stores user data via setUser', () => {
    useAuthStore.getState().setUser(mockUser);

    expect(useAuthStore.getState().user?.email).toBe('user@test.com');
  });

  it('resets both token and user on clearAuth', () => {
    useAuthStore.getState().setAccessToken('tok_abc');
    useAuthStore.getState().setUser(mockUser);

    useAuthStore.getState().clearAuth();

    const { accessToken, user } = useAuthStore.getState();
    expect(accessToken).toBeNull();
    expect(user).toBeNull();
  });
});
