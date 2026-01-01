import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Geofence, GeofenceFormData } from '@/routes/_private/register/geofences/@interface/geofence.interface';

export const geofencesKeys = {
  all: ['geofences'] as const,
  lists: () => [...geofencesKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...geofencesKeys.lists(), filters] as const,
  details: () => [...geofencesKeys.all, 'detail'] as const,
  detail: (id: string) => [...geofencesKeys.details(), id] as const,
};

// API functions
async function fetchGeofences(params?: Record<string, unknown>): Promise<{ data: Geofence[]; totalCount: number }> {
  const response = await api.get<{ data: Geofence[]; pageInfo: [{ count: number }] }>('/geofence/list', { params });
  return {
    data: response.data.data,
    totalCount: response.data.pageInfo?.[0]?.count || 0,
  };
}

async function fetchGeofence(id: string): Promise<Geofence> {
  const response = await api.get<Geofence>(`/geofence/find?id=${id}`);
  return response.data;
}

async function createGeofence(data: GeofenceFormData): Promise<Geofence> {
  const response = await api.post<Geofence>('/geofence', data);
  return response.data;
}

async function updateGeofence(data: GeofenceFormData & { id: string }): Promise<Geofence> {
  const response = await api.post<Geofence>('/geofence', data); // Legacy uses POST for both
  return response.data;
}

async function deleteGeofence(id: string): Promise<void> {
  await api.delete(`/geofence?id=${id}`);
}

// Hooks
export function useGeofences(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: geofencesKeys.list(params),
    queryFn: () => fetchGeofences(params),
  });
}

export function useGeofence(id?: string) {
  return useQuery({
    queryKey: geofencesKeys.detail(id ?? ''),
    queryFn: () => fetchGeofence(id ?? ''),
    enabled: !!id,
  });
}

export function useGeofencesApi() {
  const queryClient = useQueryClient();

  const createGeofenceMutation = useMutation({
    mutationFn: createGeofence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: geofencesKeys.lists() });
    },
  });

  const updateGeofenceMutation = useMutation({
    mutationFn: updateGeofence,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: geofencesKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: geofencesKeys.detail(data.id) });
      }
    },
  });

  const deleteGeofenceMutation = useMutation({
    mutationFn: deleteGeofence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: geofencesKeys.lists() });
    },
  });

  return {
    createGeofence: createGeofenceMutation,
    updateGeofence: updateGeofenceMutation,
    deleteGeofence: deleteGeofenceMutation,
  };
}
