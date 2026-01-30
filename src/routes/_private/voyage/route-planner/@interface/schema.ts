import { z } from 'zod';

export const routePlannerSearchSchema = z.object({
  idRoute: z.string().optional(),
});

export type RoutePlannerSearch = z.infer<typeof routePlannerSearchSchema>;
