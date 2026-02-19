import { useMutation, useQuery } from '@tanstack/react-query';
import type { AIPromptData, AISearchRequest, AISearchResponse } from '@/components/ai-prompt/@interface/ai-prompt.interface';
import { api } from '@/lib/api/client';
import { useEnterpriseFilter } from './use-enterprise-filter';

const aiBaseURL = import.meta.env.VITE_AI_URI_BASE || 'http://localhost:8080/api/v1';

type ChatHistoryMessage = {
  role: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

type ChatHistoryResponse = {
  success: boolean;
  messages: ChatHistoryMessage[];
};

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

async function fetchChatHistory(idEnterprise?: string): Promise<ChatHistoryResponse> {
  const url = idEnterprise ? `/ai/chat/history?idEnterprise=${idEnterprise}` : '/ai/chat/history';
  const response = await api.get<ChatHistoryResponse>(url, {
    baseURL: aiBaseURL,
  });
  return response.data;
}

async function clearChatHistory(idEnterprise?: string): Promise<{ success: boolean }> {
  const url = idEnterprise ? `/ai/chat/history?idEnterprise=${idEnterprise}` : '/ai/chat/history';
  const response = await api.delete<{ success: boolean }>(url, {
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

  const historyQuery = useQuery({
    queryKey: ['ai-chat-history', idEnterprise],
    queryFn: () => fetchChatHistory(idEnterprise),
    enabled: !!idEnterprise,
  });

  const clearHistoryMutation = useMutation({
    mutationFn: () => clearChatHistory(idEnterprise),
  });

  return {
    search: searchMutation,
    prompt: promptMutation,
    history: historyQuery,
    clearHistory: clearHistoryMutation,
  };
}

export type { ChatHistoryMessage, ChatHistoryResponse };
