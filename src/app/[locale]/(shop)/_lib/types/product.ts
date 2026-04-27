import type { BadgeValue } from '@/shared/types/product';

export type ProductVariant = {
  id: string;
  label: string;
  stock: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: string[];
  rating: number;
  reviewCount: number;
  badges: BadgeValue[];
  categorySlug: string;
  description: string;
  variants: ProductVariant[];
};
