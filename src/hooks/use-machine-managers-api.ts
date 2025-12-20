import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
// The API returns a list of strings representing manager names/IDs
export type MachineManager = string;

// Query keys
export const machineManagersKeys = {
  all: ['machine-managers'] as const,
  byEnterprise: (idEnterprise: string) => [...machineManagersKeys.all, 'enterprise', idEnterprise] as const,
};

// API functions
async function fetchMachineManagers(idEnterprise: string): Promise<MachineManager[]> {
  const response = await api.get<MachineManager[]>(`/machine/listmanager?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function useMachineManagers(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: machineManagersKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchMachineManagers(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useMachineManagersSelect(idEnterprise: string | undefined) {
  return useMachineManagers(idEnterprise);
}

// Mapping functions
export function mapMachineManagersToOptions(managers: MachineManager[]) {
  return managers
    .map((manager) => ({
      value: manager,
      label: manager,
      data: manager,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
