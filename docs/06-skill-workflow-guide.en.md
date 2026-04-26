# 06. Skill Workflow Guide

Last updated: 2026-04-26
Owner: FE Lead
Purpose: Standardized skill invocation flows for common development tasks. Apply these flows every time a task type is requested.

---

## How to read this guide

Each task type below contains:

- **Trigger** — when this flow starts
- **Skill sequence** — ordered steps with the skill to invoke at each step
- **Gate** — what must be true before the task is considered done
- **Skip rules** — when a step is optional
- **Usage example** — concrete sample request and how the flow applies

Skill invocation syntax: `/skill-name` in Claude Code CLI.

---

## Flow 1 — Build a Page

**Trigger:** "Build the [X] page", "Create the [X] page", "Add a new page for [X]"

```
Step 1  /concise-planning
        → Define: what data does the page need, what route, SSR or CSR,
          what components will it reuse, what is out of scope.
        → Output: a short bullet list. Do not proceed until scope is locked.

Step 2  /nextjs-app-router-patterns
        → Confirm: route group, layout nesting, server vs client boundary,
          generateMetadata shape, loading.tsx / error.tsx needed.

Step 3  /frontend-design
        → Define visual structure before writing JSX:
          layout zones, spacing scale, color tokens, mobile breakpoints.

Step 4  Implement the page
        → Use @/* alias. No ../. Follow CLAUDE.md conventions.
        → Server Components for data fetch. Client Components for interactivity only.

Step 5  /tailwind-patterns
        → Review: utility class order, no magic numbers, responsive variants correct,
          no inline styles.

Step 6  /seo-audit
        → Apply only if page is public-facing (shop, product, category).
        → Check: generateMetadata, Open Graph, canonical, sitemap entry.

Step 7  /ui-review
        → Review: spacing discipline, mobile ergonomics, empty/loading/error states present.

Step 8  /lint-and-validate
        → npm run lint + npm run build must pass before commit.

Step 9  /git-pushing
        → Commit with clear message. Push to feature branch.
```

**Gate:** lint passes, build passes, page renders on mobile without layout break, all states (loading/error/empty) are handled.

**Skip rules:**

- Skip Step 6 if the page is admin-only or behind auth.
- Skip Step 3 if reusing an existing layout pattern with no design decisions.

**Usage example:**

> User: "Build the product detail page"

```
1. /concise-planning
   → Scope: SSR page at /[locale]/(shop)/san-pham/[slug], needs product data from
     GET /api/products/:slug, reuses ProductImages + VariantSelector + AddToCartButton,
     generateMetadata for SEO, loading.tsx skeleton. Out of scope: reviews section (Phase 2).

2. /nextjs-app-router-patterns
   → Route: src/app/[locale]/(shop)/san-pham/[slug]/page.tsx (Server Component)
   → generateMetadata() fetches slug → returns title/description/og:image
   → Client boundary: AddToCartButton only (needs cart store)

3. /frontend-design
   → Layout: image gallery left (60%), info panel right (40%) on desktop
   → Mobile: stacked, image first, sticky CTA at bottom
   → Spacing scale: gap-6 section, gap-2 within fields

4. Implement page.tsx + loading.tsx

5. /tailwind-patterns → review class order, check lg: breakpoints

6. /seo-audit → verify generateMetadata, og:image from Cloudinary, canonical URL

7. /ui-review → check mobile sticky CTA, empty variant state, image skeleton

8. /lint-and-validate → npm run lint + npm run build

9. /git-pushing → git commit "feat(shop): add product detail page with SSR metadata"
```

---

## Flow 2 — Build a Component

**Trigger:** "Build the [X] component", "Create a [X] card/button/modal/drawer"

```
Step 1  /concise-planning
        → Define: props interface, variants needed, which pages will use it,
          does it need client interactivity, what is the smallest useful version.

Step 2  /frontend-design
        → Visual contract before code: size, spacing, color token, hover/focus/disabled states.
        → If variant-heavy: design CVA structure first.

Step 3  Implement the component
        → TypeScript props with explicit types. No `any`.
        → CVA for variants if more than 2 visual states.
        → Export from shared/components/ui/ if reusable across features.

Step 4  /tailwind-patterns
        → Review class order, responsive behavior, dark mode if applicable.

Step 5  /ui-review
        → Check: focus ring visible, color contrast passes, touch target >= 44px on mobile,
          no hardcoded pixel values that break at other sizes.

Step 6  /unit-testing-test-generate
        → Write tests for: render with required props, each variant, edge case props (empty, long text).
        → Use Vitest + Testing Library. File: component-name.test.tsx next to component.

Step 7  /lint-and-validate
        → Must pass before commit.
```

**Gate:** component renders in all variants, focus states visible, test file exists and passes.

**Skip rules:**

- Skip Step 6 for purely presentational leaf components with no logic (e.g. a static badge).
- Skip Step 2 if component is a direct Shadcn primitive wrapper with no added design decisions.

**Usage example:**

> User: "Build the ProductCard component for the listing page"

```
1. /concise-planning
   → Props: { id, name, slug, price, originalPrice?, image, badge? }
   → Variants: default | out-of-stock | sale
   → Used by: product listing page, homepage featured section
   → Interactivity: none — pure presentational, navigate on click via <Link>
   → Smallest version: image + name + price, no wishlist button (Phase 2)

2. /frontend-design
   → Size: fixed aspect-ratio image (4:3), 2-col mobile / 4-col desktop grid
   → Sale badge: absolute top-left, red bg
   → Out-of-stock: grayscale image + "Hết hàng" overlay
   → Hover: shadow-md + scale-[1.01] transition

3. Implement ProductCard.tsx with CVA variants

4. /tailwind-patterns → check group-hover, aspect-ratio class, truncate on name

5. /ui-review → touch target check (whole card is clickable), contrast on badge text

6. /unit-testing-test-generate
   → test: renders name and price, shows sale badge when originalPrice > price,
     shows out-of-stock overlay when variant="out-of-stock", truncates long product name

7. /lint-and-validate
```

---

## Flow 3 — Review Code (PR / Branch Review)

**Trigger:** "Review this code", "Review PR", "Review my changes", "Is this correct?"

```
Step 1  /code-review-checklist
        → Run through: correctness, types, error handling, security surface,
          performance (unnecessary re-renders, N+1 fetch), naming clarity.

Step 2  /find-bugs
        → Focus on: logic errors, edge cases not handled, missing null checks,
          incorrect dependency arrays in useEffect/useMemo.

Step 3  /ui-review
        → Apply only if the diff contains JSX/TSX changes.
        → Check: spacing, accessibility, mobile behavior, state coverage.

Step 4  /security-scanning-security-sast
        → Apply only if diff touches: auth, API routes, server actions,
          user input rendering, file uploads, environment variables.

Step 5  /lint-and-validate
        → Run locally. All findings from steps 1–4 must be resolved before merge.
```

**Gate:** all checklist items resolved, lint passes, no open security findings.

**Skip rules:**

- Skip Step 3 if diff is backend/utility only (no UI changes).
- Skip Step 4 if diff is pure styling or config.

**Usage example:**

> User: "Review my checkout form implementation"

```
1. /code-review-checklist
   → Correctness: does form submit only fire once? is loading state disabled on button?
   → Types: are all form fields typed via Zod schema? no `any` in resolver?
   → Error handling: what happens on network error — is toast shown?
   → Performance: does the component re-render on every keystroke? (RHF should prevent this)
   → Naming: is `handleSubmit` shadowing RHF's handleSubmit?

2. /find-bugs
   → Edge case: what if user submits with empty cart? is that validated?
   → Missing null check: shippingAddress?.id — is this handled if user has no saved address?
   → useEffect dependency array: is [cartItems] causing stale closure on total calculation?

3. /ui-review (JSX present)
   → Error messages: are they shown inline below each field, not just as a toast?
   → Mobile: is the submit button above keyboard fold on small screens?
   → Loading state: is the button disabled + shows spinner during submission?

4. /security-scanning-security-sast (touches user input + API call)
   → Is the total price calculated server-side? Never trust client-submitted price.
   → Is the auth token coming from the interceptor, not hardcoded in the form?
   → Are error messages from the API sanitized before rendering?

5. /lint-and-validate → npm run lint
```

---

## Flow 4 — API Integration

**Trigger:** "Integrate the [X] API", "Connect to [endpoint]", "Call the backend for [X]"

```
Step 1  /concise-planning
        → Confirm: endpoint URL, HTTP method, request shape, response shape,
          auth required (JWT header?), error codes to handle, loading/error UI.
        → Do not write any fetch code until the contract is confirmed.

Step 2  /api-documentation
        → Verify the API contract matches what backend has published.
        → Update shared/constants/api-endpoints.ts with the new endpoint constant.
        → Add or update the Zod schema in shared/types/ for request and response.

Step 3  /tanstack-query-expert
        → Choose the right primitive: useQuery (read), useMutation (write), useInfiniteQuery (paginated list).
        → Define: queryKey structure, staleTime, gcTime, retry policy, enabled condition.
        → Place the hook in the feature's _hooks/ directory.

Step 4  Implement in component
        → Wire the hook. Handle: isPending, isError, data states explicitly.
        → Use the http client from shared/lib/http/. Never call axios directly.

Step 5  /api-security-best-practices
        → Check: auth token attached via interceptor (not manual), no secrets in client code,
          error messages do not leak server internals, rate-limit handling present.

Step 6  /zod-validation-expert
        → Validate API response at the boundary. Parse with schema.safeParse().
        → If parse fails: log to Sentry, show user-friendly error, do not crash.

Step 7  /e2e-testing
        → Write a Playwright test for the happy path of this integration.
        → If it is a mutation: also test the error path (mock 500, check toast/error UI).

Step 8  /lint-and-validate + /git-pushing
```

**Gate:** loading/error/success states all handled in UI, Zod validation present, at least one e2e test covering the happy path, lint passes.

**Skip rules:**

- Skip Step 7 for internal admin-only integrations if e2e coverage already exists for the flow.

**Usage example:**

> User: "Integrate the order creation API into the checkout page"

```
1. /concise-planning
   → Endpoint: POST /api/orders/
   → Request: { items: [{variant_id, quantity}], shipping_address_id, payment_method: "COD" }
   → Response: { id, status: "PENDING", total, created_at }
   → Auth: required (JWT via interceptor)
   → Error codes: 400 (validation), 409 (out of stock), 500 (server error)
   → UI on success: redirect to /checkout/success?orderId=X
   → UI on error: toast with message, do NOT clear the form

2. /api-documentation
   → Add to api-endpoints.ts: ORDERS: { CREATE: '/api/orders/' }
   → Add OrderCreateRequest + OrderCreateResponse Zod schemas to shared/types/order.ts

3. /tanstack-query-expert
   → useMutation (write operation, not a query)
   → onSuccess: clear cart store, redirect to success page
   → onError: show toast with error.message
   → No retry on 4xx (user error), retry 1x on 5xx

4. Wire usePlaceOrder hook into CheckoutPage
   → isPending → disable submit button, show spinner
   → isError → show toast (already handled in onError)
   → isSuccess → handled in onSuccess callback

5. /api-security-best-practices
   → Total price NOT in request body — backend calculates from variant_id + quantity
   → JWT attached by interceptor, not from form state
   → 409 error message shown as "Sản phẩm vừa hết hàng", not raw server message

6. /zod-validation-expert
   → Parse response with OrderCreateResponse.safeParse(data)
   → On parse failure: Sentry.captureException + show generic error toast

7. /e2e-testing
   → Happy path: fill checkout → submit → see success page → order ID in URL
   → Error path: mock 409 → submit → see "hết hàng" toast → form still filled
```

---

## Flow 5 — UI Review (Standalone)

**Trigger:** "Review the UI", "Check this design", "Does this look right?", "Review [page/component] visually"

```
Step 1  /ui-review
        → Systematic check:
          □ Spacing uses design tokens, no magic numbers
          □ Typography scale consistent
          □ Color contrast passes (4.5:1 text, 3:1 UI elements)
          □ Focus ring visible on all interactive elements
          □ Touch targets >= 44px on mobile
          □ Empty state exists
          □ Loading state exists
          □ Error state exists

Step 2  /frontend-design
        → Visual quality check:
          □ Visual hierarchy clear (what is the primary action?)
          □ Whitespace balanced, not cramped or too sparse
          □ Mobile layout works without horizontal scroll
          □ Component aligns with existing patterns in the codebase

Step 3  /accessibility-compliance-accessibility-audit
        → Apply if page is customer-facing.
        → Check: semantic HTML (button vs div), aria-label on icon buttons,
          form labels linked to inputs, image alt text present.

Step 4  /fixing-motion-performance
        → Apply only if page has animation or transition effects.
        → Check: no layout-triggering properties animated, will-change used correctly,
          no janky scroll-linked effects.
```

**Gate:** all checkbox items in Step 1 pass, no critical a11y violations.

**Skip rules:**

- Skip Step 3 for admin-only pages (a11y still good practice but lower priority).
- Skip Step 4 if the page has no animation.

**Usage example:**

> User: "Review the cart drawer UI"

```
1. /ui-review
   □ Spacing: gap-4 between items consistent? no hardcoded mt-[13px]?
   □ Typography: product name truncated at 1 line, price uses font-semibold?
   □ Contrast: "Xóa" button text on white bg — passes 4.5:1?
   □ Focus: quantity stepper buttons have visible focus ring?
   □ Touch: "+" and "-" buttons are min 44px × 44px on mobile?
   □ Empty state: "Giỏ hàng trống" with CTA to shop?
   □ Loading: skeleton while cart syncing?
   □ Error: if remove item fails, toast + item stays in list?

2. /frontend-design
   → Primary action: "Thanh toán" button — is it visually dominant (full-width, primary color)?
   → Hierarchy: product image > name > price > quantity — is this order clear?
   → Mobile: does drawer take full screen height on small phones (< 375px)?

3. /accessibility-compliance-accessibility-audit
   → "Xóa" icon button: has aria-label="Xóa sản phẩm [tên]"?
   → Drawer: role="dialog", aria-modal="true", aria-label="Giỏ hàng"?
   → Focus trap: when drawer opens, focus moves to first interactive element?
   → Quantity input: has aria-label="Số lượng [tên sản phẩm]"?
```

---

## Flow 6 — Write Test Cases

### 6A — Unit Tests (Vitest)

**Trigger:** "Write unit tests for [X]", "Add tests to [hook/util/component]"

```
Step 1  /concise-planning
        → List: what behaviors need coverage, what edge cases exist,
          what is the minimum set that gives real confidence (not vanity coverage).

Step 2  /unit-testing-test-generate
        → Generate test cases for: happy path, edge cases, error cases.
        → For hooks: use renderHook from @testing-library/react.
        → For utils: pure function tests, no mocking needed.
        → For components: test behavior not implementation (what user sees/does).

Step 3  Run tests
        → npx vitest run src/path/to/file.test.ts
        → Coverage: npm run test:coverage — must stay >= 70% on shared/lib/** and shared/hooks/**

Step 4  /lint-and-validate
```

**Gate:** tests pass, no skipped tests without justification, coverage threshold maintained.

**Usage example:**

> User: "Write unit tests for the useCart hook"

```
1. /concise-planning
   → Behaviors to cover:
     - addItem: adds new product, increases quantity if already exists
     - removeItem: removes item by variant_id
     - updateQuantity: clamps to min 1, max stock
     - clearCart: empties the list
     - totalPrice: calculates correctly with multiple items
     - persistence: cart survives page reload (localStorage)
   → Edge cases: add item with qty 0, update to quantity > stock, remove non-existent item

2. /unit-testing-test-generate
   → File: src/shared/stores/cart-store.test.ts
   → Test structure:
     describe('useCart', () => {
       beforeEach(() => useCartStore.setState({ items: [] }))

       it('adds a new item to empty cart')
       it('increases quantity when same variant_id added')
       it('removes item by variant_id')
       it('clamps quantity to 1 minimum')
       it('calculates totalPrice across all items')
       it('clearCart resets to empty array')
     })

3. npx vitest run src/shared/stores/cart-store.test.ts

4. /lint-and-validate
```

---

### 6B — E2E Tests (Playwright)

**Trigger:** "Write e2e tests for [flow]", "Add Playwright test for [journey]"

```
Step 1  /concise-planning
        → Define: which user journey, entry point URL, preconditions (logged in?),
          what success looks like, what error paths to cover.

Step 2  /e2e-testing
        → Structure test: arrange (setup state) → act (user actions) → assert (outcomes).
        → Use page object model if the journey spans more than 3 pages.
        → Target locators by role/label, not CSS selectors or test-ids (prefer accessible queries).

Step 3  /playwright-skill
        → Run locally: npx playwright test --headed for visual verification.
        → Check: no hardcoded waits (use waitForResponse / waitForSelector).
        → Verify test is deterministic: run it 3 times, must pass every time.

Step 4  /lint-and-validate + /git-pushing
```

**Gate:** test passes 3 consecutive runs, covers happy path + at least one error path, no flaky waits.

**Usage example:**

> User: "Write a Playwright test for the COD checkout flow"

```
1. /concise-planning
   → Journey: Guest user → product page → add to cart → checkout → place COD order → success page
   → Preconditions: none (guest checkout allowed)
   → Success: order ID visible on /checkout/success, email confirmation sent
   → Error path: submit with empty address → see validation error (not a server crash)

2. /e2e-testing
   → File: e2e/checkout-cod.spec.ts
   → Structure:
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
       // ...navigate to checkout...
       await page.getByRole('button', { name: 'Đặt hàng' }).click()
       await expect(page.getByText('Vui lòng nhập địa chỉ')).toBeVisible()
       await expect(page).not.toHaveURL('**/checkout/success**')
     })

3. npx playwright test e2e/checkout-cod.spec.ts --headed
   → Run 3 times. Must pass all 3.
```

---

## Flow 7 — Full Feature Flow (Page → Component → API → Test)

**Trigger:** "Build the [X] feature end-to-end", "Implement [feature] from scratch"

This flow composes Flows 1–6 in sequence. Run them in this order:

```
Phase 1: Plan
  /concise-planning  →  full feature scope: pages, components, API endpoints, tests needed.
                         Output a checklist. Lock scope before any code.

Phase 2: API Contract First
  /api-documentation  →  confirm all endpoints, request/response shapes, auth requirements.
  → Update api-endpoints.ts and Zod schemas BEFORE building UI.
  → Frontend and backend must agree on contract. No mock data in production code.

Phase 3: Build Components (bottom-up)
  → For each component needed: run Flow 2 (Build Component).
  → Build leaf components first (buttons, cards), then composite components.

Phase 4: Build Page
  → Run Flow 1 (Build Page), referencing components built in Phase 3.

Phase 5: Wire API
  → Run Flow 4 (API Integration) for each endpoint the page needs.

Phase 6: Review
  → Run Flow 5 (UI Review) on completed page.
  → Run Flow 3 (Code Review) on the full diff.

Phase 7: Test
  → Run Flow 6A (unit tests) for critical hooks/utils.
  → Run Flow 6B (e2e tests) for the primary user journey.

Phase 8: Ship
  /lint-and-validate  →  npm run lint + npm run test + npm run build — all must pass.
  /git-pushing        →  push to feature branch, open PR.
```

**Gate:** all phase gates from Flows 1–6 met, CI passes on PR.

**Usage example:**

> User: "Build the product listing page with filter and search"

```
Phase 1 /concise-planning
  → Pages: /danh-muc/[slug] (SSR, SEO)
  → Components: ProductCard, FilterSidebar, SortDropdown, Pagination, SearchBar
  → API: GET /api/products/?category=&search=&min_price=&max_price=&ordering=&page=
  → Tests: useProducts hook (unit), filter → results (e2e)
  → Out of scope: saved filters, infinite scroll (Phase 2)

Phase 2 /api-documentation
  → Confirm response shape: { results: Product[], count, next, previous }
  → Add PRODUCTS.LIST to api-endpoints.ts
  → Add ProductListResponse Zod schema

Phase 3 Build Components (Flow 2 for each)
  → ProductCard (reuse if exists)
  → FilterSidebar (price range, category checkboxes)
  → SortDropdown (newest / price asc / price desc)
  → Pagination (prev/next, current page indicator)

Phase 4 Build Page (Flow 1)
  → src/app/[locale]/(shop)/danh-muc/[slug]/page.tsx
  → SSR: fetch initial products server-side for SEO
  → Client: filter/sort changes trigger useQuery refetch

Phase 5 Wire API (Flow 4)
  → useProducts({ category, search, filters, page }) with useQuery + useInfiniteQuery
  → URL search params synced to filter state (use nuqs or searchParams)

Phase 6 Review
  → Flow 5: UI Review on listing page (grid layout, filter panel mobile)
  → Flow 3: Code review on full diff

Phase 7 Test
  → Flow 6A: useProducts hook — correct queryKey, filter params appended to URL
  → Flow 6B: user searches "áo" → sees filtered results → changes to price asc → results reorder

Phase 8 /lint-and-validate + /git-pushing
```

---

## Flow 8 — Read Docs → Implement

**Trigger:** "Read [document/spec/PRD] and implement it", "Implement based on [requirements doc]"

```
Step 1  Read the document
        → Identify: what needs to be built, acceptance criteria, out of scope items,
          API contracts referenced, design references linked.

Step 2  /concise-planning
        → Convert the document into an ordered implementation checklist.
        → Each item must be: concrete, testable, scoped to one task type (page / component / API).
        → Flag ambiguities explicitly — do not assume, ask before coding.

Step 3  Confirm plan with user
        → Share the checklist. Get confirmation before writing any code.
        → If the doc references an API: confirm contract with /api-documentation first.
        → If the doc references a design: confirm UI contract with /frontend-design first.

Step 4  Execute item by item
        → For each checklist item, apply the matching flow:
          - Page item       → Flow 1
          - Component item  → Flow 2
          - API item        → Flow 4
          - Test item       → Flow 6A or 6B

Step 5  Verify against original document
        → Re-read the acceptance criteria from the doc.
        → Check each item is met. Do not self-declare done — verify explicitly.

Step 6  /lint-and-validate + /git-pushing
```

**Gate:** every acceptance criteria item from the doc is verifiably met, lint passes, build passes.

**Skip rules:**

- Never skip Step 3. Implementing without confirmation wastes time when requirements are ambiguous.
- Never skip the explicit verification in Step 5. Reading and implementing does not mean done.

**Usage example:**

> User: "Read docs/05-priority-implementation-backlog.en.md and implement the cart feature"

```
Step 1  Read the backlog doc
  → Finds: "Cart: add/remove/update quantity, persist to localStorage, show item count in header"
  → Acceptance criteria: items survive page reload, count badge updates immediately, empty state shown

Step 2  /concise-planning
  → Checklist:
    [ ] Zustand cart store with persist middleware (shared/stores/cart-store.ts)
    [ ] addItem / removeItem / updateQuantity / clearCart actions
    [ ] CartDrawer component (open/close via header icon)
    [ ] CartItemRow component (image, name, quantity stepper, remove button)
    [ ] CartBadge component (item count in header)
    [ ] Wire CartDrawer to header
    [ ] Unit tests: cart store actions
    [ ] E2E: add to cart → count badge updates → drawer opens → shows correct item

Step 3  Confirm checklist with user before coding

Step 4  Execute:
  → CartStore    → (Zustand pattern, Flow 2 for component)
  → CartDrawer   → Flow 2 (component)
  → CartItemRow  → Flow 2 (component)
  → CartBadge    → Flow 2 (component)
  → Wire to header → Flow 1 partial (modifying existing layout)
  → Unit tests   → Flow 6A
  → E2E tests    → Flow 6B

Step 5  Verify:
  → Reload page → items still in cart ✓
  → Add item → badge count increments immediately ✓
  → Remove all items → "Giỏ hàng trống" state shown ✓
  → npm run test → all pass ✓

Step 6  /lint-and-validate + /git-pushing
```

---

## Flow 9 — Request & Receive Code Review

**Trigger:** "Request a code review", "I want feedback on my code", "Am I doing this right?",
"Review what I just wrote before I push"

This flow is for when **you** have written code and want structured feedback — distinct from Flow 3 which is reviewing someone else's code.

```
Step 1  /requesting-code-review
        → Prepare context before asking for review:
          - What does this code do? (one sentence)
          - What is the specific concern or question? (not just "is this good?")
          - What have you already checked?
          - Are there known trade-offs or constraints?
        → Output: a clear review request with scope defined.

Step 2  /code-review-checklist
        → Self-review first using the checklist before asking Claude:
          □ Types correct, no `any`
          □ All async errors handled
          □ No hardcoded values that belong in constants/env
          □ No business logic in components
          □ Tests exist for critical paths
          □ Imports use @/* alias (no ../)

Step 3  Submit to Claude with context from Step 1
        → Share the specific file(s) or diff, not the entire codebase.
        → Ask a specific question, not open-ended "review everything".

Step 4  /receiving-code-review
        → When Claude returns findings, process them:
          - Severity: Critical (must fix before merge) / Suggestion (optional improvement)
          - For each critical: fix it, then re-run /lint-and-validate
          - For each suggestion: evaluate and decide — do not auto-accept everything
          - Push back if a suggestion conflicts with project conventions (CLAUDE.md wins)

Step 5  /lint-and-validate
        → After applying fixes: must pass before closing the review loop.

Step 6  /git-pushing
        → Commit the reviewed + fixed code.
```

**Gate:** all critical findings resolved, lint passes, reviewer (Claude) confirms no remaining blockers.

**Skip rules:**

- Skip Step 2 (self-review) only if you need a quick sanity check on a trivial change.
- Do not skip Step 4's evaluation step — not every suggestion needs to be applied.

**Usage example:**

> User: "Review my useAuth hook before I push it"

```
Step 1  /requesting-code-review
  → Context prepared:
    "useAuth manages JWT token storage and provides login/logout/refresh.
     My concern: is the token refresh logic correct? I'm unsure if the interceptor
     could cause infinite loops on 401. I've checked: types are correct, logout clears
     localStorage. I have not tested the refresh failure scenario yet."

Step 2  Self-review checklist
  □ Types: AuthUser type from shared/types, no `any` ✓
  □ Async errors: login() has try/catch, refresh() does not ← flag this
  □ No hardcoded values: token key is from constants ✓
  □ No business logic in components: hook is in shared/hooks/ ✓
  □ Tests: none yet ← flag this
  □ Imports: all use @/* ✓

Step 3  Submit to Claude
  → Share: src/shared/hooks/use-auth.ts
  → Specific question: "Is the interceptor's 401 handling correct?
    Could useRefreshToken inside the interceptor create an infinite loop
    if the refresh endpoint itself returns 401?"

Step 4  /receiving-code-review
  → Claude finds:
    CRITICAL: refresh() missing try/catch — if refresh endpoint returns 401,
              interceptor retries infinitely. Fix: add isRefreshing flag + queue.
    SUGGESTION: extract token constants to a dedicated auth-constants.ts file.

  → Action on Critical: fix the isRefreshing flag pattern → apply
  → Action on Suggestion: evaluate — project is small, constants.ts is fine for now → skip

Step 5  /lint-and-validate → pass

Step 6  /git-pushing → "fix(auth): prevent infinite loop on refresh token 401"
```

---

## Quick Reference — Skill by Situation

| Situation              | Flow    | Key Skills                                                                                              |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| Build a new page       | Flow 1  | `concise-planning` → `nextjs-app-router-patterns` → `frontend-design` → `seo-audit` → `ui-review`       |
| Build a component      | Flow 2  | `frontend-design` → `tailwind-patterns` → `ui-review` → `unit-testing-test-generate`                    |
| Review code (PR)       | Flow 3  | `code-review-checklist` → `find-bugs` → `ui-review` → `security-scanning-security-sast`                 |
| API integration        | Flow 4  | `api-documentation` → `tanstack-query-expert` → `zod-validation-expert` → `api-security-best-practices` |
| UI visual review       | Flow 5  | `ui-review` → `frontend-design` → `accessibility-compliance-accessibility-audit`                        |
| Unit tests             | Flow 6A | `unit-testing-test-generate`                                                                            |
| E2E tests              | Flow 6B | `e2e-testing` → `playwright-skill`                                                                      |
| Full feature           | Flow 7  | All flows composed in order                                                                             |
| Docs → implement       | Flow 8  | `concise-planning` → confirm → execute by flow type → verify                                            |
| Request/receive review | Flow 9  | `requesting-code-review` → `code-review-checklist` → `receiving-code-review`                            |

**Three skills used in every single flow:**

1. `/concise-planning` — before starting
2. `/lint-and-validate` — after every code change
3. `/git-pushing` — before every push
