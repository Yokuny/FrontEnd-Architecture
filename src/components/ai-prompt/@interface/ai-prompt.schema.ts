import { z } from 'zod';

export const aiPromptSchema = z.object({
  question: z.string().min(1),
});
