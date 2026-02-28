import { z } from 'zod';

const financialStatus = ['canceled', 'pending', 'partial', 'paid', 'refund'] as const;
const paymentMethod = ['cash', 'card', 'pix', 'boleto', 'transfer', 'none'] as const;

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

export const financialUpdateSchema = z.object({
  price: z.number().optional(),
  paid: z.number().optional(),
  paymentMethod: z.enum(paymentMethod).optional(),
  installments: z.number().optional(),
  status: z.enum(financialStatus).optional(),
});

export const financialStatusSchema = z.object({
  status: z.enum(financialStatus),
});

export type FinancialCreateData = z.input<typeof financialCreateSchema>;
export type FinancialUpdateData = z.infer<typeof financialUpdateSchema>;
export type FinancialStatusData = z.infer<typeof financialStatusSchema>;
export type ProcedureData = z.infer<typeof procedureSchema>;
