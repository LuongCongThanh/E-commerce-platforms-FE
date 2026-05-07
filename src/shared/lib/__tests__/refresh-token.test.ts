import axios from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { API } from '@/shared/constants/api-endpoints';
import { refreshAccessToken, setAccessToken } from '@/shared/lib/http/api-auth';
import { useAuthStore } from '@/shared/stores/auth-store';

vi.mock('axios');
vi.mock('@/shared/stores/auth-store', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      accessToken: null,
      user: null,
      setAccessToken: vi.fn(),
      setUser: vi.fn(),
      clearAuth: vi.fn(),
    })),
  },
}));

const mockedAxios = vi.mocked(axios);

afterEach(() => {
  vi.clearAllMocks();
});

describe('refreshAccessToken', () => {
  it('gọi đúng endpoint refresh', async () => {
    mockedAxios.post = vi.fn().mockResolvedValue({ data: { data: 'new-token-123' } });

    await refreshAccessToken();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining(API.AUTH.REFRESH),
      undefined,
      expect.objectContaining({ withCredentials: true })
    );
  });

  it('trả về token mới từ response', async () => {
    mockedAxios.post = vi.fn().mockResolvedValue({ data: { data: 'token-abc' } });

    const token = await refreshAccessToken();

    expect(token).toBe('token-abc');
  });

  it('gọi setAccessToken với token mới', async () => {
    const mockSetAccessToken = vi.fn();
    vi.mocked(useAuthStore.getState).mockReturnValue({
      accessToken: null,
      user: null,
      setAccessToken: mockSetAccessToken,
      setUser: vi.fn(),
      clearAuth: vi.fn(),
    });
    mockedAxios.post = vi.fn().mockResolvedValue({ data: { data: 'token-xyz' } });

    await refreshAccessToken();

    expect(mockSetAccessToken).toHaveBeenCalledWith('token-xyz');
  });

  it('throw khi backend trả lỗi', async () => {
    mockedAxios.post = vi.fn().mockRejectedValue(new Error('401 Unauthorized'));

    await expect(refreshAccessToken()).rejects.toThrow('401 Unauthorized');
  });
});

describe('setAccessToken', () => {
  it('gọi setAccessToken khi token không null', () => {
    const mockSet = vi.fn();
    vi.mocked(useAuthStore.getState).mockReturnValue({
      accessToken: null,
      user: null,
      setAccessToken: mockSet,
      setUser: vi.fn(),
      clearAuth: vi.fn(),
    });

    setAccessToken('my-token');

    expect(mockSet).toHaveBeenCalledWith('my-token');
  });

  it('gọi clearAuth khi token là null', () => {
    const mockClear = vi.fn();
    vi.mocked(useAuthStore.getState).mockReturnValue({
      accessToken: null,
      user: null,
      setAccessToken: vi.fn(),
      setUser: vi.fn(),
      clearAuth: mockClear,
    });

    setAccessToken(null);

    expect(mockClear).toHaveBeenCalled();
  });
});
