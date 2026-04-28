import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';

import { ApiError } from '@/shared/lib/errors/api-error';
import { getAccessToken, refreshAccessToken } from '@/shared/lib/http/api-auth';
import { captureError } from '@/shared/lib/monitoring/sentry';

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function resolveRefreshQueue(token: string): void {
  refreshQueue.forEach(resolve => {
    resolve(token);
  });
  refreshQueue = [];
}

function normalizeError(error: unknown): ApiError {
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

httpClient.interceptors.request.use(config => {
  const token = getAccessToken();

  if (token !== null && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
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

        return await httpClient(originalRequest);
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        resolveRefreshQueue(newToken);

        if (originalRequest.headers !== undefined) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return await httpClient(originalRequest);
      } catch (refreshError) {
        return await Promise.reject(normalizeError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    return await Promise.reject(normalizeError(error));
  }
);
