# 06. Hướng dẫn Skill Workflow

> 📌 **Snapshot lịch sử (06/2026)** — tài liệu planning, không còn được cập nhật. Hiện trạng: xem [docs/README.md](../README.md) và [docs/architecture/](../architecture/).

Cập nhật lần cuối: 2026-06-04
Chủ sở hữu: FE Lead
Mục đích: Các luồng skill chuẩn hóa cho các tác vụ phát triển phổ biến. Áp dụng những luồng này mỗi khi có yêu cầu thuộc loại tác vụ tương ứng.

---

## Cách đọc hướng dẫn này

Mỗi loại tác vụ bên dưới bao gồm:

- **Trigger** — khi nào luồng này bắt đầu
- **Skill sequence** — các bước theo thứ tự với skill cần gọi ở mỗi bước
- **Gate** — điều kiện phải đúng trước khi tác vụ được coi là hoàn thành
- **Skip rules** — khi nào một bước là tùy chọn
- **Ví dụ sử dụng** — yêu cầu mẫu cụ thể và cách luồng áp dụng

Cú pháp gọi skill: `/skill-name` trong Claude Code CLI.

---

## Flow 1 — Xây dựng Page

**Trigger:** "Build trang [X]", "Tạo trang [X]", "Thêm trang mới cho [X]"

```
Step 1  /concise-planning
        → Xác định: trang cần dữ liệu gì, route nào, SSR hay CSR,
          component nào sẽ tái sử dụng, phạm vi nằm ngoài là gì.
        → Output: danh sách bullet ngắn. Không tiến hành cho đến khi scope được khóa.

Step 2  /nextjs-app-router-patterns
        → Xác nhận: route group, layout nesting, server vs client boundary,
          generateMetadata shape, có cần loading.tsx / error.tsx không.

Step 3  /frontend-design
        → Xác định cấu trúc visual trước khi viết JSX:
          vùng layout, spacing scale, color token, mobile breakpoint.

Step 4  Implement page
        → Dùng alias @/*. Không dùng ../. Tuân theo convention trong CLAUDE.md.
        → Server Components cho data fetch. Client Components chỉ dành cho interactivity.

Step 5  /tailwind-patterns
        → Review: thứ tự utility class, không dùng magic number, responsive variant đúng,
          không có inline style.

Step 6  /seo-audit
        → Chỉ áp dụng nếu trang public-facing (shop, product, category).
        → Kiểm tra: generateMetadata, Open Graph, canonical, sitemap entry.

Step 7  /ui-review
        → Review: spacing discipline, mobile ergonomics, có đủ trạng thái empty/loading/error.

Step 8  /lint-and-validate
        → npm run lint + npm run build phải pass trước khi commit.

Step 9  /git-pushing
        → Commit với message rõ ràng. Push lên feature branch.
```

**Gate:** lint pass, build pass, trang render trên mobile không bị vỡ layout, tất cả trạng thái (loading/error/empty) đã được xử lý.

**Skip rules:**

- Bỏ qua Step 6 nếu trang chỉ dành cho admin hoặc sau auth.
- Bỏ qua Step 3 nếu tái sử dụng pattern layout có sẵn mà không cần quyết định design.

**Ví dụ sử dụng:**

> User: "Build trang chi tiết sản phẩm"

```
1. /concise-planning
   → Scope: SSR page tại /[locale]/(shop)/san-pham/[slug], cần dữ liệu sản phẩm từ
     GET /api/products/:slug, tái sử dụng ProductImages + VariantSelector + AddToCartButton,
     generateMetadata cho SEO, skeleton loading.tsx. Ngoài scope: phần đánh giá (Phase 2).

2. /nextjs-app-router-patterns
   → Route: src/app/[locale]/(shop)/san-pham/[slug]/page.tsx (Server Component)
   → generateMetadata() fetch slug → trả về title/description/og:image
   → Client boundary: chỉ AddToCartButton (cần cart store)

3. /frontend-design
   → Layout: gallery ảnh bên trái (60%), info panel bên phải (40%) trên desktop
   → Mobile: xếp chồng, ảnh trước, sticky CTA ở dưới
   → Spacing scale: gap-6 giữa các section, gap-2 trong từng field

4. Implement page.tsx + loading.tsx

5. /tailwind-patterns → review thứ tự class, kiểm tra lg: breakpoint

6. /seo-audit → verify generateMetadata, og:image từ Cloudinary, canonical URL

7. /ui-review → kiểm tra mobile sticky CTA, trạng thái variant rỗng, image skeleton

8. /lint-and-validate → npm run lint + npm run build

9. /git-pushing → git commit "feat(shop): add product detail page with SSR metadata"
```

---

## Flow 2 — Xây dựng Component

**Trigger:** "Build component [X]", "Tạo [X] card/button/modal/drawer"

```
Step 1  /concise-planning
        → Xác định: props interface, variant cần thiết, trang nào sẽ dùng nó,
          có cần client interactivity không, phiên bản nhỏ nhất hữu ích là gì.

Step 2  /frontend-design
        → Contract visual trước code: size, spacing, color token, trạng thái hover/focus/disabled.
        → Nếu nhiều variant: thiết kế cấu trúc CVA trước.

Step 3  Implement component
        → TypeScript props với kiểu dữ liệu tường minh. Không dùng `any`.
        → CVA cho variant nếu có hơn 2 trạng thái visual.
        → Export từ shared/components/base/ (primitives) hoặc shared/components/common/ (domain-agnostic) nếu tái sử dụng được qua các feature.

Step 4  /tailwind-patterns
        → Review thứ tự class, responsive behavior, dark mode nếu áp dụng.

Step 5  /ui-review
        → Kiểm tra: focus ring hiển thị, color contrast đạt, touch target >= 44px trên mobile,
          không có giá trị pixel cứng vỡ ở kích thước khác.

Step 6  /unit-testing-test-generate
        → Viết test cho: render với required props, mỗi variant, edge case prop (rỗng, text dài).
        → Dùng Vitest + Testing Library. File: component-name.test.tsx đặt cạnh component.

Step 7  /lint-and-validate
        → Phải pass trước khi commit.
```

**Gate:** component render đủ tất cả variant, focus state hiển thị, file test tồn tại và pass.

**Skip rules:**

- Bỏ qua Step 6 cho các leaf component chỉ presentational không có logic (ví dụ: static badge).
- Bỏ qua Step 2 nếu component chỉ là wrapper trực tiếp của Shadcn primitive, không có quyết định design thêm.

**Ví dụ sử dụng:**

> User: "Build component ProductCard cho trang listing"

```
1. /concise-planning
   → Props: { id, name, slug, price, originalPrice?, image, badge? }
   → Variants: default | out-of-stock | sale
   → Dùng bởi: trang danh sách sản phẩm, section featured trên homepage
   → Interactivity: không — pure presentational, điều hướng khi click qua <Link>
   → Phiên bản nhỏ nhất: image + name + price, không có nút wishlist (Phase 2)

2. /frontend-design
   → Size: image aspect-ratio cố định (4:3), grid 2-col mobile / 4-col desktop
   → Sale badge: absolute top-left, nền đỏ
   → Out-of-stock: ảnh grayscale + overlay "Hết hàng"
   → Hover: shadow-md + scale-[1.01] transition

3. Implement ProductCard.tsx với CVA variant

4. /tailwind-patterns → kiểm tra group-hover, aspect-ratio class, truncate trên tên

5. /ui-review → kiểm tra touch target (cả card có thể click), contrast trên badge text

6. /unit-testing-test-generate
   → test: render name và price, hiện sale badge khi originalPrice > price,
     hiện overlay out-of-stock khi variant="out-of-stock", truncate tên sản phẩm dài

7. /lint-and-validate
```

---

## Flow 3 — Review Code (PR / Branch Review)

**Trigger:** "Review code này", "Review PR", "Review thay đổi của tôi", "Cái này có đúng không?"

```
Step 1  /code-review-checklist
        → Chạy qua: correctness, types, error handling, security surface,
          performance (re-render không cần thiết, N+1 fetch), naming clarity.

Step 2  /find-bugs
        → Tập trung vào: logic error, edge case chưa xử lý, thiếu null check,
          dependency array sai trong useEffect/useMemo.

Step 3  /ui-review
        → Chỉ áp dụng nếu diff có thay đổi JSX/TSX.
        → Kiểm tra: spacing, accessibility, mobile behavior, state coverage.

Step 4  /security-scanning-security-sast
        → Chỉ áp dụng nếu diff chạm vào: auth, API route, server action,
          render user input, file upload, biến môi trường.

Step 5  /lint-and-validate
        → Chạy locally. Tất cả findings từ step 1–4 phải được giải quyết trước khi merge.
```

**Gate:** tất cả checklist items đã giải quyết, lint pass, không còn security finding mở.

**Skip rules:**

- Bỏ qua Step 3 nếu diff chỉ là backend/utility (không có UI change).
- Bỏ qua Step 4 nếu diff chỉ là styling hoặc config.

**Ví dụ sử dụng:**

> User: "Review implementation form checkout của tôi"

```
1. /code-review-checklist
   → Correctness: form submit có chỉ kích hoạt một lần không? loading state có disable button không?
   → Types: tất cả form field có được typed qua Zod schema không? có `any` trong resolver không?
   → Error handling: lỗi network xảy ra thì sao — có hiện toast không?
   → Performance: component có re-render mỗi keystroke không? (RHF phải ngăn điều này)
   → Naming: `handleSubmit` có shadow handleSubmit của RHF không?

2. /find-bugs
   → Edge case: nếu user submit với cart rỗng thì sao? có được validate không?
   → Thiếu null check: shippingAddress?.id — xử lý thế nào nếu user chưa có địa chỉ?
   → useEffect dependency array: [cartItems] có gây stale closure trên tính total không?

3. /ui-review (có JSX)
   → Error message: có hiện inline dưới mỗi field không, không chỉ là toast?
   → Mobile: nút submit có ở trên fold bàn phím trên màn hình nhỏ không?
   → Loading state: button có bị disable + hiện spinner khi đang submit không?

4. /security-scanning-security-sast (chạm user input + API call)
   → Tổng tiền có tính server-side không? Không bao giờ tin giá từ client.
   → Auth token có đến từ interceptor, không hardcode trong form không?
   → Error message từ API có được sanitize trước khi render không?

5. /lint-and-validate → npm run lint
```

---

## Flow 4 — Tích hợp API

**Trigger:** "Tích hợp API [X]", "Kết nối đến [endpoint]", "Gọi backend cho [X]"

```
Step 1  /concise-planning
        → Xác nhận: endpoint URL, HTTP method, request shape, response shape,
          cần auth không (JWT header?), error code cần xử lý, loading/error UI.
        → Không viết fetch code nào cho đến khi contract được xác nhận.

Step 2  /api-documentation
        → Verify contract API khớp với những gì backend đã publish.
        → Cập nhật shared/constants/api-endpoints.ts với endpoint constant mới.
        → Thêm hoặc cập nhật Zod schema trong shared/types/ cho request và response.

Step 3  /tanstack-query-expert
        → Chọn primitive phù hợp: useQuery (đọc), useMutation (ghi), useInfiniteQuery (danh sách phân trang).
        → Xác định: cấu trúc queryKey, staleTime, gcTime, retry policy, điều kiện enabled.
        → Đặt hook trong thư mục _hooks/ của feature.

Step 4  Implement trong component
        → Wire hook vào. Xử lý tường minh: isPending, isError, data state.
        → Dùng `http` từ `@/shared/lib/http/client`. Không bao giờ gọi axios trực tiếp.

Step 5  /api-security-best-practices
        → Kiểm tra: auth token gắn qua interceptor (không manual), không có secret trong client code,
          error message không lộ nội bộ server, có xử lý rate-limit.

Step 6  /zod-validation-expert
        → Validate API response tại boundary. Parse với schema.safeParse().
        → Nếu parse thất bại: log lên Sentry, hiện error thân thiện với user, không crash.

Step 7  /e2e-testing
        → Viết Playwright test cho happy path của integration này.
        → Nếu là mutation: test thêm error path (mock 500, kiểm tra toast/error UI).

Step 8  /lint-and-validate + /git-pushing
```

**Gate:** loading/error/success state đều được xử lý trong UI, Zod validation có mặt, ít nhất một e2e test cho happy path, lint pass.

**Skip rules:**

- Bỏ qua Step 7 cho các integration chỉ dành cho admin nếu e2e coverage đã tồn tại cho flow đó.

**Ví dụ sử dụng:**

> User: "Tích hợp API tạo đơn hàng vào trang checkout"

```
1. /concise-planning
   → Endpoint: POST /api/orders/
   → Request: { items: [{variant_id, quantity}], shipping_address_id, payment_method: "COD" }
   → Response: { id, status: "PENDING", total, created_at }
   → Auth: bắt buộc (JWT qua interceptor)
   → Error code: 400 (validation), 409 (hết hàng), 500 (server error)
   → UI thành công: redirect đến /checkout/success?orderId=X
   → UI lỗi: toast với message, KHÔNG xóa form

2. /api-documentation
   → Thêm vào api-endpoints.ts: ORDERS: { CREATE: '/api/orders/' }
   → Thêm OrderCreateRequest + OrderCreateResponse Zod schema vào shared/types/order.ts

3. /tanstack-query-expert
   → useMutation (write operation, không phải query)
   → onSuccess: clear cart store, redirect đến trang success
   → onError: hiện toast với error.message
   → Không retry với 4xx (lỗi user), retry 1 lần với 5xx

4. Wire usePlaceOrder hook vào CheckoutPage
   → isPending → disable submit button, hiện spinner
   → isError → hiện toast (đã xử lý trong onError)
   → isSuccess → xử lý trong onSuccess callback

5. /api-security-best-practices
   → Tổng tiền KHÔNG có trong request body — backend tính từ variant_id + quantity
   → JWT gắn bởi interceptor, không từ form state
   → 409 error message hiện là "Sản phẩm vừa hết hàng", không phải message server thô

6. /zod-validation-expert
   → Parse response với OrderCreateResponse.safeParse(data)
   → Khi parse thất bại: Sentry.captureException + hiện generic error toast

7. /e2e-testing
   → Happy path: điền checkout → submit → xem trang success → order ID trong URL
   → Error path: mock 409 → submit → xem toast "hết hàng" → form vẫn còn nội dung
```

---

## Flow 5 — UI Review (Độc lập)

**Trigger:** "Review UI", "Kiểm tra design này", "Cái này trông có ổn không?", "Review [page/component] về mặt visual"

```
Step 1  /ui-review
        → Kiểm tra hệ thống:
          □ Spacing dùng design token, không có magic number
          □ Typography scale nhất quán
          □ Color contrast đạt (4.5:1 cho text, 3:1 cho UI element)
          □ Focus ring hiển thị trên tất cả interactive element
          □ Touch target >= 44px trên mobile
          □ Empty state tồn tại
          □ Loading state tồn tại
          □ Error state tồn tại

Step 2  /frontend-design
        → Kiểm tra chất lượng visual:
          □ Visual hierarchy rõ ràng (đâu là hành động chính?)
          □ Whitespace cân bằng, không bí hay quá thưa
          □ Mobile layout hoạt động không có horizontal scroll
          □ Component align với pattern hiện có trong codebase

Step 3  /accessibility-compliance-accessibility-audit
        → Áp dụng nếu trang hướng đến khách hàng.
        → Kiểm tra: HTML semantic (button vs div), aria-label trên icon button,
          form label liên kết với input, có alt text cho ảnh.

Step 4  /fixing-motion-performance
        → Chỉ áp dụng nếu trang có animation hoặc transition.
        → Kiểm tra: không animate property gây layout, will-change dùng đúng,
          không có scroll-linked effect giật lag.
```

**Gate:** tất cả checkbox item trong Step 1 pass, không có critical a11y violation.

**Skip rules:**

- Bỏ qua Step 3 cho trang chỉ dành cho admin (a11y vẫn tốt nhưng ưu tiên thấp hơn).
- Bỏ qua Step 4 nếu trang không có animation.

**Ví dụ sử dụng:**

> User: "Review UI cart drawer"

```
1. /ui-review
   □ Spacing: gap-4 giữa các item nhất quán? không có mt-[13px] hardcode?
   □ Typography: tên sản phẩm truncate ở 1 dòng, giá dùng font-semibold?
   □ Contrast: text nút "Xóa" trên nền trắng — đạt 4.5:1?
   □ Focus: các nút quantity stepper có focus ring hiển thị không?
   □ Touch: nút "+" và "-" có tối thiểu 44px × 44px trên mobile không?
   □ Empty state: "Giỏ hàng trống" với CTA đến shop?
   □ Loading: skeleton khi cart đang sync?
   □ Error: nếu xóa item thất bại, toast + item vẫn còn trong list?

2. /frontend-design
   → Hành động chính: nút "Thanh toán" — có chiếm ưu thế visual (full-width, màu primary) không?
   → Hierarchy: ảnh sản phẩm > tên > giá > số lượng — thứ tự này có rõ không?
   → Mobile: drawer có chiếm full màn hình trên điện thoại nhỏ (< 375px) không?

3. /accessibility-compliance-accessibility-audit
   → Icon button "Xóa": có aria-label="Xóa sản phẩm [tên]" không?
   → Drawer: role="dialog", aria-modal="true", aria-label="Giỏ hàng"?
   → Focus trap: khi drawer mở, focus có chuyển đến element tương tác đầu tiên không?
   → Quantity input: có aria-label="Số lượng [tên sản phẩm]" không?
```

---

## Flow 6 — Viết Test Case

### 6A — Unit Test (Vitest)

**Trigger:** "Viết unit test cho [X]", "Thêm test vào [hook/util/component]"

```
Step 1  /concise-planning
        → Liệt kê: behavior nào cần coverage, edge case nào tồn tại,
          tập tối thiểu nào mang lại sự tự tin thực sự (không phải vanity coverage).

Step 2  /unit-testing-test-generate
        → Tạo test case cho: happy path, edge case, error case.
        → Cho hook: dùng renderHook từ @testing-library/react.
        → Cho util: test hàm thuần, không cần mock.
        → Cho component: test behavior không phải implementation (cái user thấy/làm).

Step 3  Chạy test
        → npx vitest run src/path/to/file.test.ts
        → Coverage: npm run test:coverage — phải giữ >= 70% trên shared/lib/** và shared/hooks/**

Step 4  /lint-and-validate
```

**Gate:** test pass, không có test bị skip mà không có lý do, ngưỡng coverage được duy trì.

**Ví dụ sử dụng:**

> User: "Viết unit test cho hook useCart"

```
1. /concise-planning
   → Behavior cần cover:
     - addItem: thêm sản phẩm mới, tăng quantity nếu đã tồn tại
     - removeItem: xóa item theo variant_id
     - updateQuantity: clamp về tối thiểu 1, tối đa stock
     - clearCart: làm rỗng danh sách
     - totalPrice: tính đúng với nhiều item
     - persistence: cart tồn tại sau khi reload trang (localStorage)
   → Edge case: thêm item với qty 0, update lên quantity > stock, xóa item không tồn tại

2. /unit-testing-test-generate
   → File: src/shared/hooks/__tests__/useCart.test.ts
   → Cart dùng useSyncExternalStore + module-level state, không phải Zustand.
     Reset state giữa các test bằng resetCartState() được export từ useCart.ts.
   → Cấu trúc test:
     describe('useCart', () => {
       beforeEach(() => resetCartState())

       it('adds a new item to empty cart')
       it('increases quantity when same variantId added')
       it('removes item by variantId')
       it('calculates total across all items')
       it('clearCart resets to empty array')
     })

3. npx vitest run src/shared/hooks/__tests__/useCart.test.ts

4. /lint-and-validate
```

---

### 6B — E2E Test (Playwright)

**Trigger:** "Viết e2e test cho [flow]", "Thêm Playwright test cho [journey]"

```
Step 1  /concise-planning
        → Xác định: user journey nào, URL entry point, điều kiện tiên quyết (đã đăng nhập chưa?),
          thành công trông như thế nào, error path nào cần cover.

Step 2  /e2e-testing
        → Cấu trúc test: arrange (setup state) → act (user action) → assert (kết quả).
        → Dùng page object model nếu journey trải qua hơn 3 trang.
        → Target locator bằng role/label, không phải CSS selector hay test-id (ưu tiên accessible query).

Step 3  /playwright-skill
        → Chạy locally: npx playwright test --headed để verify visual.
        → Kiểm tra: không có hardcoded wait (dùng waitForResponse / waitForSelector).
        → Verify test deterministic: chạy 3 lần, phải pass cả 3.

Step 4  /lint-and-validate + /git-pushing
```

**Gate:** test pass 3 lần liên tiếp, cover happy path + ít nhất một error path, không có flaky wait.

**Ví dụ sử dụng:**

> User: "Viết Playwright test cho flow checkout COD"

```
1. /concise-planning
   → Journey: Guest user → trang sản phẩm → thêm vào giỏ → checkout → đặt đơn COD → trang success
   → Điều kiện tiên quyết: không (guest checkout cho phép)
   → Thành công: order ID hiển thị trên /checkout/success, email xác nhận được gửi
   → Error path: submit với địa chỉ rỗng → xem validation error (không phải server crash)

2. /e2e-testing
   → File: e2e/checkout-cod.spec.ts
   → Cấu trúc:
     test('guest user completes COD checkout', async ({ page }) => {
       // Arrange
       await page.goto('/san-pham/ao-thun-basic')

       // Act - add to cart
       await page.getByRole('button', { name: 'Thêm vào giỏ' }).click()
       await page.getByRole('link', { name: 'Thanh toán' }).click()

       // Act - fill shipping form
       await page.getByLabel('Họ và tên').fill('Nguyễn Văn A')
       await page.getByLabel('Số điện thoại').fill('0901234567')
       await page.getByLabel('Địa chỉ').fill('123 Lê Lợi, Q1, TP.HCM')

       // Act - place order
       await page.getByRole('button', { name: 'Đặt hàng' }).click()

       // Assert
       await page.waitForURL('**/checkout/success**')
       await expect(page.getByText('Đặt hàng thành công')).toBeVisible()
       await expect(page.getByTestId('order-id')).toContainText('ORD-')
     })

     test('shows validation error on empty address', async ({ page }) => {
       // ...điều hướng đến checkout...
       await page.getByRole('button', { name: 'Đặt hàng' }).click()
       await expect(page.getByText('Vui lòng nhập địa chỉ')).toBeVisible()
       await expect(page).not.toHaveURL('**/checkout/success**')
     })

3. npx playwright test e2e/checkout-cod.spec.ts --headed
   → Chạy 3 lần. Phải pass cả 3.
```

---

## Flow 7 — Full Feature Flow (Page → Component → API → Test)

**Trigger:** "Build feature [X] end-to-end", "Implement [feature] từ đầu"

Flow này kết hợp Flow 1–6 theo thứ tự. Chạy theo thứ tự sau:

```
Phase 1: Lên kế hoạch
  /concise-planning  →  scope đầy đủ của feature: page, component, API endpoint, test cần thiết.
                         Output checklist. Khóa scope trước khi viết code.

Phase 2: API Contract trước
  /api-documentation  →  xác nhận tất cả endpoint, request/response shape, yêu cầu auth.
  → Cập nhật api-endpoints.ts và Zod schema TRƯỚC khi build UI.
  → Frontend và backend phải đồng ý về contract. Không dùng mock data trong production code.

Phase 3: Build Component (bottom-up)
  → Với mỗi component cần: chạy Flow 2 (Build Component).
  → Build leaf component trước (button, card), rồi đến composite component.

Phase 4: Build Page
  → Chạy Flow 1 (Build Page), tham chiếu các component đã build ở Phase 3.

Phase 5: Wire API
  → Chạy Flow 4 (API Integration) cho mỗi endpoint mà page cần.

Phase 6: Review
  → Chạy Flow 5 (UI Review) trên trang hoàn thành.
  → Chạy Flow 3 (Code Review) trên toàn bộ diff.

Phase 7: Test
  → Chạy Flow 6A (unit test) cho các hook/util quan trọng.
  → Chạy Flow 6B (e2e test) cho primary user journey.

Phase 8: Ship
  /lint-and-validate  →  npm run lint + npm run test + npm run build — tất cả phải pass.
  /git-pushing        →  push lên feature branch, mở PR.
```

**Gate:** tất cả phase gate từ Flow 1–6 đã đáp ứng, CI pass trên PR.

**Ví dụ sử dụng:**

> User: "Build trang danh sách sản phẩm với filter và search"

```
Phase 1 /concise-planning
  → Page: /danh-muc/[slug] (SSR, SEO)
  → Component: ProductCard, FilterSidebar, SortDropdown, Pagination, SearchBar
  → API: GET /api/products/?category=&search=&min_price=&max_price=&ordering=&page=
  → Test: hook useProducts (unit), filter → kết quả (e2e)
  → Ngoài scope: lưu filter, infinite scroll (Phase 2)

Phase 2 /api-documentation
  → Xác nhận response shape: { results: Product[], count, next, previous }
  → Thêm PRODUCTS.LIST vào api-endpoints.ts
  → Thêm ProductListResponse Zod schema

Phase 3 Build Component (Flow 2 cho mỗi cái)
  → ProductCard (tái sử dụng nếu đã có)
  → FilterSidebar (price range, category checkbox)
  → SortDropdown (mới nhất / giá tăng / giá giảm)
  → Pagination (prev/next, indicator trang hiện tại)

Phase 4 Build Page (Flow 1)
  → src/app/[locale]/(shop)/danh-muc/[slug]/page.tsx
  → SSR: fetch sản phẩm ban đầu server-side cho SEO
  → Client: filter/sort thay đổi trigger useQuery refetch

Phase 5 Wire API (Flow 4)
  → useProducts({ category, search, filters, page }) với useQuery + useInfiniteQuery
  → URL search param sync với filter state (dùng nuqs hoặc searchParams)

Phase 6 Review
  → Flow 5: UI Review trên trang listing (grid layout, filter panel mobile)
  → Flow 3: Code review trên toàn bộ diff

Phase 7 Test
  → Flow 6A: hook useProducts — queryKey đúng, filter param gắn vào URL
  → Flow 6B: user search "áo" → xem kết quả filtered → đổi sang giá tăng → kết quả reorder

Phase 8 /lint-and-validate + /git-pushing
```

---

## Flow 8 — Đọc Docs → Implement

**Trigger:** "Đọc [tài liệu/spec/PRD] và implement", "Implement dựa trên [requirements doc]"

```
Step 1  Đọc tài liệu
        → Xác định: cần build gì, acceptance criteria, item ngoài scope,
          API contract được tham chiếu, design reference được link.

Step 2  /concise-planning
        → Chuyển tài liệu thành implementation checklist theo thứ tự.
        → Mỗi item phải: cụ thể, có thể test, giới hạn trong một loại tác vụ (page / component / API).
        → Ghi rõ các điểm mơ hồ — không giả định, hỏi trước khi code.

Step 3  Xác nhận kế hoạch với user
        → Chia sẻ checklist. Xin xác nhận trước khi viết code.
        → Nếu doc tham chiếu API: xác nhận contract với /api-documentation trước.
        → Nếu doc tham chiếu design: xác nhận UI contract với /frontend-design trước.

Step 4  Thực thi từng item
        → Với mỗi checklist item, áp dụng flow tương ứng:
          - Item Page       → Flow 1
          - Item Component  → Flow 2
          - Item API        → Flow 4
          - Item Test       → Flow 6A hoặc 6B

Step 5  Verify so với tài liệu gốc
        → Đọc lại acceptance criteria trong doc.
        → Kiểm tra từng item có được đáp ứng. Không tự khai hoàn thành — verify tường minh.

Step 6  /lint-and-validate + /git-pushing
```

**Gate:** mọi acceptance criteria trong doc được verify đáp ứng, lint pass, build pass.

**Skip rules:**

- Không bao giờ bỏ qua Step 3. Implement mà không xác nhận lãng phí thời gian khi requirement mơ hồ.
- Không bao giờ bỏ qua việc verify tường minh ở Step 5. Đọc và implement không có nghĩa là đã xong.

**Ví dụ sử dụng:**

> User: "Đọc docs/planning/02-roadmap.md (mục Priority backlog) và implement feature cart"

```
Step 1  Đọc backlog doc
  → Tìm thấy: "Cart: add/remove/update quantity, persist to localStorage, hiện item count ở header"
  → Acceptance criteria: item tồn tại sau reload trang, count badge cập nhật ngay, hiện empty state

Step 2  /concise-planning
  → Checklist:
    [ ] Cart store dùng useSyncExternalStore + module-level state, persist qua localStorage ((shop)/_lib/hooks/useCart.ts) — KHÔNG dùng Zustand
    [ ] Actions addItem / removeItem / updateQuantity / clearCart
    [ ] Component CartDrawer (mở/đóng qua icon ở header)
    [ ] Component CartItemRow (ảnh, tên, quantity stepper, nút xóa)
    [ ] Component CartBadge (item count ở header)
    [ ] Wire CartDrawer vào header
    [ ] Unit test: cart store action
    [ ] E2E: thêm vào giỏ → count badge cập nhật → drawer mở → hiện item đúng

Step 3  Xác nhận checklist với user trước khi code

Step 4  Thực thi:
  → CartStore    → (useSyncExternalStore pattern, không phải Zustand — Flow 2 cho component)
  → CartDrawer   → Flow 2 (component)
  → CartItemRow  → Flow 2 (component)
  → CartBadge    → Flow 2 (component)
  → Wire vào header → Flow 1 partial (chỉnh sửa layout hiện tại)
  → Unit test    → Flow 6A
  → E2E test     → Flow 6B

Step 5  Verify:
  → Reload trang → item vẫn trong giỏ ✓
  → Thêm item → badge count tăng ngay ✓
  → Xóa tất cả item → hiện trạng thái "Giỏ hàng trống" ✓
  → npm run test → tất cả pass ✓

Step 6  /lint-and-validate + /git-pushing
```

---

## Flow 9 — Yêu cầu & Nhận Code Review

**Trigger:** "Yêu cầu code review", "Tôi muốn feedback về code của mình", "Tôi làm thế này có đúng không?",
"Review những gì tôi vừa viết trước khi push"

Flow này dành cho khi **bạn** đã viết code và muốn nhận feedback có cấu trúc — khác với Flow 3 là review code của người khác.

```
Step 1  /requesting-code-review
        → Chuẩn bị context trước khi xin review:
          - Code này làm gì? (một câu)
          - Concern hoặc câu hỏi cụ thể là gì? (không chỉ "cái này có ổn không?")
          - Bạn đã kiểm tra gì rồi?
          - Có trade-off hoặc ràng buộc đã biết không?
        → Output: yêu cầu review rõ ràng với scope đã xác định.

Step 2  /code-review-checklist
        → Self-review trước bằng checklist trước khi hỏi Claude:
          □ Type đúng, không có `any`
          □ Tất cả async error đã được xử lý
          □ Không có giá trị hardcode thuộc về constants/env
          □ Không có business logic trong component
          □ Test tồn tại cho critical path
          □ Import dùng alias @/* (không có ../)

Step 3  Submit cho Claude với context từ Step 1
        → Chia sẻ file(s) hoặc diff cụ thể, không phải toàn bộ codebase.
        → Đặt câu hỏi cụ thể, không phải open-ended "review tất cả".

Step 4  /receiving-code-review
        → Khi Claude trả về findings, xử lý chúng:
          - Severity: Critical (phải fix trước merge) / Suggestion (cải tiến tùy chọn)
          - Với mỗi critical: fix nó, sau đó chạy lại /lint-and-validate
          - Với mỗi suggestion: đánh giá và quyết định — không auto-accept tất cả
          - Phản bác nếu suggestion mâu thuẫn với project convention (CLAUDE.md được ưu tiên)

Step 5  /lint-and-validate
        → Sau khi áp dụng fix: phải pass trước khi đóng review loop.

Step 6  /git-pushing
        → Commit code đã được review + fix.
```

**Gate:** tất cả critical finding đã giải quyết, lint pass, reviewer (Claude) xác nhận không còn blocker.

**Skip rules:**

- Bỏ qua Step 2 (self-review) chỉ khi cần sanity check nhanh cho thay đổi nhỏ.
- Không bỏ qua bước đánh giá ở Step 4 — không phải mọi suggestion đều cần áp dụng.

**Ví dụ sử dụng:**

> User: "Review hook useAuth của tôi trước khi push"

```
Step 1  /requesting-code-review
  → Context đã chuẩn bị:
    "useAuth quản lý JWT token storage và cung cấp login/logout/refresh.
     Concern của tôi: logic refresh token có đúng không? Tôi không chắc interceptor
     có thể gây infinite loop khi 401. Tôi đã kiểm tra: type đúng, logout clear
     localStorage. Tôi chưa test scenario refresh thất bại."

Step 2  Self-review checklist
  □ Types: AuthUser type từ shared/types, không `any` ✓
  □ Async error: login() có try/catch, refresh() thì không ← flag này
  □ Không có giá trị hardcode: token key từ constants ✓
  □ Không có business logic trong component: hook ở shared/hooks/ ✓
  □ Test: chưa có ← flag này
  □ Import: tất cả dùng @/* ✓

Step 3  Submit cho Claude
  → Chia sẻ: src/shared/hooks/use-auth.ts
  → Câu hỏi cụ thể: "Xử lý 401 trong interceptor có đúng không?
    useRefreshToken bên trong interceptor có thể tạo infinite loop
    nếu chính refresh endpoint trả về 401 không?"

Step 4  /receiving-code-review
  → Claude tìm thấy:
    CRITICAL: refresh() thiếu try/catch — nếu refresh endpoint trả 401,
              interceptor retry vô hạn. Fix: thêm flag isRefreshing + queue.
    SUGGESTION: tách token constant ra file auth-constants.ts riêng.

  → Hành động với Critical: fix pattern isRefreshing flag → áp dụng
  → Hành động với Suggestion: đánh giá — project nhỏ, constants.ts ổn → bỏ qua

Step 5  /lint-and-validate → pass

Step 6  /git-pushing → "fix(auth): prevent infinite loop on refresh token 401"
```

---

## Quick Reference — Skill theo Tình huống

| Tình huống          | Flow    | Skill chính                                                                                             |
| ------------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| Build page mới      | Flow 1  | `concise-planning` → `nextjs-app-router-patterns` → `frontend-design` → `seo-audit` → `ui-review`       |
| Build component     | Flow 2  | `frontend-design` → `tailwind-patterns` → `ui-review` → `unit-testing-test-generate`                    |
| Review code (PR)    | Flow 3  | `code-review-checklist` → `find-bugs` → `ui-review` → `security-scanning-security-sast`                 |
| Tích hợp API        | Flow 4  | `api-documentation` → `tanstack-query-expert` → `zod-validation-expert` → `api-security-best-practices` |
| UI visual review    | Flow 5  | `ui-review` → `frontend-design` → `accessibility-compliance-accessibility-audit`                        |
| Unit test           | Flow 6A | `unit-testing-test-generate`                                                                            |
| E2E test            | Flow 6B | `e2e-testing` → `playwright-skill`                                                                      |
| Full feature        | Flow 7  | Tất cả flow kết hợp theo thứ tự                                                                         |
| Docs → implement    | Flow 8  | `concise-planning` → xác nhận → thực thi theo loại flow → verify                                        |
| Yêu cầu/nhận review | Flow 9  | `requesting-code-review` → `code-review-checklist` → `receiving-code-review`                            |

**Ba skill dùng trong mọi flow:**

1. `/concise-planning` — trước khi bắt đầu
2. `/lint-and-validate` — sau mỗi thay đổi code
3. `/git-pushing` — trước mỗi lần push
