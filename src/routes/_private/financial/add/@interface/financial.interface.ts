import { z } from 'zod';
import { financialStatus, paymentMethod } from '../../@interface/financial.interface';

export const procedureSchema = z.object({
  procedure: z.string().max(250),
  price: z.coerce.number().default(0),
  status: z.enum(financialStatus).default('pending'),
  periodicity: z.coerce.number().int().min(1).optional(),
});

export const financialCreateSchema = z.object({
  Patient: z.string().min(1, 'Selecione o paciente'),
  Professional: z.string().min(1, 'Selecione o profissional'),
  procedures: z.array(procedureSchema).optional(),
  price: z.number().optional(),
  paid: z.number().optional(),
  paymentMethod: z.enum(paymentMethod).optional(),
  installments: z.number().optional(),
  status: z.enum(financialStatus),
});

export type FinancialCreateData = z.input<typeof financialCreateSchema>;
export type ProcedureData = z.infer<typeof procedureSchema>;
