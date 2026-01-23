import { z } from 'zod';

export const ptaxSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z.string().optional(),
  value: z.number({ required_error: 'Informe o valor' }).min(0, 'O valor deve ser positivo'),
  date: z.string({ required_error: 'Informe a data' }),
});

export type PtaxFormData = z.infer<typeof ptaxSchema>;
