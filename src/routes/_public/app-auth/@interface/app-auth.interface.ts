import { z } from 'zod';

export const appAuthSchema = z.object({
  cpf: z.string().min(14, 'appAuth.cpf.invalid'),
  password: z.string().min(6, 'appAuth.password.min'),
});

export type AppAuthFormData = z.infer<typeof appAuthSchema>;

export interface AppLoginResponse {
  data: { token: string; id: string };
  statusCode: number;
  message: string;
}
