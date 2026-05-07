---
title: Agent Tooling Guide
status: active
audience: human
language: vi
language_role: source-of-truth
owner: FE Lead
last_updated: 2026-05-08
---

# Agent Tooling Guide

Mục tiêu: giúp team chọn đúng bộ công cụ agent trong repo này thay vì trộn nhiều workflow cùng lúc.

Nếu bạn cần hướng dẫn thao tác cụ thể, lệnh mẫu, và prompt dùng ngay, xem thêm [Agent Tooling Usage Guide](agent-tooling-usage-guide.vi.md).

---

## Tóm tắt nhanh

| Công cụ                 | Dùng để làm gì                                                                 | Khi nào nên dùng                                                      | Khi nào không nên dùng                                                      |
| ----------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `superpowers`           | Bộ skill theo tác vụ: brainstorm, plan, debug, review, execute                 | Task đơn lẻ, cần 1 skill cụ thể, muốn workflow gọn                    | Không cần nếu bạn muốn cả lifecycle spec -> roadmap -> execute tự động      |
| `get-shit-done` (`gsd`) | Hệ workflow lớn: idea -> requirements -> roadmap -> phase -> execute -> verify | Feature lớn, milestone mới, refactor nhiều bước, cần quản lý phase rõ | Không phù hợp cho fix nhỏ, task 1 file, hoặc việc cần tốc độ hơn ceremony   |
| `rtk`                   | Giảm token từ output terminal (`git`, `test`, `build`, `lint`)                 | Gần như mọi lúc khi chạy shell output dài                             | Không cần khi lệnh rất ngắn hoặc cần raw output nguyên bản                  |
| `caveman`               | Ép agent trả lời ngắn để tiết kiệm token                                       | Khi cần trao đổi nhanh, ít prose, nhiều iteration                     | Không nên dùng khi cần warning, hướng dẫn nhiều bước, giải thích onboarding |

---

## 1. Superpowers

`superpowers` là bộ skill composable. Mỗi skill giải quyết 1 dạng việc rõ ràng.

Ví dụ phù hợp:

- Cần brainstorm trước khi code
- Cần plan rồi mới implement
- Cần debug bài bản
- Cần subagent flow cho task lớn

Skill nổi bật đã có trong repo:

- `superpowers:brainstorming`
- `superpowers:executing-plans`
- `superpowers:systematic-debugging`
- `superpowers:subagent-driven-development`

Nên dùng khi:

- Bạn đã biết task là gì
- Chỉ cần 1 phần của workflow
- Muốn agent linh hoạt, ít ceremony

Không nên dùng khi:

- Bạn muốn hệ thống tự kéo từ spec đến milestone management
- Cần quản lý state dài hơi qua nhiều phase

---

## 2. Get Shit Done

`gsd` là workflow framework đầy đủ hơn `superpowers`. Nó thiên về spec-driven development.

Nó hợp cho:

- Bắt đầu feature mới từ ý tưởng mơ hồ
- Chia scope thành phase
- Quản lý requirements, roadmap, verification
- Điều phối nhiều agent/role trong 1 flow thống nhất

Lệnh thường dùng:

- `$gsd-new-project`
- `$gsd-discuss-phase`
- `$gsd-plan-phase`
- `$gsd-next`
- `$gsd-debug`

Lưu ý setup:

- `gsd` trong repo này được cài theo kiểu **local-only**
- thư mục `.codex/` không phải canonical repo artifact
- xem thêm [GSD Local Setup](gsd-setup.vi.md)

Nên dùng khi:

- Task lớn, nhiều bước
- Cần tài liệu planning có cấu trúc
- Team muốn quy trình ổn định hơn là ứng biến

Không nên dùng khi:

- Chỉ sửa bug nhỏ
- Chỉ cần viết test nhanh
- Chỉ muốn “làm luôn” không qua planning flow

Rule thực tế:

- Việc nhỏ -> ưu tiên `superpowers`
- Việc trung bình/lớn, nhiều phase -> ưu tiên `gsd`

---

## 3. RTK

`rtk` không phải framework planning. Nó là tool tối ưu output shell để agent đỡ tốn token.

Phù hợp nhất cho:

- `git status`
- `git diff`
- `npm run build`
- `vitest`
- `playwright test`
- `eslint`
- `tsc`

Repo này đã có script sẵn:

- `npm run rtk:status`
- `npm run rtk:build`
- `npm run rtk:lint`
- `npm run rtk:test`
- `npm run rtk:test:e2e`
- `npm run rtk:typecheck`
- `npm run rtk:gain`

Nên dùng mặc định khi:

- Output terminal có thể dài
- Bạn đang pair với agent và muốn giữ context gọn

Không nên dùng khi:

- Cần raw log đầy đủ để điều tra bug khó

Khi cần raw output:

- Dùng command gốc
- Hoặc `.\.tools\rtk\rtk.exe proxy <cmd>`

---

## 4. Caveman

`caveman` là communication mode. Nó không thay planning, không thay execution, không thay shell optimization.

Tác dụng:

- Rút ngắn câu trả lời của agent
- Giữ nội dung kỹ thuật
- Giảm token ở phần hội thoại

Khi nên dùng:

- Loop hỏi đáp nhanh
- Review ngắn
- Chốt hướng xử lý
- Khi token budget quan trọng

Khi không nên dùng:

- Cảnh báo bảo mật
- Hướng dẫn nhiều bước dễ hiểu nhầm
- Tài liệu onboarding
- Giải thích cho người mới

Mức độ:

- `/caveman lite`
- `/caveman`
- `/caveman ultra`

---

## Cách chọn nhanh

### Trường hợp 1 - Bug nhỏ hoặc 1 task hẹp

Chọn:

- `superpowers` skill phù hợp
- `rtk` cho shell
- `caveman` nếu muốn chat ngắn

Không cần:

- `gsd`

### Trường hợp 2 - Feature vừa, nhiều file, vẫn hiểu scope

Chọn:

- `superpowers:brainstorming` hoặc `superpowers:executing-plans`
- `rtk`

Có thể dùng:

- `gsd` nếu muốn chia phase nghiêm túc

### Trường hợp 3 - Epic/refactor lớn/milestone mới

Chọn:

- `gsd` làm xương sống workflow
- `rtk` cho mọi shell command
- `caveman` tùy nhu cầu tiết kiệm token chat

Có thể kết hợp:

- `superpowers` cho từng subtask cụ thể trong phase

---

## Khuyến nghị cho repo này

Workflow khuyến nghị:

1. Task nhỏ -> `superpowers` + `rtk`
2. Task lớn -> `gsd` + `rtk`
3. Muốn chat gọn -> thêm `caveman`

Mặc định tốt nhất:

- Đừng bật cả `superpowers mindset` và `gsd ceremony` cho mọi task nhỏ
- Dùng `rtk` gần như mặc định cho shell
- Xem `caveman` là chế độ giao tiếp, không phải framework phát triển

---

## Vị trí cài trong repo này

- `superpowers`: `.agents/skills/superpowers/`
- `gsd`: `.codex/` (local-only, không commit)
- `rtk`: `.tools/rtk/rtk.exe`
- `caveman`: `.agents/skills/caveman/`
