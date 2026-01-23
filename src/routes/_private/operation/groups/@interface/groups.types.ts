import { z } from 'zod';

export const groupSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  name: z.string().min(1, 'group.name.required'),
  idEnterprise: z.string().min(1, 'enterprise.required'),
  enterprise: z
    .object({
      id: z.string(),
      name: z.string(),
      city: z.string().optional(),
      state: z.string().optional(),
    })
    .optional(),
  subgroup: z
    .array(
      z.object({
        name: z.string().min(1, 'name.required'),
        details: z.array(z.any()).optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
});

export type Group = z.infer<typeof groupSchema>;

export interface GroupsListResponse {
  data: Group[];
  pageInfo?: Array<{ count: number }>;
}
