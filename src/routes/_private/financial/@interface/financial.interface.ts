import { z } from 'zod';

export const financialStatus = ['canceled', 'pending', 'partial', 'paid', 'refund'] as const;
export const paymentMethod = ['cash', 'card', 'pix', 'boleto', 'transfer', 'none'] as const;

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

export type FinancialUpdateData = z.infer<typeof financialUpdateSchema>;
export type FinancialStatusData = z.infer<typeof financialStatusSchema>;
