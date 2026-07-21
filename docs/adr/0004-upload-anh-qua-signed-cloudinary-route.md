# ADR 0004 — Upload ảnh sản phẩm qua signed Cloudinary request (Next.js API route ký), không dùng unsigned preset

## Status

Accepted — 2026-07-18

## Context

`shared/lib/cloudinary.ts` từ trước tới nay chỉ build URL hiển thị ảnh đã tồn tại (transform width/height/crop) — dự án chưa có luồng upload ảnh nào. Admin Product form (ADR 0003) cần upload ảnh mới lên Cloudinary, đây là lần đầu cần quyết định kiến trúc upload.

Hai lựa chọn thường gặp: (1) unsigned upload preset gọi thẳng từ browser lên Cloudinary, hoặc (2) signed upload — browser xin chữ ký từ một Next.js API route nội bộ (route giữ Cloudinary API secret server-side), rồi mới upload thẳng lên Cloudinary kèm chữ ký đó.

## Decision

Dùng **signed upload qua Next.js API route nội bộ** tại `src/app/api/admin/` (route handler không thể nằm trong `(admin)/_lib` vì thư mục prefix `_` không routable). Route chạy server-side, xác thực **thật** trước khi ký: lấy `access_token` từ cookie của request, gọi Django `GET /api/auth/me/` với token đó, chỉ ký khi Django xác nhận user là admin. Lưu ý middleware KHÔNG cover `/api/*` (matcher loại trừ), và kiểu guard "cookie tồn tại" của middleware không đủ ở đây — với route ký, chữ ký chính là tài nguyên, cookie giả mạo là xin được chữ ký hợp lệ. Sau khi có chữ ký, client upload thẳng lên Cloudinary.

Lý do: unsigned preset cho phép bất kỳ ai biết tên preset upload thẳng vào Cloudinary account, không có control nào từ phía app — rủi ro lạm dụng storage/spam. Signed route đảm bảo chỉ user đã qua guard admin mới xin được chữ ký hợp lệ.

## Consequences

- API secret Cloudinary chỉ tồn tại server-side (env var không có prefix `NEXT_PUBLIC_`), không bao giờ lộ ra client bundle.
- Thêm hai round-trip trước mỗi lần upload: client xin chữ ký, và route ký gọi Django `/api/auth/me/` để xác thực — chấp nhận được vì upload ảnh là hành động hiếm.
- Route ký nằm tại `src/app/api/admin/` — vị trí duy nhất khả thi vì `_lib` không routable.
- Django là nguồn sự thật authorization duy nhất, kể cả cho route Next.js nội bộ — không phát minh cơ chế verify token riêng phía FE.
- Ảnh mồ côi (upload rồi bỏ form, hoặc bị gỡ khỏi product) được chấp nhận, không gọi destroy — dọn ảnh đòi hỏi track `public_id` + route ký destroy, không đáng chi phí ở MVP.
