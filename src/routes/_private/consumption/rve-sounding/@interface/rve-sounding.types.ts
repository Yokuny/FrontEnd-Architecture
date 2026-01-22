import { z } from 'zod';

export const rveSoundingSearchParamsSchema = z.object({
  machines: z.string().optional(),
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
});

export type RVESoundingSearchParams = z.infer<typeof rveSoundingSearchParamsSchema>;

export interface Asset {
  id: string;
  name: string;
  image: {
    url: string;
  };
}

export interface Operation {
  code: string;
  idAsset: string;
  dateStart: Date;
  dateEnd: Date;
  consumptionDailyContract: number;
}

export interface Sounding {
  idAsset: string;
  date: Date;
  volume: number;
}

export interface RDO {
  idAsset: string;
  date: Date;
  received: number;
  supply: number;
}

export interface RVESoundingDashboardResponse {
  assets: any[][];
  operations: any[][];
  sounding: any[][];
  rdo?: any[][];
}

export interface NormalizedData {
  assets: Asset[];
  operations: Operation[];
  sounding: Sounding[];
  rdo: RDO[];
}
