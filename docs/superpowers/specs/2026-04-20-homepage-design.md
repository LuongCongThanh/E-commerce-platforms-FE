# Homepage Design Spec - Home Module First (2026)

**Date:** 2026-04-20  
**Status:** Approved for implementation  
**Direction:** Minimal Luxury fashion e-commerce  
**Scope:** UI-first homepage architecture, reusable shared blocks, no live API coupling in this phase

---

## 1. Overview

Homepage is designed as a dedicated `home` module instead of a loose collection of page-local components.

The goal of this spec is to make implementation decision-complete:

- Clarify which components belong to `modules/home`
- Clarify which components belong to `shared`
- Define section boundaries and reusable building blocks
- Define minimum props, mock data shape, i18n needs, and test expectations

### Product and UX direction

- Visual style: Minimal Luxury
- Content direction: EN-first, localized through `next-intl`
- Homepage scope: UI-first with mock/static structured data
- Hero direction: single static luxury hero, not a multi-slide carousel
- Reuse rule: anything likely to be reused outside homepage moves to `shared`

### Current integration point

`src/app/[locale]/(shop)/page.tsx` should remain thin:

- await locale params
- call `setRequestLocale(locale)`
- import and render `HomePage`

No section-specific composition should remain in the route file after refactor.

---

## 2. Module Structure

Homepage should be organized as a standalone module:

```text
src/modules/home/
  components/
    HomePage.tsx
    HomeSectionHeading.tsx
    HomeTrustBar.tsx
    HomeCategoryCard.tsx
    HomeTestimonialCard.tsx
    HomeNewsletterForm.tsx
    HomeProductRail.tsx
  sections/
    SectionHero.tsx
    SectionFeaturedCategories.tsx
    SectionBestSellers.tsx
    SectionFlashSale.tsx
    SectionNewArrivals.tsx
    SectionWhyChooseUs.tsx
    SectionTestimonials.tsx
    SectionNewsletter.tsx
  data/
    home-hero.data.ts
    home-categories.data.ts
    home-products.data.ts
    home-testimonials.data.ts
    home-benefits.data.ts
  types/
    home-category.ts
    home-product-highlight.ts
    home-testimonial.ts
    home-benefit.ts
  hooks/
    use-home-flash-sale-countdown.ts
    use-home-product-filters.ts
  lib/
    format-home-price.ts
    map-home-badge.ts
```

### Module rules

- `components/` contains small homepage-specific blocks
- `sections/` contains full-width homepage sections
- `data/` contains mock content used in this UI-first phase
- `types/` contains homepage-only types that should not pollute shared commerce types
- `hooks/` contains homepage-only state and interaction hooks
- `lib/` contains homepage-only helper functions

### Composition root

`src/modules/home/components/HomePage.tsx` is the composition root and renders sections in this order:

1. `SectionHero`
2. `SectionFeaturedCategories`
3. `SectionBestSellers`
4. `SectionFlashSale`
5. `SectionNewArrivals`
6. `SectionWhyChooseUs`
7. `SectionTestimonials`
8. `SectionNewsletter`

### Section-level home components

If the team prefers section names aligned with product language, these section wrappers can also be exposed as:

- `home-hero.tsx`
- `home-featured-categories.tsx`
- `home-best-sellers.tsx`
- `home-flash-sale.tsx`
- `home-new-arrivals.tsx`
- `home-why-choose-us.tsx`
- `home-testimonials.tsx`
- `home-newsletter.tsx`

If the repo follows the current naming convention for component files, prefer these file names instead:

- `HomeHero.tsx`
- `HomeFeaturedCategories.tsx`
- `HomeBestSellers.tsx`
- `HomeFlashSale.tsx`
- `HomeNewArrivals.tsx`
- `HomeWhyChooseUs.tsx`
- `HomeTestimonials.tsx`
- `HomeNewsletter.tsx`

Recommended implementation rule:

- keep section implementation files in `sections/`
- optionally re-export from `components/` only if the team wants a flatter import surface

---

## 3. Shared Reusable Components

The following parts should not stay inside `home` because they are reusable in category, PDP, collection, cart, search, campaign, or account flows.

### Shared layout blocks

- `src/shared/components/layouts/Header.tsx`
- `src/shared/components/layouts/Footer.tsx`

### Shared commerce blocks

- `src/shared/components/commerce/ProductCard.tsx`
- `src/shared/components/commerce/ProductPrice.tsx`
- `src/shared/components/commerce/ProductRating.tsx`
- `src/shared/components/commerce/ProductBadges.tsx`
- `src/shared/components/commerce/SizeSelector.tsx`
- `src/shared/components/commerce/CategoryCard.tsx`
- `src/shared/components/commerce/MiniCartPreview.tsx`

### Shared marketing and content blocks

- `src/shared/components/marketing/SectionHeading.tsx`
- `src/shared/components/marketing/TrustBadgeList.tsx`
- `src/shared/components/marketing/TestimonialCard.tsx`
- `src/shared/components/marketing/NewsletterForm.tsx`
- `src/shared/components/marketing/CountdownTimer.tsx`

### Shared hooks

- `src/shared/hooks/use-countdown.ts`
- `src/shared/hooks/use-hover-intent.ts`
- `src/shared/hooks/use-scroll-state.ts`

### Shared types

- `src/shared/types/product.ts`
- `src/shared/types/category.ts`
- `src/shared/types/review.ts`

### Reuse rule

- If a component can appear outside homepage, place it in `shared`
- If a component contains homepage-only copy, layout orchestration, or section-specific composition, keep it in `modules/home`
- Shared components should stay content-agnostic and be driven by props
- Home components are allowed to import shared components, but shared components must not depend on `modules/home`

---

## 4. Section Breakdown

Each homepage section should be implemented as a home-owned section wrapper that composes reusable shared blocks.

### Hero section

**File:** `src/modules/home/sections/SectionHero.tsx`

#### Responsibility

- Render the primary editorial hero for the homepage
- Own hero-specific layout, spacing, CTA placement, and trust line
- Pull content from `home-hero.data.ts`

#### Should use

- shared `SectionHeading` only if it fits the hero layout
- home `HomeTrustBar` for the small trust line under CTA

### Featured categories section

**File:** `src/modules/home/sections/SectionFeaturedCategories.tsx`

#### Responsibility

- Render featured categories rail or grid
- Map homepage category mock data into category cards
- Control desktop grid and mobile horizontal scrolling

#### Should use

- shared `CategoryCard`
- optional home `HomeSectionHeading`

### Best sellers section

**File:** `src/modules/home/sections/SectionBestSellers.tsx`

#### Responsibility

- Render best-selling products block
- Use homepage-curated data only in this phase
- Configure card behavior such as quick add visibility and badges

#### Should use

- shared `SectionHeading`
- shared `ProductCard`
- optional home `HomeProductRail`

### Flash sale section

**File:** `src/modules/home/sections/SectionFlashSale.tsx`

#### Responsibility

- Render countdown-driven promotional section
- Own campaign styling and urgency presentation
- Consume countdown state from a home-level or shared hook

#### Should use

- shared `CountdownTimer`
- shared `ProductCard` with compact or promo variant
- home `use-home-flash-sale-countdown` only if behavior is specific to homepage

### New arrivals section

**File:** `src/modules/home/sections/SectionNewArrivals.tsx`

#### Responsibility

- Render newly dropped products
- Control local quick filter UI for homepage
- Map selected filter state to visible mock products

#### Should use

- shared `SectionHeading`
- shared `ProductCard`
- module `use-home-product-filters`

### Why choose us section

**File:** `src/modules/home/sections/SectionWhyChooseUs.tsx`

#### Responsibility

- Render USP and trust messaging for the brand
- Own homepage copy and ordering of benefits

#### Should use

- shared `TrustBadgeList` if generic enough
- otherwise home `HomeTrustBar` or a small home-owned wrapper over shared primitives

### Testimonials section

**File:** `src/modules/home/sections/SectionTestimonials.tsx`

#### Responsibility

- Render customer proof and social trust
- Decide between simple carousel, scroll snap, or grid based on viewport

#### Should use

- shared `TestimonialCard`
- home wrapper for carousel behavior if the implementation is homepage-specific

### Newsletter section

**File:** `src/modules/home/sections/SectionNewsletter.tsx`

#### Responsibility

- Render final lead capture panel before footer
- Own homepage-specific copy, spacing, and visual treatment

#### Should use

- shared `NewsletterForm`
- optional home wrapper for premium layout framing

---

## 5. Component Responsibilities

### Home-only section components

- `HomePage`: composes the complete homepage in scroll order
- `SectionHero`: main hero, CTAs, image, trust line
- `SectionFeaturedCategories`: highlighted category discovery section
- `SectionBestSellers`: best seller merchandising section
- `SectionFlashSale`: countdown plus product rail
- `SectionNewArrivals`: latest products plus quick filters
- `SectionWhyChooseUs`: brand benefits and trust points
- `SectionTestimonials`: social proof section
- `SectionNewsletter`: email capture section before footer

### Home-only supporting components

- `HomeSectionHeading`: homepage-specific section heading wrapper when shared heading is too generic
- `HomeTrustBar`: compact homepage trust messaging row under hero or promo sections
- `HomeCategoryCard`: only keep if homepage category presentation diverges from shared category card
- `HomeTestimonialCard`: only keep if homepage visual treatment diverges from shared testimonial card
- `HomeNewsletterForm`: only keep if homepage newsletter wrapper needs extra logic beyond shared form
- `HomeProductRail`: homepage-specific rail layout helper for featured product sections

### Shared reusable components

- `ProductCard`: product tile for homepage, product listing, search, and collection pages
- `CategoryCard`: category tile for homepage and other landing surfaces
- `SectionHeading`: section title, subtitle, and optional CTA
- `CountdownTimer`: campaign timer for flash sale and future campaign pages
- `TestimonialCard`: reusable testimonial block
- `NewsletterForm`: reusable email form for homepage, footer promo, or campaign pages
- `MiniCartPreview`: hover or popover cart preview for header and future cart interactions

---

## 6. Public Interfaces and Props

The following props should be treated as the minimum reusable contracts.

### `ProductCardProps`

```ts
type ProductCardProps = {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  rating?: number;
  reviewCount?: number;
  badges?: Array<'best-seller' | 'new' | 'sale' | 'low-stock'>;
  sizes?: string[];
  variant?: 'default' | 'compact' | 'featured';
  showQuickAdd?: boolean;
};
```

### `CategoryCardProps`

```ts
type CategoryCardProps = {
  slug: string;
  name: string;
  image: string;
  productCount?: number;
  href: string;
};
```

### `SectionHeadingProps`

```ts
type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  align?: 'left' | 'center';
};
```

### `CountdownTimerProps`

```ts
type CountdownTimerProps = {
  targetDate: Date;
  variant?: 'default' | 'compact' | 'hero';
};
```

### `TestimonialCardProps`

```ts
type TestimonialCardProps = {
  name: string;
  avatar: string;
  rating: number;
  quote: string;
  meta?: string;
};
```

### `NewsletterFormProps`

```ts
type NewsletterFormProps = {
  title?: string;
  description?: string;
  submitLabel?: string;
};
```

### Home mock data shapes

Homepage mock data should be grouped by intent, not embedded inline inside section components.

- `home-hero.data.ts`: hero title, subtitle, CTA labels, image, trust items
- `home-categories.data.ts`: featured categories list
- `home-products.data.ts`: best sellers and new arrivals product highlights
- `home-testimonials.data.ts`: testimonials list
- `home-benefits.data.ts`: trust and brand benefits items

Shared commerce data should eventually align with `src/shared/types/product.ts` where possible. Home-only data files may use narrower derived shapes in this UI-first phase.

---

## 7. i18n Expectations

Homepage remains under the existing `home` namespace in `next-intl`.

Required additions:

- `home.hero.*`
- `home.categories.*`
- `home.bestSellers.*`
- `home.flashSale.*`
- `home.newArrivals.*`
- `home.whyChooseUs.*`
- `home.testimonials.*`
- `home.newsletter.*`

If header and footer labels are updated for the new homepage experience, shared labels should go under `common` instead of `home`.

### Copy rules

- English is the primary content voice for this homepage spec
- Vietnamese translation must be complete and natural
- Shared components should receive translated strings via props instead of hardcoded copy

---

## 8. Test Expectations

Testing should cover three layers.

### Module rendering

- `HomePage` renders all sections in the correct order
- each section renders its heading, CTA, and mapped mock data correctly
- homepage sections remain compositional and do not pull route concerns into the module

### Shared component behavior

- `ProductCard` displays prices, sale states, badges, rating, and optional sizes correctly
- `CountdownTimer` formats countdown output correctly and handles expired state
- `NewsletterForm` handles safe submit UI states
- `CategoryCard` renders title, image, and href correctly

### i18n and accessibility

- `en` and `vi` contain all required homepage keys
- CTA buttons have accessible labels
- all images have meaningful alt text
- keyboard focus works in header actions, hero CTAs, and product actions

---

## 9. Assumptions and Boundaries

- Homepage remains UI-first in this phase and does not connect to live product or search APIs
- Search autocomplete, visual search, AR try-on, and personalization are out of scope
- `Header` and `Footer` remain in `shared/layouts`
- `ProductCard` and other commerce primitives must live in `shared`, not inside `modules/home`
- `modules/home` is responsible for homepage orchestration and homepage-specific presentation only
- Hero stays single and static for MVP, aligned with the Minimal Luxury direction
