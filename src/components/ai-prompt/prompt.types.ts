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
}
