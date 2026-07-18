# Contributing

Quy trình git chuẩn cho repo này — áp dụng cho mọi người, không có ngoại lệ (kể cả admin).

## Branching model — GitHub Flow

- `master` là nhánh dài hạn duy nhất, luôn ở trạng thái deploy được.
- Mọi thay đổi tạo từ 1 nhánh nhánh từ `master`, làm việc, mở PR, merge lại vào `master`.
- Không push trực tiếp vào `master` (kể cả admin) — mọi thay đổi phải qua PR.
- Không có nhánh `develop`/`release` riêng.

## Đặt tên nhánh

```
<type>/<mo-ta-ngan-khong-dau>
```

`type` là một trong: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `ci`, `perf`, `style`, `build`, `revert` (khớp với type của commit message bên dưới).

Ví dụ: `feat/checkout-api`, `fix/auth-refresh-token`, `refactor/shop-lib-cleanup`.

Không bắt buộc gắn số issue vào tên nhánh — link issue nằm trong PR description (`Closes #12`).

## Commit message — Conventional Commits (enforced)

```
<type>(<scope>): <mô tả>
```

- `type`: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `ci`, `perf`, `style`, `build`, `revert`.
- `scope`: tự do, thường là module bị ảnh hưởng (`shop`, `auth`, `admin`, `shared`, `deps`...). Có thể bỏ trống nếu thay đổi cross-cutting.
- Ví dụ: `feat(shop): wire checkout form to real order-creation API`.

Được enforce bằng [commitlint](https://commitlint.js.org/) qua husky `commit-msg` hook — commit sai format sẽ bị chặn ngay tại local, không đợi tới CI.

## Pull Request

1. Mở PR với base là `master`.
2. **PR title cũng phải theo Conventional Commits** giống commit message ở trên — vì merge dùng **squash**, PR title sẽ trở thành commit message duy nhất trên `master`. Được enforce tự động bằng GitHub Action (`pr-title-lint.yml`), PR không đúng format sẽ bị chặn merge.
3. Điền đầy đủ [PR template](./.github/PULL_REQUEST_TEMPLATE.md): Summary, Related issue, Test plan, Checklist, Screenshots (nếu có đổi UI).
4. CI phải xanh: `lint`, `format:check`, `typecheck`, `test`, PR title check. Không có exception.
5. Không bắt buộc approval (repo hiện không yêu cầu reviewer khác duyệt) — nhưng khuyến khích nhờ review với thay đổi lớn/rủi ro.
6. Merge bằng **Squash and merge** — đây là phương thức merge duy nhất được phép trên repo (merge commit và rebase merge bị tắt). Branch tự động xoá sau khi merge.

## Branch protection trên `master`

- Không cho push trực tiếp, không cho force-push, không cho xoá nhánh — áp dụng cho tất cả, kể cả admin.
- Bắt buộc đi qua PR (0 approval bắt buộc, nhưng vẫn phải qua PR để CI chạy).
- Required status checks: `Lint & format`, `Typecheck`, `Unit tests`, PR title check.

## Troubleshooting

- Commit bị `commitlint` chặn → sửa lại message theo đúng format `<type>(<scope>): <mô tả>`, không sửa được thì `git commit --amend`.
- PR bị chặn merge vì title sai format → sửa PR title (không cần push lại code), check sẽ tự chạy lại.
