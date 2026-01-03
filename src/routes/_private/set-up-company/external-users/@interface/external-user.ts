import { z } from 'zod';

export const externalUserSchema = z.object({
  username: z.string().min(1, 'username.required'),
  token: z.string().min(1),
  active: z.boolean().default(true),
});

export type ExternalUserFormData = z.infer<typeof externalUserSchema>;

export interface ExternalUser {
  id: string;
  idEnterprise: string;
  username: string;
  token: string;
  active: boolean;
  createdAt?: string;
}
