import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface MaintenancePlanByMachine {
  id: string;
  description: string;
}

// Query keys
export const maintenancePlanByMachineKeys = {
  all: ['maintenance-plans-by-machine'] as const,
  byMachine: (idMachine: string, params?: Record<string, unknown>) => [...maintenancePlanByMachineKeys.all, 'machine', idMachine, params] as const,
};

// API functions
async function fetchMaintenancePlanByMachine(idMachine: string, params?: Record<string, unknown>): Promise<MaintenancePlanByMachine[]> {
  // Convert array of IDs to multiple notIdMaintenancePlan[] params if provided
  const searchParams = new URLSearchParams({
    onlyWear: 'true',
    id: idMachine,
  });

  if (params?.filterItems && Array.isArray(params.filterItems)) {
    params.filterItems.forEach((id: string) => {
      searchParams.append('notIdMaintenancePlan[]', id);
    });
  }

  const response = await api.get<MaintenancePlanByMachine[]>(`/machine/maintenanceplans?${searchParams.toString()}`);
  return response.data;
}

// Hooks
export function useMaintenancePlanByMachine(idMachine: string | undefined, filterItems?: string[]) {
  return useQuery({
    queryKey: maintenancePlanByMachineKeys.byMachine(idMachine || '', { filterItems }),
    queryFn: () => {
      if (!idMachine) return Promise.resolve([]);
      return fetchMaintenancePlanByMachine(idMachine, { filterItems });
    },
    enabled: !!idMachine,
  });
}

// Helper hook for select components
export function useMaintenancePlanByMachineSelect(idMachine: string | undefined, filterItems?: string[]) {
  return useMaintenancePlanByMachine(idMachine, filterItems);
}

// Mapping functions
export function mapMaintenancePlanByMachineToOptions(plans: MaintenancePlanByMachine[]) {
  return plans
    .map((plan) => ({
      value: plan.id,
      label: plan.description,
      data: plan,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
