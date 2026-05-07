# Agent Skills Guide

Danh sách **tất cả** các skill có thể dùng trong dự án. Gọi bằng cách gõ `/tên-skill` trong chat với Claude Code.

- **Local skills** (`📁`): định nghĩa trong `.claude/skills/` của dự án này.
- **Global skills** (`🌐`): built-in từ hệ thống Claude Code, dùng được ở mọi dự án.

---

## Giao tiếp & Hiệu suất

| #   | Skill        | Lệnh       | Nguồn | Mô tả                                                                                                    | Dùng khi nào                                           |
| --- | ------------ | ---------- | ----- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1   | Caveman Mode | `/caveman` | 📁    | Chế độ trả lời siêu ngắn gọn, cắt ~75% token, vẫn giữ đầy đủ nội dung kỹ thuật. Tắt bằng "stop caveman". | Muốn Claude trả lời nhanh và ngắn hơn, tiết kiệm token |

---

## Thiết kế & Kiến trúc

| #   | Skill                | Lệnh                             | Nguồn | Mô tả                                                                                                            | Dùng khi nào                                                              |
| --- | -------------------- | -------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 2   | Design an Interface  | `/design-an-interface`           | 📁    | Sinh ra nhiều thiết kế API/interface khác nhau bằng nhiều sub-agent song song, theo nguyên tắc "Design It Twice" | Muốn khám phá nhiều cách thiết kế module, so sánh các phương án interface |
| 3   | Improve Architecture | `/improve-codebase-architecture` | 📁    | Phân tích codebase để tìm cơ hội cải thiện kiến trúc (deepening shallow modules, ports & adapters)               | Muốn refactor kiến trúc, gom các module rời rạc, tăng khả năng test       |
| 4   | Zoom Out             | `/zoom-out`                      | 📁    | Yêu cầu Claude "lùi lại" và cho cái nhìn tổng quan về một phần code không quen thuộc                             | Đang đọc code lạ và cần hiểu nó fit vào hệ thống như thế nào              |

---

## Lập kế hoạch & Phân tích

| #   | Skill                 | Lệnh                     | Nguồn | Mô tả                                                                                                     | Dùng khi nào                                                          |
| --- | --------------------- | ------------------------ | ----- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 5   | Grill Me              | `/grill-me`              | 📁    | Claude phỏng vấn bạn liên tục về một kế hoạch/thiết kế cho đến khi giải quyết hết mọi quyết định          | Muốn stress-test một ý tưởng, cần ai đó hỏi những câu khó về plan     |
| 6   | Grill with Docs       | `/grill-with-docs`       | 📁    | Giống `grill-me` nhưng kiểm tra plan dựa trên domain model hiện có, đồng thời cập nhật CONTEXT.md và ADRs | Muốn đảm bảo plan mới nhất quán với các quyết định đã ghi lại         |
| 7   | Request Refactor Plan | `/request-refactor-plan` | 📁    | Phỏng vấn chi tiết về refactor, chia nhỏ thành các commit nhỏ, rồi tạo GitHub Issue                       | Muốn lập kế hoạch refactor bài bản với các bước an toàn               |
| 8   | To PRD                | `/to-prd`                | 📁    | Chuyển context cuộc trò chuyện hiện tại thành một PRD và đăng lên issue tracker                           | Đã thảo luận xong một feature và muốn tạo tài liệu yêu cầu chính thức |

---

## Quản lý Issues & QA

| #   | Skill      | Lệnh         | Nguồn | Mô tả                                                                                                  | Dùng khi nào                                                       |
| --- | ---------- | ------------ | ----- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 9   | To Issues  | `/to-issues` | 📁    | Chia nhỏ một plan/spec thành các GitHub Issues dạng vertical slices (tracer bullets)                   | Có PRD hoặc plan và muốn chuyển thành các ticket implement độc lập |
| 10  | Triage     | `/triage`    | 📁    | Phân loại issues qua state machine: `needs-triage` → `ready-for-agent` → `ready-for-human` → `wontfix` | Muốn review và phân loại bugs hoặc feature requests mới            |
| 11  | QA Session | `/qa`        | 📁    | Phiên QA tương tác — bạn mô tả bug, Claude hỏi làm rõ rồi tự tạo GitHub Issues                         | Muốn báo cáo bugs theo kiểu hội thoại, không cần tự viết issue     |

---

## Development

| #   | Skill           | Lệnh               | Nguồn | Mô tả                                                                                               | Dùng khi nào                                                       |
| --- | --------------- | ------------------ | ----- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 12  | TDD             | `/tdd`             | 📁    | Phát triển theo vòng lặp red-green-refactor, tập trung vào behavioral tests qua public interfaces   | Muốn build feature hoặc fix bug theo TDD, cần integration tests    |
| 13  | Diagnose        | `/diagnose`        | 📁    | Vòng lặp chẩn đoán bài bản: Reproduce → Minimize → Hypothesize → Instrument → Fix → Regression test | Gặp bug khó, lỗi không rõ nguyên nhân, hoặc performance regression |
| 14  | Review PR       | `/review`          | 🌐    | Review pull request: phân tích diff, tìm bugs, code smell, security issues, đề xuất cải thiện       | Muốn Claude review một PR trước khi merge                          |
| 15  | Security Review | `/security-review` | 🌐    | Kiểm tra bảo mật chuyên sâu: OWASP Top 10, injection, auth flaws, data exposure                     | Muốn audit bảo mật cho một feature hoặc module                     |
| 16  | Simplify        | `/simplify`        | 🌐    | Review code vừa thay đổi để tìm cơ hội tái sử dụng, cải thiện chất lượng và hiệu suất               | Sau khi implement xong, muốn Claude gợi ý cách đơn giản hóa        |

---

## Frontend & UI

| #   | Skill             | Lệnh                 | Nguồn | Mô tả                                                                                                  | Dùng khi nào                                                        |
| --- | ----------------- | -------------------- | ----- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| 17  | Frontend Design   | `/frontend-design`   | 🌐    | Tạo giao diện frontend production-grade với chất lượng thiết kế cao (React, Tailwind, shadcn/ui)       | Muốn build component, page, hoặc UI với thiết kế đẹp, chuyên nghiệp |
| 18  | Artifacts Builder | `/artifacts-builder` | 🌐    | Tạo HTML artifacts phức tạp, multi-component với React, Tailwind, shadcn/ui, state management, routing | Cần build artifact phức tạp có nhiều component, routing, hoặc state |

---

## Domain & Tài liệu

| #   | Skill               | Lệnh                   | Nguồn | Mô tả                                                                                              | Dùng khi nào                                               |
| --- | ------------------- | ---------------------- | ----- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 19  | Ubiquitous Language | `/ubiquitous-language` | 📁    | Trích xuất glossary thuật ngữ domain (DDD-style) từ conversation, lưu vào `UBIQUITOUS_LANGUAGE.md` | Muốn chuẩn hóa thuật ngữ trong team, tạo domain glossary   |
| 20  | Edit Article        | `/edit-article`        | 📁    | Cải thiện bài viết: cấu trúc lại sections, tăng clarity, rút gọn prose                             | Có bản nháp bài viết/tài liệu và muốn cải thiện chất lượng |

---

## Cài đặt & Tooling

| #   | Skill                    | Lệnh                          | Nguồn | Mô tả                                                                                                     | Dùng khi nào                                                                 |
| --- | ------------------------ | ----------------------------- | ----- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 21  | Setup Pre-commit         | `/setup-pre-commit`           | 📁    | Cài Husky pre-commit hooks với lint-staged (Prettier), type check, và tests                               | Muốn thêm pre-commit hooks vào dự án mới                                     |
| 22  | Git Guardrails           | `/git-guardrails-claude-code` | 📁    | Cài Claude Code hooks để block các lệnh git nguy hiểm: `push`, `reset --hard`, `clean`, `branch -D`, v.v. | Muốn bảo vệ repo khỏi các thao tác git destructive                           |
| 23  | Setup Skills             | `/setup-matt-pocock-skills`   | 📁    | Setup cấu hình cho các engineering skills (issue tracker, triage labels, domain docs)                     | Lần đầu dùng các skills như `to-issues`, `triage`, `diagnose`                |
| 24  | Write a Skill            | `/write-a-skill`              | 📁    | Tạo skill mới với cấu trúc chuẩn (SKILL.md + scripts)                                                     | Muốn tạo skill tùy chỉnh cho dự án                                           |
| 25  | Update Config            | `/update-config`              | 🌐    | Cấu hình Claude Code qua settings.json: hooks, permissions, env vars, automated behaviors                 | Muốn thêm permission, cài hook tự động ("whenever X do Y"), hoặc set env var |
| 26  | Keybindings Help         | `/keybindings-help`           | 🌐    | Tùy chỉnh keyboard shortcuts trong `~/.claude/keybindings.json`                                           | Muốn rebind phím, thêm chord shortcut, hoặc thay đổi submit key              |
| 27  | Fewer Permission Prompts | `/fewer-permission-prompts`   | 🌐    | Scan transcripts để tìm các tool call read-only thường dùng, thêm vào allowlist trong settings.json       | Bị phiền bởi quá nhiều permission prompts cho các lệnh đọc thông thường      |
| 28  | Init                     | `/init`                       | 🌐    | Khởi tạo cấu hình Claude Code cho dự án mới (CLAUDE.md, settings, v.v.)                                   | Bắt đầu dự án mới và muốn setup Claude Code                                  |

---

## Claude API & AI Development

| #   | Skill      | Lệnh          | Nguồn | Mô tả                                                                                                         | Dùng khi nào                                                                                |
| --- | ---------- | ------------- | ----- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 29  | Claude API | `/claude-api` | 🌐    | Build, debug, và optimize apps dùng Claude API / Anthropic SDK, bao gồm prompt caching, tool use, batch, v.v. | Code dùng `import anthropic`, muốn tích hợp Claude API, hoặc migrate giữa các model version |

---

## Automation & Scheduling

| #   | Skill    | Lệnh        | Nguồn | Mô tả                                                                                   | Dùng khi nào                                                                                 |
| --- | -------- | ----------- | ----- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 30  | Loop     | `/loop`     | 🌐    | Chạy một lệnh hoặc skill lặp đi lặp lại theo chu kỳ. Bỏ interval để Claude tự định nhịp | Muốn setup recurring task, poll trạng thái, hoặc chạy thứ gì đó định kỳ                      |
| 31  | Schedule | `/schedule` | 🌐    | Tạo, cập nhật, liệt kê các scheduled remote agents chạy theo cron schedule              | Muốn lên lịch task tự động, tạo cron job cho Claude Code, hoặc chạy một lần vào giờ định sẵn |

---

## CCS (CLI Delegation)

| #   | Skill        | Lệnh            | Nguồn | Mô tả                                                                                      | Dùng khi nào                                   |
| --- | ------------ | --------------- | ----- | ------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| 32  | CCS          | `/ccs`          | 🌐    | Ủy thác task cho CCS CLI (profile glm/kimi/custom), tối ưu cho các task đơn giản, xác định | Muốn dùng CCS cho typo fix, test, refactor nhỏ |
| 33  | CCS Continue | `/ccs:continue` | 🌐    | Tiếp tục một CCS session đang chạy                                                         | Đang trong một CCS session và muốn tiếp tục    |

---

## Khám phá & Tìm kiếm

| #   | Skill          | Lệnh              | Nguồn | Mô tả                                                           | Dùng khi nào                               |
| --- | -------------- | ----------------- | ----- | --------------------------------------------------------------- | ------------------------------------------ |
| 34  | Find Skills    | `/find-skills`    | 🌐    | Tìm kiếm và gợi ý các skill có thể cài thêm phù hợp với nhu cầu | Muốn biết "có skill nào làm được X không?" |
| 35  | Obsidian Vault | `/obsidian-vault` | 📁    | Tìm kiếm và quản lý notes trong Obsidian vault với wikilinks    | Muốn tổ chức hoặc tìm notes trong Obsidian |

---

## Các Skill Khác

| #   | Skill               | Lệnh                   | Nguồn | Mô tả                                                                        | Dùng khi nào                                           |
| --- | ------------------- | ---------------------- | ----- | ---------------------------------------------------------------------------- | ------------------------------------------------------ |
| 36  | Migrate to Shoehorn | `/migrate-to-shoehorn` | 📁    | Migrate test files từ `as` type assertions sang `@total-typescript/shoehorn` | Muốn thay thế `as` trong tests bằng cách type-safe hơn |
| 37  | Scaffold Exercises  | `/scaffold-exercises`  | 📁    | Tạo cấu trúc thư mục bài tập với sections, problems, solutions, explainers   | Dành cho course/learning content                       |

---

## Skills được đề xuất cho dự án này

| Tình huống                      | Skill nên dùng           |
| ------------------------------- | ------------------------ |
| Phát hiện bug khó tái hiện      | `/diagnose`              |
| Build feature mới theo TDD      | `/tdd`                   |
| Báo cáo bug nhanh               | `/qa`                    |
| Muốn refactor an toàn           | `/request-refactor-plan` |
| Có plan, cần tạo GitHub tickets | `/to-issues`             |
| Cần thiết kế API/module mới     | `/design-an-interface`   |
| Không hiểu một phần code        | `/zoom-out`              |
| Review PR trước khi merge       | `/review`                |
| Muốn Claude trả lời ngắn        | `/caveman`               |
| Build UI component đẹp          | `/frontend-design`       |
| Audit bảo mật                   | `/security-review`       |
| Sau khi code xong, muốn tối ưu  | `/simplify`              |
