import { z } from 'zod';

export const customerFormSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z.string().min(1, 'enterprise.required'),
  name: z.string().min(1, 'name.required'),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
