import { z } from 'zod';

export const sensorFunctionSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  algorithm: z.string().min(1, 'Algorithm is required'),
  idSensor: z.string().min(1, 'Result sensor is required'),
  idMachines: z.array(z.string()).min(1, 'At least one machine is required'),
  enabled: z.boolean(),
});

export type SensorFunctionFormData = z.infer<typeof sensorFunctionSchema>;

export interface SensorFunction {
  id: string;
  _id?: string;
  description: string;
  algorithm: string;
  sensorsIn: string[];
  idMachines: string[];
  machines: { label: string; value: string }[];
  idSensor: string;
  sensor: { label: string; value: string };
  enabled: boolean;
  enterprise?: {
    id: string;
    name: string;
  };
}
