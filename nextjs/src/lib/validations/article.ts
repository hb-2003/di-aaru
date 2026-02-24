import { z } from 'zod';
import { MediaObjectSchema, BlockSchema } from './shared';

export const CreateArticleSchema = z.object({
  data: z.object({
    title: z.string().min(1),
    description: z.string().max(80).optional(),
    cover: MediaObjectSchema.optional(),
    authorId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    blocks: z.array(BlockSchema).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
  }),
});

export const UpdateArticleSchema = z.object({
  data: CreateArticleSchema.shape.data.partial(),
});
