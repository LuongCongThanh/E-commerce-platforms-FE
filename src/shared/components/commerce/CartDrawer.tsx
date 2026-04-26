'use client';

import Image from 'next/image';
import Link from 'next/link';

import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

import { Button } from '@/shared/components/base/Button';
import { ScrollArea } from '@/shared/components/base/ScrollArea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/base/Sheet';
import { useCartStore } from '@/shared/stores/cart-store';

interface CartDrawerProps {
  readonly children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { items, total, itemCount, updateQuantity, removeCartItem } = useCartStore();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="glass flex w-full flex-col border-l-white/10 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-white/10 p-6">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag className="text-primary-500 size-5" />
            Giỏ hàng của bạn
            <span className="bg-primary-500/10 text-primary-500 ml-2 rounded-full px-2 py-0.5 text-xs font-medium">{itemCount}</span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <ShoppingBag className="size-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium">Giỏ hàng trống</h3>
                <p className="mt-1 text-sm text-neutral-500">Hãy bắt đầu mua sắm để lấp đầy giỏ hàng của bạn!</p>
                <SheetTrigger asChild>
                  <Button variant="outline" className="mt-6">
                    Tiếp tục mua sắm
                  </Button>
                </SheetTrigger>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative flex gap-4"
                    >
                      <div className="relative size-20 overflow-hidden rounded-xl border border-white/10 bg-neutral-100 dark:bg-neutral-800">
                        <Image src={item.image} alt={item.name} fill className="object-cover transition-transform group-hover:scale-110" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="line-clamp-1 text-sm font-semibold">{item.name}</h4>
                          <p className="text-primary-500 mt-1 text-sm font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-1">
                            <button
                              onClick={() => {
                                updateQuantity(item.variantId, Math.max(1, item.quantity - 1));
                              }}
                              className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-white/10"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                            <button
                              onClick={() => {
                                updateQuantity(item.variantId, item.quantity + 1);
                              }}
                              className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-white/10"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              removeCartItem(item.variantId);
                            }}
                            className="hover:text-destructive-500 text-neutral-400 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </ScrollArea>

        {items.length > 0 && (
          <div className="border-t border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="mb-4 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Tạm tính</span>
                <span className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Tổng cộng</span>
                <span className="text-primary-500">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SheetTrigger asChild>
                <Link href="/cart">
                  <Button variant="outline" className="w-full">
                    Xem giỏ hàng
                  </Button>
                </Link>
              </SheetTrigger>
              <Link href="/checkout">
                <Button className="w-full">Thanh toán</Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
