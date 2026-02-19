import { z } from 'zod';

export const aiPromptSchema = z.object({
  question: z.string().min(1),
  mentions: z
    .array(
      z.object({
        trigger: z.string(),
        type: z.string(),
        id: z.string(),
        name: z.string(),
      }),
    )
    .optional(),
});
