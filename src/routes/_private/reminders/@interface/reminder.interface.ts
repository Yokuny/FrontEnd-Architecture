import type { z } from 'zod';
import type { reminderSchema } from '@/lib/interfaces/schemas/reminder.schema';

export type ReminderFormData = z.infer<typeof reminderSchema>;
