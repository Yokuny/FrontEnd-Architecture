import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface SensorSignal {
  id: string;
  description: string;
}

// Query keys
export const sensorSignalsKeys = {
  all: ['sensor-signals'] as const,
  list: (id: string, sensorId: string) => [...sensorSignalsKeys.all, 'list', id, sensorId] as const,
};

// API functions
async function fetchSensorSignals(id: string, sensorId: string): Promise<SensorSignal[]> {
  const response = await api.get<SensorSignal[]>(`/machine/sensor/signals?id=${id}&sensorId=${sensorId}`);
  return response.data;
}

// Hooks
export function useSensorSignals(id: string | undefined, sensorId: string | undefined) {
  return useQuery({
    queryKey: sensorSignalsKeys.list(id || '', sensorId || ''),
    queryFn: () => fetchSensorSignals(id as string, sensorId as string),
    enabled: !!id && !!sensorId,
  });
}

// Helper hook for select components
export function useSensorSignalsSelect(id: string | undefined, sensorId: string | undefined) {
  return useSensorSignals(id, sensorId);
}

// Helper function to map signals to select options
export function mapSensorSignalsToOptions(signals: SensorSignal[]) {
  return signals
    .map((signal) => ({
      value: signal.id,
      label: `${signal.description} (${signal.id})`,
      data: signal,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
