import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface FasPlanner {
  addedById: string;
  addedByName: string;
}

// Query keys
export const fasPlannersKeys = {
  all: ['fas-planners'] as const,
  byEnterprise: (id: string) => [...fasPlannersKeys.all, 'enterprise', id] as const,
};

// API functions
async function fetchFasPlanners(idEnterprise: string): Promise<FasPlanner[]> {
  const response = await api.get<FasPlanner[]>(`/fas/planner/list?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function useFasPlanners(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: fasPlannersKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchFasPlanners(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useFasPlannersSelect(idEnterprise: string | undefined) {
  return useFasPlanners(idEnterprise);
}

// Helper function to map planners to select options
export function mapFasPlannersToOptions(planners: FasPlanner[]) {
  return planners
    .map((planner) => ({
      value: planner.addedById,
      label: planner.addedByName,
      data: planner,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
