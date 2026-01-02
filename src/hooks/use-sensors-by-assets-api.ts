import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface SensorByAsset {
  id: string;
  sensor: string;
  sensorId: string;
  type?: string;
}

// Query keys
export const sensorsByAssetsKeys = {
  all: ['sensors-by-assets'] as const,
  byAssets: (idAssets: string[]) => [...sensorsByAssetsKeys.all, idAssets.sort().join(',')] as const,
};

// API functions
async function fetchSensorsByAssets(idAssets: string[]): Promise<SensorByAsset[]> {
  const filtering = idAssets.join(',');
  const response = await api.get<SensorByAsset[]>(`/machine/sensors?id=${filtering}`);
  return response.data;
}

// Hooks
export function useSensorsByAssets(idAssets: string[] | undefined) {
  return useQuery({
    queryKey: sensorsByAssetsKeys.byAssets(idAssets || []),
    queryFn: () => fetchSensorsByAssets(idAssets as string[]),
    enabled: !!idAssets && idAssets.length > 0,
  });
}

// Helper hook for select components
export function useSensorsByAssetsSelect(idAssets: string[] | undefined) {
  return useSensorsByAssets(idAssets);
}

// Helper function to map sensors to select options
export function mapSensorsByAssetsToOptions(sensors: SensorByAsset[]) {
  return sensors
    .filter((x) => x)
    .map((sensor) => ({
      value: sensor.sensorId,
      label: `${sensor.sensor} (${sensor.sensorId})`,
      data: sensor,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
