import { z } from 'zod';
import type { DailyDataItem, RawChartData, StatusDataItem } from '../@services/operational-asset.service';

export const operationalAssetSearchSchema = z.object({
  idMachine: z.string().optional(),
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  view: z.enum(['OPERATIONAL', 'FINANCIAL']).optional().default('OPERATIONAL'),
});

export type OperationalAssetSearch = z.infer<typeof operationalAssetSearchSchema>;

export interface OperationalAssetData {
  dailyList: DailyDataItem[];
  statusList: StatusDataItem[];
  typesEvents: RawChartData[];
  totalLoss: number;
  totalRevenue: number;
}
