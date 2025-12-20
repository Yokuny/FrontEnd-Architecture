import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Scale {
  id: string;
  description: string;
}

// Query keys
export const scalesKeys = {
  all: ['scales'] as const,
  list: () => [...scalesKeys.all, 'list'] as const,
};

// API functions
async function fetchScales(): Promise<Scale[]> {
  const response = await api.get<Scale[]>('/scale/list');
  return response.data;
}

// Hooks
export function useScales() {
  return useQuery({
    queryKey: scalesKeys.list(),
    queryFn: fetchScales,
  });
}

// Helper hook for select components
export function useScalesSelect() {
  return useScales();
}

// Helper function to map scales to select options
export function mapScalesToOptions(scales: Scale[]) {
  return scales
    .map((scale) => ({
      value: scale.id,
      label: scale.description,
      data: scale,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
