import { z } from 'zod';

/**
 * Schema para search params da rota datalogger
 */
export const dataloggerSearchSchema = z.object({
  dateInit: z.string().optional(),
  dateEnd: z.string().optional(),
  timeInit: z.string().optional(),
  timeEnd: z.string().optional(),
  interval: z.coerce.number().optional().default(30),
  idAsset: z.string().optional(),
});

export type DataloggerSearchParams = z.infer<typeof dataloggerSearchSchema>;
