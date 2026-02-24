import { z } from 'zod';
import { MediaObjectSchema } from './shared';

export const CreateAuthorSchema = z.object({
  data: z.object({
    name: z.string().min(1),
    avatar: MediaObjectSchema.optional(),
    email: z.string().email().optional(),
  }),
});

export const UpdateAuthorSchema = z.object({
  data: CreateAuthorSchema.shape.data.partial(),
});
