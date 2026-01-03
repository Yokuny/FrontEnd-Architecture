import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { SetupLimitsPayload, SetupLimitsResponse } from '../@interface/setup-limits';

export const setupLimitsKeys = {
  all: ['setup-limits'] as const,
  detail: (idEnterprise: string) => [...setupLimitsKeys.all, 'detail', idEnterprise] as const,
};

async function fetchSetupLimits(idEnterprise: string): Promise<SetupLimitsResponse | null> {
  try {
    const response = await api.get<SetupLimitsResponse>(`/limitenterprise/find?idEnterprise=${idEnterprise}`);
    return response.data;
  } catch (_error) {
    return null;
  }
}

async function saveSetupLimits(data: SetupLimitsPayload): Promise<SetupLimitsResponse> {
  const response = await api.post<SetupLimitsResponse>('/limitenterprise', data);
  return response.data;
}

export function useSetupLimits(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: setupLimitsKeys.detail(idEnterprise || ''),
    queryFn: () => fetchSetupLimits(idEnterprise as string),
    enabled: !!idEnterprise,
  });
}

export function useSetupLimitsApi() {
  const queryClient = useQueryClient();

  const saveLimits = useMutation({
    mutationFn: saveSetupLimits,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: setupLimitsKeys.detail(variables.idEnterprise) });
    },
  });

  return { saveLimits };
}
