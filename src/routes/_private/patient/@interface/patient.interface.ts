import { z } from 'zod';

export const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(20),
  search: z.string().optional(),
});

export type SearchParams = z.infer<typeof searchSchema>;
