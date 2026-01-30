import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { HeatmapFleetItem } from '../@interface/heatmap.types';

export const heatmapFleetKeys = {
  all: ['heatmap-fleet'] as const,
  list: (idEnterprise?: string) => [...heatmapFleetKeys.all, 'list', { idEnterprise }] as const,
};

export function useHeatmapFleet(idEnterprise?: string) {
  return useQuery({
    queryKey: heatmapFleetKeys.list(idEnterprise),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (idEnterprise) {
        params.append('idEnterprise', idEnterprise);
      }

      const url = `/machineheatmap${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<HeatmapFleetItem[]>(url);
      return response.data || [];
    },
    enabled: !!idEnterprise,
  });
}
