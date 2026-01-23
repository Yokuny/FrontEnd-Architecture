import { z } from 'zod';

export interface Machine {
  id: string;
  name: string;
  image?: {
    url: string;
  };
}

export interface TimeStatus {
  status: string;
  minutes: number;
  consumption: number;
}

export interface DailyEvent {
  machine: Machine;
  listTimeStatus: TimeStatus[];
  [key: string]: any; // To allow for dynamic percentual properties added during normalization
}

export interface TimeOperationResponse {
  dataReturn: DailyEvent[];
}

export const timeOperationSearchParamsSchema = z.object({
  machines: z.string().optional(),
  dateMin: z.string().optional(),
  dateMax: z.string().optional(),
  isShowDisabled: z.boolean().optional().default(false),
  unit: z.string().optional().default('m³'),
});

export type TimeOperationSearchParams = z.infer<typeof timeOperationSearchParamsSchema>;

export const OPERATION_MODES = [
  {
    value: 'dp',
    label: 'dp',
    accept: ['dp', 'dynamic_position', 'dynamic position'],
  },
  {
    value: 'standby',
    label: 'stand.by',
    accept: ['stand by', 'stand_by', 'standby'],
  },
  {
    value: 'standbyready',
    label: 'stand.by.ready',
    accept: ['stand by ready', 'stand_by_ready', 'standbyready'],
  },
  {
    value: 'underway',
    label: 'in.travel',
    accept: ['underway using engine', 'underway_using_engine', 'underway', 'under way', 'under way using engine', 'under_way_using_engine', 'transit'],
  },
  {
    value: 'fasttransit',
    label: 'fast.transit',
    accept: ['fast transit', 'fasttransit', 'fast_transit'],
  },
  {
    value: 'slow',
    label: 'slow',
    accept: ['slow'],
  },
  {
    value: 'at_anchor',
    label: 'at.anchor',
    accept: ['at anchor', 'at_anchor', 'stopped', 'anchorage'],
  },
  {
    value: 'port',
    label: 'moored',
    accept: ['moored', 'port'],
  },
  {
    value: 'dock',
    label: 'dock',
    accept: ['dock'],
  },
  {
    value: 'other',
    label: 'other',
    accept: ['other'],
  },
];
