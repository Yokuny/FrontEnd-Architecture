import { z } from 'zod';

export const searchSchema = z.object({
  id: z.string().optional(),
});

export type DetailsSearchParams = z.infer<typeof searchSchema>;
