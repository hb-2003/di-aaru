import { z } from 'zod';
import { MediaObjectSchema, SeoSchema } from './shared';

export const UpdateGlobalSchema = z.object({
  data: z.object({
    siteName: z.string().min(1).optional(),
    favicon: MediaObjectSchema.optional(),
    siteDescription: z.string().optional(),
    topBarMessage: z.string().optional(),
    topBarPhone: z.string().optional(),
    topBarEmail: z.string().email().optional(),
    defaultSeo: SeoSchema.optional(),
  }),
});
