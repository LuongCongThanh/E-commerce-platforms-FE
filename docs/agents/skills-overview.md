# Tổng quan các Agent Skill trong repo

`.claude/skills/` là symlink trỏ tới `.agents/skills/` — 40 skill hiện có. Tài liệu này tổng hợp mục đích, thời điểm nên dùng, và các skill dễ nhầm lẫn với nhau, để chọn đúng skill thay vì đoán mò theo tên.

**Cách gọi:** phần lớn skill có `disable-model-invocation: true` — nghĩa là Claude **không tự động** kích hoạt chúng, bạn phải gọi tường minh qua `/tên-skill`. Các skill **không** có cờ này (`code-review`, `design-an-interface`, `diagnosing-bugs`, `domain-modeling`, `grilling`, `migrate-to-shoehorn`, `obsidian-vault`, `prototype`, `setup-pre-commit`) có thể được Claude tự gọi khi phát hiện ngữ cảnh phù hợp — cột "Kích hoạt" đánh dấu `tự động` cho các skill này, còn lại là `chỉ định (/…)`.

---

## 1. Grilling / Làm rõ ý tưởng (Interview)

Một "họ" skill dùng để phỏng vấn gắt gao, siết chặt một kế hoạch/thiết kế mơ hồ trước khi bắt tay làm.

| Skill             | Kích hoạt          | Mục đích                                                                                                                                                                                    | Khi nào dùng                                                                                                                                    |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `grilling`        | tự động            | **Động cơ lõi** — hỏi từng câu một về mọi khía cạnh của một kế hoạch/quyết định, đi qua từng nhánh cây quyết định, đề xuất câu trả lời kèm theo, dừng lại chờ xác nhận trước khi hành động. | Khi muốn stress-test tư duy trước khi triển khai; mọi skill "grill-\*" khác chỉ là wrapper gọi tới đây.                                         |
| `grill-me`        | `/grill-me`        | Wrapper 1 dòng, gọi thẳng `grilling`, không thêm gì.                                                                                                                                        | Muốn phỏng vấn thuần túy, không cần sinh tài liệu phụ trợ.                                                                                      |
| `grill-with-docs` | `/grill-with-docs` | Wrapper gọi `grilling` **+ `domain-modeling`** song song — vừa phỏng vấn vừa ghi ADR/glossary ngay khi chốt quyết định.                                                                     | Khi quyết định đang bàn ảnh hưởng đến domain model hoặc cần lưu lại thành tài liệu chính thức (đây chính là skill đang chạy để tạo report này). |
| `batch-grill-me`  | `/batch-grill-me`  | Biến thể dồn dập — hỏi **toàn bộ** câu hỏi "ở biên" cùng lúc theo từng vòng, thay vì từng câu một.                                                                                          | Khi cần đào sâu nhanh nhiều nhánh cùng lúc và chấp nhận trả lời hàng loạt thay vì tuần tự.                                                      |
| `loop-me`         | `/loop-me`         | Biến thể chuyên biệt của grilling, chỉ nhắm tới output là **workflow spec** (`workflows/*.md`) cho các quy trình lặp lại (career, tuần, thói quen...).                                      | Khi muốn đặc tả một workflow tự động lặp lại để giao cho agent thực hiện định kỳ — không phải để làm rõ kiến trúc code.                         |

> **Phân biệt nhanh:** `grilling` = engine; `grill-me` = engine trần; `grill-with-docs` = engine + ghi tài liệu domain; `batch-grill-me` = engine nhưng hỏi dồn theo lô; `loop-me` = engine nhưng chỉ để đặc tả workflow, khác hẳn phạm vi 3 skill kia.

---

## 2. Domain Modeling & Ngôn ngữ chung

| Skill                 | Kích hoạt              | Mục đích                                                                                                                                                                    | Khi nào dùng                                                                                                                                                     |
| --------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain-modeling`     | tự động                | Chủ động xây/mài glossary miền — thách thức thuật ngữ mơ hồ, ghi `CONTEXT.md` (thuần glossary, không chứa chi tiết triển khai) và `docs/adr/` cho quyết định khó đảo ngược. | Khi cần thống nhất thuật ngữ domain, hoặc khi skill khác (grill-with-docs, triage, wayfinder, improve-codebase-architecture) cần duy trì domain model song song. |
| `ubiquitous-language` | `/ubiquitous-language` | Trích xuất bảng thuật ngữ DDD từ hội thoại hiện tại, gắn cờ điểm mơ hồ/đồng nghĩa, lưu vào `UBIQUITOUS_LANGUAGE.md` (khác file với `CONTEXT.md`).                           | Khi cần thống nhất ngôn ngữ nghiệp vụ nhanh từ một cuộc trò chuyện cụ thể, không cần quy trình ADR đầy đủ như domain-modeling.                                   |

> **Phân biệt:** `domain-modeling` là kỷ luật nền, chạy song song với các skill khác và ghi vào `CONTEXT.md`/`docs/adr/`. `ubiquitous-language` là một lệnh độc lập, chạy riêng lẻ, ghi vào `UBIQUITOUS_LANGUAGE.md`.

---

## 3. Kiến trúc & Thiết kế Module

| Skill                           | Kích hoạt                        | Mục đích                                                                                                                                                                              | Khi nào dùng                                                                                                                      |
| ------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `codebase-design`               | — (vocab)                        | Lớp từ vựng nền: định nghĩa Module, Interface, Depth, Seam, Adapter, Leverage, Locality cho "deep module" (nhiều hành vi ẩn sau interface nhỏ).                                       | Khi cần ngôn ngữ chung để bàn về thiết kế module/seam — thường được các skill khác tham chiếu tới, ít khi gọi trực tiếp một mình. |
| `design-an-interface`           | tự động                          | Sinh nhiều phương án thiết kế API khác biệt hoàn toàn bằng sub-agent song song ("Design It Twice"), so sánh theo độ đơn giản/đa dụng/depth.                                           | Khi muốn thiết kế một API/interface mới và muốn so sánh nhiều lựa chọn trước khi chốt.                                            |
| `improve-codebase-architecture` | `/improve-codebase-architecture` | Quét codebase (qua `git log` + Explore agent) tìm cơ hội "deepening" module nông thành sâu, xuất báo cáo HTML trực quan, rồi grill sâu vào phương án được chọn (kèm domain-modeling). | Review kiến trúc định kỳ, hoặc sau một đợt phát triển tính năng lớn muốn tìm ma sát kiến trúc.                                    |
| `setup-ts-deep-modules`         | `/setup-ts-deep-modules`         | Cài `dependency-cruiser` để ép mỗi package thành deep module — chặn import sâu vào nội bộ package khác.                                                                               | Thiết lập một lần cho repo TypeScript nhiều package, muốn ép ranh giới module bằng linter thay vì convention.                     |

> **Phân biệt:** `codebase-design` chỉ là từ vựng (không có quy trình hành động); `design-an-interface` dùng từ vựng đó để thiết kế **một** interface cụ thể; `improve-codebase-architecture` dùng cùng từ vựng để quét **toàn bộ codebase** tìm cơ hội cải thiện; `setup-ts-deep-modules` là bước thiết lập công cụ (dependency-cruiser) để _ép buộc_ nguyên tắc đó bằng linter.

---

## 4. Lập kế hoạch → Ticket hóa (Planning → Tickets)

Chuỗi tự nhiên: thu thập thông tin còn thiếu → chốt thành spec → chia nhỏ thành việc có thể giao.

| Skill                   | Kích hoạt                | Mục đích                                                                                                                                                           | Khi nào dùng                                                                                         |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `to-questionnaire`      | `/to-questionnaire`      | Chuyển một quyết định mà **chính bạn** không tự trả lời được thành bộ câu hỏi Markdown để gửi cho **người khác** (domain expert/stakeholder) điền.                 | Khi thiếu thông tin nghiệp vụ mà chỉ người khác mới biết, cần hỏi async hoặc trong cuộc họp.         |
| `to-spec`               | `/to-spec`               | Tổng hợp (không phỏng vấn thêm) hội thoại đã có thành một spec/PRD hoàn chỉnh, publish lên issue tracker với label `ready-for-agent`.                              | Khi đã bàn đủ về một tính năng và cần chốt thành văn bản chính thức duy nhất.                        |
| `to-tickets`            | `/to-tickets`            | Bẻ spec/plan thành nhiều ticket dạng tracer-bullet (vertical slice), mỗi ticket khai báo rõ "blocked by", publish lên tracker.                                     | Sau khi có spec rõ ràng, cần chia thành các việc độc lập có thể giao cho nhiều agent/người.          |
| `request-refactor-plan` | `/request-refactor-plan` | Phỏng vấn người dùng để tạo kế hoạch refactor gồm các commit rất nhỏ, tăng dần, rồi file thành issue.                                                              | Khi muốn lên kế hoạch refactor an toàn, chia nhỏ theo tinh thần Fowler thay vì refactor lớn một lần. |
| `wayfinder`             | `/wayfinder`             | Lập "bản đồ" ticket-quyết định cho một khối công việc quá lớn/mơ hồ cho một phiên agent, giải quyết từng ticket (research/prototype/grilling) đến khi rõ đường đi. | Khi có ý tưởng lớn cần nhiều phiên/nhiều người làm rõ trước khi code — ví dụ một cuộc migrate lớn.   |

> **Phân biệt:** `to-questionnaire` → `to-spec` → `to-tickets` là 3 bước tuần tự của **cùng một** tính năng đã rõ phạm vi. `request-refactor-plan` là biến thể chuyên cho refactor (không phải tính năng mới). `wayfinder` khác cả 4 skill trên ở chỗ nó dùng khi phạm vi công việc **còn mơ hồ**, cần điều tra dần qua nhiều ticket-quyết định (có gọi cả `research`, `prototype`, `grilling` bên trong) — không phải chia việc đã biết rõ.

---

## 5. Quản lý Issue / QA

| Skill    | Kích hoạt | Mục đích                                                                                                                                                                      | Khi nào dùng                                                                                   |
| -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `qa`     | `/qa`     | Phiên QA tương tác: bạn mô tả bug bằng lời, agent khám phá codebase ngầm để hiểu ngữ cảnh, tự động file GitHub issue (dùng ngôn ngữ nghiệp vụ, không nhắc file path/số dòng). | Khi muốn báo lỗi kiểu trò chuyện mà không cần tự viết issue bằng tay.                          |
| `triage` | `/triage` | Đưa issue/PR mới qua state machine triage (`needs-triage` → `needs-info`/`ready-for-agent`/`ready-for-human`/`wontfix`), có gọi `grilling`/`domain-modeling` khi cần đào sâu. | Khi maintainer cần xử lý issue/PR mới, ví dụ "xem #42" hoặc "chuyển #42 sang ready-for-agent". |

---

## 6. Coding Workflow (Implement / Test / Review)

| Skill                 | Kích hoạt    | Mục đích                                                                                                                                                             | Khi nào dùng                                                                        |
| --------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `implement`           | `/implement` | Điều phối triển khai từ spec/ticket: dùng `tdd` tại các seam đã thống nhất, typecheck + test thường xuyên, review bằng `code-review`, rồi commit.                    | Khi đã có spec/ticket rõ ràng, sẵn sàng code triển khai thật.                       |
| `tdd`                 | tự động      | Tài liệu tham chiếu thực hành TDD (red-green-refactor) đúng nghĩa — tránh test tautological/coupled-với-implementation/horizontal-slicing.                           | Đọc **trước và trong suốt** vòng lặp TDD khi xây tính năng/sửa bug theo test-first. |
| `code-review`         | tự động      | Review code 2 trục song song (Standards vs Spec) cho diff so với 1 mốc cố định, dùng 2 sub-agent riêng biệt, không gộp xếp hạng chung.                               | Khi review một branch/PR/thay đổi dở dang, hoặc yêu cầu "review since X".           |
| `migrate-to-shoehorn` | tự động      | Thay `as` type assertion trong **test file** bằng `@total-typescript/shoehorn` (`fromPartial`/`fromAny`/`fromExact`) để giữ type-safe với dữ liệu test không đầy đủ. | Khi cần truyền partial test data mà vẫn qua type-check, hoặc user nhắc "shoehorn".  |

---

## 7. Debug & Git

| Skill                        | Kích hoạt                     | Mục đích                                                                                                                                             | Khi nào dùng                                                                              |
| ---------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `diagnosing-bugs`            | tự động                       | Quy trình chẩn đoán 6 pha kỷ luật: bắt buộc xây feedback loop trước, rồi mới đưa giả thuyết falsifiable, instrument, fix + regression test, cleanup. | Khi có bug khó/regression hiệu năng, tránh nhảy thẳng vào đoán nguyên nhân.               |
| `resolving-merge-conflicts`  | `/resolving-merge-conflicts`  | Giải xung đột merge/rebase bằng cách hiểu ý định gốc của từng thay đổi rồi hợp nhất — **không bao giờ** dùng `--abort`.                              | Đang trong merge/rebase bị conflict, cần agent xử lý thay vì tự làm tay.                  |
| `git-guardrails-claude-code` | `/git-guardrails-claude-code` | Cài Claude Code hook (PreToolUse) chặn lệnh git nguy hiểm (`push`, `reset --hard`, `clean -f`, `branch -D`...) trước khi thực thi.                   | Thiết lập một lần khi muốn Claude Code không thể lỡ tay chạy git command phá hủy dữ liệu. |

---

## 8. Setup / Tooling (chạy một lần)

| Skill                      | Kích hoạt                   | Mục đích                                                                                                                                                                                                                                                                                 | Khi nào dùng                                                                                                                                     |
| -------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `setup-matt-pocock-skills` | `/setup-matt-pocock-skills` | Cấu hình nền cho cả bộ skill kỹ thuật: chọn issue tracker, nhãn triage, cách tổ chức domain docs — ghi ra `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md` (những file đã tồn tại trong repo này) và cập nhật mục "Agent skills" trong CLAUDE.md. | **Chạy trước tiên, một lần duy nhất**, trước khi dùng `qa`, `triage`, `to-tickets`, `to-spec` — các skill này cần biết lưu issue/tài liệu ở đâu. |
| `setup-pre-commit`         | tự động                     | Cài Husky pre-commit hook + lint-staged (Prettier) + typecheck + test.                                                                                                                                                                                                                   | Khi muốn thêm/cấu hình pre-commit hook tự động format/kiểm tra khi commit.                                                                       |
| `wizard`                   | `/wizard`                   | Sinh một wizard bash tương tác (progress bar, confirm gate, mở URL, ghi `.env`/`gh secret`) dẫn dắt **con người** qua một quy trình thủ công lặp lại.                                                                                                                                    | Khi cần hướng dẫn ai đó (không nhất thiết là dev) qua chuỗi thao tác thủ công tẻ nhạt — ví dụ cấu hình API key bên thứ ba, migration một lần.    |

---

## 9. Bàn giao phiên làm việc (Handoff)

| Skill            | Kích hoạt         | Mục đích                                                                                                                                                                            | Khi nào dùng                                                                                                                                      |
| ---------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `handoff`        | `/handoff`        | Nén hội thoại hiện tại thành tài liệu bàn giao (redact thông tin nhạy cảm, không lặp lại nội dung đã có trong spec/issue/commit — chỉ tham chiếu đường dẫn) để agent khác tiếp tục. | Kết thúc phiên làm việc, cần chuyển ngữ cảnh sang phiên/người khác.                                                                               |
| `claude-handoff` | `/claude-handoff` | Giống `handoff` nhưng đi xa hơn một bước: viết tóm tắt xong **tự khởi chạy ngay một background agent mới** (`claude --bg`) với tóm tắt đó làm prompt.                               | Khi ngữ cảnh hiện tại đã đầy hoặc muốn tách nhánh công việc (vd. prototype) sang phiên nền mới **ngay lập tức**, không chỉ tạo tài liệu rồi dừng. |

> **Phân biệt:** `handoff` chỉ tạo tài liệu; `claude-handoff` tạo tài liệu **và** tự động launch agent nền tiếp tục luôn.

---

## 10. Prototype & Research

| Skill       | Kích hoạt   | Mục đích                                                                                                                                                                                                                    | Khi nào dùng                                                                                                 |
| ----------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `prototype` | tự động     | Xây prototype dùng-một-lần-rồi-bỏ để trả lời 1 câu hỏi thiết kế cụ thể — nhánh `LOGIC.md` (terminal app nhỏ kiểm chứng state model) hoặc nhánh `UI.md` (nhiều biến thể UI khác nhau trên cùng route, chuyển qua URL param). | Khi cần sanity-check nhanh state model hoặc khám phá UI nên trông ra sao, không cần code production-ready.   |
| `research`  | `/research` | Điều tra một câu hỏi dựa trên nguồn sơ cấp đáng tin cậy (docs chính thức, source code, spec), ghi kết quả thành file Markdown, thường chạy như background agent.                                                            | Khi cần nghiên cứu một chủ đề/API và muốn giao việc đọc tài liệu cho agent chạy nền trong lúc làm việc khác. |

---

## 11. Viết nội dung (Article / Writing)

Cặp explore/exploit: `writing-fragments` khai thác ý tưởng thô không cấu trúc; `writing-beats` và `writing-shape` lắp ráp nguyên liệu đó thành bài viết theo hai cách khác nhau.

| Skill               | Kích hoạt            | Mục đích                                                                                                                                                            | Khi nào dùng                                                                                                                        |
| ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `writing-fragments` | `/writing-fragments` | **Explore** — khai thác mẩu nguyên liệu thô từ hội thoại qua phiên grilling liên tục, chưa áp cấu trúc bài viết nào, tìm "leading word" (từ dẫn dắt giá trị nhất).  | Giai đoạn đầu brainstorm, ghi ý tưởng rời rạc trước khi biết bài viết sẽ có cấu trúc ra sao.                                        |
| `writing-beats`     | `/writing-beats`     | **Exploit** — lắp nguyên liệu thô thành bài viết theo từng "beat" nối tiếp kiểu chọn-đường-đi, đảm bảo mỗi khái niệm được "grounded" trước khi beat sau dựa vào nó. | Khi đã có file nguyên liệu và muốn viết theo nhịp nhỏ, có lựa chọn hướng đi ở mỗi bước.                                             |
| `writing-shape`     | `/writing-shape`     | **Exploit** — định hình nguyên liệu thành bài viết ở cấp block/đoạn văn, tranh luận cấu trúc/mở bài/format từng phần (prose vs list, table vs lặp cấu trúc...).     | Khi muốn "chốt" bài viết mạch lạc, tranh luận từng đoạn nên viết gì tiếp, thiên về biên tập luận điểm hơn là hành trình chọn nhánh. |
| `edit-article`      | `/edit-article`      | Chỉnh sửa bài viết có sẵn: chia lại theo heading, sắp xếp thứ tự phần theo phụ thuộc thông tin (DAG), viết lại từng phần cho rõ ràng (giới hạn 240 ký tự/đoạn).     | Khi đã có bản nháp hoàn chỉnh và muốn revise/cải thiện, không phải viết mới từ nguyên liệu thô.                                     |

> **Phân biệt `writing-beats` vs `writing-shape`:** cùng là bước exploit, khác đơn vị làm việc — beats đi theo "nhịp" rời rạc kiểu chọn-nhánh, shape đi theo "khối/đoạn văn" theo mạch tranh luận tuyến tính hơn. Hai file định nghĩa "grounding" gần như trùng lặp có chủ đích.

---

## 12. Meta — Viết Skill

| Skill                  | Kích hoạt               | Mục đích                                                                                                                                                                                                   | Khi nào dùng                                                                                        |
| ---------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `writing-great-skills` | `/writing-great-skills` | Tài liệu tham chiếu nguyên tắc/từ vựng để viết SKILL.md tốt (model-invoked vs user-invoked, khi nào tách skill, "leading word", các failure mode: premature completion, duplication, sediment, sprawl...). | Khi tự viết mới hoặc chỉnh sửa một SKILL.md trong repo, kể cả các skill liệt kê trong tài liệu này. |

---

## 13. Điều hướng tổng (Router)

| Skill      | Kích hoạt   | Mục đích                                                                                                                                         | Khi nào dùng                                                                                                                  |
| ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `ask-matt` | `/ask-matt` | Bản đồ điều hướng toàn bộ luồng làm việc (idea → ship) — không tự làm việc gì, chỉ mô tả và liên kết tới skill/lệnh phù hợp cho từng tình huống. | Khi chưa biết nên bắt đầu từ skill/lệnh nào — ví dụ có ý tưởng mới, bug khó, dự án lớn mơ hồ, hoặc cần chuyển phiên làm việc. |

---

## 14. Không liên quan trực tiếp đến dự án ecommerce-next

Ba skill này tồn tại trong bộ skill dùng chung nhưng phục vụ mục đích cá nhân/dự án khác, không gắn với codebase Next.js hiện tại:

| Skill                | Mục đích                                                                                                        | Ghi chú                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `obsidian-vault`     | Tìm kiếm/tạo/quản lý ghi chú trong một Obsidian vault cố định (đường dẫn WSL `/mnt/d/Obsidian Vault/...`).      | Quản lý ghi chú cá nhân, không phải công cụ code.                       |
| `teach`              | Duy trì "teaching workspace" nhiều phiên để học một kỹ năng/khái niệm mới theo lộ trình dài hạn.                | Công cụ học tập cá nhân, không liên quan phát triển tính năng.          |
| `scaffold-exercises` | Scaffold cấu trúc bài tập (section/problem/solution/explainer) cho một công cụ khóa học nội bộ (`ai-hero-cli`). | Dành cho dự án dạng course/exercises, không áp dụng cho ecommerce-next. |

---

## Bảng tra nhanh theo tình huống

| Bạn đang...                                 | Dùng skill                                            |
| ------------------------------------------- | ----------------------------------------------------- |
| Chưa biết bắt đầu từ đâu                    | `ask-matt`                                            |
| Có ý tưởng/thiết kế mơ hồ cần siết chặt     | `grilling` / `grill-me` / `grill-with-docs`           |
| Cần thiết kế một API/interface mới          | `design-an-interface`                                 |
| Muốn rà soát kiến trúc toàn bộ codebase     | `improve-codebase-architecture`                       |
| Đã bàn xong 1 tính năng, cần chốt spec      | `to-spec` → `to-tickets`                              |
| Cần hỏi domain expert điều mình không biết  | `to-questionnaire`                                    |
| Có ý tưởng lớn, mơ hồ, nhiều phiên mới xong | `wayfinder`                                           |
| Muốn refactor an toàn, chia bước nhỏ        | `request-refactor-plan`                               |
| Báo bug bằng lời, muốn tự động file issue   | `qa`                                                  |
| Cần xử lý issue/PR mới trên tracker         | `triage`                                              |
| Đã có spec, cần code                        | `implement` (dùng `tdd` + `code-review` bên trong)    |
| Gặp bug khó/regression hiệu năng            | `diagnosing-bugs`                                     |
| Đang bị conflict merge/rebase               | `resolving-merge-conflicts`                           |
| Muốn chặn git push/reset nguy hiểm          | `git-guardrails-claude-code`                          |
| Thiết lập pre-commit hook                   | `setup-pre-commit`                                    |
| Cần sanity-check nhanh state/UI             | `prototype`                                           |
| Cần tra cứu tài liệu/API chính thức         | `research`                                            |
| Kết thúc phiên, cần bàn giao                | `handoff` / `claude-handoff`                          |
| Đang brainstorm nội dung bài viết           | `writing-fragments` → `writing-beats`/`writing-shape` |
| Sửa bản nháp bài viết có sẵn                | `edit-article`                                        |
| Đang viết một SKILL.md mới                  | `writing-great-skills`                                |
