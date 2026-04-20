import { Footer } from '@/shared/components/layouts/Footer';
import { Header } from '@/shared/components/layouts/Header';

export default function ShopLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
