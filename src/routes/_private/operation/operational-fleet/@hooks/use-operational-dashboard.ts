import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { formatDate } from '@/lib/formatDate';
import type { AssetOperationalRanking } from '../@interface/operational-dashboard.types';

export interface OperationalDashboardResponse {
  data: AssetOperationalRanking[];
  pageInfo?: Array<{ count: number }>;
}

export function useOperationalDashboard(idEnterprise: string) {
  return useQuery<OperationalDashboardResponse>({
    queryKey: ['operational-dashboard', idEnterprise],
    queryFn: async () => {
      if (!idEnterprise) return { data: [] };
      const finalDate = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX");

      const response = await api.get(`/assetstatus/ranking/operational?idEnterprise=${idEnterprise}&date=${finalDate}`);

      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          pageInfo: [{ count: response.data.length }],
        };
      }

      return response.data as OperationalDashboardResponse;
    },
    enabled: !!idEnterprise,
    refetchInterval: 2 * 60 * 1000, // 2 minutes
  });
}
