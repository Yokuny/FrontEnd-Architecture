import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Query keys
export const statusKeys = {
  all: ['status'] as const,
  byEnterprise: (id: string) => [...statusKeys.all, 'enterprise', id] as const,
};

// API functions
async function fetchStatusByEnterprise(idEnterprise: string): Promise<string[]> {
  const response = await api.get<string[]>(`/form/cmms/status/${idEnterprise}`);
  return response.data;
}

// Hooks
export function useStatusByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: statusKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchStatusByEnterprise(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useStatusSelect(idEnterprise: string | undefined) {
  return useStatusByEnterprise(idEnterprise);
}

/**
 * Helper function to map basic status strings to select options.
 * The component usually adds the "empty/undefined" option with translation.
 */
export function mapStatusToOptions(statuses: string[]) {
  return statuses.map((status) => ({
    value: status,
    label: status,
    data: status,
  }));
}
