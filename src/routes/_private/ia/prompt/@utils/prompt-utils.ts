import type { ChatMessage } from '../@interface/prompt.types';

export function createMessage(message: string, sender: string, reply: boolean, type: 'text' = 'text'): ChatMessage {
  return {
    message,
    date: new Date().toLocaleTimeString(),
    reply,
    type,
    sender,
  };
}
