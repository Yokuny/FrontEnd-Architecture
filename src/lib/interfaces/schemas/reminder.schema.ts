import { z } from 'zod';

const reminderStatus = ['pending', 'done'] as const;

export const reminderSchema = z.object({
  Patient: z.string().min(1, 'Paciente é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória').max(255, 'Máximo de 255 caracteres'),
  scheduledDate: z.string().datetime(),
});

export const reminderQuerySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(reminderStatus).optional(),
});

export const reminderBulkUpdateSchema = z.object({
  ids: z.array(z.string()).min(1),
  status: z.enum(reminderStatus),
});

export type ReminderQuery = z.infer<typeof reminderQuerySchema>;
export type ReminderBulkUpdate = z.infer<typeof reminderBulkUpdateSchema>;
