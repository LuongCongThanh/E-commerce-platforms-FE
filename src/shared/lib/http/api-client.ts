import type { ApiRequestConfig, ApiResponse } from '@/shared/lib/http/api-types';
import { httpClient } from '@/shared/lib/http/client';
import { validateResponse } from '@/shared/lib/http/zod-helpers';

async function request<TSchema>(config: ApiRequestConfig<TSchema>): Promise<TSchema> {
  const response = await httpClient.request<ApiResponse<TSchema>>(config);
  const payload = response.data.data;

  if (config.schema !== undefined) {
    return validateResponse(config.schema, payload);
  }

  return payload;
}

export function apiGet<TSchema = unknown>(url: string, config?: ApiRequestConfig<TSchema>): Promise<TSchema> {
  return request<TSchema>({
    ...config,
    url,
    method: 'GET',
  });
}

export function apiPost<TSchema = unknown>(url: string, body?: unknown, config?: ApiRequestConfig<TSchema>): Promise<TSchema> {
  return request<TSchema>({
    ...config,
    url,
    method: 'POST',
    data: body,
  });
}

export function apiPut<TSchema = unknown>(url: string, body?: unknown, config?: ApiRequestConfig<TSchema>): Promise<TSchema> {
  return request<TSchema>({
    ...config,
    url,
    method: 'PUT',
    data: body,
  });
}

export function apiPatch<TSchema = unknown>(url: string, body?: unknown, config?: ApiRequestConfig<TSchema>): Promise<TSchema> {
  return request<TSchema>({
    ...config,
    url,
    method: 'PATCH',
    data: body,
  });
}

export function apiDelete<TSchema = unknown>(url: string, config?: ApiRequestConfig<TSchema>): Promise<TSchema> {
  return request<TSchema>({
    ...config,
    url,
    method: 'DELETE',
  });
}
