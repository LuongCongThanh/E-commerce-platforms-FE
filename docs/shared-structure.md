# Shared Structure

Last updated: 2026-06-07  
Source of truth: current `src/shared/` structure + module boundary rules in `docs/04-project-structure-guidelines-design-system-conventions.vi.md`  
Owner: FE team

## Purpose

Tài liệu này định nghĩa lại vai trò và cấu trúc chuẩn của `src/shared/`.

`shared` không phải là nơi chứa "mọi thứ chưa biết để đâu".
`shared` chỉ chứa phần dùng chung thật sự cho nhiều module hoặc nhiều route group.

## Core rule

Một file chỉ được nằm trong `src/shared/` khi thỏa cả 2 điều kiện:

1. Nó không mang business rule riêng của một module.
2. Nó đã được dùng thực tế bởi ít nhất 2 module, hoặc ít nhất 2 page/flow độc lập.

Nếu một file chỉ phục vụ `(auth)`, `(shop)`, hoặc `(admin)`, file đó phải nằm trong `_lib/` của module tương ứng.

## Ownership rules

### Được phép ở `shared`

- UI primitives dùng toàn app
- generic UI states như loading, empty, error
- cross-module utilities
- HTTP foundation không phụ thuộc module cụ thể
- shared constants thực sự ổn định toàn app
- shared domain types/schema dùng ở nhiều module
- generic UI component đã được chứng minh reuse ở ít nhất 2 module hoặc 2 page/flow độc lập

### Không được phép ở `shared`

- auth state/store/hook/guard
- cart logic nếu chỉ phục vụ shop
- navigation data nếu chỉ phục vụ storefront
- payment provider wiring nếu chỉ phục vụ checkout/shop flow
- feature queries/actions/components chỉ dùng cho một route group
- copy, schema, state, side effects đặc thù của một module

## Naming convention

- Component export: `PascalCase`
- Component file: giữ nhất quán theo nhóm; với shared component hiện tại đang dùng chủ yếu `PascalCase.tsx`
- Hook file: `useCamelCase.ts`
- Utility file: `camelCase.ts`
- Constants file: `camelCase.ts`
- Types/schema file: `camelCase.ts`

Ví dụ đúng theo quyết định hiện tại:

- `useDebounce.ts`
- `appConfig.ts`
- `queryKeys.ts`
- `apiEndpoints.ts`
- `apiError.ts`
- `errorCodes.ts`
- `zodHelpers.ts`

## Current tree and file purposes

```text
src/shared/
│
├── components/
│   │
│   ├── base/                              # Design-system primitives dùng toàn app
│   │   ├── accordion.tsx                  # Accordion wrapper từ Radix
│   │   ├── Alert.tsx                      # Alert shell theo variant
│   │   ├── Avatar.tsx                     # Avatar + fallback wrapper
│   │   ├── Badge.tsx                      # Badge primitive theo variant
│   │   ├── breadcrumb.tsx                 # Breadcrumb primitive
│   │   ├── Button.tsx                     # Button primitive
│   │   ├── Card.tsx                       # Card primitive
│   │   ├── Checkbox.tsx                   # Checkbox primitive
│   │   ├── Command.tsx                    # Command palette / searchable menu primitive
│   │   ├── Dialog.tsx                     # Dialog primitive
│   │   ├── DropdownMenu.tsx               # Dropdown menu primitive
│   │   ├── Form.tsx                       # React Hook Form helpers / field wrappers
│   │   ├── Input.tsx                      # Input primitive
│   │   ├── Label.tsx                      # Label primitive
│   │   ├── Popover.tsx                    # Popover primitive
│   │   ├── progress.tsx                   # Progress primitive
│   │   ├── radio-group.tsx                # Radio group primitive
│   │   ├── ScrollArea.tsx                 # Scroll container primitive
│   │   ├── Select.tsx                     # Select primitive
│   │   ├── Separator.tsx                  # Separator primitive
│   │   ├── Sheet.tsx                      # Drawer / sheet primitive
│   │   ├── Skeleton.tsx                   # Base skeleton block
│   │   ├── slider.tsx                     # Slider primitive
│   │   ├── switch.tsx                     # Switch primitive
│   │   ├── Table.tsx                      # Table primitive
│   │   ├── tabs.tsx                       # Tabs primitive
│   │   ├── Textarea.tsx                   # Textarea primitive
│   │   └── Tooltip.tsx                    # Tooltip primitive
│   │
│   ├── common/                            # Generic shared UI states / inputs / display
│   │   ├── EmptyState.tsx                 # Empty state dùng cho màn hình không có dữ liệu
│   │   ├── ErrorState.tsx                 # Error state cho route error/loading fallback
│   │   ├── LoadingSpinner.tsx             # Spinner tái sử dụng cho button / section / page
│   │   ├── PageLoader.tsx                 # Loader toàn trang
│   │   ├── PaginationNav.tsx              # Điều hướng phân trang generic, giữ lại vì dự kiến dùng đa module
│   │   ├── SearchInput.tsx                # Search input có debounce callback, giữ lại vì dự kiến dùng đa module
│   │   └── __tests__/                     # Unit tests cho nhóm common
│
├── constants/
│   ├── api-endpoints.ts                   # Map endpoint FE dùng để gọi Next API / backend proxy
│   ├── app-config.ts                      # App config chung: page size, label map, sort options
│   ├── query-keys.ts                      # Query keys chuẩn cho React Query
│   └── routes.ts                          # Route fragments dùng để build link/redirect
│
├── hooks/
│   ├── useDebounce.ts                     # Debounce generic cho input/state
│   ├── useLocalStorage.ts                 # Đồng bộ state với localStorage
│   ├── useMediaQuery.ts                   # Match media query + helpers mobile/tablet/desktop
│   ├── usePagination.ts                   # Tính total pages và clamp page
│   ├── useToast.ts                        # Wrapper hook cho sonner toast
│   └── __tests__/                         # Unit tests cho shared hooks
│
├── lib/
│   ├── cloudinary.ts                      # Build Cloudinary image URL
│   ├── env.ts                             # Parse và validate env bằng Zod
│   ├── notification.ts                    # notify helper bọc toast API
│   ├── query-client.ts                    # Tạo QueryClient và chuẩn hóa retry/toast behavior
│   ├── seo.ts                             # Build Next Metadata object
│   ├── utils.ts                           # Utility functions: cn, currency, date, query string...
│   │
│   ├── errors/
│   │   ├── api-error.ts                   # ApiError class chuẩn hóa lỗi HTTP/API
│   │   └── error-codes.ts                 # Error code constants
│   │
│   ├── http/
│   │   ├── api-types.ts                   # Shared HTTP response/request typings
│   │   ├── client.ts                      # Axios client chung + interceptors + error normalization
│   │   ├── runtime.ts                     # Runtime adapter để module-specific auth đăng ký token/refresh
│   │   └── zod-helpers.ts                 # Validate API response bằng Zod
│   │
│   ├── monitoring/
│   │   └── sentry.ts                      # Capture error/message vào Sentry
│   │
│   └── __tests__/                         # Unit tests cho shared libs
│
└── types/
    ├── address.ts                         # Shipping address schema + phone validation
    ├── api.ts                             # API response envelope/types dùng chung
    ├── category.ts                        # Category schema/type
    ├── checkout.ts                        # Checkout form schema/type
    ├── filter.ts                          # Product filter schema/type
    ├── order.ts                           # Order schema/list/status types
    ├── payment.ts                         # Payment method/result/payload schema/type
    ├── product.ts                         # Product, variant, product list schema/type
    └── user.ts                            # User/auth-related schema/type shared ở data boundary
```

## Current assessment of the remaining shared tree

### Đang đúng tính chất `shared`

- `components/base/*`
- `components/common/EmptyState.tsx`
- `components/common/ErrorState.tsx`
- `components/common/LoadingSpinner.tsx`
- `components/common/PageLoader.tsx`
- `components/common/PaginationNav.tsx`
- `components/common/SearchInput.tsx`
- `constants/*`
- `hooks/useDebounce.ts`
- `hooks/useLocalStorage.ts`
- `hooks/useMediaQuery.ts`
- `hooks/usePagination.ts`
- `hooks/useToast.ts`
- `lib/*`
- `types/*`

### Còn cần xem xét tiếp

- `components/common/PaginationNav.tsx`
- `components/common/SearchInput.tsx`

`PaginationNav` và `SearchInput` đang được giữ lại trong `shared` theo quyết định hiện tại của team vì được xem là generic enough và có khả năng reuse cao ở nhiều module. Tuy nhiên chúng vẫn cần được chứng minh bằng consumer thực tế trong các module/page khác để hoàn toàn đạt chuẩn shared boundary đã chốt.

## What should move out of shared

### Move to `(auth)/_lib/`

- auth store
- auth hooks
- auth guard
- auth runtime bootstrap

### Move to `(shop)/_lib/`

- cart state and cart-specific hooks if only storefront uses them
- storefront header/footer if they are not reused by auth/admin
- storefront navigation components and category menu data
- commerce widgets tightly bound to product/catalog/cart flow
- marketing sections used only on storefront pages
- payment config and payment provider glue if they only exist for checkout
- product/category/order display helpers that only shop screens use
- owner-first generic UI khi hiện tại mới chỉ shop dùng

### Move to `(auth)/_lib/` by owner-first rule

- password field helpers nếu hiện tại chỉ auth forms dùng

## Folder intent

### `components/base`

Chỉ chứa primitive wrappers và composition blocks.
Không chứa business meaning như auth, cart, order, product, sale.

### `components/feedback`

Chứa UI states chung toàn app:

- `EmptyState`
- `ErrorState`
- `LoadingSpinner`
- `PageLoader`

### `components/forms`

Chứa field-level reusable inputs:

- `PasswordInput`
- `SearchInput`
- `QuantitySelector` chỉ nên ở đây nếu thật sự dùng ngoài shop; nếu không thì chuyển về shop

### `components/display`

Chứa display components chung:

- `PriceDisplay`
- `PaginationNav`
- `SortSelect` chỉ nên ở đây nếu ngoài shop cũng dùng

### `hooks`

Chỉ giữ hook generic, không giữ hook mang domain/module state.

Ví dụ tốt:

- `useDebounce`
- `useMediaQuery`
- `useLocalStorage`

Ví dụ không nên ở đây:

- `useAuth`
- `useCart`
- `useCheckout`

### `lib/http`

Là hạ tầng chung, không được import ngược vào module-specific auth/store.
Phần module-specific phải đi qua adapter hoặc contract injection.

## Decision checklist

Trước khi thêm file mới vào `shared`, trả lời 4 câu hỏi:

1. File này có dùng bởi hơn một module không?
2. Nếu chưa dùng bởi hơn một module, nó đã được dùng bởi ít nhất 2 page/flow độc lập chưa?
3. File này có đang giữ state, workflow, hoặc assumption riêng của một module không?
4. File này có thể đặt tên mà không cần nhắc đến auth, shop, admin, product, cart, checkout không?

Nếu câu 1 và 2 đều là "không", hoặc câu 3 là "có", file đó không nên nằm ở `shared`.

## Current migration direction

### Already aligned

- auth-specific runtime đã được chuyển khỏi `shared`
- `shared/lib/http/runtime.ts` hiện là contract trung tính, đúng boundary
- `useProductFilters` đã được chuyển về `(shop)/_lib/hooks/products/`
- product skeletons đã được chuyển về `(shop)/_lib/components/common/`

### Next recommended cleanup

1. Tách `components/common/` thành các nhóm có nghĩa rõ hơn như `feedback/`, `forms/`, `display/`
2. Theo dõi `PaginationNav` và `SearchInput` để xác nhận reuse thật ở nhiều module/page
3. Tách `components/common/` thành các nhóm nhỏ có nghĩa rõ hơn khi cấu trúc ổn định
4. Gom việc đọc env về một cổng duy nhất thay vì đọc `process.env` rải rác

## Anti-patterns

- Dùng `shared` làm thùng `misc`
- Đưa module runtime state vào `shared`
- Đặt tên thư mục theo "common" nhưng thực tế chỉ dùng cho một feature
- Để HTTP foundation phụ thuộc auth/shop cụ thể
- Để shared constants chứa data chỉ phục vụ storefront
