import { z } from 'zod';

export const serviceItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'description.required'),
  typeService: z.any().optional(),
  observation: z.string().optional(),
});

export const serviceGroupSchema = z.object({
  groupName: z.string().min(1, 'group.name.required'),
  itens: z.array(serviceItemSchema).optional().default([]),
});

export const maintenancePlanSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z.string().min(1, 'enterprise.required'),
  description: z.string().min(1, 'description.required').max(150),
  typeMaintenance: z.string().min(1, 'type.maintenance.required'),
  daysNotice: z.coerce.number().default(0),
  durationDays: z.coerce.number().min(0, 'duration.required').default(0),
  maintanceCycle: z
    .object({
      unity: z.string(),
      value: z.coerce.number().min(0).default(0),
    })
    .optional(),
  maintanceWear: z
    .object({
      type: z.string(),
      value: z.coerce.number().min(0),
    })
    .optional(),
  servicesGrouped: z.array(serviceGroupSchema).optional().default([]),
  enterprise: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
});

export type MaintenancePlan = z.infer<typeof maintenancePlanSchema>;

export const partCycleSchema = z.object({
  id: z.string().optional(),
  part: z.any(),
  typeService: z.any(),
  observation: z.string().optional(),
});

export const maintenancePlanFormSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z.string().min(1, 'enterprise.required'),
  description: z.string().min(1, 'description.required').max(150),
  typeMaintenance: z.string().min(1, 'type.maintenance.required'),
  daysNotice: z.coerce.number().default(0),
  durationDays: z.coerce.number().min(0, 'duration.required').default(0),
  maintanceCycle: z
    .object({
      unity: z.string(),
      value: z.coerce.number().min(0).default(0),
    })
    .optional(),
  maintanceWear: z
    .object({
      type: z.string(),
      value: z.coerce.number().min(0).default(0),
    })
    .optional(),
  servicesGrouped: z.array(serviceGroupSchema).optional().default([]),
  partsCycle: z.array(partCycleSchema).optional().default([]),
});

export type MaintenancePlanFormData = z.infer<typeof maintenancePlanFormSchema>;
