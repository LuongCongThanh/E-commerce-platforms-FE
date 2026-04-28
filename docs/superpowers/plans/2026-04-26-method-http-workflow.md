````md
# Senior API Client Architecture [IMPLEMENTED]

## Goal

Build a production-ready API layer for Next.js using:

- Axios
- TypeScript strict type safety
- Zod runtime validation
- Refresh token handling
- Retry strategy
- React Query integration
- Auto API type generation

---

## Folder Structure

```txt
src/
  shared/
    lib/
      http/
        client.ts        (Axios instance)
        api-client.ts    (Shared wrappers)
        api-types.ts     (TS interfaces)
        api-auth.ts      (Token logic)
        zod-helpers.ts   (Validation utils)
        interceptors/    (Specific logic)
      errors/
        api-error.ts     (Error class)
        error-codes.ts   (Enum codes)

  modules/
    products/
      api/
        product.schema.ts
        product.api.ts
        product.query.ts
```
````

---

# 1. Core Types

```ts
// src/shared/lib/http/api-types.ts
import type { AxiosRequestConfig } from 'axios';
import type { ZodSchema } from 'zod';

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status?: number;
};

export type ApiRequestConfig<TSchema = unknown> = AxiosRequestConfig & {
  schema?: ZodSchema<TSchema>;
  skipAuth?: boolean;
  skipRefreshToken?: boolean;
  retry?: boolean;
};

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
```

---

# 2. API Error

```ts
// src/shared/lib/errors/api-error.ts
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(params: { message: string; status: number; code?: string; details?: unknown }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
  }
}
```

---

# 3. Axios Instance

```ts
// src/shared/lib/http/client.ts
import axios from 'axios';

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
```

---

# 4. Auth Token Helper

```ts
// src/shared/lib/http/api-auth.ts
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export async function refreshAccessToken(): Promise<string> {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Unable to refresh token');
  }

  const data = (await res.json()) as { accessToken: string };

  setAccessToken(data.accessToken);

  return data.accessToken;
}
```

---

# 5. Zod Helper

```ts
// src/shared/lib/http/zod-helpers.ts
import { ApiError } from '@/shared/lib/errors/api-error';
import type { ZodSchema } from 'zod';

export function validateResponse<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ApiError({
      message: 'Invalid API response shape',
      status: 500,
      code: 'INVALID_RESPONSE_SCHEMA',
      details: result.error.flatten(),
    });
  }

  return result.data;
}
```

---

# 6. API Client With Zod + Refresh Token

```ts
// src/shared/lib/http/api-client.ts
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { httpClient } from './client';
import { ApiError } from '@/shared/lib/errors/api-error';
import { getAccessToken, refreshAccessToken } from './api-auth';
import { validateResponse } from './zod-helpers';
import type { ApiRequestConfig, ApiResponse } from './api-types';

// NOTE: Refresh queue logic moved to client.ts for centralization

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function resolveRefreshQueue(token: string): void {
  refreshQueue.forEach(resolve => resolve(token));
  refreshQueue = [];
}

function normalizeError(error: unknown): ApiError {
  const axiosError = error as AxiosError<{
    message?: string;
    code?: string;
    details?: unknown;
  }>;

  return new ApiError({
    message: axiosError.response?.data?.message ?? axiosError.message ?? 'Unknown API error',
    status: axiosError.response?.status ?? 500,
    code: axiosError.response?.data?.code,
    details: axiosError.response?.data?.details,
  });
}

axiosInstance.interceptors.request.use(config => {
  const token = getAccessToken();

  if (token && !config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
      skipRefreshToken?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipRefreshToken) {
      originalRequest._retry = true;

      if (isRefreshing) {
        const token = await new Promise<string>(resolve => {
          refreshQueue.push(resolve);
        });

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token}`,
        };

        return axiosInstance(originalRequest);
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        resolveRefreshQueue(newToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return axiosInstance(originalRequest);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

async function request<TData, TSchema = TData>(config: ApiRequestConfig<TSchema>): Promise<TSchema> {
  const response = await axiosInstance.request<ApiResponse<TData>>(config);
  const payload = response.data.data;

  if (config.schema) {
    return validateResponse(config.schema, payload);
  }

  return payload as unknown as TSchema;
}

export function apiGet<TData, TSchema = TData>(url: string, config?: ApiRequestConfig<TSchema>): Promise<TSchema> {
  return request<TData, TSchema>({
    ...config,
    url,
    method: 'GET',
  });
}

export function apiPost<TData, TBody = unknown, TSchema = TData>(url: string, body?: TBody, config?: ApiRequestConfig<TSchema>): Promise<TSchema> {
  return request<TData, TSchema>({
    ...config,
    url,
    method: 'POST',
    data: body,
  });
}

export function apiPut<TData, TBody = unknown, TSchema = TData>(url: string, body?: TBody, config?: ApiRequestConfig<TSchema>): Promise<TSchema> {
  return request<TData, TSchema>({
    ...config,
    url,
    method: 'PUT',
    data: body,
  });
}

export function apiPatch<TData, TBody = unknown, TSchema = TData>(url: string, body?: TBody, config?: ApiRequestConfig<TSchema>): Promise<TSchema> {
  return request<TData, TSchema>({
    ...config,
    url,
    method: 'PATCH',
    data: body,
  });
}

export function apiDelete<TData, TSchema = TData>(url: string, config?: ApiRequestConfig<TSchema>): Promise<TSchema> {
  return request<TData, TSchema>({
    ...config,
    url,
    method: 'DELETE',
  });
}
```

---

# 7. React Query Client

```ts
// src/shared/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/shared/lib/errors/api-error';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          if (error.status >= 400 && error.status < 500) return false;
        }

        return failureCount < 2;
      },
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
      onError: error => {
        if (error instanceof ApiError) {
          toast.error(error.message);
        } else {
          toast.error('Đã có lỗi xảy ra');
        }
      },
    },
  },
});
```

---

# 8. React Query Provider

```tsx
// src/app/providers.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/query-client';

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

---

# 9. Domain Schema With Zod

```ts
// src/modules/products/api/product.schema.ts
import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  imageUrl: z.string().url().nullable(),
});

export const productListSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;
```

---

# 10. Domain API

```ts
// src/modules/products/api/product.api.ts
import { apiGet } from '@/shared/lib/http/api-client';
import { productListSchema, productSchema, type Product } from './product.schema';

export const productApi = {
  getProducts: () =>
    apiGet<Product[]>('/products', {
      schema: productListSchema,
    }),

  getProductBySlug: (slug: string) =>
    apiGet<Product>(`/products/${slug}`, {
      schema: productSchema,
    }),
};
```

---

# 11. React Query Hook

```ts
// src/modules/products/api/product.query.ts
import { useQuery } from '@tanstack/react-query';
import { productApi } from './product.api';

export const productQueryKeys = {
  all: ['products'] as const,
  list: () => [...productQueryKeys.all, 'list'] as const,
  detail: (slug: string) => [...productQueryKeys.all, 'detail', slug] as const,
};

export function useProductsQuery() {
  return useQuery({
    queryKey: productQueryKeys.list(),
    queryFn: productApi.getProducts,
  });
}

export function useProductDetailQuery(slug: string) {
  return useQuery({
    queryKey: productQueryKeys.detail(slug),
    queryFn: () => productApi.getProductBySlug(slug),
    enabled: Boolean(slug),
  });
}
```

---

# 12. Usage In Component

```tsx
'use client';

import { useProductsQuery } from '@/modules/products/api/product.query';

export function ProductList() {
  const { data, isLoading, error } = useProductsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Cannot load products.</p>;

  return (
    <ul>
      {data?.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

---

# 13. Auto API Type Generator

## Recommended tools

| Tool                 | Use case                                |
| -------------------- | --------------------------------------- |
| `openapi-typescript` | Generate TypeScript types from OpenAPI  |
| `orval`              | Generate API client + React Query hooks |
| `zodios`             | Type-safe API client with Zod           |
| `openapi-zod-client` | Generate Zod schemas from OpenAPI       |

---

## Option A: Generate Types Only

```bash
npm install -D openapi-typescript
```

```json
{
  "scripts": {
    "api:types": "openapi-typescript http://localhost:8000/openapi.json -o src/shared/api/generated/schema.ts"
  }
}
```

Usage:

```ts
import type { paths } from '@/shared/api/generated/schema';

type ProductListResponse = paths['/products']['get']['responses']['200']['content']['application/json'];
```

---

## Option B: Generate Client + React Query

```bash
npm install -D orval
```

```ts
// orval.config.ts
export default {
  api: {
    input: 'http://localhost:8000/openapi.json',
    output: {
      target: './src/shared/api/generated/api.ts',
      schemas: './src/shared/api/generated/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/shared/api/api-client.ts',
          name: 'customInstance',
        },
      },
    },
  },
};
```

Script:

```json
{
  "scripts": {
    "api:generate": "orval"
  }
}
```

---

# 14. Retry Strategy

## Rule

| Case     | Retry         |
| -------- | ------------- |
| `500`    | yes           |
| `502`    | yes           |
| `503`    | yes           |
| `504`    | yes           |
| `400`    | no            |
| `401`    | refresh token |
| `403`    | no            |
| `404`    | no            |
| mutation | no by default |

Retry nên đặt ở React Query thay vì Axios để tránh duplicate request khó kiểm soát.

---

# 15. Refresh Token Strategy

## Recommended flow

```txt
Request API
  ↓
Access token expired
  ↓
API returns 401
  ↓
Refresh token once
  ↓
Replay original request
  ↓
If refresh failed → logout
```

## Important rules

- Không refresh nhiều request cùng lúc
- Dùng queue để chờ token mới
- Refresh token nên nằm trong httpOnly cookie
- Access token có thể lưu memory
- Không lưu refresh token trong localStorage

---

# 16. Best Practices

| Rule                                   | Reason                  |
| -------------------------------------- | ----------------------- |
| API client không chứa business logic   | Dễ reuse                |
| Domain API không gọi Axios trực tiếp   | Dễ thay transport       |
| Component không gọi `apiGet` trực tiếp | Dễ test                 |
| Zod validate ở boundary                | Chặn response sai shape |
| React Query quản lý server state       | Cache tốt hơn           |
| Axios chỉ làm transport                | Trách nhiệm rõ ràng     |

---

# 17. Final Flow

```txt
Component
  ↓
React Query Hook
  ↓
Domain API
  ↓
Shared API Client
  ↓
Axios Instance
  ↓
Backend API
  ↓
Zod Validation
  ↓
Typed Data
```

---

# 18. Required Packages

```bash
npm install axios zod @tanstack/react-query
npm install -D openapi-typescript orval
```

---

# 19. Recommended Scripts

```json
{
  "scripts": {
    "api:types": "openapi-typescript http://localhost:8000/openapi.json -o src/shared/api/generated/schema.ts",
    "api:generate": "orval",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write"
  }
}
```

---

# 20. Conclusion

This setup is senior-level because it provides:

- Compile-time type safety
- Runtime response validation
- Centralized error handling
- Refresh token support
- Retry control
- React Query cache integration
- Future-ready OpenAPI generation

```

```
