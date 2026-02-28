import { z } from 'zod';

export const procedureSchema = z.object({
  procedure: z.string().min(3).max(255),
  group: z.string().min(1).max(50),
  costPrice: z.number().min(0),
  suggestedPrice: z.number().min(0),
  savedPrice: z.number().min(0),
});

export const proceduresArraySchema = z.object({
  procedures: z.array(procedureSchema),
});

export type NewProcedure = z.infer<typeof procedureSchema>;
export type NewProcedures = z.infer<typeof proceduresArraySchema>;
