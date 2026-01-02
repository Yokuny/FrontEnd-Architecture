import { z } from 'zod';

export const modelMachineSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z.string().min(1, 'enterprise.required'),
  description: z.string().min(1, 'description.required'),
  specification: z.string().optional(),
  color: z.string().min(1, 'color.required'),
  typeMachine: z.string().min(1, 'type.machine.required'),
  typeVesselCIIReference: z.string().optional().nullable(),
});

export type ModelMachineFormData = z.infer<typeof modelMachineSchema>;

export interface ModelMachine {
  id: string;
  description: string;
  specification?: string;
  color: string;
  typeMachine: string;
  typeVesselCIIReference?: string;
  idEnterprise: string;
  enterprise?: {
    id: string;
    name: string;
  };
  image?: {
    url: string;
  };
  icon?: {
    url: string;
  };
  files?: Array<{
    id: string;
    filename: string;
    url: string;
    size: number;
    mimetype: string;
  }>;
}
