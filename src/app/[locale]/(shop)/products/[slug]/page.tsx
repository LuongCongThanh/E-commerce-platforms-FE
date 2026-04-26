import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft, RotateCcw, ShieldCheck, Star, Truck } from 'lucide-react';

import { AddToCartSection } from '@/app/[locale]/(shop)/_components/products/AddToCartSection';
import { ProductGallery } from '@/app/[locale]/(shop)/_components/products/ProductGallery';
import { bestSellersData, newArrivalsData } from '@/app/[locale]/(shop)/_lib/data/home';
import { Badge } from '@/shared/components/base/Badge';
import { cn, formatCurrency } from '@/shared/lib/utils';

interface ProductPageProps {
  readonly params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = [...bestSellersData, ...newArrivalsData].find(p => p.slug === slug);

  if (product === undefined) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | ANTIGRAVITY.STORE`,
    description: `Mua ${product.name} chính hãng tại ANTIGRAVITY.STORE. Giá tốt, giao hàng nhanh toàn quốc.`,
    openGraph: {
      title: product.name,
      description: `Mua ${product.name} chính hãng tại ANTIGRAVITY.STORE.`,
      images: [product.images[0]],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = [...bestSellersData, ...newArrivalsData].find(p => p.slug === slug);

  if (product === undefined) {
    notFound();
  }

  // SEO JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: `Mua ${product.name} chính hãng tại ANTIGRAVITY.STORE.`,
    brand: {
      '@type': 'Brand',
      name: 'Antigravity',
    },
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

  return (
    <div className="relative min-h-screen pt-20 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto px-4">
        {/* Back link */}
        <Link href="/products" className="hover:text-primary-500 mb-8 flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors">
          <ArrowLeft className="size-4" />
          Quay lại danh sách
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left: Product Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                {product.badges.map(badge => (
                  <Badge key={badge} variant="secondary" className="capitalize">
                    {badge}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={`star-${i.toString()}`}
                      className={cn('size-4', i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300')}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-neutral-500">
                    {product.rating.toString()} ({product.reviewCount.toString()} đánh giá)
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8 flex items-baseline gap-4">
              {product.salePrice !== null ? (
                <>
                  <span className="text-primary-500 text-3xl font-bold">{formatCurrency(product.salePrice)}</span>
                  <span className="text-xl text-neutral-400 line-through">{formatCurrency(product.price)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
              )}
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-sm font-bold tracking-wider text-neutral-500 uppercase">Mô tả sản phẩm</h3>
              <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
                Sản phẩm cao cấp từ thương hiệu Antigravity, được thiết kế với chất liệu bền bỉ và kiểu dáng thời thượng. Phù hợp cho mọi hoạt động
                hàng ngày, mang lại cảm giác thoải mái và phong cách riêng biệt.
              </p>
            </div>

            {/* Add to Cart Section - Client Component for interaction */}
            <AddToCartSection product={product} />

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary-500/10 text-primary-500 flex size-10 items-center justify-center rounded-full">
                  <Truck className="size-5" />
                </div>
                <div className="text-xs">
                  <p className="font-bold">Giao hàng nhanh</p>
                  <p className="text-neutral-500">2-4 ngày làm việc</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary-500/10 text-primary-500 flex size-10 items-center justify-center rounded-full">
                  <RotateCcw className="size-5" />
                </div>
                <div className="text-xs">
                  <p className="font-bold">Đổi trả 30 ngày</p>
                  <p className="text-neutral-500">Miễn phí đổi trả</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary-500/10 text-primary-500 flex size-10 items-center justify-center rounded-full">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="text-xs">
                  <p className="font-bold">Bảo hành 1 năm</p>
                  <p className="text-neutral-500">Chính hãng 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
