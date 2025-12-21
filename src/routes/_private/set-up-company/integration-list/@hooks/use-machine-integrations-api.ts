import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { MachineIntegration, MachineIntegrationPayload, MachineIntegrationResponse } from '../@interface/machine-integration';

// Query keys
export const machineIntegrationKeys = {
  all: ['machine-integration'] as const,
  list: (idEnterprise: string) => [...machineIntegrationKeys.all, 'list', idEnterprise] as const,
};

// Transformar resposta da API para o formato do componente
function transformResponse(data: MachineIntegrationResponse[]): MachineIntegration[] {
  return data
    .map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      type: item.machineIntegration?.type || null,
      idMoon: item.machineIntegration?.idMoon || null,
      imo: item.machineIntegration?.imo || item.dataSheet?.imo || null,
      mmsi: item.machineIntegration?.mmsi || item.dataSheet?.mmsi || null,
      disabled: item.machineIntegration?.disabled || false,
      updateTime: item.machineIntegration?.updateTime || null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Fetch machine integrations
async function fetchMachineIntegrations(idEnterprise: string): Promise<MachineIntegration[]> {
  const response = await api.get<MachineIntegrationResponse[]>(`/machine-integration/list?idEnterprise=${idEnterprise}`);
  return transformResponse(response.data || []);
}

// Save machine integrations
async function saveMachineIntegrations(data: MachineIntegrationPayload[]): Promise<void> {
  await api.put('/machine-integration/list', data);
}

// Hook de Query
export function useMachineIntegrations(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: machineIntegrationKeys.list(idEnterprise || ''),
    queryFn: () => fetchMachineIntegrations(idEnterprise!),
    enabled: !!idEnterprise,
  });
}

// Hook de Mutation
export function useMachineIntegrationsApi() {
  const queryClient = useQueryClient();

  const saveMachineIntegrationsMutation = useMutation({
    mutationFn: saveMachineIntegrations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: machineIntegrationKeys.all });
    },
  });

  return {
    saveMachineIntegrations: saveMachineIntegrationsMutation,
  };
}
