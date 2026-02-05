import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { AssetOperationalRanking } from '../@interface/operational-dashboard.types';

export interface OperationalDashboardResponse {
  data: AssetOperationalRanking[];
  pageInfo?: Array<{ count: number }>;
}

export function useOperationalDashboard(idEnterprise: string, initialDate?: string, finalDate?: string) {
  return useQuery<OperationalDashboardResponse>({
    queryKey: ['operational-dashboard', idEnterprise, initialDate, finalDate],
    queryFn: async () => {
      if (!idEnterprise) return { data: [] };

      const params: Record<string, string> = {};
      if (initialDate) params.initialDate = initialDate;
      if (finalDate) params.finalDate = finalDate;

      const response = await api.get<AssetOperationalRanking[] | OperationalDashboardResponse>(`/assetstatus/ranking/operational/${idEnterprise}`, { params });

      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          pageInfo: [{ count: response.data.length }],
        };
      }

      return response.data;
    },
    enabled: !!idEnterprise,
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });
}
