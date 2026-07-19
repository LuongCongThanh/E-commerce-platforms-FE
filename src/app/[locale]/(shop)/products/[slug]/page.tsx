import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft, ChevronRight, RotateCcw, ShieldCheck, Star, Truck } from 'lucide-react';
import type { Metadata } from 'next';

import { ProductGrid } from '@/app/[locale]/(shop)/_lib/components/common/ProductGrid';
import { AddToCartSection } from '@/app/[locale]/(shop)/_lib/components/products/AddToCartSection';
import { ProductDetailTabs } from '@/app/[locale]/(shop)/_lib/components/products/ProductDetailTabs';
import { ProductGallery } from '@/app/[locale]/(shop)/_lib/components/products/ProductGallery';
import { getProductBySlug } from '@/app/[locale]/(shop)/_lib/queries/product';
import { Badge } from '@/shared/components/base/badge';
import { cn, formatCurrency } from '@/shared/lib/utils';

interface ProductPageProps {
  readonly params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { product } = getProductBySlug(slug);

  if (product === null) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | ANTIGRAVITY.STORE`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const { product, relatedProducts } = getProductBySlug(slug);

  if (product === null) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { '@type': 'Brand', name: 'Antigravity' },
    offers: {
      '@type': 'Offer',
      url: `https://antigravity.store/${locale}/products/${slug}`,
      priceCurrency: 'VND',
      price: product.salePrice ?? product.price,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  const discount = product.salePrice !== null ? Math.round(((product.price - product.salePrice) / product.price) * 100) : null;

  return (
    <div className="min-h-screen pt-8 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-muted-foreground mb-8 flex items-center gap-1.5 text-sm">
          <Link href={`/${locale}/home`} className="hover:text-foreground transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href={`/${locale}/products`} className="hover:text-foreground transition-colors">
            Sản phẩm
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href={`/${locale}/categories/${product.categorySlug}`} className="hover:text-foreground capitalize transition-colors">
            {product.categorySlug}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </nav>

        {/* Main 2-col layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Right: Info */}
          <div className="flex flex-col gap-6">
            {/* Badges + name */}
            <div>
              {product.badges.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {product.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="capitalize">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
              <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">{product.name}</h1>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={`star-${i.toString()}`}
                      className={cn('size-4', i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300')}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">({product.reviewCount.toString()} đánh giá)</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-success-700 text-sm">Còn hàng</span>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-4">
                {product.salePrice !== null ? (
                  <>
                    <span className="text-brand-600 text-3xl font-bold">{formatCurrency(product.salePrice)}</span>
                    <span className="text-muted-foreground text-lg line-through">{formatCurrency(product.price)}</span>
                    {discount !== null && (
                      <span className="bg-brand-50 text-brand-700 rounded-full px-2.5 py-0.5 text-sm font-bold">-{discount.toString()}%</span>
                    )}
                  </>
                ) : (
                  <span className="text-brand-600 text-3xl font-bold">{formatCurrency(product.price)}</span>
                )}
              </div>
              {product.salePrice !== null && (
                <p className="text-muted-foreground mt-1.5 text-xs">Tiết kiệm {formatCurrency(product.price - product.salePrice)}</p>
              )}
            </div>

            {/* Variant + Qty + Cart */}
            <AddToCartSection product={product} />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 border-t pt-6">
              {[
                { icon: Truck, title: 'Giao hàng nhanh', sub: '2-4 ngày làm việc' },
                { icon: RotateCcw, title: 'Đổi trả 30 ngày', sub: 'Miễn phí đổi trả' },
                { icon: ShieldCheck, title: 'Bảo hành 1 năm', sub: 'Chính hãng 100%' },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center gap-2 rounded-xl border p-3 text-center">
                  <div className="bg-muted text-foreground flex size-9 items-center justify-center rounded-full">
                    <item.icon className="size-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold">{item.title}</p>
                    <p className="text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Back link */}
            <Link
              href={`/${locale}/products`}
              className="text-muted-foreground hover:text-foreground mt-2 flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="size-4" />
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>

        {/* Tabs: Description / Specs / Reviews */}
        <div className="mt-16">
          <ProductDetailTabs description={product.description} rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
              <Link
                href={`/${locale}/categories/${product.categorySlug}`}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-medium hover:underline"
              >
                Xem tất cả <ChevronRight className="size-4" />
              </Link>
            </div>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
