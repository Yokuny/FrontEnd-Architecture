import { z } from 'zod';

export const groupConsumptionSchema = z.object({
  code: z.string().min(1, 'code.required'),
  description: z.string().min(1, 'description.required'),
  consumption: z.coerce.number().default(0),
});

export const operationSchema = z.object({
  idOperation: z.string().min(1, 'code.required'),
  name: z.string().min(1, 'name.required'),
  description: z.string().optional(),
  idGroupConsumption: z.string().min(1, 'group.consumption.required'),
});

export const contractEventSchema = z.object({
  description: z.string().min(1, 'description.required'),
  factor: z.coerce.number().min(0).max(100).default(0),
});

export const contractSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z.string().min(1, 'enterprise.required'),
  description: z.string().min(1, 'description.required'),
  customer: z.string().min(1, 'customer.required'),
  competence: z.enum(['dayInMonth', 'eof']).default('eof'),
  day: z.coerce.number().nullable().optional(),
  groupConsumption: z.array(groupConsumptionSchema).default([]),
  operations: z.array(operationSchema).default([]),
  events: z.array(contractEventSchema).default([]),
});

export type ContractFormData = z.infer<typeof contractSchema>;
export type GroupConsumptionFormData = z.infer<typeof groupConsumptionSchema>;
export type OperationFormData = z.infer<typeof operationSchema>;
export type ContractEventFormData = z.infer<typeof contractEventSchema>;
