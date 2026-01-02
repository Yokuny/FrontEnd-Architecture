import { z } from 'zod';

// Schema para validação do formulário
export const apiExternalSchema = z.object({
  idEnterprise: z.string().min(1, 'enterprise.required'),
  id: z.string().optional(),
  windyKey: z.string().min(1, 'api.key.required'),
});

export type ApiExternalFormData = z.infer<typeof apiExternalSchema>;

// Interface da resposta da API
export interface SetupApiExternalResponse {
  id: string;
  idEnterprise: string;
  api?: {
    windyKey?: string;
  };
}

// Interface para salvar
export interface SetupApiExternalPayload {
  idEnterprise: string;
  id?: string;
  windyKey: string;
}
