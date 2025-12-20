import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Fence {
  id: string;
  description: string;
  color?: string;
  location?: unknown;
  typeFence?: string;
}

export interface FenceFilters {
  idEnterprise?: string;
  notId?: string[];
  typeFence?: string;
}

// Query keys
export const fencesKeys = {
  all: ['fences'] as const,
  list: (filters: FenceFilters) => [...fencesKeys.all, 'list', filters] as const,
};

// API functions
async function fetchFences(filters: FenceFilters): Promise<Fence[]> {
  const query = new URLSearchParams();
  if (filters.idEnterprise) query.append('idEnterprise', filters.idEnterprise);
  if (filters.notId?.length) {
    filters.notId.forEach((id) => {
      query.append('notId[]', id);
    });
  }
  if (filters.typeFence) query.append('typeFence', filters.typeFence);

  const response = await api.get<Fence[]>(`/geofence/fences?${query.toString()}`);
  return response.data;
}

// Hooks
export function useFences(filters: FenceFilters) {
  return useQuery({
    queryKey: fencesKeys.list(filters),
    queryFn: () => fetchFences(filters),
    enabled: !!filters.idEnterprise,
  });
}

// Helper hook for select components
export function useFencesSelect(filters: FenceFilters) {
  return useFences(filters);
}

// Helper function to map fences to select options
export function mapFencesToOptions(fences: Fence[]) {
  return fences
    .map((fence) => ({
      value: fence.id,
      label: fence.description,
      data: fence,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
