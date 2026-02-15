import { useMutation } from '@tanstack/react-query';
import type { AIPromptData, AISearchRequest, AISearchResponse } from '@/components/ai-prompt/prompt.types';
import { api } from '@/lib/api/client';

// API functions
async function searchAI(data: AISearchRequest): Promise<AISearchResponse> {
  const response = await api.post<AISearchResponse>('/ai/search', data);
  return response.data;
}

async function sendPrompt(data: AIPromptData): Promise<{ text: string }> {
  const response = await api.post<{ text: string }>('/ai/prompt', data);
  return response.data;
}

// Hooks
export function useAIApi() {
  const searchMutation = useMutation({
    mutationFn: searchAI,
  });

  const promptMutation = useMutation({
    mutationFn: sendPrompt,
  });

  return {
    search: searchMutation,
    prompt: promptMutation,
  };
}
