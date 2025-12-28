import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface MaintenancePlan {
  id: string;
  description: string;
}

export interface MaintenancePlanSelectOption {
  value: string;
  label: string;
}

// Query keys
export const maintenancePlansKeys = {
  all: ['maintenance-plans'] as const,
  lists: () => [...maintenancePlansKeys.all, 'list'] as const,
  list: (idEnterprise?: string) => [...maintenancePlansKeys.lists(), idEnterprise] as const,
  details: () => [...maintenancePlansKeys.all, 'detail'] as const,
  detail: (id: string) => [...maintenancePlansKeys.details(), id] as const,
};

// API functions
async function fetchMaintenancePlans(idEnterprise: string): Promise<MaintenancePlan[]> {
  const response = await api.get<MaintenancePlan[]>(`/maintenanceplan/list/all?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function useMaintenancePlans(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: maintenancePlansKeys.list(idEnterprise),
    queryFn: () => {
      if (!idEnterprise) {
        return Promise.resolve([]);
      }
      return fetchMaintenancePlans(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useMaintenancePlansSelect(idEnterprise: string | undefined) {
  return useMaintenancePlans(idEnterprise);
}

// Helper function to map maintenance plans to select options
export function mapMaintenancePlansToOptions(plans: MaintenancePlan[]) {
  return plans
    .map((plan) => ({
      value: plan.id,
      label: plan.description,
      data: plan,
    }))
    .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
}
