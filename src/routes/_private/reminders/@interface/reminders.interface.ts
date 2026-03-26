import { z } from 'zod';

export const searchSchema = z.object({
  showAll: z.boolean().optional().default(false),
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
});

export type SearchParams = z.infer<typeof searchSchema>;
