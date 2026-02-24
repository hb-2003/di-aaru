import { z } from 'zod';
import { MediaObjectSchema } from './shared';

export const CreateProductSchema = z.object({
  data: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    diamondType: z.enum(['Lab Grown', 'Natural']).optional(),
    carat: z.number().positive().optional(),
    shape: z.string().optional(),
    images: z.array(MediaObjectSchema).optional(),
    featured: z.boolean().default(false),
    isShow: z.boolean().default(true),
    status: z.enum(['draft', 'published']).default('draft'),
  }),
});

export const UpdateProductSchema = z.object({
  data: CreateProductSchema.shape.data.partial(),
});
