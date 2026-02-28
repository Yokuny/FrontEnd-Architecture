import { z } from 'zod';
import { validObjectID } from '@/lib/helpers/validade.helper';
import { objectIdMessage } from '@/lib/helpers/zodMessage.helper';

const financialStatus = ['canceled', 'pending', 'partial', 'paid', 'refund'] as const;
const paymentMethod = ['cash', 'card', 'pix', 'boleto', 'transfer', 'none'] as const;

export const procedureSchema = z.object({
  procedure: z.string().max(250),
  price: z.coerce.number().default(0),
  status: z.enum(financialStatus).default('pending'),
  periodicity: z.coerce.number().int().min(1).optional(),
});

export const financialSchema = z.object({
  Patient: z.string().refine(validObjectID, objectIdMessage()),
  Professional: z.string().refine(validObjectID, objectIdMessage()),
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

export type FinancialStatus = z.infer<typeof financialStatusSchema>;
export type FinancialUpdate = z.infer<typeof financialUpdateSchema>;
export type NewFinancial = z.infer<typeof financialSchema>;
export type NewProcedure = z.infer<typeof procedureSchema>;
