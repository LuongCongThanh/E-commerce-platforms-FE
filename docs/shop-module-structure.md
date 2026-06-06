# Shop Module — Cấu trúc thư mục

> Route group: `src/app/[locale]/(shop)/`  
> Module private lib: `src/app/[locale]/(shop)/_lib/`  
> Không import chéo từ `(auth)/` hay `(admin)/`.

---

## Cây thư mục đầy đủ

```text
src/app/[locale]/(shop)/
│
├── layout.tsx                          # Shell layout: Header + Footer + Providers
├── loading.tsx                         # Root loading UI
├── page.tsx                            # Redirect → /home
│
│── ─── ROUTES ────────────────────────────────────────────────────────────
│
├── home/
│   └── page.tsx                        # Trang chủ — ghép 8 section
│
├── products/
│   ├── page.tsx                        # Danh sách sản phẩm (lọc, phân trang)
│   └── [slug]/
│       └── page.tsx                    # Chi tiết sản phẩm (gallery, variants, tabs)
│
├── categories/
│   └── [slug]/
│       └── page.tsx                    # Danh sách SP theo danh mục + sidebar filter
│
├── search/
│   └── page.tsx                        # Kết quả tìm kiếm theo query param
│
├── cart/
│   └── page.tsx                        # Giỏ hàng
│
├── checkout/
│   ├── page.tsx                        # Form đặt hàng (địa chỉ + thanh toán)
│   └── success/
│       └── page.tsx                    # Xác nhận đặt hàng thành công
│
├── orders/
│   ├── page.tsx                        # Lịch sử đơn hàng
│   └── [id]/
│       └── page.tsx                    # Chi tiết đơn hàng
│
├── profile/
│   └── page.tsx                        # Thông tin cá nhân
│
│   ── [PLANNED] ──────────────────────────────────────────────────────────
│
├── wishlist/                           # [TODO] Danh sách yêu thích
│   └── page.tsx
│
└── flash-sale/                         # [TODO] Trang Flash Sale chuyên biệt
    └── page.tsx
│
│── ─── MODULE PRIVATE LIB (_lib/) ────────────────────────────────────────
│
└── _lib/
    │
    ├── actions/                        # Server-side API calls (http client wrapper)
    │   ├── order.ts                    # orderActions: list, detail, cancel, create
    │   ├── product.ts                  # productActions: list, detail, categories
    │   └── profile.ts                  # profileActions: get, update
    │   │
    │   └── [PLANNED]
    │       ├── wishlist.ts             # wishlistActions: list, add, remove
    │       ├── review.ts               # reviewActions: list, create
    │       └── voucher.ts              # voucherActions: validate, apply
    │
    ├── components/                     # UI components (chỉ dùng trong shop)
    │   │
    │   ├── common/                     # Dùng chung ≥2 feature folder trong shop
    │   │   ├── CategoryGrid.tsx
    │   │   ├── FeaturedProducts.tsx
    │   │   ├── FlashSaleBanner.tsx
    │   │   ├── HeroBanner.tsx
    │   │   ├── OrderStatusBadge.tsx
    │   │   ├── Pagination.tsx          # Dùng ở products/, categories/, search/
    │   │   ├── ProductGrid.tsx         # Dùng ở products/, categories/, search/, home/
    │   │   └── ShopLoadingShell.tsx
    │   │
    │   ├── home/                       # Các section của trang chủ
    │   │   ├── SectionHero.tsx
    │   │   ├── SectionFeaturedCategories.tsx
    │   │   ├── SectionFlashSale.tsx
    │   │   ├── SectionBestSellers.tsx
    │   │   ├── SectionNewArrivals.tsx
    │   │   ├── SectionWhyChooseUs.tsx
    │   │   ├── SectionTestimonials.tsx
    │   │   └── SectionNewsletter.tsx
    │   │
    │   ├── products/                   # Components trang sản phẩm
    │   │   ├── ProductsClient.tsx      # Container: filter state + pagination logic
    │   │   ├── ProductGallery.tsx      # Ảnh sản phẩm (zoom, thumbnail)
    │   │   ├── ProductDetailTabs.tsx   # Tabs: Mô tả / Thông số / Đánh giá
    │   │   ├── AddToCartSection.tsx    # Chọn variant + thêm vào giỏ
    │   │   └── VariantSelector.tsx     # Chọn size/màu
    │   │
    │   ├── categories/
    │   │   ├── CategoryClient.tsx      # Container danh mục + filter state
    │   │   └── FilterSidebar.tsx       # Sidebar lọc giá, thuộc tính
    │   │
    │   ├── cart/
    │   │   ├── CartClient.tsx          # Container giỏ hàng (client state)
    │   │   ├── CartTable.tsx           # Bảng sản phẩm + điều chỉnh qty
    │   │   └── CartSummary.tsx         # Tổng tiền + CTA checkout
    │   │
    │   ├── checkout/
    │   │   ├── CheckoutClient.tsx      # Container page checkout ('use client')
    │   │   └── OrderSummary.tsx        # Tóm tắt đơn hàng bên phải
    │   │
    │   ├── orders/
    │   │   ├── OrdersClient.tsx        # Container danh sách đơn hàng
    │   │   └── OrderDetailClient.tsx   # Container chi tiết đơn hàng
    │   │
    │   ├── profile/
    │   │   └── ProfileClient.tsx       # Container form thông tin cá nhân
    │   │
    │   ├── search/
    │   │   └── SearchClient.tsx        # Container kết quả tìm kiếm
    │   │
    │   └── [PLANNED]
    │       ├── reviews/
    │       │   ├── ReviewList.tsx      # [TODO] Danh sách đánh giá
    │       │   ├── ReviewForm.tsx      # [TODO] Form viết đánh giá
    │       │   └── ReviewStars.tsx     # [TODO] Hiển thị rating
    │       │
    │       ├── wishlist/
    │       │   ├── WishlistClient.tsx  # [TODO] Container wishlist
    │       │   └── WishlistButton.tsx  # [TODO] Toggle yêu thích trên ProductCard
    │       │
    │       └── checkout/
    │           └── VoucherInput.tsx    # [TODO] Ô nhập mã voucher
    │
    ├── hooks/                          # Custom hooks (business logic + state)
    │   │
    │   ├── home/
    │   │   ├── useHomeData.ts          # Aggregate data cho trang chủ
    │   │   └── useHomeFlashSaleCountdown.ts  # Đếm ngược flash sale
    │   │
    │   ├── products/
    │   │   ├── useProducts.ts          # Danh sách SP + filter/sort/pagination
    │   │   ├── useProduct.ts           # Chi tiết 1 sản phẩm
    │   │   └── useAddToCart.ts         # Thêm SP vào giỏ (validate variant)
    │   │
    │   ├── categories/
    │   │   ├── useCategories.ts        # Danh sách danh mục
    │   │   └── useCategoriesData.ts    # Dữ liệu danh mục (mock → API)
    │   │
    │   ├── checkout/
    │   │   └── useCreateOrder.ts       # Mutation tạo đơn hàng
    │   │
    │   ├── orders/
    │   │   ├── useOrders.ts            # Danh sách đơn hàng của user
    │   │   ├── useOrder.ts             # Chi tiết 1 đơn hàng
    │   │   └── useCancelOrder.ts       # Mutation huỷ đơn
    │   │
    │   ├── profile/
    │   │   ├── useProfile.ts           # Lấy thông tin profile
    │   │   └── useUpdateProfile.ts     # Mutation cập nhật profile
    │   │
    │   └── [PLANNED]
    │       ├── reviews/
    │       │   ├── useReviews.ts       # [TODO] Danh sách review theo SP
    │       │   └── useCreateReview.ts  # [TODO] Mutation gửi đánh giá
    │       │
    │       ├── wishlist/
    │       │   ├── useWishlist.ts      # [TODO] Danh sách wishlist
    │       │   └── useToggleWishlist.ts # [TODO] Toggle thêm/xóa wishlist
    │       │
    │       └── checkout/
    │           └── useVoucher.ts       # [TODO] Validate + áp dụng mã voucher
    │
    ├── data/                           # Mock data thuần (thay thế bằng API calls khi backend sẵn sàng)
    │   ├── products.ts                 # productsData (mảng dữ liệu)
    │   ├── categories.ts               # re-export categoriesData
    │   └── home.ts                     # heroData, homeCategoriesData, testimonialsData, whyChooseUsData
    │
    ├── queries/                        # Query helpers — hàm tra cứu dữ liệu trên mock data
    │   ├── product.ts                  # getProductBySlug()
    │   └── category.ts                 # getCategoryBySlug()
    │
    ├── schemas/                        # Zod validation schemas (form input)
    │   ├── checkout.ts                 # checkoutSchema, addressSchema
    │   ├── filter.ts                   # filterSchema (price range, sort)
    │   ├── profile.ts                  # profileSchema, ProfileInput
    │   │
    │   └── [PLANNED]
    │       └── review.ts               # [TODO] reviewSchema (rating, content)
    │
    └── types/                          # TypeScript types cục bộ (shop-specific)
        ├── product.ts                  # ProductDisplay, SizeOption
        ├── category.ts                 # CategoryDisplay
        ├── home.ts                     # HomeSection, FlashSaleItem
        │
        └── [PLANNED]
            ├── review.ts               # [TODO] ReviewDisplay, CreateReviewInput
            └── wishlist.ts             # [TODO] WishlistItem
```

---

## Nguyên tắc tổ chức

| Quy tắc                                                                 | Ví dụ                                             |
| ----------------------------------------------------------------------- | ------------------------------------------------- |
| **Pages mỏng** — chỉ orchestrate, không chứa logic                      | `page.tsx` chỉ gọi components và truyền props     |
| **Không `'use client'` trên page.tsx** — luôn là Server Component       | Client logic delegate vào `*Client.tsx`           |
| **Logic vào hooks** — mọi state/business logic                          | `useProducts()`, `useCreateOrder()`               |
| **API qua actions** — không gọi `http` trực tiếp trong component        | `orderActions.list()`                             |
| **`*Client` suffix** — chỉ container top-level của một page             | `OrdersClient`, `CheckoutClient`, `ProfileClient` |
| **`common/`** — component dùng ở ≥2 feature folder                      | `Pagination`, `ProductGrid`, `OrderStatusBadge`   |
| **Types cục bộ ở `_lib/types/`** — không lan ra ngoài shop              | `ProductDisplay` chỉ dùng trong `(shop)`          |
| **Shared types ở `@/shared/types/`** — dùng chung toàn app              | `Product`, `Order`, `User`, `BadgeValue`          |
| **Alias bắt buộc** — không dùng `../` để đi lên                         | `import from '@/app/[locale]/(shop)/_lib/...'`    |
| **Không cross-feature** — shop không import từ `(admin)/` hay `(auth)/` | ESLint enforce                                    |

---

## Luồng dữ liệu

```text
Page (Server Component)
  └─► Client Component (*Client.tsx — 'use client')
        └─► Hook (useXxx)
              └─► actions/xxx.ts  →  http client  →  Django REST API
                                                         ↑
                                     (mock: data/xxx.ts khi chưa có API)
```

---

## Trạng thái feature

| Feature                           | Trạng thái      | Ghi chú                             |
| --------------------------------- | --------------- | ----------------------------------- |
| Trang chủ (8 sections)            | ✅ Done         |                                     |
| Danh sách sản phẩm                | ✅ Done         |                                     |
| Chi tiết sản phẩm                 | ✅ Done         | SEO + JSON-LD                       |
| Danh mục + filter sidebar         | ✅ Done         |                                     |
| Tìm kiếm                          | ✅ Done         |                                     |
| Giỏ hàng                          | ✅ Done         | Zustand persist                     |
| Checkout (COD)                    | ✅ Done         | Zod validation                      |
| Lịch sử & chi tiết đơn hàng       | ✅ Done         |                                     |
| Trang cá nhân                     | ✅ Done (shell) | API chưa nối                        |
| Flash sale countdown              | 🔧 Partial      | Hook có, UI chưa wire vào live data |
| Đánh giá sản phẩm (submit)        | 📋 Planned      |                                     |
| Wishlist / Yêu thích              | 📋 Planned      |                                     |
| Mã voucher                        | 📋 Planned      | Schemas ready                       |
| Thanh toán VNPay/Momo/ZaloPay     | 📋 Planned      | Schemas ready                       |
| Advanced filter (rating, tồn kho) | 📋 Planned      |                                     |
