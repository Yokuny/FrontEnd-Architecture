import { z } from 'zod';

export const monitoringPlansSearchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
});

export type MonitoringPlansSearch = z.infer<typeof monitoringPlansSearchSchema>;

export const monitoringFilterSchema = z.object({
  idMachine: z.array(z.string()).optional(),
  idMaintenancePlan: z.array(z.string()).optional(),
  managers: z.array(z.string()).optional(),
  status: z.enum(['late', 'next']).optional(),
});

export type MonitoringFilter = z.infer<typeof monitoringFilterSchema>;
