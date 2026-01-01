import { z } from 'zod';

// --- Shared Schemas ---

// --- Event Type Schemas ---

// Update to use string IDs for form state compatibility with ShadCN Selects
const machineRefSchema = z.string();
const platformRefSchema = z.string();
const geofenceRefSchema = z.string();
const sensorRefSchema = z.string();

const startInsideInPlatformAreaSchema = z.object({
  allPlatforms: z.boolean().optional(),
  allMachines: z.boolean().optional(),
  machines: z.array(machineRefSchema).optional(),
  platforms: z.array(platformRefSchema).optional(),
});

const inOutGeofenceSchema = z.object({
  allGeofences: z.boolean().optional(),
  allMachines: z.boolean().optional(),
  passage: z.boolean().optional(),
  alertEntering: z.boolean().optional(),
  alertLeaving: z.boolean().optional(),
  machines: z.array(machineRefSchema).optional(),
  geofences: z.array(geofenceRefSchema).optional(),
});

const lostConnectionSensorSchema = z.object({
  machine: machineRefSchema.nullable().optional(), // Single machine ID
  sensors: z.array(sensorRefSchema).optional(),
  timeMinutes: z.number().min(1).optional(),
});

const statusDistancePortSchema = z.object({
  allMachines: z.boolean().optional(),
  machines: z.array(machineRefSchema).optional(),
  status: z.string().optional(),
  distance: z.number().optional(),
});

const alertEventsSchema = z.object({
  description: z.string().optional(),
  startInsideInPlatformArea: startInsideInPlatformAreaSchema.optional().nullable(), // Allow nullable from API
  inOutGeofence: inOutGeofenceSchema.optional().nullable(),
  lostConnectionSensor: lostConnectionSensorSchema.optional().nullable(),
  statusDistancePort: statusDistancePortSchema.optional().nullable(),
});

// --- Simple Conditional Rule Schemas ---
// Legacy structure: { and: [ { or: [ { ...conditions } ] } ] }

const ruleConditionSchema = z.object({
  sensor: z.string().optional().nullable(),
  condition: z.string().optional().nullable(),
  value: z.string().optional(),
}); // Simplified for now

const ruleSchema = z.object({
  and: z
    .array(
      z.object({
        or: z.array(ruleConditionSchema),
      }),
    )
    .optional(),
  inMinutes: z.number().optional(),
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
const usersPermissionViewSchema = z.array(z.string()).optional();

// --- Main Form Schema ---

export const alertFormSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z.string().min(1, 'required'), // stored as simple string ID
  type: z.enum(['conditional', 'event', 'min-max']),

  // Fields for Min-Max
  description: z.string().optional(),
  idsMinMax: z.array(z.string()).default([]), // Array of machine IDs for min-max type

  // Fields for Event
  events: alertEventsSchema.optional(),

  // Fields for Conditional
  rule: ruleSchema.optional(),

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

export type AlertEventFormData = z.infer<typeof alertEventsSchema>;
export type AlertRuleFormData = z.infer<typeof ruleSchema>;

// Types for API responses might differ slightly
export interface AlertRule extends AlertFormData {
  enterprise?: {
    id: string;
    name: string;
    city?: string;
    state?: string;
  };
  // Helper fields for UI that might need transformation from API
  machinesPermissions?: Array<{ id: string; name: string }>;
}
