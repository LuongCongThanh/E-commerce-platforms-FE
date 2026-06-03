import type { BadgeValue, Product as SharedProduct } from '@/shared/types/product';

export type { BadgeValue };

// UI display variant (size selector) — distinct from API ProductVariant
export type VariantOption = {
  id: string;
  label: string;
  stock: number;
};

// Shop UI product — extends shared API shape, overrides fields that differ in the UI layer
export type Product = Omit<SharedProduct, 'category' | 'variants' | 'stock' | 'isActive' | 'createdAt' | 'updatedAt'> & {
  categorySlug: string;
  badges: BadgeValue[];
  variants: VariantOption[];
};
