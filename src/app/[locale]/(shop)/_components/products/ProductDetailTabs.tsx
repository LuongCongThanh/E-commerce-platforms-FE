'use client';

import { Star } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/base/tabs';
import { cn } from '@/shared/lib/utils';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

interface ProductDetailTabsProps {
  readonly description: string;
  readonly rating: number;
  readonly reviewCount: number;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: 'Nguyễn Văn A',
    rating: 5,
    date: '15/04/2025',
    comment: 'Sản phẩm chất lượng rất tốt, đúng mô tả, giao hàng nhanh. Mình rất hài lòng!',
  },
  { id: 2, author: 'Trần Thị B', rating: 4, date: '10/04/2025', comment: 'Hàng đẹp, chất vải tốt. Sẽ mua lại lần sau.' },
  { id: 3, author: 'Lê Minh C', rating: 5, date: '02/04/2025', comment: 'Mua cho cả nhà, ai cũng thích. Shop đóng gói cẩn thận.' },
];

const FEATURES = [
  { label: 'Chất liệu', value: 'Cotton 100% cao cấp' },
  { label: 'Xuất xứ', value: 'Việt Nam' },
  { label: 'Bảo quản', value: 'Giặt máy ở nhiệt độ thường, không tẩy' },
  { label: 'Thương hiệu', value: 'Antigravity' },
];

export function ProductDetailTabs({ description, rating, reviewCount }: ProductDetailTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="h-auto w-full justify-start rounded-none border-b border-white/10 bg-transparent p-0">
        <TabsTrigger
          value="description"
          className="data-[state=active]:border-primary-500 rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-semibold data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
        >
          Mô tả sản phẩm
        </TabsTrigger>
        <TabsTrigger
          value="specs"
          className="data-[state=active]:border-primary-500 rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-semibold data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
        >
          Thông số
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="data-[state=active]:border-primary-500 rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-semibold data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
        >
          Đánh giá ({reviewCount})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>
          <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>✓ Chất liệu cao cấp, bền đẹp theo thời gian</li>
            <li>✓ Thiết kế thời thượng, phù hợp mọi dịp</li>
            <li>✓ Thoáng mát, thoải mái khi mặc suốt ngày dài</li>
            <li>✓ Form chuẩn, đa dạng size từ S đến XL</li>
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="specs" className="mt-6">
        <div className="divide-y divide-white/10 rounded-xl border border-white/10">
          {FEATURES.map(f => (
            <div key={f.label} className="flex px-5 py-3.5 text-sm">
              <span className="w-36 shrink-0 font-semibold text-neutral-500">{f.label}</span>
              <span className="text-neutral-700 dark:text-neutral-300">{f.value}</span>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="mb-6 flex items-center gap-6">
          <div className="text-center">
            <p className="text-5xl font-black">{rating.toFixed(1)}</p>
            <div className="mt-1 flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`avg-star-${i.toString()}`}
                  className={cn('size-4', i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300')}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-neutral-500">{reviewCount} đánh giá</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-neutral-500">{star}</span>
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-yellow-400" style={{ width: star >= 4 ? `${(star === 5 ? 60 : 30).toString()}%` : '5%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_REVIEWS.map(review => (
            <div key={review.id} className="glass rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{review.author}</p>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={`review-${review.id.toString()}-star-${i.toString()}`}
                        className={cn('size-3.5', i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300')}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-neutral-500">{review.date}</span>
              </div>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{review.comment}</p>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
