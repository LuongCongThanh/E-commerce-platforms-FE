import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  productCount: z.number().optional(),
});

export type Category = z.infer<typeof CategorySchema>;
