import { z } from 'zod';
import { SectionSchema } from './shared';

export const CreatePageSchema = z.object({
  data: z.object({
    title: z.string().min(1),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    sections: z.array(SectionSchema).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
  }),
});

export const UpdatePageSchema = z.object({
  data: CreatePageSchema.shape.data.partial(),
});
