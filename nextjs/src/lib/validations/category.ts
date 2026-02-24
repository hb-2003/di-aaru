import { z } from 'zod';

export const CreateCategorySchema = z.object({
  data: z.object({
    name: z.string().min(1),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
  }),
});

export const UpdateCategorySchema = z.object({
  data: CreateCategorySchema.shape.data.partial(),
});
