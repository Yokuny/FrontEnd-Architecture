import { z } from 'zod';

export const enterpriseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'name.required'),
  description: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  number: z.string().optional(),
  district: z.string().optional(),
  complement: z.string().optional(),
  city: z.string().min(1, 'city.required'),
  state: z.string().min(1, 'state.required'),
  country: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  active: z.boolean().optional().default(true),
  image: z.any().optional(),
  imageDark: z.any().optional(),
  imagePreview: z.string().optional(),
  imagePreviewDark: z.string().optional(),
  publicKey: z.string().optional(),
});

export type EnterpriseFormData = z.infer<typeof enterpriseSchema>;
