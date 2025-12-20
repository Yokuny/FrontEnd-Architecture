import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Fleet {
  id: string;
  description: string;
}

// Query keys
export const fleetsKeys = {
  all: ['fleets'] as const,
  byEnterprise: (id: string) => [...fleetsKeys.all, 'enterprise', id] as const,
};

// API functions
async function fetchFleetsByEnterprise(idEnterprise: string): Promise<Fleet[]> {
  const response = await api.get<Fleet[]>(`/machinefleet/?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function useFleetsByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: fleetsKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchFleetsByEnterprise(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useFleetsSelect(idEnterprise: string | undefined) {
  return useFleetsByEnterprise(idEnterprise);
}

// Helper function to map fleets to select options
export function mapFleetsToOptions(fleets: Fleet[]) {
  return fleets.map((fleet) => ({
    value: fleet.id,
    label: fleet.description,
    data: fleet,
  }));
}
