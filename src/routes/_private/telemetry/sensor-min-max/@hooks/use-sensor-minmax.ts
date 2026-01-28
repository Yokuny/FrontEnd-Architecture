import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import type { SensorData, SensorMinMaxConfig, SensorMinMaxData } from '../@interface/sensor-minmax.types';

// Query keys
export const sensorMinMaxKeys = {
  all: ['sensor-minmax'] as const,
  sensorData: (idMachine: string, days: number, idEnterprise: string) => [...sensorMinMaxKeys.all, 'data', { idMachine, days, idEnterprise }] as const,
  minMaxConfig: (idAsset: string, idEnterprise: string) => [...sensorMinMaxKeys.all, 'config', { idAsset, idEnterprise }] as const,
};

/**
 * Fetch sensor data for last N days
 */
export function useSensorDataQuery(idMachine: string | undefined, days: number, idEnterprise: string | undefined) {
  return useQuery({
    queryKey: sensorMinMaxKeys.sensorData(idMachine || '', days, idEnterprise || ''),
    queryFn: async () => {
      const response = await api.get<SensorData[]>(`/sensordata/lastdays/${idMachine}?days=${days}&idEnterprise=${idEnterprise}`);
      return response.data || [];
    },
    enabled: !!idMachine && !!idEnterprise && days > 0,
  });
}

/**
 * Fetch current min/max configuration for asset
 */
export function useSensorMinMaxQuery(idAsset: string | undefined, idEnterprise: string | undefined) {
  return useQuery({
    queryKey: sensorMinMaxKeys.minMaxConfig(idAsset || '', idEnterprise || ''),
    queryFn: async () => {
      const response = await api.get<SensorMinMaxData>(`/sensorminmax?idAsset=${idAsset}&idEnterprise=${idEnterprise}`);
      return response.data;
    },
    enabled: !!idAsset && !!idEnterprise,
  });
}

/**
 * API mutations for sensor min/max
 */
export function useSensorMinMaxApi(idAsset: string | undefined, idEnterprise: string | undefined) {
  const queryClient = useQueryClient();

  const saveMinMax = useMutation({
    mutationFn: async (data: { id?: string; sensors: SensorMinMaxConfig[] }) => {
      return api.post('/sensorminmax', {
        id: data.id || null,
        idAsset,
        idEnterprise,
        sensors: data.sensors,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sensorMinMaxKeys.all });
    },
    onError: () => {
      toast.error('Error saving sensor configuration');
    },
  });

  return { saveMinMax };
}
