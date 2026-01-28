import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { HeatmapData } from '../@interface/heatmap-panel.types';

const heatmapPanelKeys = {
  all: ['heatmap-panel'] as const,
  byEnterprise: (idEnterprise?: string) => [...heatmapPanelKeys.all, idEnterprise] as const,
};

async function fetchHeatmapPanel(idEnterprise?: string): Promise<HeatmapData> {
  if (!idEnterprise) {
    return { columns: [], data: [] };
  }

  const response = await api.get<HeatmapData>(`/heatmap/panel?idEnterprise=${idEnterprise}`);
  return response.data || { columns: [], data: [] };
}

export function useHeatmapPanelQuery(idEnterprise?: string) {
  return useQuery({
    queryKey: heatmapPanelKeys.byEnterprise(idEnterprise),
    queryFn: () => fetchHeatmapPanel(idEnterprise),
    enabled: !!idEnterprise,
  });
}
