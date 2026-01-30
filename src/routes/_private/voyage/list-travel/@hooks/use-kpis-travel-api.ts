import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { VoyageFormValues } from '../@interface/schema';

export const voyageKeys = {
  all: ['voyage'] as const,
  lists: () => [...voyageKeys.all, 'list'] as const,
  list: (filters?: any) => [...voyageKeys.lists(), filters] as const,
  details: () => [...voyageKeys.all, 'detail'] as const,
  detail: (id: string) => [...voyageKeys.details(), id] as const,
};

async function fetchVoyages(filters?: any) {
  const params = {
    page: 0,
    size: 100,
    showAnalytics: 'true',
    ...filters,
  };
  const response = await api.get('/travel/list', { params });
  return response.data;
}

async function fetchVoyage(id: string) {
  const response = await api.get<any>(`/travel/manual-voyage/${id}`);
  return response.data;
}

export function useVoyages(filters?: any) {
  return useQuery({
    queryKey: voyageKeys.list(filters),
    queryFn: () => fetchVoyages(filters),
  });
}

export function useVoyage(id: string | null) {
  return useQuery({
    queryKey: voyageKeys.detail(id || ''),
    queryFn: () => (id ? fetchVoyage(id) : Promise.reject('No ID')),
    enabled: !!id,
  });
}

export function useVoyageApi() {
  const queryClient = useQueryClient();

  const createVoyage = useMutation({
    mutationFn: (data: VoyageFormValues) => api.post('/travel/create', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voyageKeys.lists() });
    },
  });

  const updateVoyage = useMutation({
    mutationFn: (data: VoyageFormValues) => api.put('/travel/edit', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voyageKeys.all });
    },
  });

  const deleteVoyage = useMutation({
    mutationFn: (id: string) => api.delete(`/travel/manual-voyage/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voyageKeys.lists() });
    },
  });

  const changeStatusVoyage = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/travel/changestatus/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: voyageKeys.all });
    },
  });

  return {
    createVoyage,
    updateVoyage,
    deleteVoyage,
    changeStatusVoyage,
  };
}
