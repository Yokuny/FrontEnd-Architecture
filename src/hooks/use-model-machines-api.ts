import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface ModelMachine {
  id: string;
  description: string;
  typeMachine: string;
}

// Query keys
export const modelMachinesKeys = {
  all: ['model-machines'] as const,
  byEnterprise: (id: string) => [...modelMachinesKeys.all, 'enterprise', id] as const,
};

// API functions
async function fetchModelMachinesByEnterprise(idEnterprise: string): Promise<ModelMachine[]> {
  const response = await api.get<ModelMachine[]>(`/modelmachine?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function useModelMachinesByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: modelMachinesKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchModelMachinesByEnterprise(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useModelMachinesSelect(idEnterprise: string | undefined) {
  return useModelMachinesByEnterprise(idEnterprise);
}

// Helper function to map model machines to select options
export function mapModelMachinesToOptions(models: ModelMachine[]) {
  return models.map((model) => ({
    value: model.id,
    label: model.description,
    data: model,
  }));
}
