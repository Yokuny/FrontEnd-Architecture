import { z } from 'zod';

export const fasAnalyticsSearchSchema = z.object({
  chartType: z.string().optional().default('range'),
  filterType: z.enum(['range', 'month']).optional().default('range'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  month: z.string().optional(),
  year: z.number().optional(),
  vesselId: z.string().optional(),
  status: z.array(z.string()).optional(),
  fasType: z.array(z.string()).optional(),
  dependantAxis: z.enum(['month', 'year', 'vessel', 'supplier']).optional().default('month'),
  showValueByPayment: z.boolean().optional().default(false),
});

export type FasAnalyticsSearch = z.infer<typeof fasAnalyticsSearchSchema>;
