import { useMutation } from '@tanstack/react-query';
import type { AIPromptData, AISearchRequest, AISearchResponse } from '@/components/ai-prompt/prompt.types';
import { api } from '@/lib/api/client';
import { useEnterpriseFilter } from './use-enterprise-filter';

const aiBaseURL = import.meta.env.VITE_AI_URI_BASE || 'http://localhost:8080/api/v1';

async function searchAI(data: AISearchRequest, idEnterprise?: string): Promise<AISearchResponse> {
  const url = idEnterprise ? `/ai/search?idEnterprise=${idEnterprise}` : '/ai/search';
  const response = await api.post<AISearchResponse>(url, data, {
    baseURL: aiBaseURL,
  });
  return response.data;
}

async function sendPrompt(data: AIPromptData, idEnterprise?: string): Promise<{ text: string }> {
  const url = idEnterprise ? `/ai/prompt?idEnterprise=${idEnterprise}` : '/ai/prompt';
  const response = await api.post<{ text: string }>(url, data, {
    baseURL: aiBaseURL,
  });
  return response.data;
}

// Hooks
export function useAIApi() {
  const { idEnterprise } = useEnterpriseFilter();

  const searchMutation = useMutation({
    mutationFn: (data: AISearchRequest) => searchAI(data, idEnterprise),
  });

  const promptMutation = useMutation({
    mutationFn: (data: AIPromptData) => sendPrompt(data, idEnterprise),
  });

  return {
    search: searchMutation,
    prompt: promptMutation,
  };
}
