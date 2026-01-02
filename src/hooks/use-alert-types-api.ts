import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface AlertType {
  id: string;
  description: string;
  type: string;
}

// Query keys
export const alertTypesKeys = {
  all: ['alert-types'] as const,
  list: () => [...alertTypesKeys.all, 'list'] as const,
};

// API functions
async function fetchAlertTypes(): Promise<AlertType[]> {
  const response = await api.get<AlertType[]>('/alerttype/list');
  return response.data;
}

// Hooks
export function useAlertTypes() {
  return useQuery({
    queryKey: alertTypesKeys.list(),
    queryFn: fetchAlertTypes,
  });
}

// Helper hook for select components
export function useAlertTypesSelect() {
  return useAlertTypes();
}

// Helper function to map alert types to select options
export function mapAlertTypesToOptions(types: AlertType[]) {
  return types.map((type) => ({
    value: type.id,
    label: type.description,
    data: type,
  }));
}
