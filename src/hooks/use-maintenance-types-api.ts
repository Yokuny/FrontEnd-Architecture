import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface MaintenanceType {
  value: string;
  label: string;
}

// Query keys
export const maintenanceTypesKeys = {
  all: ['maintenance-types'] as const,
  byEnterprise: (id: string) => [...maintenanceTypesKeys.all, 'enterprise', id] as const,
};

// API functions
async function fetchMaintenanceTypes(idEnterprise: string): Promise<string[]> {
  const response = await api.get<string[]>(`/form/cmms/maintenance/${idEnterprise}`);
  return response.data;
}

// Hooks
export function useMaintenanceTypes(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: maintenanceTypesKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchMaintenanceTypes(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useMaintenanceTypesSelect(idEnterprise: string | undefined) {
  return useMaintenanceTypes(idEnterprise);
}

// Helper function to map maintenance types to select options
export function mapMaintenanceTypesToOptions(types: string[]) {
  return [
    { value: 'empty', label: 'Indefinido', data: 'empty' },
    ...types.map((type) => ({
      value: type || 'Indefinido',
      label: type || 'Indefinido',
      data: type,
    })),
  ].sort((a, b) => a.label.localeCompare(b.label));
}
