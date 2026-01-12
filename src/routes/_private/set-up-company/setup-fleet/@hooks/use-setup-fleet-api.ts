import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { SetupFleetPayload, SetupFleetResponse } from '../@interface/setup-fleet';

export const setupFleetKeys = {
  all: ['setup-fleet'] as const,
  detail: (idEnterprise: string) => [...setupFleetKeys.all, 'detail', idEnterprise] as const,
};

async function fetchSetupFleet(idEnterprise: string): Promise<SetupFleetResponse | null> {
  try {
    const response = await api.get<SetupFleetResponse>(`/setupenterprise/find/fleet?idEnterprise=${idEnterprise}`);
    return response.data;
  } catch (_error) {
    return null;
  }
}

async function updateSetupFleet(data: SetupFleetPayload): Promise<SetupFleetResponse> {
  const response = await api.patch<SetupFleetResponse>('/setupenterprise/fleet', data);
  return response.data;
}

export function useSetupFleet(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: setupFleetKeys.detail(idEnterprise || ''),
    queryFn: () => fetchSetupFleet(idEnterprise as string),
    enabled: !!idEnterprise,
  });
}

export function useSetupFleetApi() {
  const queryClient = useQueryClient();

  const updateFleet = useMutation({
    mutationFn: updateSetupFleet,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: setupFleetKeys.detail(variables.idEnterprise) });
    },
  });

  return { updateFleet };
}
