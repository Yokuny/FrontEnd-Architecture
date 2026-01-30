import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export const routePlannerKeys = {
  all: ['route-planner'] as const,
  history: () => [...routePlannerKeys.all, 'history'] as const,
  detail: (id: string) => [...routePlannerKeys.history(), id] as const,
};

export function useRouteHistory() {
  return useQuery({
    queryKey: routePlannerKeys.history(),
    queryFn: async () => {
      const response = await api.get('/route/history', { isV2: true });
      return response.data;
    },
  });
}

export function useRouteDetail(id: string | null) {
  return useQuery({
    queryKey: routePlannerKeys.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/route/history/${id}`, { isV2: true });
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCalculateRoute() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/route', data, { isV2: true });
      return response.data;
    },
  });
}

export function useRouteApi() {
  const queryClient = useQueryClient();

  const saveRoute = useMutation({
    mutationFn: async (data: { description: string; routeGeoJson: any }) => {
      const response = await api.post('/route/history', data, { isV2: true });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routePlannerKeys.history() });
    },
  });

  const deleteRoute = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/route/history/${id}`, { isV2: true });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routePlannerKeys.history() });
    },
  });

  return {
    saveRoute,
    deleteRoute,
  };
}
