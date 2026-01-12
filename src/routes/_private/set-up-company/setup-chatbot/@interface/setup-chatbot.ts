import { z } from 'zod';

export const setupChatbotSchema = z.object({
  idEnterprise: z.string().min(1, 'enterprise.required'),
  id: z.string().optional(),
  phone: z.string().optional(),
  messageWelcome: z.string().optional(),
});

export type SetupChatbotFormData = z.infer<typeof setupChatbotSchema>;

export interface SetupChatbotResponse {
  id: string;
  idEnterprise: string;
  chatbot?: {
    phone?: string;
    messageWelcome?: string;
  };
}

export interface SetupChatbotPayload {
  idEnterprise: string;
  id?: string;
  chatbot: {
    phone: string;
    messageWelcome: string;
  };
}
