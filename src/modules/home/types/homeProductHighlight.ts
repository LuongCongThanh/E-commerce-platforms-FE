export interface HomeProductHighlight {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  rating?: number;
  reviewCount?: number;
  badges?: Array<'best-seller' | 'new' | 'sale' | 'low-stock'>;
}
