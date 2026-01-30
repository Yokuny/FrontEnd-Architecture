import { z } from 'zod';

export const reportFormSchema = z.object({
  idMachine: z.string().min(1, 'select.machines'),
  sensorIds: z.array(z.string()).min(1, 'machine.sensors.placeholder'),
  dateStart: z.date(),
  dateEnd: z.date(),
  interval: z.number().nullable(),
  showStatusNavigation: z.boolean().default(false),
  showStatusOperation: z.boolean().default(false),
  showFenceName: z.boolean().default(false),
  showPlatformName: z.boolean().default(false),
  justHasValue: z.boolean().default(false),
  coordinates: z.boolean().default(false),
});

export type ReportFormData = z.infer<typeof reportFormSchema>;
