import { z } from 'zod';
import { numClean } from '@/lib/helpers/formatter.helper';
import { validObjectID } from '@/lib/helpers/validade.helper';
import { lengthMessage, objectIdMessage } from '@/lib/helpers/zodMessage.helper';
import { procedureSchema } from './financial.schema';

const scheduleStatus = ['pending', 'waiting', 'confirmed', 'completed', 'in_progress', 'no_show', 'canceled', 'canceled_by_patient', 'canceled_by_professional'] as const;

export const scheduleSchema = z.object({
  Patient: z.string().refine(validObjectID, objectIdMessage()).optional(),
  Professional: z
    .string()
    .refine((val) => !val || validObjectID(val), objectIdMessage())
    .optional(),
  Financial: z
    .string()
    .refine((val) => !val || validObjectID(val), objectIdMessage())
    .optional(),
  Room: z.string().refine((val) => !val || validObjectID(val), objectIdMessage()),
  title: z.string().optional(),
  allDay: z.boolean().optional(),
  Odontogram: z
    .string()
    .refine((val) => !val || validObjectID(val), objectIdMessage())
    .optional(),
  procedures: z.array(procedureSchema).optional(),
  start: z.string().datetime(),
  end: z.string().datetime().optional(),
  status: z.enum(scheduleStatus),
});

export const scheduleUpdateSchema = z.object({
  title: z.string().optional(),
  allDay: z.boolean().default(false),
  start: z.string().datetime(),
  end: z.string().datetime().optional(),
});

export const scheduleTimeSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

export const scheduleConfirmationSchema = z.object({
  status: z.enum(['confirmed', 'canceled_by_patient']),
});

export const scheduledPatientSchema = z.object({
  patient: z.object({
    name: z.string().trim().min(5, lengthMessage(5, 60)).max(60, lengthMessage(5, 60)),
    sex: z.enum(['M', 'F']),
    phone: z
      .string()
      .trim()
      .transform((val) => (val === '' ? undefined : val))
      .optional()
      .transform((val) => {
        if (val) {
          const cleanedPhone = val.replace(/\D/g, '');
          return cleanedPhone.length > 0 ? cleanedPhone : undefined;
        }
        return val;
      })
      .refine((val) => !val || (val.length >= 10 && val.length <= 11), 'Telefone deve ter 10 ou 11 dígitos')
      .transform((val) => (val ? numClean(val) : undefined)),
  }),
  Professional: z.string().refine(validObjectID, objectIdMessage()),
  Room: z.string().refine(validObjectID, objectIdMessage()),
  allDay: z.boolean().default(false),
  start: z.string().datetime(),
  end: z.string().datetime().optional(),
  title: z.string().optional(),
});

export type NewSchedule = z.infer<typeof scheduleSchema>;
export type UpdateSchedule = z.infer<typeof scheduleUpdateSchema>;
export type ScheduleConfirmation = z.infer<typeof scheduleConfirmationSchema>;
export type ScheduledPatient = z.infer<typeof scheduledPatientSchema>;
