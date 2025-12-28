import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { SetupEnterprisePayload, SetupEnterpriseResponse } from '../@interface/setup-email';

// Query keys
export const setupEnterpriseKeys = {
  all: ['setup-enterprise'] as const,
  detail: (idEnterprise: string) => [...setupEnterpriseKeys.all, 'detail', idEnterprise] as const,
};

// Fetch setup enterprise
async function fetchSetupEnterprise(idEnterprise: string): Promise<SetupEnterpriseResponse | null> {
  try {
    const response = await api.get<SetupEnterpriseResponse>(`/setupenterprise/find?idEnterprise=${idEnterprise}`);
    return response.data;
  } catch (_error) {
    return null;
  }
}

// Save setup enterprise
async function saveSetupEnterprise(data: SetupEnterprisePayload): Promise<SetupEnterpriseResponse> {
  const response = await api.post<SetupEnterpriseResponse>('/setupenterprise', data);
  return response.data;
}

// Hook de Query
export function useSetupEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: setupEnterpriseKeys.detail(idEnterprise || ''),
    queryFn: () => fetchSetupEnterprise(idEnterprise as string),
    enabled: !!idEnterprise,
  });
}

// Hook de Mutation
export function useSetupEnterpriseApi() {
  const queryClient = useQueryClient();

  const saveSetupEnterpriseMutation = useMutation({
    mutationFn: saveSetupEnterprise,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: setupEnterpriseKeys.detail(variables.idEnterprise) });
    },
  });

  return {
    saveSetupEnterprise: saveSetupEnterpriseMutation,
  };
}
