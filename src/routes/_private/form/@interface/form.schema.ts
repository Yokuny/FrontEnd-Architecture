import { z } from 'zod';

export const formSearchSchema = z.object({
  page: z.number().catch(1).optional().default(1),
  size: z.number().catch(10).optional().default(10),
  search: z.string().optional(),
});

export type FormSearch = z.infer<typeof formSearchSchema>;
