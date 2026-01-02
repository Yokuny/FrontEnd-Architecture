import { z } from 'zod';

// Schema para validação do formulário
export const emailConfigSchema = z.object({
  idEnterprise: z.string().min(1, 'enterprise.required'),
  id: z.string().optional(),
  host: z.string().min(1, 'host.required'),
  port: z.coerce.number().min(1, 'port.required'),
  secure: z.boolean(),
  email: z.string().email('email.invalid').min(1, 'email.required'),
  password: z.string().min(1, 'password.required'),
  accountname: z.string().optional(),
});

export type EmailConfigFormData = z.infer<typeof emailConfigSchema>;

// Interface da resposta da API
export interface SetupEnterpriseResponse {
  id: string;
  idEnterprise: string;
  email?: {
    host: string;
    port: number;
    secure: boolean;
    accountname?: string;
    auth?: {
      user: string;
    };
  };
}

// Interface para salvar
export interface SetupEnterprisePayload {
  idEnterprise: string;
  id?: string;
  email: {
    host: string;
    port: number;
    secure: boolean;
    accountname?: string;
    auth: {
      user: string;
      pass: string;
    };
  };
}
