import { z } from 'zod';

export const userTypeSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z
    .string({
      required_error: 'machine.idEnterprise.required',
    })
    .min(1, 'machine.idEnterprise.required'),
  description: z
    .string({
      required_error: 'description.required',
    })
    .min(1, 'description.required'),
  color: z.string().optional(),
});

export type UserTypeFormData = z.infer<typeof userTypeSchema>;
