import { z } from 'zod';

export const searchSchema = z.object({
  dateMin: z.string().optional(),
  dateMax: z.string().optional(),
  unit: z.string().optional(),
  viewType: z.enum(['consumption', 'stock']).optional(),
  machines: z.string().optional(),
});

export type ConsumptionComparativeSearch = z.infer<typeof searchSchema>;
