import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { HeatmapConfigRequest, HeatmapConfigResponse, MachineSensor } from '../@interface/heatmap.types';

// Query keys
export const heatmapConfigKeys = {
  all: ['heatmap-config'] as const,
  detail: (id: string) => [...heatmapConfigKeys.all, id] as const,
  sensors: (machineId: string) => ['machine-sensors', machineId] as const,
};

// Fetch heatmap configuration by ID
export function useHeatmapConfig(id?: string) {
  return useQuery({
    queryKey: heatmapConfigKeys.detail(id || ''),
    queryFn: async () => {
      const { data } = await api.get<HeatmapConfigResponse>(`/machineheatmap/find?id=${id}`);
      return data;
    },
    enabled: !!id,
  });
}

// Fetch machine sensors
export function useMachineSensors(machineId?: string) {
  return useQuery({
    queryKey: heatmapConfigKeys.sensors(machineId || ''),
    queryFn: async () => {
      const { data } = await api.get<MachineSensor[]>(`/machine/sensors?id=${machineId}`);
      return data || [];
    },
    enabled: !!machineId,
  });
}

// Save heatmap configuration (create or update)
export function useSaveHeatmapConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: HeatmapConfigRequest) => {
      if (config.id) {
        const { data } = await api.put('/machineheatmap', config);
        return data;
      }
      const { data } = await api.post('/machineheatmap', config);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heatmap-fleet'] });
    },
  });
}

// Delete heatmap configuration
export function useDeleteHeatmapConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/machineheatmap?id=${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heatmap-fleet'] });
    },
  });
}
