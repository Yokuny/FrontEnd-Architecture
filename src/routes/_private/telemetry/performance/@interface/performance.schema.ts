import { z } from 'zod';

export const performanceSearchSchema = z.object({
  period: z.coerce.number().optional().default(1),
});

export type PerformanceSearch = z.infer<typeof performanceSearchSchema>;
