# Unit Test Report — `src/shared/`

> 📌 **Snapshot 20/05/2026** — báo cáo tại thời điểm; số liệu không còn đúng (coverage đo ngày 17/07/2026 chỉ ~32% — xem issue #10).

**Date:** 2026-05-20 &nbsp;·&nbsp; **Runner:** Vitest 4.1.4 &nbsp;·&nbsp; **Scope:** `src/shared/` — hooks · lib · stores

> **Result: ✅ 86 passed / 86 total — 16 test files**

---

## 1. Tổng quan

| #     | Module | Test File                   |  Tests | Status  |
| ----- | ------ | --------------------------- | -----: | ------- |
| 1     | hooks  | `useAuth.test.ts`           |      4 | ✅ pass |
| 2     | hooks  | `useCart.test.ts`           |      5 | ✅ pass |
| 3     | hooks  | `useDebounce.test.ts`       |      5 | ✅ pass |
| 4     | hooks  | `useLocalStorage.test.ts`   |      5 | ✅ pass |
| 5     | hooks  | `useMediaQuery.test.ts`     |      6 | ✅ pass |
| 6     | hooks  | `usePagination.test.ts`     |      3 | ✅ pass |
| 7     | hooks  | `useProductFilters.test.ts` |      6 | ✅ pass |
| 8     | hooks  | `useToast.test.ts`          |      1 | ✅ pass |
| 9     | lib    | `api-error.test.ts`         |      7 | ✅ pass |
| 10    | lib    | `cloudinary.test.ts`        |      7 | ✅ pass |
| 11    | lib    | `notification.test.ts`      |      2 | ✅ pass |
| 12    | lib    | `seo.test.ts`               |      7 | ✅ pass |
| 13    | lib    | `utils.test.ts`             |     13 | ✅ pass |
| 14    | lib    | `zod-helpers.test.ts`       |      4 | ✅ pass |
| 15    | stores | `auth-store.test.ts`        |      4 | ✅ pass |
| 16    | stores | `cart-store.test.ts`        |      7 | ✅ pass |
| **—** | **—**  | **Total**                   | **86** | **✅**  |

---

## 2. Chi tiết từng module

### 2.1 Hooks

#### `useAuth` — 4 tests

| #   | Test case                                 | Input / Scenario                       | Expected output                                     | Status |
| --- | ----------------------------------------- | -------------------------------------- | --------------------------------------------------- | ------ |
| 1   | returns logged out state by default       | Store khởi tạo với `accessToken: null` | `isLoggedIn = false`, `user = null`                 | ✅     |
| 2   | updates auth state after login            | Gọi `login('token123', mockUser)`      | `isLoggedIn = true`, `user.email = 'user@test.com'` | ✅     |
| 3   | returns admin flag from the current user  | Gọi `login()` với `role: 'admin'`      | `isAdmin = true`                                    | ✅     |
| 4   | clears auth state and redirects on logout | Gọi `logout()` sau khi đã login        | State reset, `router.push('/login')` được gọi       | ✅     |

#### `useCart` — 5 tests

| #   | Test case                                         | Input / Scenario          | Expected output                            | Status |
| --- | ------------------------------------------------- | ------------------------- | ------------------------------------------ | ------ |
| 1   | returns empty state when cart has no items        | Store trống               | `isEmpty = true`                           | ✅     |
| 2   | updates total and item count when items are added | Thêm 2 item khác nhau     | `total` và `itemCount` tính đúng           | ✅     |
| 3   | removes an item by variant id                     | `removeItem('v1')`        | Item bị xoá khỏi danh sách                 | ✅     |
| 4   | updates quantity for an existing item             | `updateQuantity('v1', 5)` | `items[0].quantity = 5`                    | ✅     |
| 5   | clears the entire cart                            | `clearCart()`             | `items = []`, `total = 0`, `itemCount = 0` | ✅     |

#### `useDebounce` — 5 tests

| #   | Test case                                      | Input / Scenario                                    | Expected output                                  | Status |
| --- | ---------------------------------------------- | --------------------------------------------------- | ------------------------------------------------ | ------ |
| 1   | returns the initial value immediately          | Render với value `'hello'`, delay `300`             | Giá trị trả về ngay là `'hello'`                 | ✅     |
| 2   | does not update value before delay elapses     | Thay đổi value, advance `100ms` trong delay `300ms` | Vẫn trả về giá trị cũ                            | ✅     |
| 3   | updates value after the delay elapses          | Thay đổi value, advance đủ `300ms`                  | Trả về giá trị mới                               | ✅     |
| 4   | resets the timer when value changes rapidly    | Thay đổi liên tiếp mỗi `200ms` trong delay `300ms`  | Timer reset, cập nhật sau `300ms` kể từ lần cuối | ✅     |
| 5   | uses 500ms default delay when none is provided | Không truyền tham số delay                          | Default là `500ms`                               | ✅     |

#### `useLocalStorage` — 5 tests

| #   | Test case                                                  | Input / Scenario                      | Expected output                            | Status |
| --- | ---------------------------------------------------------- | ------------------------------------- | ------------------------------------------ | ------ |
| 1   | returns the initial value when key is not set              | Key chưa tồn tại trong `localStorage` | Trả về `initialValue`                      | ✅     |
| 2   | reads an existing value from localStorage on mount         | Đã có value ở key trước khi mount     | Hydrate đúng giá trị đã lưu                | ✅     |
| 3   | persists a new value to localStorage when setter is called | Gọi setter với giá trị mới            | State cập nhật, `localStorage` ghi giá trị | ✅     |
| 4   | works with object values                                   | Setter nhận `{ name: 'Thanh' }`       | Serialize / deserialize đúng               | ✅     |
| 5   | falls back to initial value when stored JSON is malformed  | Key chứa chuỗi không hợp lệ           | Parse lỗi → trả `initialValue`             | ✅     |

#### `useMediaQuery` — 6 tests

| #   | Test case                                         | Input / Scenario                       | Expected output              | Status |
| --- | ------------------------------------------------- | -------------------------------------- | ---------------------------- | ------ |
| 1   | returns false when the media query does not match | `matchMedia` mock trả `matches: false` | Hook trả `false`             | ✅     |
| 2   | returns true when the media query matches         | `matchMedia` mock trả `matches: true`  | Hook trả `true`              | ✅     |
| 3   | updates when a change event fires                 | Gọi listener với `{ matches: true }`   | State cập nhật thành `true`  | ✅     |
| 4   | `useIsMobile` returns false by default            | `matchMedia` mock trả `false`          | `useIsMobile()` trả `false`  | ✅     |
| 5   | `useIsTablet` returns false by default            | `matchMedia` mock trả `false`          | `useIsTablet()` trả `false`  | ✅     |
| 6   | `useIsDesktop` returns false by default           | `matchMedia` mock trả `false`          | `useIsDesktop()` trả `false` | ✅     |

#### `usePagination` — 3 tests

| #   | Test case                                   | Input / Scenario                | Expected output                         | Status |
| --- | ------------------------------------------- | ------------------------------- | --------------------------------------- | ------ |
| 1   | starts at page 1 and calculates total pages | `count = 101`, `pageSize = 20`  | `page = 1`, `totalPages = 6`            | ✅     |
| 2   | clamps page to the valid range              | `setPage(999)` rồi `setPage(0)` | Clamp về max / min hợp lệ               | ✅     |
| 3   | exposes next and previous flags             | Page 1 và page cuối             | `hasPrev` / `hasNext` đúng tại boundary | ✅     |

#### `useProductFilters` — 6 tests

| #   | Test case                                  | Input / Scenario                              | Expected output                     | Status |
| --- | ------------------------------------------ | --------------------------------------------- | ----------------------------------- | ------ |
| 1   | starts with default pagination filters     | Khởi tạo không có args                        | `{ page: 1, pageSize: 20 }`         | ✅     |
| 2   | accepts initial overrides                  | Truyền `{ page: 2, category: 'ao' }`          | Filters phản ánh giá trị ban đầu    | ✅     |
| 3   | resets page when a non-page filter changes | `setFilter('search', 'áo')` khi đang ở page 3 | `page` reset về `1`                 | ✅     |
| 4   | keeps page when page is updated explicitly | `setFilter('page', 4)`                        | `page = 4`                          | ✅     |
| 5   | resets all filters to defaults             | `resetFilters()`                              | Trả về `{ page: 1, pageSize: 20 }`  | ✅     |
| 6   | serializes defined filters to query string | `toQueryString()` sau khi set `search`        | Chỉ include các field đã có giá trị | ✅     |

#### `useToast` — 1 test

| #   | Test case                               | Input / Scenario               | Expected output                                            | Status |
| --- | --------------------------------------- | ------------------------------ | ---------------------------------------------------------- | ------ |
| 1   | returns the shared notification helpers | `renderHook(() => useToast())` | Trả về đúng object `notify` từ `@/shared/lib/notification` | ✅     |

---

### 2.2 Lib

#### `ApiError` — 7 tests

| #   | Test case                                  | Input / Scenario                                | Expected output                         | Status |
| --- | ------------------------------------------ | ----------------------------------------------- | --------------------------------------- | ------ |
| 1   | is an instance of Error with name ApiError | `new ApiError({ message: '...', status: 500 })` | `instanceof Error`, `name = 'ApiError'` | ✅     |
| 2   | stores status, code, and details           | Constructor với đầy đủ fields                   | `status`, `code`, `details` lưu đúng    | ✅     |
| 3   | `isUnauthorized` for 401                   | `status: 401` và `status: 403`                  | `true` chỉ khi `401`                    | ✅     |
| 4   | `isForbidden` for 403                      | `status: 403` và `status: 401`                  | `true` chỉ khi `403`                    | ✅     |
| 5   | `isNotFound` for 404                       | `status: 404` và `status: 200`                  | `true` chỉ khi `404`                    | ✅     |
| 6   | `isValidation` for 400 and 422             | `status: 400`, `422`, `404`                     | `true` cho 400 và 422                   | ✅     |
| 7   | `isServerError` for 500 and above          | `status: 500`, `503`, `499`                     | `true` cho `>= 500`                     | ✅     |

#### `buildImageUrl` (Cloudinary) — 7 tests

| #   | Test case                                       | Input / Scenario                  | Expected output                 | Status |
| --- | ----------------------------------------------- | --------------------------------- | ------------------------------- | ------ |
| 1   | returns placeholder for empty publicId          | `publicId = ''`                   | `/images/placeholder.jpg`       | ✅     |
| 2   | builds URL with default transforms              | `publicId = 'products/shirt.jpg'` | URL chứa `f_auto,q_auto,c_fill` | ✅     |
| 3   | applies width when provided                     | Options `{ width: 400 }`          | URL chứa `w_400`                | ✅     |
| 4   | applies height when provided                    | Options `{ height: 300 }`         | URL chứa `h_300`                | ✅     |
| 5   | applies custom crop mode                        | Options `{ crop: 'thumb' }`       | URL chứa `c_thumb`              | ✅     |
| 6   | applies custom quality                          | Options `{ quality: 80 }`         | URL chứa `q_80`                 | ✅     |
| 7   | does not include width/height when not provided | Không truyền `width` / `height`   | URL không chứa `w_` hoặc `h_`   | ✅     |

#### `notify` (Notification) — 2 tests

| #   | Test case                                 | Input / Scenario                  | Expected output                           | Status |
| --- | ----------------------------------------- | --------------------------------- | ----------------------------------------- | ------ |
| 1   | delegates success notifications to sonner | `notify.success('Saved', 'Desc')` | `toast.success` được gọi đúng args        | ✅     |
| 2   | delegates dismiss calls to sonner         | `notify.dismiss('toast-id')`      | `toast.dismiss` được gọi với `'toast-id'` | ✅     |

#### `buildMetadata` (SEO) — 7 tests

| #   | Test case                                 | Input / Scenario                         | Expected output                                         | Status |
| --- | ----------------------------------------- | ---------------------------------------- | ------------------------------------------------------- | ------ |
| 1   | formats title with site name              | `{ title: 'Áo thun' }`                   | `meta.title = 'Ao thun - TestShop'`                     | ✅     |
| 2   | includes description when provided        | `{ title: '...', description: '...' }`   | `meta.description` được set                             | ✅     |
| 3   | sets canonical URL when url provided      | `{ title: '...', url: '/catalog' }`      | `alternates.canonical = 'https://testshop.com/catalog'` | ✅     |
| 4   | sets openGraph title                      | `{ title: 'Áo thun' }`                   | `og.title` khớp với formatted title                     | ✅     |
| 5   | includes OG image when provided           | `{ image: 'https://img.com/shirt.jpg' }` | `og.images` được định nghĩa                             | ✅     |
| 6   | sets noIndex robots when noIndex is true  | `{ noIndex: true }`                      | `robots = { index: false, follow: false }`              | ✅     |
| 7   | does not set robots when noIndex is false | `{ noIndex: false }` (default)           | `robots` là `undefined`                                 | ✅     |

#### `utils` — 13 tests

| #   | Suite                      | Test case                          | Input / Scenario                          | Expected output               | Status |
| --- | -------------------------- | ---------------------------------- | ----------------------------------------- | ----------------------------- | ------ |
| 1   | `buildQueryString`         | omits empty values                 | `{ search: 'ao', category: '', page: 1 }` | `'search=ao&page=1'`          | ✅     |
| 2   | `buildQueryString`         | keeps boolean values when provided | `{ inStock: false, page: 2 }`             | `'inStock=false&page=2'`      | ✅     |
| 3   | `parseSearchParams`        | parses supported filter params     | `'search=ao&page=2&inStock=true'`         | Object đầy đủ với đúng types  | ✅     |
| 4   | `parseSearchParams`        | treats "false" as false            | `'inStock=false'`                         | `inStock = false` (boolean)   | ✅     |
| 5   | `calculateDiscountPercent` | returns rounded discount percent   | `orig = 200000`, `disc = 150000`          | `25`                          | ✅     |
| 6   | `calculateDiscountPercent` | returns zero when no discount      | `orig = 100000`, `disc = 100000`          | `0`                           | ✅     |
| 7   | `truncateText`             | returns original when short        | `'ao thun'`, maxLength `20`               | `'ao thun'`                   | ✅     |
| 8   | `truncateText`             | truncates and appends ellipsis     | `'ao thun tay dai'`, maxLength `10`       | `'ao thun...'`                | ✅     |
| 9   | `order status helpers`     | returns translated status label    | `status = 'pending'`                      | `'Cho xac nhan'`              | ✅     |
| 10  | `order status helpers`     | returns fallback color for unknown | `status = 'unknown'`                      | `'bg-gray-100 text-gray-600'` | ✅     |
| 11  | `validateVietnamesePhone`  | accepts valid numbers              | `'0912345678'`                            | `true`                        | ✅     |
| 12  | `validateVietnamesePhone`  | rejects invalid numbers            | `'12345'`                                 | `false`                       | ✅     |
| 13  | `getDefaultPageSize`       | returns configured page size       | —                                         | `20`                          | ✅     |

#### `validateResponse` (Zod Helpers) — 4 tests

| #   | Test case                                         | Input / Scenario                       | Expected output                                            | Status |
| --- | ------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------- | ------ |
| 1   | returns parsed data when input matches the schema | `{ id: 1, name: 'Ao thun' }`           | Object trả về đúng                                         | ✅     |
| 2   | strips unknown fields not in the schema           | `{ id: 2, name: 'Quan', extra: true }` | `extra` bị loại bỏ                                         | ✅     |
| 3   | throws ApiError with status 500 when schema fails | `{ id: 'not-a-number', name: 'X' }`    | Throw `ApiError`                                           | ✅     |
| 4   | throws with INVALID_RESPONSE_SCHEMA code          | Input `null`                           | `err.code = 'INVALID_RESPONSE_SCHEMA'`, `err.status = 500` | ✅     |

---

### 2.3 Stores

#### `useAuthStore` — 4 tests

| #   | Test case                                  | Input / Scenario            | Expected output                     | Status |
| --- | ------------------------------------------ | --------------------------- | ----------------------------------- | ------ |
| 1   | starts with null token and user            | State khởi tạo              | `accessToken = null`, `user = null` | ✅     |
| 2   | stores the access token via setAccessToken | `setAccessToken('tok_abc')` | `accessToken = 'tok_abc'`           | ✅     |
| 3   | stores user data via setUser               | `setUser(mockUser)`         | `user.email = 'user@test.com'`      | ✅     |
| 4   | resets both token and user on clearAuth    | Set rồi gọi `clearAuth()`   | Cả hai về `null`                    | ✅     |

#### `useCartStore` — 7 tests

| #   | Test case                                              | Input / Scenario                           | Expected output                            | Status |
| --- | ------------------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------ |
| 1   | starts empty                                           | State khởi tạo                             | `items = []`, `total = 0`, `itemCount = 0` | ✅     |
| 2   | adds a new item and recalculates total and count       | `addToCart(itemA)` — price 100,000 × qty 1 | `total = 100000`, `itemCount = 1`          | ✅     |
| 3   | increments quantity when adding the same variant twice | `addToCart(itemA)` × 2 lần                 | Merge qty, không tạo entry mới             | ✅     |
| 4   | removes an item by variantId                           | `addToCart` 2 item, `removeCartItem('v1')` | Còn 1 item, total tính lại                 | ✅     |
| 5   | updates quantity for an existing item                  | `updateQuantity('v1', 5)`                  | `qty = 5`, `total` recalculate             | ✅     |
| 6   | clears the cart entirely                               | `addToCart` nhiều item, `clearCart()`      | Reset hoàn toàn                            | ✅     |
| 7   | totals multiple different items correctly              | itemA 100k×1 + itemB 200k×2                | `total = 500000`, `itemCount = 3`          | ✅     |

---

## 3. Phạm vi coverage

### Đã có unit test

| Path                                | Stmts% |       Branch% | Funcs% | Lines% | Ghi chú                                 |
| ----------------------------------- | -----: | ------------: | -----: | -----: | --------------------------------------- |
| `shared/hooks/useAuth.ts`           |   100% |          100% |   100% |   100% | Đầy đủ hành vi login / logout / isAdmin |
| `shared/hooks/useCart.ts`           |   100% |          100% |   100% |   100% | Đầy đủ CRUD cart                        |
| `shared/hooks/useDebounce.ts`       |   100% |          100% |   100% |   100% | Timing, default delay, timer reset      |
| `shared/hooks/useLocalStorage.ts`   |  90.9% |    **75%** ⚠️ |   100% |   100% | ⚠️ Branch 75%                           |
| `shared/hooks/useMediaQuery.ts`     | 90.47% |    **50%** ⚠️ |   100% |   100% | ⚠️ Branch 50%                           |
| `shared/hooks/usePagination.ts`     |   100% |          100% |   100% |   100% | Tính totalPages, clamp, flags           |
| `shared/hooks/useProductFilters.ts` |   100% |          100% |   100% |   100% | Defaults, page reset, serialization     |
| `shared/hooks/useToast.ts`          |   100% |          100% |   100% |   100% | Re-export notify                        |
| `shared/lib/errors/api-error.ts`    |   100% |          100% |   100% |   100% | Constructor, tất cả helpers             |
| `shared/lib/cloudinary.ts`          |   100% |        92.85% |   100% |   100% | URL builder, tất cả transform options   |
| `shared/lib/notification.ts`        |   100% |          100% |   100% |   100% | Delegation tới sonner                   |
| `shared/lib/seo.ts`                 |   100% | **85.71%** ⚠️ |   100% |   100% | Title, canonical, OG, noIndex           |
| `shared/lib/utils.ts`               |   100% | **89.65%** ⚠️ |   100% |   100% | Tất cả exported functions               |
| `shared/lib/http/zod-helpers.ts`    |   100% |          100% |   100% |   100% | Parse, strip, error contract            |
| `shared/hooks/useAuth.ts`           |   100% |          100% |   100% |   100% | Tất cả actions                          |
| `shared/hooks/useCart.ts`           |   100% |          100% |   100% |   100% | Tất cả actions + derived state          |

### Chưa có unit test (ngoài phạm vi shared lib)

| Path                              | Lý do                                                           |
| --------------------------------- | --------------------------------------------------------------- |
| `shared/lib/http/client.ts`       | Axios client + interceptors — cần integration test với API thật |
| `shared/lib/guards/AuthGuard.tsx` | Cần React tree đầy đủ — e2e scope                               |
| `shared/lib/query-client.ts`      | React Query config — kiểm tra qua integration                   |
| `shared/lib/env.ts`               | Zod env validation — kiểm tra tại build time                    |
