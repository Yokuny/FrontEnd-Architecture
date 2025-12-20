import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Part {
  id: string;
  name: string;
  sku: string;
}

// Query keys
export const partsKeys = {
  all: ['parts'] as const,
  byEnterprise: (id: string) => [...partsKeys.all, 'enterprise', id] as const,
};

// API functions
async function fetchPartsByEnterprise(idEnterprise: string): Promise<Part[]> {
  const response = await api.get<Part[]>(`/part?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function usePartsByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: partsKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchPartsByEnterprise(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function usePartsSelect(idEnterprise: string | undefined) {
  return usePartsByEnterprise(idEnterprise);
}

// Helper function to map parts to select options
export function mapPartsToOptions(parts: Part[]) {
  return parts.map((part) => ({
    value: part.id,
    label: `${part.name} (${part.sku})`,
    data: part,
  }));
}
