import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { SetupChatbotPayload, SetupChatbotResponse } from '../@interface/setup-chatbot';

export const setupChatbotKeys = {
  all: ['setup-chatbot'] as const,
  detail: (idEnterprise: string) => [...setupChatbotKeys.all, 'detail', idEnterprise] as const,
};

async function fetchSetupChatbot(idEnterprise: string): Promise<SetupChatbotResponse | null> {
  try {
    const response = await api.get<SetupChatbotResponse>(`/setupenterprise/find/chatbot?idEnterprise=${idEnterprise}`);
    return response.data;
  } catch (_error) {
    return null;
  }
}

async function saveSetupChatbot(data: SetupChatbotPayload): Promise<SetupChatbotResponse> {
  const response = await api.post<SetupChatbotResponse>('/setupenterprise/chatbot', data);
  return response.data;
}

export function useSetupChatbot(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: setupChatbotKeys.detail(idEnterprise || ''),
    queryFn: () => fetchSetupChatbot(idEnterprise as string),
    enabled: !!idEnterprise,
  });
}

export function useSetupChatbotApi() {
  const queryClient = useQueryClient();

  const saveChatbot = useMutation({
    mutationFn: saveSetupChatbot,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: setupChatbotKeys.detail(variables.idEnterprise) });
    },
  });

  return { saveChatbot };
}
