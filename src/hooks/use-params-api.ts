import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Param {
  id: string;
  description: string;
}

// Query keys
export const paramsKeys = {
  all: ['params'] as const,
  list: () => [...paramsKeys.all, 'list'] as const,
};

// API functions
async function fetchParams(): Promise<Param[]> {
  const response = await api.get<Param[]>('/params/list/all');
  return response.data;
}

// Hooks
export function useParams() {
  return useQuery({
    queryKey: paramsKeys.list(),
    queryFn: fetchParams,
  });
}

// Helper hook for select components
export function useParamsSelect() {
  return useParams();
}

// Helper function to map to select options
export function mapParamsToOptions(params: Param[]) {
  return params
    .map((param) => ({
      value: param.id,
      label: param.description,
      data: param,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
