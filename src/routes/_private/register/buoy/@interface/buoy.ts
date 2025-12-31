import { z } from 'zod';

export const delimitationSchema = z.object({
  idDelimitation: z.string().optional(),
  name: z.string().min(1, 'required'),
  radius: z.coerce.number().min(1, 'required'),
  color: z.string().min(1, 'required'),
});

export const buoySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'required'),
  proximity: z.string().min(1, 'required'),
  idEnterprise: z.string().min(1, 'enterprise.required'),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  delimitations: z.array(delimitationSchema).min(1),
});

export type BuoyFormData = z.infer<typeof buoySchema>;
export type DelimitationData = z.infer<typeof delimitationSchema>;
