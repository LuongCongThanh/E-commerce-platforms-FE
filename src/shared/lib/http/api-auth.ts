import axios from 'axios';

import { API } from '@/shared/constants/api-endpoints';
import type { ApiResponse } from '@/shared/lib/http/types';
import { useAuthStore } from '@/shared/stores/auth-store';

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export function setAccessToken(token: string | null): void {
  if (token !== null) {
    useAuthStore.getState().setAccessToken(token);
  } else {
    useAuthStore.getState().clearAuth();
  }
}

// Dùng axios riêng (không qua httpClient) để tránh circular dependency
// và tránh trigger response interceptor (gây infinite loop khi 401).
// Error sẽ là AxiosError — interceptor trong client.ts normalize khi catch.
export async function refreshAccessToken(): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const response = await axios.post<ApiResponse<string>>(`${baseUrl}${API.AUTH.REFRESH}`, undefined, {
    withCredentials: true,
  });

  const newToken = response.data.data;
  setAccessToken(newToken);

  return newToken;
}
