import { z } from 'zod';

export const dashboardListSearchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
  idEnterprise: z.string().optional(),
  idMachine: z.string().optional(),
  name: z.string().optional(),
});

export type DashboardListSearch = z.infer<typeof dashboardListSearchSchema>;
