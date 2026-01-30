import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { takeCareResponse } from '../@utils/voyage-kpi-utils';

export const voyageKpiKeys = {
  all: ['voyage-kpis'] as const,
  list: (filters: any) => [...voyageKpiKeys.all, filters] as const,
};

export interface VoyageKpiFilters {
  idEnterprise?: string;
  'idMachine[]'?: string[];
  'idCustomer[]'?: string[];
}

export function useVoyageKpis(filters: VoyageKpiFilters) {
  return useQuery({
    queryKey: voyageKpiKeys.list(filters),
    queryFn: async () => {
      const response = await api.get<any[]>('/travel/kpis', { params: filters });
      return takeCareResponse(response.data || []);
    },
    enabled: !!filters.idEnterprise,
  });
}
