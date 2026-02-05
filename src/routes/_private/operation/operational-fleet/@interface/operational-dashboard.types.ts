import { z } from 'zod';

export const operationalFleetSearchParamsSchema = z.object({
  search: z.string().optional(),
  dateMin: z.string().optional(),
  dateMax: z.string().optional(),
});

export type OperationalFleetSearchParams = z.infer<typeof operationalFleetSearchParamsSchema>;

export interface AssetOperationalRanking {
  machine: {
    id: string;
    name: string;
    image?: {
      url: string;
    };
  };
  status: string;
  startedAt: string;
  percentualOperating: number;
}
