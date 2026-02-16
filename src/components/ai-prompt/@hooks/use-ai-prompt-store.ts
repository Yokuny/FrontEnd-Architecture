import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessageExtended } from '../@interface/ai-prompt.interface';

export interface AIPromptState {
  messages: ChatMessageExtended[];
  isProcessing: boolean;
  setMessages: (messages: AIPromptState['messages'] | ((prev: AIPromptState['messages']) => AIPromptState['messages'])) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  clearMessages: () => void;
}

export const useAIPromptStore = create<AIPromptState>()(
  persist(
    (set) => ({
      messages: [],
      isProcessing: false,
      setMessages: (updater) =>
        set((state) => ({
          messages: typeof updater === 'function' ? updater(state.messages) : updater,
        })),
      setIsProcessing: (isProcessing) => set({ isProcessing }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'ai-prompt-storage',
    },
  ),
);
