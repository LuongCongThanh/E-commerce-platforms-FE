# Đánh giá UI/UX — Hệ thống màu & Design Tokens (`globals.css`)

> 📌 **Snapshot 07/06/2026** — đánh giá tại thời điểm; hệ màu đã được điều chỉnh sau đó.

> **Phạm vi:** `src/app/globals.css`
> **Ngày đánh giá:** 2026-06-07

---

## Tổng quan

Codebase sử dụng **OKLCH color space** — một lựa chọn hiện đại và đúng đắn. OKLCH có độ đồng đều cảm nhận (perceptual uniformity) vượt trội so với HSL/HEX, giúp các bước sáng tối trên scale thực sự đồng đều theo cảm nhận của mắt người. Đây là điểm cộng kỹ thuật lớn.

**Điểm tổng thể: 7.2 / 10**

| Hạng mục                 | Điểm | Nhận xét ngắn                                    |
| ------------------------ | ---- | ------------------------------------------------ |
| Kỹ thuật màu (OKLCH)     | 9/10 | Dùng đúng color space hiện đại                   |
| Tính thẩm mỹ tổng thể    | 7/10 | Ấm áp, năng động, nhưng hơi đơn điệu             |
| Hệ thống hóa (scale)     | 8/10 | Scale 11 bậc đầy đủ                              |
| Phân biệt vai trò màu    | 5/10 | Primary vs Secondary quá gần nhau                |
| Dark mode                | 8/10 | Được thiết kế cẩn thận                           |
| Accessibility / Contrast | 6/10 | Một số cặp màu không đạt WCAG AA                 |
| Token mapping (Shadcn)   | 5/10 | Conflict giữa custom tokens và Shadcn convention |

---

## 1. Phân tích từng nhóm màu

### 1.1 Primary — Cam-đỏ (hue 25°)

```css
primary-500: oklch(0.62 0.23 25)  /* ~#D4490A — cam-đỏ đậm */
primary-400: oklch(0.70 0.19 25)  /* ~#E06535 — cam nhạt hơn */
```

**Đánh giá: ✅ Tốt**

Màu cam-đỏ là lựa chọn kinh điển cho e-commerce (Shopee, Lazada, Amazon đều dùng vùng hue này). Kích thích cảm giác khẩn cấp và ham muốn mua hàng. Chroma 0.23 ở bậc 500 là mức đậm đủ để nổi bật mà không chói.

> **Lưu ý:** `primary-300` (`oklch(0.79 0.14 25)`) khá nhạt — không dùng làm màu text trên nền trắng vì sẽ fail WCAG.

---

### 1.2 Secondary — Đỏ đậm (hue 15°)

```css
secondary-500: oklch(0.57 0.22 15); /* ~#C83020 — đỏ gạch */
```

**Đánh giá: ⚠️ Có vấn đề nghiêm trọng**

Primary (hue 25°) và Secondary (hue 15°) chỉ cách nhau **10° trên vòng màu**. Mắt người rất khó phân biệt hai màu này khi đặt riêng lẻ. Điều này tạo ra vấn đề nghiêm trọng trong e-commerce:

> Khi đặt nút "Mua ngay" (primary) cạnh nút "Thêm vào giỏ" (secondary), user sẽ không nhận ra sự khác biệt về cấp độ ưu tiên của hai action.

**Khuyến nghị:** Đổi Secondary sang hue xa hơn để tạo phân cấp rõ ràng:

| Phương án                | Hue   | Cảm giác                          |
| ------------------------ | ----- | --------------------------------- |
| Blue (hiện đại, trust)   | ~220° | Tương phản tốt nhất với cam       |
| Teal (tươi mát)          | ~185° | Vẫn giữ năng lượng nhưng cool hơn |
| Deep Purple (sang trọng) | ~280° | Phù hợp nếu muốn premium          |

---

### 1.3 Accent — Vàng-cam (hue 55°)

```css
accent-500: oklch(0.72 0.22 55); /* ~#E8A020 — vàng-cam */
```

**Đánh giá: ✅ Màu đẹp nhưng bị "chôn vùi"**

Màu vàng-cam rất phù hợp để highlight giá khuyến mãi, badge "SALE", "HOT", điểm đánh giá sao. Chroma 0.22 tạo độ rực rỡ tốt.

**Vấn đề nghiêm trọng trong mapping:** Trong Shadcn token, `--accent` được gán là `oklch(0.96 0.006 30)` — **một màu xám nhạt trung tính**, hoàn toàn không liên quan đến accent scale đẹp đã định nghĩa. Kết quả là màu vàng-cam này **không bao giờ được sử dụng** bởi các Shadcn components.

---

### 1.4 Neutral — Xám ấm (hue 30°)

```css
neutral-50:  oklch(0.98 0.004 30)  /* trắng ngà ấm */
neutral-900: oklch(0.16 0.004 30)  /* xám than */
```

**Đánh giá: ✅ Điểm mạnh nhất của palette**

Xám ấm (warm gray) ở hue 30° hài hòa tự nhiên với Primary cam-đỏ vì chúng chia sẻ vùng hue gần nhau. Không bị "lạnh" như xám thuần, tạo cảm giác nhất quán và ấm áp.

Scale đủ 11 bậc, chroma thấp (0.003–0.01) — đúng với neutral. Text `neutral-900` trên `neutral-50` đạt contrast ratio ~18:1 (WCAG AAA ✅).

---

### 1.5 Semantic Colors

```css
success-500: oklch(0.60 0.18 145)  /* xanh lá */
warning-500: oklch(0.78 0.18 80)   /* vàng */
error-500:   oklch(0.58 0.24 10)   /* đỏ */
info-500:    oklch(0.58 0.18 250)  /* xanh dương */
```

**Đánh giá: ✅ Tốt về chọn hue**

Bốn màu trải đều trên vòng màu (10° / 80° / 145° / 250°) — thiết kế đúng nguyên tắc. Mỗi màu dễ phân biệt với nhau.

**Cảnh báo:** `warning-500` (hue 80°, `L=0.78`) rất sáng — contrast ratio chỉ ~2.5:1 trên nền trắng, **không đạt WCAG AA**. Cần dùng `warning-700` (`L=0.55`) cho text trong notification/alert.

---

## 2. Đánh giá tính thẩm mỹ tổng thể

### Cảm xúc mà palette truyền tải

| Cảm xúc                | Mức độ     | Phù hợp e-commerce?           |
| ---------------------- | ---------- | ----------------------------- |
| Năng động, cấp bách    | Cao        | ✅ Thúc đẩy mua hàng          |
| Ấm áp, thân thiện      | Trung bình | ✅ Tạo trust                  |
| Sang trọng, premium    | Thấp       | ⚠️ Không phù hợp luxury brand |
| Hiện đại, tech-forward | Cao        | ✅ OKLCH + glassmorphism      |
| Mát mẻ, bình tĩnh      | Không có   | ⚠️ Thiếu điểm cân bằng nhiệt  |

**Nhận xét:** Palette nghiêng hoàn toàn về vùng warm (hue 15°–55°). Sự vắng mặt của bất kỳ màu cool nào khiến interface trở nên đơn điệu và thiếu độ tương phản thị giác. Một màu cool accent (blue/teal) sẽ tạo ra "nhịp thở" cho trang.

### So sánh với các thương hiệu e-commerce lớn

| Thương hiệu | Primary     | Accent        | Nhận xét                   |
| ----------- | ----------- | ------------- | -------------------------- |
| Shopee      | Cam ~20°    | Đỏ            | Gần giống bạn              |
| Lazada      | Xanh ~210°  | Cam           | Có điểm cân bằng cool/warm |
| Tiki        | Xanh ~210°  | —             | Khác biệt rõ               |
| Bạn         | Cam-đỏ ~25° | Vàng-cam ~55° | Warm hoàn toàn             |

> Palette của bạn nằm đúng vùng tâm lý học màu cho e-commerce. Tuy nhiên, quá gần Shopee — sẽ khó tạo brand differentiation mạnh mẽ.

---

## 3. Phân tích Dark Mode

```css
.dark {
  --background: oklch(0.13 0.004 30); /* xám than ấm */
  --primary: oklch(0.7 0.19 25); /* cam — sáng hơn light mode */
  --card: oklch(0.16 0.004 30); /* card nền */
}
```

**Đánh giá: ✅ Được thiết kế cẩn thận**

- Background dark (`L=0.13`) đủ tối mà không quá đen thuần, có hơi ấm từ hue 30°
- Primary được làm sáng (`L=0.62 → 0.70`) trong dark mode — đúng nguyên tắc (màu trên nền tối cần lightness cao hơn để đạt contrast tương đương)
- `glass-bg` dark mode dùng `rgba(15, 15, 25, 0.6)` — có tone xanh tím nhẹ, tạo depth tốt

**Điểm trừ:** `--card` (`L=0.16`) chỉ chênh `+0.03L` so với `--background` (`L=0.13`). Card sẽ gần như "biến mất" vào background trong dark mode — thiếu visual layering.

**Khuyến nghị:** Tăng lightness card lên ít nhất `+0.05`:

```css
--card: oklch(0.18 0.004 30); /* L=0.18 thay vì 0.16 */
```

---

## 4. Vấn đề Mapping Shadcn/UI

Đây là **vấn đề nghiêm trọng nhất** trong thiết kế hiện tại.

### Conflict giữa custom scale và Shadcn convention

```css
/* Bạn định nghĩa accent là vàng-cam đẹp: */
--color-accent-500: oklch(0.72 0.22 55);

/* Nhưng @theme mapping lại override: */
--color-accent: var(--accent); /* trỏ về Shadcn --accent */

/* Và Shadcn --accent là: */
--accent: oklch(0.96 0.006 30); /* xám trắng nhạt! */
```

Bất kỳ component nào dùng `bg-accent` hay `text-accent` đều nhận màu xám trắng, **không phải vàng-cam như thiết kế**.

### Giải pháp

**Option A — Đổi tên scale tránh collision:**

```css
/* Thay --color-accent-* thành --color-brand-accent-* */
--color-brand-accent-500: oklch(0.72 0.22 55);
/* Dùng trong code: bg-brand-accent-500 */
```

**Option B — Override Shadcn --accent:**

```css
:root {
  --accent: oklch(0.95 0.05 55); /* light tint */
  --accent-foreground: oklch(0.42 0.13 55); /* dark text */
}
```

---

## 5. Accessibility Audit (Ước tính)

### Contrast Ratio — Light Mode

| Cặp màu                                          | Contrast ước tính | WCAG AA?                      |
| ------------------------------------------------ | ----------------- | ----------------------------- |
| `foreground` (L=0.16) trên `background` (L=1.0)  | ~17:1             | ✅ AAA                        |
| `primary-500` (L=0.62) trên `background` (L=1.0) | ~3.8:1            | ⚠️ Fail text, Pass large text |
| `muted-foreground` (L=0.58) trên `background`    | ~4.6:1            | ✅ AA borderline              |
| `warning-500` (L=0.78) trên white                | ~2.5:1            | ❌ Fail                       |
| `primary-300` (L=0.79) trên white                | ~2.3:1            | ❌ Fail                       |
| `error-500` (L=0.58) trên white                  | ~4.4:1            | ⚠️ Borderline                 |

**Action items:**

- Không dùng `primary-500` cho body text — chỉ dùng cho UI elements lớn (buttons ≥ 18px, headers)
- Dùng `primary-700` hoặc tối hơn cho text link
- Thay `warning-500` bằng `warning-700` (`L=0.55`) trong text notifications/alerts

---

## 6. Điểm nổi bật (Strengths)

### ✅ Glassmorphism được implement đúng cách

```css
@utility glass {
  backdrop-filter: blur(24px);
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
}
```

`blur(24px)` là mức tối ưu — đủ tạo glass effect mà không quá nặng về rendering performance. Pattern hiện đại (2024–2025), tạo độ sâu thị giác tốt.

### ✅ Spatial/3D Tokens

```css
--shadow-spatial-sm: 0 2px 10px -2px rgba(0, 0, 0, 0.1)... --shadow-spatial-lg: 0 20px 40px -15px rgba(0, 0, 0, 0.3)... --animate-float: float 6s
  ease-in-out infinite;
```

Shadow có phân cấp sm/lg — tốt. Animation float nhẹ nhàng cho hero elements. Cho thấy tư duy về **spatial hierarchy** rõ ràng.

### ✅ Warm Neutral — Lựa chọn thông minh

Xám ấm ở hue 30° là điểm hài hòa hoàn hảo với Primary cam. Hiếm thấy dev/designer chọn warm neutral thay vì xám lạnh mặc định.

### ✅ Font smoothing

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

Typography sắc nét trên retina screens.

### ✅ Inter + JetBrains Mono

Inter là font UI tốt nhất hiện tại (Notion, Linear, Vercel). JetBrains Mono cho code — chuyên nghiệp và consistent.

---

## 7. Điểm cần cải thiện (Weaknesses)

### ❌ Không có Typography Scale Tokens

Chỉ có `--font-sans` và `--font-mono`. Thiếu:

```css
/* Nên thêm vào @theme */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--leading-tight: 1.25;
--leading-normal: 1.5;
```

### ❌ Không có Transition/Duration Tokens

```css
/* Nên thêm */
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-fast: 120ms;
--duration-normal: 200ms;
--duration-slow: 350ms;
```

### ❌ Secondary color không có mục đích rõ ràng

10° cách Primary, chroma tương đương — không tạo được visual differentiation cho component hierarchy.

### ❌ Accent đẹp nhất bị lãng phí

`accent-500` (vàng-cam) là màu duy nhất thực sự "bắt mắt" và khác biệt trong palette, nhưng bị override bởi Shadcn mapping và không được sử dụng.

---

## 8. Đánh giá thẩm mỹ tổng thể

### Bắt mắt không?

**Palette này đẹp theo kiểu "an toàn và chuyên nghiệp"**, không phải đẹp theo kiểu "độc đáo và memorable". Màu cam-đỏ trên warm neutral là combination đã được chứng minh hiệu quả trong e-commerce. Tuy nhiên:

- Toàn bộ palette nằm trong vùng hue 10°–55° — rất hẹp
- Thiếu "contrast màu sắc" (chromatic contrast), chỉ có "contrast độ sáng" (luminance contrast)
- Khi nhìn toàn trang, interface sẽ cảm giác "nóng" và có thể gây mệt mỏi thị giác khi browse lâu

### Cần gì để lên level?

Thêm một điểm nhấn **cool** để tạo cân bằng nhiệt độ màu:

```css
/* Option: Blue accent */
--color-cool-accent-500: oklch(0.58 0.18 240); /* blue mang tính trust */

/* Dùng cho: link, info badge, secondary button */
```

Sự tương phản warm-vs-cool là kỹ thuật mà hầu hết các brand e-commerce thành công đều sử dụng.

---

## 9. Khuyến nghị theo thứ tự ưu tiên

### 🔴 Cao — ảnh hưởng trực tiếp UX

| #   | Vấn đề                                                     | File               | Effort  |
| --- | ---------------------------------------------------------- | ------------------ | ------- |
| 1   | Fix Secondary color sang hue khác biệt (≥60° cách Primary) | `globals.css`      | ~15 min |
| 2   | Fix Shadcn accent mapping — resolve conflict               | `globals.css`      | ~10 min |
| 3   | Dùng `warning-700` thay `warning-500` cho text             | Toàn bộ components | ~30 min |

### 🟡 Trung bình

| #   | Vấn đề                                                   | Effort  |
| --- | -------------------------------------------------------- | ------- |
| 4   | Tăng `--card` lightness trong dark mode (+0.05L)         | ~5 min  |
| 5   | Thêm Typography scale tokens                             | ~20 min |
| 6   | Thêm Transition/Duration tokens                          | ~15 min |
| 7   | Kiểm tra `primary-500` contrast khi làm CTA button label | ~10 min |

### 🟢 Thấp — nice-to-have

| #   | Vấn đề                                                | Effort  |
| --- | ----------------------------------------------------- | ------- |
| 8   | Thêm cool accent (blue/teal) để cân bằng warm palette | ~20 min |
| 9   | Cân nhắc đổi Secondary thành màu khác biệt hơn        | ~20 min |

---

## 10. Kết luận

Hệ thống màu được xây dựng trên **nền tảng kỹ thuật tốt** (OKLCH, glassmorphism, spatial tokens). Warm palette cam-đỏ phù hợp cho e-commerce và tạo cảm giác năng động, thúc đẩy mua hàng.

Điểm yếu tập trung ở **tính phân biệt vai trò màu** (Primary–Secondary quá gần, Accent bị override) và **accessibility** (một số cặp màu fail WCAG).

> Nếu fix được 3 vấn đề đỏ ở trên, điểm tổng thể sẽ tăng lên **8.5/10** — đây sẽ là một design system e-commerce đáng tự hào và dễ maintain lâu dài.

---

## Palette Reference

| Token           | Value OKLCH     | Màu ước tính | Dùng cho                          |
| --------------- | --------------- | ------------ | --------------------------------- |
| `primary-500`   | `0.62 0.23 25`  | Cam-đỏ đậm   | CTA button, badge chính           |
| `primary-700`   | `0.45 0.19 25`  | Cam-đỏ tối   | Text link, hover state            |
| `secondary-500` | `0.57 0.22 15`  | Đỏ gạch      | ⚠️ Quá gần primary                |
| `accent-500`    | `0.72 0.22 55`  | Vàng-cam     | Sale badge, rating stars          |
| `neutral-900`   | `0.16 0.004 30` | Xám than ấm  | Body text                         |
| `neutral-50`    | `0.98 0.004 30` | Trắng ngà    | Background                        |
| `success-500`   | `0.60 0.18 145` | Xanh lá      | Đơn hàng thành công               |
| `warning-700`   | `0.55 0.15 80`  | Vàng tối     | Text cảnh báo (dùng 700 thay 500) |
| `error-500`     | `0.58 0.24 10`  | Đỏ           | Destructive action                |
| `info-500`      | `0.58 0.18 250` | Xanh dương   | Thông tin                         |
