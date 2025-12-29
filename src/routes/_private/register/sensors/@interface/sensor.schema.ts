import { z } from 'zod';

export const sensorSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z
    .string({
      required_error: 'machine.idEnterprise.required',
    })
    .min(1, 'machine.idEnterprise.required'),
  sensorId: z
    .string({
      required_error: 'sensor.id.required',
    })
    .min(1, 'sensor.id.required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'sensor.id.invalid'),
  sensor: z
    .string({
      required_error: 'sensor.name.required',
    })
    .min(1, 'sensor.name.required'),
  description: z.string().optional(),
  type: z.string().optional(),
  unit: z.string().optional(),
  valueMin: z.coerce.number().optional(),
  valueMax: z.coerce.number().optional(),
});

export type SensorFormData = z.infer<typeof sensorSchema>;
