---
title: GSD Local Setup
status: active
audience: human
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-08
---

# GSD Local Setup

Mục tiêu: cài `get-shit-done` (`gsd`) cho máy local mà không commit snapshot generated `.codex/` vào repo.

## Nguyên tắc

- `.codex/` trong repo này là **runtime state local**
- Không commit `.codex/`
- Nếu cần dùng `gsd`, mỗi máy tự cài local lại

## Vì sao không commit `.codex/`

- File generated hiện chứa path tuyệt đối theo máy local
- Snapshot GSD rất lớn: agents, hooks, skills, templates, workflows
- Commit snapshot này làm repo nặng và khó nâng version

## Cách cài local

Chạy trong root repo:

```powershell
npx get-shit-done-cc --codex --local
```

Kết quả:

- tạo `.codex/` trong root repo
- cài local skills, hooks, agents cho Codex
- không ảnh hưởng trực tiếp tới source code app

## Kiểm tra sau khi cài

Ví dụ các file sẽ xuất hiện:

- `.codex/config.toml`
- `.codex/skills/`
- `.codex/hooks/`
- `.codex/agents/`

## Cách dùng

Trong Codex, có thể gọi các workflow như:

- `$gsd-new-project`
- `$gsd-discuss-phase`
- `$gsd-plan-phase`
- `$gsd-next`
- `$gsd-debug`

## Khi nào nên reinstall

Nên cài lại local khi:

- đổi máy
- đổi path repo
- xóa `.codex/`
- nâng version GSD

## Cleanup

Nếu muốn bỏ GSD local khỏi repo working copy:

```powershell
Remove-Item -LiteralPath '.codex' -Recurse -Force
```

Lưu ý: thao tác này chỉ xóa local runtime setup, không xóa source code app.
