import type { ChatMessageType } from '../@interface/ai-prompt.interface';

export function createMessage(message: string, sender: string, reply: boolean, type: 'text' = 'text'): ChatMessageType {
  return {
    message,
    date: new Date().toLocaleTimeString(),
    reply,
    type,
    sender,
  };
}
