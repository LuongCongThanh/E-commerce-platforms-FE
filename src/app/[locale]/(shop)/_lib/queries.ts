import { homeCategoriesData, homeHeroData } from '@/app/[locale]/(shop)/_lib/data/home';
import { productsData } from '@/app/[locale]/(shop)/_lib/data/products';
import type { HomeCategory, HomeHero, HomeProductHighlight } from '@/app/[locale]/(shop)/_lib/types/home';
import type { Product } from '@/app/[locale]/(shop)/_lib/types/product';

function toHomeHighlight(product: Product): HomeProductHighlight {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    salePrice: product.salePrice,
    images: product.images,
    rating: product.rating,
    reviewCount: product.reviewCount,
    badges: product.badges,
  };
}

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
  hero: HomeHero;
  bestSellers: HomeProductHighlight[];
  newArrivals: HomeProductHighlight[];
  flashSale: HomeProductHighlight[];
  categories: HomeCategory[];
} {
  const bestSellers = productsData.filter(product => product.badges.includes('best-seller')).map(toHomeHighlight);
  const newArrivals = productsData.filter(product => product.badges.includes('new')).map(toHomeHighlight);
  const flashSale = productsData
    .filter(product => product.salePrice !== null)
    .slice(0, 4)
    .map(toHomeHighlight);

  return {
    hero: homeHeroData,
    bestSellers,
    newArrivals,
    flashSale,
    categories: homeCategoriesData,
  };
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): HomeCategory | null {
  return homeCategoriesData.find(c => c.slug === slug) ?? null;
}
