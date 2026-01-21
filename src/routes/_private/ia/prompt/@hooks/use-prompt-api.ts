import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { AIPromptData } from '../@interface/prompt.types';

export function useAIPrompt() {
  return useMutation({
    mutationFn: async (data: AIPromptData) => {
      const response = await api.post<{ text: string }>('/ai/prompt', data);
      return response.data;
    },
  });
}
