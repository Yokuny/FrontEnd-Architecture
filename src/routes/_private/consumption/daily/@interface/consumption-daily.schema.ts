import { z } from 'zod';

export const searchSchema = z.object({
  dateMin: z.string().optional(),
  dateMax: z.string().optional(),
  machine: z.string().optional(),
  unit: z.string().optional(),
});

export type SearchParams = z.infer<typeof searchSchema>;
