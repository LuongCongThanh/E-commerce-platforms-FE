# ADR 0005 — Base components track upstream shadcn/ui (new-york), không fork tự do

## Status

Accepted — 2026-07-19

## Context

28 file trong `src/shared/components/base/` là code shadcn/ui thế hệ cũ (style `default` đã bị upstream khai tử, còn `forwardRef`, chưa có `data-slot`, thiếu các cải tiến a11y như `aria-invalid` và focus ring mới). Trong khi đó CSS layer (`globals.css`) đã chuẩn Tailwind v4 `@theme` + OKLCH, và toàn bộ stack shadcn (Radix, CVA, tailwind-merge, lucide, cmdk, sonner, vaul) đã có sẵn — chỉ lớp component TSX bị tụt lại.

Có hai hướng đối lập: **fork-and-own** (coi base/ là code của mình, sửa tay tự do, chấp nhận lệch upstream vĩnh viễn) hoặc **track-upstream** (giữ base/ là bản vendor nguyên gốc, đồng bộ qua shadcn CLI). Một người đọc sau này thấy các file trong base/ giống hệt shadcn có thể thắc mắc: đây là code tự viết hay vendor, và có được sửa thẳng vào không?

Kiểm tra thực tế cho thấy cả 28 component đều đang là bản gốc chưa customize (tuỳ biến domain như `BadgeValue` nằm ở tầng types/tiêu thụ), và không nơi nào import các type `*Props` — tức là chưa hề có lý do phải fork.

## Decision

Base components trong `src/shared/components/base/` **track upstream shadcn/ui, style `new-york`**:

- Đồng bộ bằng shadcn CLI (`npx shadcn add <tên> --overwrite`), không chép tay từ docs.
- File đặt tên **kebab-case** theo codegen của CLI; `components.json` trỏ alias về `@/shared/components/base`.
- **Không sửa tay vào file trong base/.** Tuỳ biến theo domain (variant riêng, wrapper có business rule) đặt ở tầng tiêu thụ: `shared/components/common/` hoặc `_lib/components/` của route group.
- Nhận full visual new-york (sizing, shadow, focus ring mới) thay vì giữ visual cũ, để các lần sync sau không phải merge tay.
- Chỉ vendor component đang thực dùng; component mới thêm đúng lúc cần, không kéo `--all`.

## Consequences

- Lần sync đầu đổi visual nhẹ toàn site (Button `h-9` thay `h-10`, `shadow-xs`, cursor mặc định...) — nghiệm thu bằng CI gates + smoke tay các trang chính ở light/dark.
- Đổi tên file PascalCase → kebab-case kéo theo cập nhật ~56 import; sau đó import path ổn định theo chuẩn shadcn.
- Nâng cấp shadcn về sau rẻ: chạy lại CLI overwrite, diff chỉ là thay đổi upstream thật.
- Nếu một component buộc phải lệch khỏi upstream (business rule không tách ra tầng tiêu thụ được), phải ghi chú rõ tại chỗ và chấp nhận component đó rời khỏi vòng sync — cân nhắc như một ngoại lệ, không phải mặc định.
