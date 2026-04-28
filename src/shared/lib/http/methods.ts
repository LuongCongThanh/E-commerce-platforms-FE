import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '@/shared/lib/http/api-client';

export const http = {
  get: <T>(url: string, params?: object) => apiGet<T>(url, { params }),

  post: <T>(url: string, body?: unknown) => apiPost<T>(url, body),

  put: <T>(url: string, body?: unknown) => apiPut<T>(url, body),

  patch: <T>(url: string, body?: unknown) => apiPatch<T>(url, body),

  delete: <T>(url: string) => apiDelete<T>(url),
};
