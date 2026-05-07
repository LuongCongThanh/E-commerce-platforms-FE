---
title: Agent Tooling Usage Guide
status: active
audience: human
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-08
---

# Agent Tooling Usage Guide

Mục tiêu: hướng dẫn cách dùng cụ thể các công cụ agent đã cài trong repo này để bạn có thể dùng ngay mà không phải đoán.

## 1. Bạn vừa cài những gì

Repo này hiện có 4 nhóm công cụ chính:

- `rtk`: giảm token từ output terminal
- `caveman`: ép agent trả lời ngắn gọn
- `superpowers`: bộ skill theo tác vụ
- `gsd` (`get-shit-done`): workflow lớn theo phase

## 2. Dùng khi nào

| Nhu cầu                                   | Công cụ nên dùng |
| ----------------------------------------- | ---------------- |
| Chạy lệnh dài, log nhiều                  | `rtk`            |
| Muốn agent trả lời ngắn                   | `caveman`        |
| Làm task nhỏ hoặc vừa, cần workflow gọn   | `superpowers`    |
| Làm feature lớn, nhiều phase, cần flow rõ | `gsd`            |

## 3. RTK

### RTK là gì

`rtk` đứng giữa agent và shell để rút gọn output terminal trước khi agent đọc.

### Khi nào nên dùng

- `git status`
- `git diff`
- `build`
- `test`
- `lint`
- `typecheck`

### Cách dùng nhanh

Dùng script đã có sẵn trong repo:

```powershell
npm run rtk:status
npm run rtk:build
npm run rtk:lint
npm run rtk:test
npm run rtk:test:e2e
npm run rtk:typecheck
npm run rtk:gain
```

### Cách dùng trực tiếp

```powershell
.\.tools\rtk\rtk.exe git status
.\.tools\rtk\rtk.exe npm run build
.\.tools\rtk\rtk.exe vitest
.\.tools\rtk\rtk.exe playwright test
```

### Khi cần output thô

Nếu cần log đầy đủ để debug:

```powershell
.\.tools\rtk\rtk.exe proxy npm run build
```

Hoặc chạy lệnh gốc không qua `rtk`.

### Câu mẫu để dùng với agent

- `hãy chạy giúp tôi npm run rtk:test và tóm tắt lỗi chính`
- `hãy dùng rtk để xem git status`
- `hãy chạy build qua rtk rồi cho tôi biết blocker`

## 4. Caveman

### Caveman là gì

`caveman` là chế độ giao tiếp ngắn gọn để giảm token chat, không thay thế logic kỹ thuật.

### Cách bật

- Gõ: `$caveman`
- Hoặc nói: `caveman mode`

### Mức độ

- `$caveman lite`
- `$caveman`
- `$caveman ultra`

### Cách tắt

- `stop caveman`
- `normal mode`

### Khi nào nên dùng

- Hỏi đáp nhanh
- Chốt hướng xử lý
- Review ngắn
- Loop trao đổi nhiều lần

### Khi không nên dùng

- Cảnh báo bảo mật
- Hướng dẫn nhiều bước
- Onboarding
- Giải thích cho người mới

### Câu mẫu để dùng với agent

- `$caveman giải thích lỗi này giúp tôi`
- `$caveman ultra tóm tắt git diff này`
- `normal mode, giải thích kỹ hơn`

## 5. Superpowers

### Superpowers là gì

`superpowers` là bộ skill theo từng loại tác vụ. Bạn gọi đúng skill tùy nhu cầu.

### Dùng khi nào

- Cần brainstorm
- Cần lập plan
- Cần debug bài bản
- Cần flow có subagent cho task lớn

### Một số skill đáng dùng ngay

#### Brainstorm trước khi code

```text
use superpowers:brainstorming để giúp tôi nghĩ 2-3 hướng làm feature này
```

#### Có plan rồi, muốn execute bài bản

```text
use superpowers:executing-plans để triển khai plan trong docs/plans/2026-04-27-storefront-core-p1-01.md
```

#### Gặp bug khó

```text
use superpowers:systematic-debugging để điều tra lỗi checkout redirect sai locale
```

#### Task lớn cần chia subtask

```text
use superpowers:subagent-driven-development để triển khai refactor này theo từng phần
```

### Prompt mẫu thực tế

- `use superpowers:brainstorming để đề xuất cách tốt nhất thêm wishlist vào repo này`
- `use superpowers:executing-plans và thực hiện docs/plans/2026-04-27-mvp-implementation-plan.md`
- `use superpowers:systematic-debugging để debug lỗi login redirect`

## 6. GSD

### GSD là gì

`gsd` là workflow framework lớn hơn `superpowers`. Nó phù hợp cho feature lớn, milestone, hoặc refactor nhiều phase.

### Lưu ý quan trọng

- `gsd` trong repo này là **local-only**
- nó sống trong `.codex/`
- không commit `.codex/`
- nếu đổi máy hoặc đổi path repo, có thể phải cài lại

Xem thêm: [GSD Local Setup](gsd-setup.vi.md)

### Cách cài lại nếu cần

```powershell
npx get-shit-done-cc --codex --local
```

### Các lệnh thường dùng

- `$gsd-new-project`
- `$gsd-discuss-phase`
- `$gsd-plan-phase`
- `$gsd-next`
- `$gsd-debug`

### Dùng thế nào trong thực tế

#### Bắt đầu một hướng mới lớn

```text
$gsd-new-project
```

#### Thảo luận và làm rõ scope của một phase

```text
$gsd-discuss-phase
```

#### Tạo plan cho phase

```text
$gsd-plan-phase
```

#### Hỏi bước tiếp theo nên làm gì

```text
$gsd-next
```

#### Debug theo flow của GSD

```text
$gsd-debug
```

### Prompt mẫu thực tế

- `$gsd-discuss-phase cho feature premium upgrade`
- `$gsd-plan-phase cho checkout stabilization`
- `$gsd-debug lỗi checkout submit không chuyển trang`

## 7. Chọn công cụ nào trước

### Trường hợp 1: bug nhỏ

Dùng:

- `rtk` để chạy test/build/log
- `superpowers:systematic-debugging` để debug
- `caveman` nếu muốn chat ngắn

Ví dụ:

```text
use superpowers:systematic-debugging để điều tra lỗi này, và dùng npm run rtk:test khi cần chạy test
```

### Trường hợp 2: feature vừa

Dùng:

- `superpowers:brainstorming`
- `superpowers:executing-plans`
- `rtk`

Ví dụ:

```text
use superpowers:brainstorming trước, rồi superpowers:executing-plans để làm feature wishlist
```

### Trường hợp 3: feature lớn hoặc milestone

Dùng:

- `gsd`
- `rtk`
- có thể thêm `caveman` nếu muốn giảm token chat

Ví dụ:

```text
$gsd-discuss-phase cho premium upgrade, khi cần chạy lệnh thì dùng rtk
```

## 8. Quy trình khuyên dùng trong repo này

### Quy trình ngắn

1. Nếu chỉ cần chạy lệnh: dùng `rtk`
2. Nếu cần chat ngắn: bật `caveman`
3. Nếu task nhỏ/vừa: dùng `superpowers`
4. Nếu task lớn/nhiều phase: dùng `gsd`

### Rule thực tế

- `rtk` gần như nên dùng mặc định cho shell output dài
- `caveman` chỉ là communication mode
- `superpowers` hợp với task execution theo tác vụ
- `gsd` hợp với plan/spec/phase workflow lớn

## 9. Nếu thấy không hoạt động

### Trường hợp Codex chưa nhận skill mới

Hãy restart phiên Codex.

### Trường hợp `gsd` không hoạt động

Kiểm tra:

- `.codex/` có tồn tại không
- có cần cài lại bằng:

```powershell
npx get-shit-done-cc --codex --local
```

### Trường hợp `rtk` không chạy

Kiểm tra:

- file `.\.tools\rtk\rtk.exe` còn tồn tại không
- thử:

```powershell
.\.tools\rtk\rtk.exe --version
```

## 10. Tài liệu liên quan

- [Agent Tooling Guide](agent-tooling-guide.vi.md)
- [Skills Catalog](skills-catalog.vi.md)
- [GSD Local Setup](gsd-setup.vi.md)
