import { z } from 'zod';

export const searchSchema = z.object({
  dateMin: z.string().optional(),
  dateMax: z.string().optional(),
  unit: z.string().optional(),
  machines: z
    .array(z.string())
    .optional()
    .or(z.string().transform((val) => [val])),
});

export type ConsumptionIntervalSearch = z.infer<typeof searchSchema>;
