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
