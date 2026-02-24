import { z } from 'zod';
import { BlockSchema } from './shared';

export const UpdateAboutSchema = z.object({
  data: z.object({
    title: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.number().optional(),
    blocks: z.array(BlockSchema).optional(),
  }),
});
