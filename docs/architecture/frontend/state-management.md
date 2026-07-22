# State Ownership

> Tầng sống. Last verified: 2026-07-23.

## Ranh giới

- **Server state** — sở hữu bởi API: **TanStack Query** (`useProducts()`, `useOrders()`, `useProfile()`, `useOrder()`...). Cache key chuẩn hoá qua `shared/constants/query-keys.ts`. Config tại `shared/lib/query-client.ts`.
- **Client state** — chỉ tồn tại phía browser: **`useSyncExternalStore`** (React built-in) + module-level store.
  - Cart: `(shop)/_lib/hooks/useCart.ts` — mảng `CartItem[]`, persist `localStorage` (key `cart-storage`).
  - Auth: `src/core/session/auth-store.ts` — `{ token, user }`, KHÔNG persist localStorage (chỉ tồn tại trong memory).
- **Local UI state** — `useState`/`useReducer` trong component.

**Không dùng Zustand hay thư viện state ngoài** cho cả 2 nhóm trên (đã xác nhận: `zustand` có trong `package.json` nhưng không được import ở đâu trong `src/` — ứng viên gỡ bỏ khỏi dependencies).

## Vì sao auth store không nằm trong `shared/`

`auth-store.ts` là cross-cutting (dùng bởi toàn app — shop/checkout/profile/admin — qua `src/app/providers.tsx`), nhưng vẫn không đặt trong `src/shared/` vì nó mang state/business rule riêng của auth (rule loại bị cấm ở `shared/`, xem [`shared-structure.md`](./shared-structure.md)). Vị trí đúng là `src/core/session/` — một module cross-cutting tách riêng, không phải `(auth)/_lib` (private cho route group `(auth)`) và không phải `shared/`. Việc di chuyển này đã xong (PR #7); tài liệu cũ nào còn ghi auth store/hook nằm trong `shared/` hoặc `(auth)/_lib` đều đã lỗi thời.

## Cart: dữ liệu không đáng tin từ phía server

`CartItem` cache `price` phía browser, không có field `version` để migrate schema khi đổi cấu trúc. Server (khi tạo order) phải luôn coi đây là dữ liệu **không đáng tin**, tự kiểm tra lại giá/tồn kho/khuyến mãi — không suy ra giá cuối cùng chỉ từ payload FE gửi lên.

## Bootstrap lại token sau F5

`AuthRuntimeProvider` (`src/core/session/AuthRuntimeProvider.tsx`) chỉ đăng ký callback `getAccessToken`/`refreshAccessToken` vào `shared/lib/http/runtime.ts` lúc mount — không tự gọi refresh ngay. Vì `auth-store` chỉ lưu trong memory (không persist), sau khi reload trang request đầu tiên sẽ luôn nhận 401 rồi mới kích hoạt refresh. Interceptor tại `shared/lib/http/client.ts` có single-flight refresh + retry nên không bị lặp vô hạn, nhưng luôn tốn 1 round-trip 401 và có thể gây flash UI "chưa đăng nhập" trong lúc chờ refresh. Chưa xử lý — cân nhắc khi có issue riêng.
