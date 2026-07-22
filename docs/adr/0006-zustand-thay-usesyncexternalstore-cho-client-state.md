# ADR 0006 — Dùng Zustand thay `useSyncExternalStore` thủ công cho client state (cart, auth)

## Status

Accepted — 2026-07-23

## Context

Từ đầu dự án, client state (cart tại `(shop)/_lib/hooks/useCart.ts`, auth tại `src/core/session/auth-store.ts`) được cài bằng `useSyncExternalStore` (React built-in) + module-level store tự viết tay (`Set<Listener>`, hàm `subscribe`/`getSnapshot`/`getServerSnapshot` thủ công). Quyết định này đã được ghi nhận nhiều nơi (`CLAUDE.md`, `docs/architecture/tech-stack.md`, `docs/architecture/frontend/runtime.md`) với lý do "không cần thư viện ngoài". `zustand` (`^5.0.14`) có trong `package.json` từ trước nhưng không được import ở đâu, và các tài liệu trước đây xếp nó vào diện "dependency thừa, ứng viên gỡ bỏ".

Quyết định này nay bị đảo ngược theo yêu cầu trực tiếp: dùng Zustand thật cho cả 2 store thay vì tiếp tục tự viết tay cơ chế pub-sub.

## Decision

Migrate `useCart.ts` và `auth-store.ts` sang Zustand `create()`:

- **Không dùng middleware `persist` của Zustand cho cart.** `persist` tự rehydrate từ localStorage lúc store khởi tạo — với Next.js SSR, việc này dễ gây hydration mismatch (server render rỗng, client render đầu tiên đã có data khác server). Thay vào đó: store khởi tạo `items: []` (khớp SSR), `useCart()` gọi `initCartFromStorage()` trong `useEffect` (chỉ chạy client-side, sau lần render đầu tiên) để nạp dữ liệu thật — giữ đúng nguyên lý né hydration mismatch mà bản cũ dùng qua tham số `getServerSnapshot`, chỉ đổi cơ chế lưu trữ bên dưới từ `useSyncExternalStore` thủ công sang Zustand.
- Việc ghi localStorage vẫn thủ công trong từng action (`addToCart`/`removeCartItem`/`updateQuantity`/`clearCart`), giữ nguyên format cũ (`{version: 1, items: CartItem[]}`) — không cần migrate dữ liệu người dùng đã có, không cần sửa test.
- Toàn bộ API export của 2 module (`resetCartState`, `initCartFromStorage`, `clearCart`, `useCart()`, và `getAccessToken`, `setAccessToken`, `setUser`, `clearAuth`, `refreshAccessToken`, `bootstrapAuth`, `getAuthSnapshot`, `subscribeAuth` của auth) giữ nguyên tên/chữ ký — không ai trong số 14 file tiêu thụ (`CartClient`, `CheckoutClient`, `Header`, `AuthRuntimeProvider`, `useAuth.ts`, `(auth)/_lib/api/auth.ts`...) hay 2 file test (`useCart.test.tsx`, `auth-store.test.ts`) cần sửa ngoài `useAuth.ts` (đơn giản hoá gọi thẳng `useAuthStore()` thay vì tự bọc `useSyncExternalStore` quanh `subscribeAuth`/`getAuthSnapshot`).
- Auth store **không dùng `persist`** — giữ nguyên hành vi cũ: chỉ tồn tại trong memory, không lưu localStorage (đã là quyết định riêng, không đổi ở ADR này).

## Consequences

- `zustand` từ dependency-thừa trở thành dependency thật — bỏ ghi chú "ứng viên gỡ bỏ" ở mọi tài liệu.
- Toàn bộ test suite (181 test, gồm 1 test regression chuyên biệt chống hydration-mismatch cho cart) pass không sửa gì ở phần assertion — chỉ đổi internal implementation.
- Any state client mới sau này (wishlist, voucher... theo `docs/planning/08-nike-flagship-expansion.md`) nên dùng Zustand `create()` theo cùng pattern, cân nhắc kỹ trước khi dùng middleware `persist` nếu có SSR page tiêu thụ store đó.
- Nếu sau này cần dùng `persist` middleware (ví dụ store không bị SSR chạm tới), phải test riêng hydration — không mặc định an toàn như cách làm thủ công ở ADR này.
