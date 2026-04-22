import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ tên'),
  phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
  address: z.string().min(5, 'Vui lòng nhập địa chỉ'),
  city: z.string().min(1, 'Vui lòng chọn tỉnh/thành'),
});

export const checkoutSchema = addressSchema.extend({
  paymentMethod: z.enum(['cod', 'vnpay', 'momo', 'zalopay']),
  note: z.string().optional(),
  voucherCode: z.string().optional(),
});

export const filterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  ordering: z.enum(['price', '-price', '-created_at', 'rating']).optional(),
  page: z.coerce.number().default(1),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type FilterInput = z.infer<typeof filterSchema>;
