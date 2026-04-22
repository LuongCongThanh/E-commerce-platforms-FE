import { bestSellersData } from '@/app/[locale]/(shop)/_lib/data/home';
import { ProductCard } from '@/shared/components/commerce/ProductCard';
import { SectionHeading } from '@/shared/components/marketing/SectionHeading';

export const SectionBestSellers = (): React.JSX.Element => {
  return (
    <section className="container mx-auto px-4 py-12">
      <SectionHeading title="Sản phẩm bán chạy" ctaLabel="Xem tất cả" ctaHref="/vi/products" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {bestSellersData.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            salePrice={product.salePrice}
            images={product.images}
            rating={product.rating}
            reviewCount={product.reviewCount}
            badges={product.badges}
            locale="vi"
          />
        ))}
      </div>
    </section>
  );
};
