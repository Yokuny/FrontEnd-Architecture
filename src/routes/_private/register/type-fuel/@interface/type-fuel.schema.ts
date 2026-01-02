import { z } from 'zod';

export const typeFuelSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z
    .string({
      required_error: 'machine.idEnterprise.required',
    })
    .min(1, 'machine.idEnterprise.required'),
  code: z
    .string({
      required_error: 'code.required',
    })
    .min(1, 'code.required'),
  description: z
    .string({
      required_error: 'description.required',
    })
    .min(1, 'description.required'),
  density: z.coerce
    .number({
      required_error: 'density.required',
      invalid_type_error: 'density.required',
    })
    .min(0, 'density.required'),
  co2Coefficient: z.coerce.number().default(0),
  color: z.string().optional().default('#3366ff'),
});

export type TypeFuelFormData = z.infer<typeof typeFuelSchema>;
