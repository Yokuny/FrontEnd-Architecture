import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { ListOrderServiceDoneResponse } from '../@interface/list-os-done.types';

export const listOsDoneKeys = {
  all: ['list-os-done'] as const,
  list: (params: any) => [...listOsDoneKeys.all, 'list', params] as const,
};

export function useListOrderServiceDone(params: { page: number; size: number; search?: string; idEnterprise?: string }) {
  return useQuery({
    queryKey: listOsDoneKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(params.page));
      queryParams.append('size', String(params.size));
      if (params.search) queryParams.append('search', params.search);
      if (params.idEnterprise) queryParams.append('idEnterprise', params.idEnterprise);

      const response = await api.get<ListOrderServiceDoneResponse>(`/maintenancemachine/os/done/list?${queryParams.toString()}`);
      return response.data;
    },
    enabled: !!params.idEnterprise,
  });
}
