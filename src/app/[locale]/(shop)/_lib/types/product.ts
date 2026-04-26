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
  badges: string[];
  categorySlug: string;
  description: string;
  variants: ProductVariant[];
};
