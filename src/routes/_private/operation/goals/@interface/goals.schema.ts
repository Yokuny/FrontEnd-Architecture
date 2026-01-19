import { z } from 'zod';

export const goalMonthSchema = z.object({
  date: z.string().nullable(),
  value: z.number().default(0),
});

export const goalRowSchema = z.object({
  idMachine: z.string().nullable(),
  machineName: z.string().optional(),
  isFleet: z.boolean().default(false),
  months: z.array(goalMonthSchema).length(13), // 12 months + 1 total
});

export const goalSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z.string(),
  name: z.string().min(1, 'Required field'),
  type: z.string().min(1, 'Required field'),
  year: z.number().nullable(),
  rows: z.array(goalRowSchema).default([]),
});

export type GoalFormData = z.infer<typeof goalSchema>;
export type GoalRow = z.infer<typeof goalRowSchema>;
export type GoalMonth = z.infer<typeof goalMonthSchema>;

export interface Goal {
  id: string;
  _id?: string;
  idEnterprise: string;
  name: string;
  type: string;
  year: number;
  enterprise?: {
    id: string;
    name: string;
  };
  appliedPermissions?: {
    canEdit: boolean;
    canDelete: boolean;
  };
}
