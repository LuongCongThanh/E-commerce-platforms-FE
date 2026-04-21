import { z } from 'zod';

export const ProductFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  ordering: z.enum(['-created_at', 'price', '-price', 'rating']).optional(),
  inStock: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(20),
});

export type ProductFilter = z.infer<typeof ProductFilterSchema>;
