import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import { ApiError } from '@/shared/lib/errors/api-error';
import { getAccessToken, refreshAccessToken } from '@/shared/lib/http/api-auth';
import { captureError } from '@/shared/lib/monitoring/sentry';

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function resolveRefreshQueue(token: string): void {
  refreshQueue.forEach(resolve => {
    resolve(token);
  });
  refreshQueue = [];
}

export function normalizeError(error: unknown): ApiError {
  const axiosError = error as AxiosError<{
    message?: string;
    detail?: string;
    code?: string;
    details?: unknown;
  }>;

  const status = axiosError.response?.status ?? 500;
  const data = axiosError.response?.data;
  const rawMessage = data?.detail ?? data?.message ?? axiosError.message;
  const message = rawMessage !== '' ? rawMessage : 'Đã có lỗi xảy ra';

  if (status >= 500) {
    captureError(axiosError, { url: axiosError.config?.url, status });
  }

  return new ApiError({
    message,
    status,
    code: data?.code,
    details: (data?.details ?? data) as unknown,
  });
}

export function setupInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(config => {
    const token = getAccessToken();

    if (token !== null && config.headers.Authorization === undefined) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    response => response,
    async error => {
      const axiosError = error as AxiosError;
      const originalRequest = axiosError.config as AxiosRequestConfig & {
        _retry?: boolean;
        skipRefreshToken?: boolean;
      };

      if (axiosError.response?.status === 401 && originalRequest._retry !== true && originalRequest.skipRefreshToken !== true) {
        originalRequest._retry = true;

        if (isRefreshing) {
          const token = await new Promise<string>(resolve => {
            refreshQueue.push(resolve);
          });

          if (originalRequest.headers !== undefined) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

          return await client(originalRequest);
        }

        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          resolveRefreshQueue(newToken);

          if (originalRequest.headers !== undefined) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return await client(originalRequest);
        } catch (refreshError) {
          return await Promise.reject(normalizeError(refreshError));
        } finally {
          isRefreshing = false;
        }
      }

      return await Promise.reject(normalizeError(error));
    }
  );
}
