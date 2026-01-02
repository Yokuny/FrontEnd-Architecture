import { z } from 'zod';

export const paramOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export type ParamOption = z.infer<typeof paramOptionSchema>;

export const paramSchema = z.object({
  id: z.string(),
  description: z.string(),
  type: z.enum(['JUSTIFY', 'OTHER']),
  enterprise: z.object({
    id: z.string(),
    name: z.string(),
  }),
  options: z.array(paramOptionSchema),
});

export type Param = z.infer<typeof paramSchema>;

export const paramFormSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'description.required'),
  idEnterprise: z.string().min(1, 'enterprise.required'),
  type: z.string().optional(),
  options: z.array(paramOptionSchema),
});

export type ParamFormData = z.infer<typeof paramFormSchema>;
