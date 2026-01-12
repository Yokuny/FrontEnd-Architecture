import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Buoy {
  id: string;
  _id?: string; // Legacy MongoDB ID
  name: string;
  proximity: string;
  idEnterprise: string;
  color?: string;
  location: any; // Complex location object from legacy
}

export interface BuoyListResponse {
  data: Buoy[];
  pageInfo?: Array<{ count: number }>;
}

// Query keys
export const buoyKeys = {
  all: ['buoys'] as const,
  lists: () => [...buoyKeys.all, 'list'] as const,
  list: (params: any) => [...buoyKeys.lists(), params] as const,
  details: () => [...buoyKeys.all, 'detail'] as const,
  detail: (id?: string) => [...buoyKeys.details(), id] as const,
};

// API functions
async function fetchBuoysList(params: { idEnterprise?: string; page?: number; size?: number; search?: string }): Promise<BuoyListResponse> {
  const queryParams = new URLSearchParams();
  if (params.idEnterprise) queryParams.append('idEnterprise', params.idEnterprise);
  if (params.page !== undefined) queryParams.append('page', String(params.page));
  if (params.size !== undefined) queryParams.append('size', String(params.size));
  if (params.search) queryParams.append('search', params.search);

  const response = await api.get<BuoyListResponse>(`/buoy/list?${queryParams.toString()}`);
  return response.data;
}

async function fetchBuoyById(id: string): Promise<Buoy> {
  const response = await api.get<any>(`/buoy/${id}`);
  // Handle both { data: buoy } and direct buoy object
  return response.data?.data || response.data;
}

// Hooks
export function useBuoys(params: { idEnterprise?: string; page?: number; size?: number; search?: string }) {
  return useQuery({
    queryKey: buoyKeys.list(params),
    queryFn: () => fetchBuoysList(params),
    enabled: !!params.idEnterprise,
  });
}

export function useBuoy(id: string | undefined) {
  return useQuery({
    queryKey: buoyKeys.detail(id),
    queryFn: () => {
      if (!id) return Promise.resolve(undefined);
      return fetchBuoyById(id);
    },
    enabled: !!id,
  });
}

export function useBuoysApi() {
  const queryClient = useQueryClient();

  const saveBuoy = useMutation({
    mutationFn: async (data: any) => {
      const { id, _id, ...payload } = data;
      const targetId = _id || id;
      if (targetId) {
        return api.put(`/buoy/${targetId}`, payload);
      }
      return api.post('/buoy', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buoyKeys.all });
    },
  });

  const deleteBuoy = useMutation({
    mutationFn: async (id: string) => {
      // Prioritize Mongo ID if it looks like one, or use whatever id is provided
      await api.delete(`/buoy/${id}`, { responseType: 'text' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buoyKeys.all });
    },
  });

  return {
    saveBuoy,
    deleteBuoy,
  };
}

export function useBuoysMap({ idEnterprise }: { idEnterprise?: string }) {
  return useQuery({
    queryKey: [...buoyKeys.all, 'map-list', idEnterprise],
    queryFn: async () => {
      const response = await api.get<any[]>(`/buoy/maplist${idEnterprise ? `?idEnterprise=${idEnterprise}` : ''}`);
      return response.data;
    },
    enabled: !!idEnterprise,
  });
}

export function useVesselsNear(buoysData: any[], enabled: boolean) {
  return useQuery({
    queryKey: ['buoys', 'vessels-near', buoysData?.length],
    queryFn: async () => {
      const near = buoysData?.map((x) => ({
        latitude: x.location[0].geometry.coordinates[1],
        longitude: x.location[0].geometry.coordinates[0],
        radius: x.location[0].properties.radius + 1000,
        lookbackMinutes: 60,
      }));
      const response = await api.post<any[]>(`/integrationthird/vesselsnear`, near);
      return response.data;
    },
    enabled: enabled && !!buoysData?.length,
  });
}
