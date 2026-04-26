import { z } from 'zod';

import { ShippingAddressSchema } from '@/shared/types/address';

export const CheckoutFormSchema = z.object({
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.literal('cod'),
  note: z.string().max(200, 'Ghi chú tối đa 200 ký tự').optional(),
});

export type CheckoutFormData = z.infer<typeof CheckoutFormSchema>;
