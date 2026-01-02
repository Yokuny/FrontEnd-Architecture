import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { SetupApiExternalPayload, SetupApiExternalResponse } from '../@interface/api-external';

// Query keys
export const setupApiExternalKeys = {
  all: ['setup-api-external'] as const,
  detail: (idEnterprise: string) => [...setupApiExternalKeys.all, 'detail', idEnterprise] as const,
};

// Fetch setup api external
async function fetchSetupApiExternal(idEnterprise: string): Promise<SetupApiExternalResponse | null> {
  try {
    const response = await api.get<SetupApiExternalResponse>(`/setupenterprise/find/api?idEnterprise=${idEnterprise}`);
    return response.data;
  } catch (_error) {
    return null;
  }
}

// Save setup api external
async function saveSetupApiExternal(data: SetupApiExternalPayload): Promise<SetupApiExternalResponse> {
  const response = await api.put<SetupApiExternalResponse>('/setupenterprise/api', data);
  return response.data;
}

// Hook de Query
export function useSetupApiExternal(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: setupApiExternalKeys.detail(idEnterprise || ''),
    queryFn: () => fetchSetupApiExternal(idEnterprise as string),
    enabled: !!idEnterprise,
  });
}

// Hook de Mutation
export function useSetupApiExternalApi() {
  const queryClient = useQueryClient();

  const saveSetupApiExternalMutation = useMutation({
    mutationFn: saveSetupApiExternal,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: setupApiExternalKeys.detail(variables.idEnterprise) });
    },
  });

  return {
    saveSetupApiExternal: saveSetupApiExternalMutation,
  };
}
