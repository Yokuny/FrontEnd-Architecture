import { z } from 'zod';

export const osDetailsSearchSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export type OsDetailsSearch = z.infer<typeof osDetailsSearchSchema>;

export interface OsService {
  done: boolean;
  description: string;
  groupName: string;
  typeService?: {
    id: string;
    label: string;
  };
  observation?: string;
}

export interface OsDetails {
  id: string;
  order: string;
  description: string;
  doneAt: string;
  createAt: string;
  enterprise: {
    id: string;
    name: string;
    city: string;
    state: string;
    image?: {
      url: string;
    };
  };
  machine: {
    id: string;
    name: string;
  };
  maintenancePlan: {
    id: string;
    description: string;
  };
  services: OsService[];
  usersDone: {
    id: string;
    name: string;
  }[];
  userFill?: {
    id: string;
    name: string;
  };
}
