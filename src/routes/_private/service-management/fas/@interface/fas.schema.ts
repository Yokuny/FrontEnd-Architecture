import { z } from 'zod';

export const fasSearchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  idVessel: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  type: z.array(z.string()).optional(),
  planner: z.array(z.string()).optional(),
  idEnterprise: z.string().optional(),
});

export type FasSearch = z.infer<typeof fasSearchSchema>;

export interface Fas {
  id: string;
  type: string;
  serviceDate: string;
  vessel?: {
    name: string;
    image?: {
      url: string;
    };
  };
  orders?: FasOrder[];
}

export interface FasOrder {
  id: string;
  name: string;
  state: string; // status
  supplierData?: {
    razao?: string;
    cancelled?: boolean;
    addedBy?: string;
  };
  recommendedSupplier?: string;
  slaLighthouse?: number;
  empty0?: boolean;
}

export interface FasPaginatedResponse {
  data: Fas[];
  pageInfo: Array<{ count: number }>;
}
