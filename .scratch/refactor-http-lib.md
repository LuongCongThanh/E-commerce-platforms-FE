# Refactor: HTTP lib — cấu trúc rõ ràng, error handling chuẩn, fix bugs

**Labels:** `needs-triage`

---

## Problem Statement

Lớp HTTP (`shared/lib/http`) hiện tại có ba vấn đề chính từ góc nhìn của developer:

1. **Error handling khó debug**: `orders/page.tsx` catch lỗi im lặng (`catch { return [] }`) — khi API lỗi không có log, không có signal, developer không biết gì đã xảy ra. Không có pattern chuẩn cho error handling trong Server Components.

2. **Code lặp ở callers**: Không có helper chuẩn để phân loại lỗi (`isNotFound`, `isServerError`, v.v.) — callers phải tự check `error.status === 404` hoặc swallow error để tránh crash.

3. **Cấu trúc file không rõ ràng**: 6 file với trách nhiệm chồng chéo (`methods.ts` chỉ wrap `api-client.ts`, `api-client.ts` và `client.ts` chia logic không rõ ranh giới). Ngoài ra có bug: `refreshAccessToken` dùng raw `fetch` thay vì axios instance, khiến error từ refresh flow không được normalize qua `ApiError`.

---

## Solution

Refactor `shared/lib/http` thành cấu trúc file rõ ràng, mỗi file một trách nhiệm. Giữ nguyên pattern **throw `ApiError`** (tương thích React Query). Bổ sung:

- `ApiError` với đầy đủ helper methods để callers phân loại lỗi không cần check status code thủ công
- Một `withErrorBoundary` utility dùng trong Server Components thay vì silent catch
- Fix `refreshAccessToken` dùng axios với flag `skipRefreshToken` để tránh infinite loop
- Merge `methods.ts` + `api-client.ts` thành một module duy nhất
- Viết tests cho toàn bộ http module

---

## Commits

### Commit 1 — Rename và tổ chức lại file, không thay đổi logic

Rename các file để tên rõ nghĩa hơn:
- `api-types.ts` → `types.ts`
- `zod-helpers.ts` → `validation.ts`

Không thay đổi bất kỳ logic nào. Update tất cả import paths. Mục đích: tạo baseline sạch trước khi sửa logic.

### Commit 2 — Mở rộng `ApiError` với helper methods

Thêm các helper methods vào class `ApiError` hiện có:
- `isNotFound()` — true nếu status 404
- `isServerError()` — true nếu status >= 500
- `isConflict()` — true nếu status 409
- `isBadRequest()` — true nếu status 400

Các helpers `isUnauthorized()`, `isForbidden()`, `isValidation()` đã tồn tại — giữ nguyên. Không thay đổi constructor hay các field hiện có.

### Commit 3 — Fix bug: `refreshAccessToken` dùng axios thay vì `fetch`

Viết lại `refreshAccessToken` trong `auth.ts` (rename từ `api-auth.ts`) để dùng axios instance thay vì raw `fetch`. Thêm config `skipRefreshToken: true` vào request refresh để interceptor không trigger vòng lặp vô hạn. Điều này đảm bảo error từ refresh flow được normalize qua `normalizeError` giống các request thông thường.

### Commit 4 — Merge `methods.ts` + `api-client.ts` → `request.ts`

Gộp hai file thành một `request.ts` chứa:
- Hàm `request<T>()` nội bộ (core)
- Các hàm `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete` — không đổi interface

Xóa `methods.ts` và `api-client.ts`. Tạo `index.ts` export public API `http` object. Codebase vẫn hoạt động bình thường sau commit này.

### Commit 5 — Thêm `withErrorBoundary` utility cho Server Components

Tạo một helper `withErrorBoundary<T>(fn, fallback)` trong `request.ts`:
- Nhận một async function và một fallback value
- Nếu function throw `ApiError`, log error có cấu trúc (status, code, message) rồi trả về fallback
- Nếu throw error khác, re-throw (không swallow unexpected errors)

Refactor `orders/page.tsx` dùng `withErrorBoundary` thay vì `catch { return [] }`.

### Commit 6 — Di chuyển `normalizeError` và tách interceptors

Di chuyển `normalizeError` ra file riêng `interceptors.ts`. File này chứa cả setup request interceptor (auth token injection) và response interceptor (401 refresh + error normalize). `client.ts` chỉ còn tạo axios instance và gọi `setupInterceptors(httpClient)`. Không thay đổi behavior.

### Commit 7 — Tạo `index.ts` làm public API duy nhất

Tạo `index.ts` export:
- `http` — object với get/post/put/patch/delete
- `withErrorBoundary` — Server Component error handler
- `ApiRequestConfig` — type cho callers cần config nâng cao

Mọi import từ bên ngoài chỉ dùng `@/shared/lib/http` (không import sâu vào subfiles). Update 3 caller files.

### Commit 8 — Viết tests: core request + error normalization

Viết unit tests cho:
- `normalizeError` với nhiều loại AxiosError (401, 404, 422, 500, network error)
- `validateResponse` với schema hợp lệ và không hợp lệ
- `ApiError` helper methods (isNotFound, isServerError, v.v.)

Mock `httpClient` bằng `vi.mock`. Không test interceptor logic trực tiếp.

### Commit 9 — Viết tests: `withErrorBoundary`

Viết unit tests cho:
- `withErrorBoundary` trả về fallback khi `ApiError` 404/500
- `withErrorBoundary` re-throw khi error không phải `ApiError`
- `withErrorBoundary` trả về data khi success

### Commit 10 — Viết tests: `refreshAccessToken`

Viết unit tests cho:
- `refreshAccessToken` gọi đúng endpoint với `skipRefreshToken: true`
- `refreshAccessToken` throw `ApiError` khi backend trả lỗi
- `refreshAccessToken` gọi `setAccessToken` với token mới khi success

---

## Decision Document

**Modules sẽ thay đổi:**
- `shared/lib/http/` — toàn bộ (restructure + fix)
- `shared/lib/errors/api-error.ts` — thêm helper methods
- `app/[locale]/(shop)/orders/page.tsx` — dùng `withErrorBoundary`

**Modules KHÔNG thay đổi:**
- `shared/stores/auth-store` — không liên quan
- `shared/constants/api-endpoints` — không liên quan
- `shared/lib/monitoring/sentry` — vẫn dùng nguyên

**Quyết định kiến trúc:**
- Giữ pattern **throw `ApiError`** — không chuyển sang Result type. Lý do: callers dùng React Query, RQ expect throws. Đổi sang Result type sẽ phải unwrap ở mọi query function.
- `withErrorBoundary` chỉ dùng trong Server Components (RSC, page.tsx) — không dùng trong React Query query functions
- `refreshAccessToken` dùng axios với `skipRefreshToken: true` — tránh infinite loop khi 401 trong refresh flow
- Public API export qua `index.ts` — callers không import sâu vào subfiles, dễ refactor nội bộ sau này
- `ApiResponse<T>` giữ nguyên shape `{ data: T, message?, status? }` — backend contract không đổi

**Interface public API sau refactor:**
```ts
// Import
import { http, withErrorBoundary } from '@/shared/lib/http'

// Methods (không đổi từ caller's perspective)
http.get<T>(url, params?)
http.post<T>(url, body?)
http.put<T>(url, body?)
http.patch<T>(url, body?)
http.delete<T>(url)

// Mới — dùng trong Server Components
withErrorBoundary<T>(fn: () => Promise<T>, fallback: T): Promise<T>
```

---

## Testing Decisions

**Test tốt là test gì:**
Test chỉ verify external behavior qua public interface — không test implementation details (không test tên hàm nội bộ, không test thứ tự gọi hàm, không spy vào private methods). Test nên đọc như specification: "khi gọi X với input Y thì result là Z".

**Modules sẽ được test:**
- `ApiError` — helper methods
- `normalizeError` — behavior với các loại error khác nhau
- `validateResponse` — Zod validation pass/fail
- `withErrorBoundary` — fallback và re-throw behavior
- `refreshAccessToken` — axios call, token storage, error propagation

**Modules KHÔNG test:**
- Axios interceptors trực tiếp (quá coupled vào implementation)
- `httpClient` instance (integration concern, không phải unit)

**Prior art trong codebase:**
- `src/shared/lib/__tests__/seo.test.ts`
- `src/shared/lib/__tests__/cloudinary.test.ts`

Test framework: Vitest. Mock axios bằng `vi.mock('axios')`.

---

## Out of Scope

- Không thay đổi `ApiError` constructor hay field names hiện có — backward compat
- Không thay đổi shape `ApiResponse<T>` — backend contract
- Không migrate React Query hooks sang pattern mới — họ dùng throw, không cần đổi
- Không thêm retry logic cho các request thường (chỉ refresh token đã có retry)
- Không thêm request cancellation (AbortController)
- Không thêm request caching ngoài React Query

---

## Further Notes

Sau refactor, cấu trúc file cuối cùng:

```
src/shared/lib/http/
├── index.ts          ← public API duy nhất
├── client.ts         ← axios instance
├── auth.ts           ← token get/set/refresh (fix: dùng axios)
├── interceptors.ts   ← request + response interceptors
├── request.ts        ← core request + http object + withErrorBoundary
├── types.ts          ← ApiResponse, ApiRequestConfig, ApiMethod
└── validation.ts     ← validateResponse (Zod)
```

`gh` CLI chưa cài trên máy — issue này được lưu tại `.scratch/refactor-http-lib.md`. Khi cài `gh`, tạo issue bằng:

```bash
gh issue create \
  --title "refactor(http): cấu trúc rõ ràng, error handling chuẩn, fix refresh bug" \
  --body-file .scratch/refactor-http-lib.md \
  --label needs-triage
```
