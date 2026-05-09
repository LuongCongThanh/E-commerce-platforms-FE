import Link from 'next/link';

import { AlertTriangle } from 'lucide-react';

import { Button } from '@/shared/components/base/Button';

const REASON_COPY: Record<string, string> = {
  server: 'Hệ thống đang gặp sự cố tạm thời khi xử lý đơn hàng.',
  unknown: 'Không thể hoàn tất đơn hàng ở thời điểm này.',
};

export default async function CheckoutFailedPage({
  params,
  searchParams,
}: {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<{ reason?: string; message?: string }>;
}): Promise<React.JSX.Element> {
  const { locale } = await params;
  const { reason, message } = await searchParams;

  const detail = message != null && message.length > 0 ? message : ((reason != null ? REASON_COPY[reason] : null) ?? REASON_COPY.unknown);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center">
      <AlertTriangle className="h-20 w-20 text-amber-500" />
      <div>
        <h1 className="text-2xl font-bold">Chưa thể hoàn tất đơn hàng</h1>
        <p className="text-muted-foreground mt-2">{detail}</p>
      </div>
      <p className="text-muted-foreground max-w-md text-sm">
        Giỏ hàng của bạn vẫn được giữ nguyên để bạn có thể thử lại sau khi kiểm tra kết nối hoặc thông tin đơn hàng.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href={`/${locale}/cart`}>Quay lại giỏ hàng</Link>
        </Button>
        <Button asChild>
          <Link href={`/${locale}/checkout`}>Thử lại</Link>
        </Button>
      </div>
    </div>
  );
}
