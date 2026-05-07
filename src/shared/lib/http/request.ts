import { ApiError } from '@/shared/lib/errors/api-error';
import { httpClient } from '@/shared/lib/http/client';
import type { ApiRequestConfig, ApiResponse } from '@/shared/lib/http/types';
import { validateResponse } from '@/shared/lib/http/validation';

async function request<TSchema>(config: ApiRequestConfig<TSchema>): Promise<TSchema> {
  const response = await httpClient.request<ApiResponse<TSchema>>(config);
  const payload = response.data.data;

  if (config.schema !== undefined) {
    return validateResponse(config.schema, payload);
  }

  return payload;
}

export const http = {
  get: <T>(url: string, params?: object) => request<T>({ url, method: 'GET', params }),
  post: <T>(url: string, body?: unknown) => request<T>({ url, method: 'POST', data: body }),
  put: <T>(url: string, body?: unknown) => request<T>({ url, method: 'PUT', data: body }),
  patch: <T>(url: string, body?: unknown) => request<T>({ url, method: 'PATCH', data: body }),
  delete: <T>(url: string) => request<T>({ url, method: 'DELETE' }),
};

// Dùng trong Server Components thay vì silent catch.
// Chỉ bắt ApiError (lỗi từ backend) — các lỗi bất ngờ khác vẫn được re-throw.
export async function withErrorBoundary<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('[ApiError]', { status: error.status, code: error.code, message: error.message });
      return fallback;
    }
    throw error;
  }
}
