import { z } from 'zod';

export const geofenceFormSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z.string().min(1, 'enterprise.required'),
  type: z.object({
    value: z.string().min(1, 'type.required'),
    label: z.string().optional(),
    color: z.string().optional(),
  }),
  code: z.string().min(1, 'code.required'),
  description: z.string().min(1, 'description.required'),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  timezone: z.number().optional().nullable(),
  color: z.string().min(1, 'color.required'),
  idFence: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  initializeTravel: z.boolean().default(false),
  finalizeTravel: z.boolean().default(false),
  nearestPort: z.boolean().default(false),
  location: z.any().refine((val) => val !== null, 'coordinates.required'),
});

export type GeofenceFormData = z.infer<typeof geofenceFormSchema>;

export interface Geofence {
  id: string;
  idEnterprise: string;
  enterprise?: {
    id: string;
    name: string;
    city?: string;
    state?: string;
  };
  type: {
    value: string;
    label?: string;
    color?: string;
  };
  code: string;
  description: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: number;
  color: string;
  idFence?: string;
  fenceReference?: {
    id: string;
    description: string;
    location?: any;
    color?: string;
  };
  link?: string;
  initializeTravel: boolean;
  finalizeTravel: boolean;
  nearestPort: boolean;
  location: any;
  createdAt?: string;
  updatedAt?: string;
}
