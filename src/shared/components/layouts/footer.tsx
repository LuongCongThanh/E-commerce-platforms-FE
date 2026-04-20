import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-border border-t bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-primary-500 text-xl font-extrabold tracking-tight">
              SHOP<span className="text-neutral-900">.VN</span>
            </span>
            <p className="mt-2 text-sm text-neutral-500">Mua sắm trực tuyến nhanh chóng, tiện lợi.</p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">Mua sắm</h3>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li>
                <Link href="/products" className="hover:text-primary-500">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/products?category=sale" className="hover:text-primary-500">
                  Flash Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">Tài khoản</h3>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li>
                <Link href="/auth/login" className="hover:text-primary-500">
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-primary-500">
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-primary-500">
                  Đơn hàng của tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li>
                <span>📞 1800 xxxx</span>
              </li>
              <li>
                <span>✉ support@shop.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border mt-8 border-t pt-6 text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} Shop.VN. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
