# Padrao de Hook de API (TanStack Query)

Arquivo: `src/hooks/use-{feature}-api.ts`

## Estrutura Completa

```tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Geofence, GeofenceFormData } from '@/routes/_private/register/geofences/@interface/geofence.interface';

// 1. Query Keys centralizadas
export const geofencesKeys = {
  all: ['geofences'] as const,
  lists: () => [...geofencesKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...geofencesKeys.lists(), filters] as const,
  details: () => [...geofencesKeys.all, 'detail'] as const,
  detail: (id: string) => [...geofencesKeys.details(), id] as const,
};

// 2. Funcoes de API (privadas)
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
  const response = await api.post<Geofence>('/geofence', data);
  return response.data;
}

async function deleteGeofence(id: string): Promise<void> {
  await api.delete(`/geofence?id=${id}`);
}

// 3. Hook de Query - Listagem
export function useGeofences(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: geofencesKeys.list(params),
    queryFn: () => fetchGeofences(params),
  });
}

// 4. Hook de Query - Detalhe
export function useGeofence(id?: string) {
  return useQuery({
    queryKey: geofencesKeys.detail(id ?? ''),
    queryFn: () => fetchGeofence(id ?? ''),
    enabled: !!id,
  });
}

// 5. Hook de Mutations
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
```

## Resumo do Padrao

1. **Query Keys**: Objeto centralizado com hierarquia (`all > lists > list > details > detail`)
2. **Funcoes de API**: Funcoes privadas async que usam `api` client
3. **useQuery**: Hooks separados para listagem e detalhe, com `enabled` para queries condicionais
4. **useMutation**: Hook agrupado retornando todas as mutations com `invalidateQueries` no `onSuccess`
