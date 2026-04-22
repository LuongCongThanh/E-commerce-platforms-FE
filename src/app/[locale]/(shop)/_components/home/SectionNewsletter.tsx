import { NewsletterForm } from '@/shared/components/marketing/NewsletterForm';

export const SectionNewsletter = (): React.JSX.Element => {
  return (
    <section className="bg-neutral-900 text-white">
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-16 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight">Nhận ưu đãi độc quyền</h2>
          <p className="text-sm text-neutral-400">Đăng ký nhận bản tin để không bỏ lỡ khuyến mãi</p>
        </div>
        <div className="w-full max-w-md">
          <NewsletterForm title="Nhận ưu đãi độc quyền" submitLabel="Đăng ký ngay" />
        </div>
      </div>
    </section>
  );
};
