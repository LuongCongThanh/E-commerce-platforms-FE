# ADR 0002 — Chuẩn hoá git flow: GitHub Flow, squash merge, không bắt buộc approval

## Status

Accepted — 2026-07-18

## Context

Repo chưa có quy trình git chính thức nào được ghi lại — branch naming, commit message và merge strategy đều đang là quy ước tự phát (đọc được qua git log), không có tài liệu, không có tool enforce, không có PR template, không có branch protection. Khi team có nhiều người tham gia hơn, cần một flow rõ ràng mà ai cũng bắt buộc phải theo, thay vì dựa vào thói quen cá nhân.

## Decision

1. **Branching model: GitHub Flow.** Chỉ một nhánh dài hạn (`master`), mọi thay đổi qua nhánh ngắn hạn + PR. Không thêm `develop`/`release` vì repo không có lịch release cố định cần nhánh riêng.
2. **Branch naming:** `<type>/<mo-ta-ngan>`, không bắt buộc số issue trong tên nhánh — issue được link trong PR description.
3. **Commit message: Conventional Commits, enforced bằng commitlint** qua husky `commit-msg` hook. Repo đã tự giác theo convention này từ trước — enforce chỉ khoá lại thói quen sẵn có, không đổi hành vi.
4. **Merge strategy: Squash and merge** (duy nhất được phép, tắt merge commit và rebase merge). Vì GitHub Flow cho phép nhiều commit nháp trong 1 branch, squash giữ lịch sử `master` sạch — 1 PR = 1 commit.
5. **PR title enforce theo Conventional Commits** bằng GitHub Action (`amannn/action-semantic-pull-request`), vì squash-merge dùng PR title làm commit message trên `master` — nếu không enforce title, enforce commit message ở bước 3 sẽ vô nghĩa.
6. **Không bắt buộc approval** trước khi merge — chỉ cần required status checks xanh (lint, format, typecheck, test, PR title check). Quyết định này ưu tiên tốc độ hơn gate-by-review; có thể xét lại khi team lớn hơn.
7. **Chặn push trực tiếp và force-push vào `master`, áp dụng cho tất cả kể cả admin** — không có ngoại lệ, để đảm bảo mọi thay đổi đều đi qua CI.

## Consequences

- Thêm 2 file mới: `CONTRIBUTING.md` (cách làm) và `.github/PULL_REQUEST_TEMPLATE.md` (form PR).
- Thêm 1 GitHub Action (`pr-title-lint.yml`) và 1 husky hook (`commit-msg`) — cả hai chạy độc lập, không phụ thuộc nhau.
- Lịch sử `master` từ nay chỉ có commit dạng squash (1 PR = 1 commit) — mất chi tiết commit nhỏ trong branch trên `master`, nhưng vẫn xem được trong PR đã đóng.
- Vì không bắt buộc approval, gate chất lượng duy nhất là CI xanh — nếu sau này phát hiện bug lọt qua do thiếu review, cần quay lại xét thêm required approval.
- Branch protection phải được admin repo áp dụng thủ công qua GitHub Settings hoặc `gh api` (token thường không đủ quyền).
