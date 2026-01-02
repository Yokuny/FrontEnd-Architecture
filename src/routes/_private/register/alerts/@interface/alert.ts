import { z } from 'zod';

const machineRefSchema = z.string();
const sensorRefSchema = z.string();
const platformRefSchema = z.string();
const geofenceRefSchema = z.string();

const startInsideInPlatformAreaSchema = z.object({
  allPlatforms: z.boolean().optional(),
  allMachines: z.boolean().optional(),
  idMachines: z.array(machineRefSchema).default([]),
  idPlatforms: z.array(platformRefSchema).default([]),
});

const inOutGeofenceSchema = z.object({
  allGeofences: z.boolean().optional(),
  allMachines: z.boolean().optional(),
  passage: z.boolean().optional(),
  alertEntering: z.boolean().optional(),
  alertLeaving: z.boolean().optional(),
  idMachines: z.array(machineRefSchema).default([]),
  idGeofences: z.array(geofenceRefSchema).default([]),
});

const lostConnectionSensorSchema = z.object({
  idMachine: machineRefSchema.nullable().optional(),
  idSensors: z.array(sensorRefSchema).default([]),
  timeMinutes: z.number().min(1).optional(),
});

const statusDistancePortSchema = z.object({
  allMachines: z.boolean().optional(),
  idMachines: z.array(machineRefSchema).default([]),
  status: z.string().optional(),
  distance: z.number().optional(),
});

const alertEventsSchema = z.object({
  description: z.string().optional(),
  startInsideInPlatformArea: startInsideInPlatformAreaSchema.optional().nullable(),
  inOutGeofence: inOutGeofenceSchema.optional().nullable(),
  lostConnectionSensor: lostConnectionSensorSchema.optional().nullable(),
  statusDistancePort: statusDistancePortSchema.optional().nullable(),
});

// --- Simple Conditional Rule Schemas ---
const ruleConditionSchema = z.object({
  sensor: z.any().optional().nullable(), // Can be string or object from API
  condition: z.string().optional().nullable(),
  value: z.string().optional(),
});

const ruleSchema = z.object({
  and: z
    .array(
      z.object({
        or: z.array(ruleConditionSchema),
      }),
    )
    .default([]),
  inMinutes: z.number().min(0).max(1440).optional().nullable(),
  // biome-ignore lint/suspicious/noThenProperty: Legacy API structure requires 'then'
  then: z
    .object({
      message: z.string().optional(),
      level: z.string().optional(),
    })
    .optional(),
});

// --- Permissions/Visibility Schema ---
const visibilitySchema = z.enum(['public', 'private', 'limited']);
const editPermissionSchema = z.enum(['public', 'private', 'limited']).optional();
const usersPermissionViewSchema = z.array(z.string()).default([]);

// --- Main Form Schema ---

export const alertFormSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z.string().min(1, 'required'),
  type: z.enum(['conditional', 'event', 'min-max']),

  // Fields for Min-Max
  description: z.string().optional(),
  idsMinMax: z.array(z.string()).default([]),

  // Fields for Event
  events: alertEventsSchema.optional().nullable(),

  // Fields for Conditional
  rule: ruleSchema.optional().nullable(),

  // Permissions (Machine/Vessel access for some types)
  allMachines: z.boolean().optional(),
  idMachines: z.array(z.string()).default([]),

  // Send To
  sendBy: z.array(z.string()).default([]),
  users: z.array(z.string()).default([]),
  scales: z.array(z.string()).default([]),
  useScale: z.boolean().optional(),

  // Visibility/Edit
  visibility: visibilitySchema.default('private'),
  edit: editPermissionSchema.default('private'),
  usersPermissionView: usersPermissionViewSchema.default([]),
});

export type AlertFormData = z.infer<typeof alertFormSchema>;

export interface pageInfo {
  count: number;
  page: number;
  size: number;
}

export interface AlertRule extends AlertFormData {
  id: string;
  enterprise?: {
    id: string;
    name: string;
  };
}
