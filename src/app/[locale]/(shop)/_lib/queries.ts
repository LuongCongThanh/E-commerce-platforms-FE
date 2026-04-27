import { bestSellersData, homeCategoriesData, newArrivalsData } from '@/app/[locale]/(shop)/_lib/data/home';
import { productsData } from '@/app/[locale]/(shop)/_lib/data/products';
import type { HomeCategory, HomeProductHighlight } from '@/app/[locale]/(shop)/_lib/types/home';
import type { Product } from '@/app/[locale]/(shop)/_lib/types/product';

/**
 * Get product by slug and its related products
 */
export function getProductBySlug(slug: string): {
  product: Product | null;
  relatedProducts: Product[];
} {
  const product = productsData.find(p => p.slug === slug) ?? null;
  const relatedProducts = product !== null ? productsData.filter(p => p.categorySlug === product.categorySlug && p.slug !== slug).slice(0, 4) : [];
  return { product, relatedProducts };
}

/**
 * Get home page data sections
 */
export function getHomeData(): {
  bestSellers: HomeProductHighlight[];
  newArrivals: HomeProductHighlight[];
  flashSale: HomeProductHighlight[];
  categories: HomeCategory[];
} {
  return {
    bestSellers: bestSellersData,
    newArrivals: newArrivalsData,
    flashSale: bestSellersData.slice(0, 4),
    categories: homeCategoriesData,
  };
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): HomeCategory | null {
  return homeCategoriesData.find(c => c.slug === slug) ?? null;
}
