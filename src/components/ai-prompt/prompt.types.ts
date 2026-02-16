import { z } from 'zod';

export const aiPromptSchema = z.object({
  question: z.string().min(1),
});

export type AIPromptData = z.infer<typeof aiPromptSchema>;

export interface ChatMessageType {
  message: string;
  date: string;
  reply: boolean;
  type: 'text';
  sender: string;
  avatar?: string;
  showBackendOption?: boolean;
  data?: any;
}

export interface AISearchRequest {
  prompt: string;
  context: {
    currentPath: string;
  };
}

export interface AISearchResponse {
  success: boolean;
  interpretation?: string;
  data?: any[];
  error?: string;
  query?: any;
  metadata?: any;
}
