import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEnterpriseFilter } from '@/hooks/use-enterprises-api';
import { api } from '@/lib/api/client';
import type { Param } from '@/routes/_private/register/params/@interface/param';

// Query keys
export const paramsKeys = {
  all: ['params'] as const,
  lists: () => [...paramsKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...paramsKeys.lists(), filters] as const,
  details: () => [...paramsKeys.all, 'detail'] as const,
  detail: (id: string) => [...paramsKeys.details(), id] as const,
};

// API functions
async function fetchParams(params?: Record<string, unknown>): Promise<{ data: Param[]; totalCount: number }> {
  const idEnterprise = (params?.idEnterprise as string) || useEnterpriseFilter.getState().idEnterprise || '';
  const queryParams = { ...params, idEnterprise };

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined || value === null || value === '') continue;
    searchParams.append(key, String(value));
  }

  const response = await api.get<{ data: Param[]; totalCount: number }>(`/params/list?${searchParams.toString()}`);
  return response.data;
}

async function fetchParam(id: string): Promise<Param> {
  const response = await api.get<Param>(`/params/find?id=${id}`);
  return response.data;
}

// Hooks
export function useParams(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: paramsKeys.list(filters),
    queryFn: () => fetchParams(filters),
  });
}

export function useParam(id: string | undefined) {
  return useQuery({
    queryKey: paramsKeys.detail(id || ''),
    queryFn: () => fetchParam(id as string),
    enabled: !!id,
  });
}

export function useParamsApi() {
  const queryClient = useQueryClient();

  const createParam = useMutation({
    mutationFn: (data: Partial<Param>) => api.post('/params', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paramsKeys.all });
    },
  });

  const deleteParam = useMutation({
    mutationFn: (id: string) => api.delete(`/params?id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paramsKeys.all });
    },
  });

  return { createParam, deleteParam };
}

// Helper hook for select components
export function useParamsSelect() {
  return useQuery({
    queryKey: [...paramsKeys.all, 'select'],
    queryFn: async () => {
      const response = await api.get<Param[]>('/params/list/all');
      return response.data;
    },
  });
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
