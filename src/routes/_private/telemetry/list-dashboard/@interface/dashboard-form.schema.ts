import { z } from 'zod';

export const dashboardFormSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, 'description.required'),
  idEnterprise: z.string().min(1, 'enterprise.required'),
  typeData: z.enum(['dashboard', 'folder', 'url.external']),
  idFolder: z.string().optional().nullable(),
  typeLayout: z.enum(['simple', 'group']).optional(),
  visibility: z.string().min(1, 'visibility.required'),
  edit: z.enum(['me', 'any']),
  users: z.array(z.string()).optional(),
  idMachines: z.array(z.string()).optional(),
  urlExternal: z.string().url('invalid.url').optional().or(z.literal('')),
});

export type DashboardFormValues = z.infer<typeof dashboardFormSchema>;
