import { type AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

import { API } from '@/shared/constants/api-endpoints';
import { useAuthStore } from '@/shared/stores/auth-store';

import { httpClient } from '../client';
import { http } from '../methods';

let refreshPromise: Promise<string> | null = null;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

httpClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token != null && token.length > 0) {
    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

httpClient.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const original = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status === 401 && original != null && original._retry !== true) {
      original._retry = true;

      refreshPromise ??= http.post<string>(API.AUTH.REFRESH).finally(() => {
        refreshPromise = null;
      });

      try {
        const newToken = await refreshPromise;
        useAuthStore.getState().setAccessToken(newToken);
        original.headers = AxiosHeaders.from(original.headers);
        original.headers.set('Authorization', `Bearer ${newToken}`);
        return await httpClient(original);
      } catch {
        useAuthStore.getState().clearAuth();

        if (typeof window !== 'undefined') {
          window.location.href = '/vi/login';
        }
      }
    }

    return Promise.reject(error);
  }
);
