import type { HomeProductHighlight } from '@/modules/home/types/homeProductHighlight';

export const bestSellersData: HomeProductHighlight[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `Sản phẩm bán chạy ${String(i + 1)}`,
  slug: `san-pham-ban-chay-${String(i + 1)}`,
  price: (i + 1) * 150_000 + 200_000,
  salePrice: i % 3 === 0 ? (i + 1) * 120_000 + 180_000 : null,
  images: ['/images/products/placeholder.jpg'],
  rating: 4 + (i % 2) * 0.5,
  reviewCount: 10 + i * 5,
  badges: i === 0 ? ['best-seller'] : i % 4 === 0 ? ['sale'] : [],
}));

export const newArrivalsData: HomeProductHighlight[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 100,
  name: `Hàng mới về ${String(i + 1)}`,
  slug: `hang-moi-ve-${String(i + 1)}`,
  price: (i + 1) * 200_000 + 300_000,
  salePrice: null,
  images: ['/images/products/placeholder.jpg'],
  rating: 4.2,
  reviewCount: i * 2,
  badges: ['new'],
}));
