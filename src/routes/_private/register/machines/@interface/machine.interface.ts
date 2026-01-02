import { z } from 'zod';

export const machineFormSchema = z.object({
  id: z.string().min(1, 'machine.id.required'),
  _id: z.string().optional(),
  name: z.string().min(1, 'machine.name.required'),
  code: z.string().optional(),
  mmsi: z.string().optional(),
  imo: z.string().optional(),
  idEnterprise: z.string().min(1, 'machine.idEnterprise.required'),
  sensors: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        id: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
  parts: z.array(z.string()).optional().default([]),
  maintenancePlans: z.array(z.string()).optional().default([]),
  idModel: z.string().optional(),
  dataSheet: z.record(z.any()).optional().default({}),
  contacts: z.array(z.any()).optional().default([]),
  cameras: z
    .array(
      z.object({
        name: z.string(),
        link: z.string(),
      }),
    )
    .optional()
    .default([{ name: '', link: '' }]),
  idFleet: z.string().optional(),
  inactiveAt: z.string().nullable().optional(),
});

export type MachineFormData = z.infer<typeof machineFormSchema>;
