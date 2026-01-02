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
  const response = await api.get<Buoy>(`/buoy/find?id=${id}`);
  return response.data;
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
      if (data.id) {
        return api.put(`/buoy/update?id=${data.id}`, data);
      }
      return api.post('/buoy', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buoyKeys.all });
    },
  });

  const deleteBuoy = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/buoy?id=${id}`, { responseType: 'text' });
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
