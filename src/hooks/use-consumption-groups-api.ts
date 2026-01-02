import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface ConsumptionGroup {
  id: string;
  description: string;
}

// Query keys
export const consumptionGroupsKeys = {
  all: ['consumption-groups'] as const,
  byEnterprise: (id: string) => [...consumptionGroupsKeys.all, 'enterprise', id] as const,
};

// API functions
async function fetchConsumptionGroups(idEnterprise: string): Promise<ConsumptionGroup[]> {
  const response = await api.get<ConsumptionGroup[]>(`/group-consumption?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function useConsumptionGroups(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: consumptionGroupsKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchConsumptionGroups(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useConsumptionGroupsSelect(idEnterprise: string | undefined) {
  return useConsumptionGroups(idEnterprise);
}

// Helper function to map consumption groups to select options
export function mapConsumptionGroupsToOptions(groups: ConsumptionGroup[]) {
  return groups
    .map((group) => ({
      value: group.id,
      label: `${group.id} - ${group.description || ''}`,
      data: group,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
