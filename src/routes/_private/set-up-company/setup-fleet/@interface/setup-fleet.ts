import { z } from 'zod';

export const setupFleetSchema = z.object({
  idEnterprise: z.string().min(1, 'enterprise.required'),
  id: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  zoom: z.coerce.number().min(0).optional(),
});

export type SetupFleetFormData = z.infer<typeof setupFleetSchema>;

export interface SetupFleetResponse {
  id: string;
  idEnterprise: string;
  fleet?: {
    center?: [number, number];
    zoom?: number;
  };
}

export interface SetupFleetPayload {
  idEnterprise: string;
  id?: string;
  fleet: {
    center: [number, number] | null;
    zoom: number;
  };
}
