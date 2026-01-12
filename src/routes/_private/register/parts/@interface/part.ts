import { z } from 'zod';

export const partSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z
    .string({
      required_error: 'enterprise.required',
    })
    .min(1, 'enterprise.required'),
  name: z
    .string({
      required_error: 'part.name.placeholder',
    })
    .min(1, 'part.name.placeholder'),
  sku: z
    .string({
      required_error: 'sku.required',
    })
    .min(1, 'sku.required'),
  description: z.string().optional().default(''),
});

export type PartFormData = z.infer<typeof partSchema>;
