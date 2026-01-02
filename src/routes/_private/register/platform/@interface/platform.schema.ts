import { z } from 'zod';

export const platformSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z
    .string({
      required_error: 'enterprise.required',
    })
    .min(1, 'enterprise.required'),
  name: z
    .string({
      required_error: 'name.required',
    })
    .min(1, 'name.required'),
  code: z
    .string({
      required_error: 'code.required',
    })
    .min(1, 'code.required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'code.id.invalid'),
  acronym: z.string().optional(),
  basin: z.string().optional(),
  type: z.string().optional(),
  modelType: z.string().optional(),
  operator: z.string().optional(),
  imo: z.string().optional(),
  mmsi: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  radius: z.coerce.number().optional(),
  ais: z
    .object({
      distanceToBow: z.coerce.number().optional(),
      distanceToStern: z.coerce.number().optional(),
      distanceToStarboard: z.coerce.number().optional(),
      distanceToPortSide: z.coerce.number().optional(),
    })
    .optional(),
});

export type PlatformFormData = z.infer<typeof platformSchema>;
