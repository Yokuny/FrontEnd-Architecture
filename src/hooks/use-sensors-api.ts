import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Sensor {
  id: string;
  sensorId: string;
  sensor: string;
  // Add other fields as needed
}

export interface SensorSelectOption {
  value: string;
  label: string;
  id: string;
}

// Query keys
export const sensorsKeys = {
  all: ['sensors'] as const,
  lists: () => [...sensorsKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...sensorsKeys.lists(), filters] as const,
  details: () => [...sensorsKeys.all, 'detail'] as const,
  detail: (id: string) => [...sensorsKeys.details(), id] as const,
};

// API functions
async function fetchSensors(): Promise<Sensor[]> {
  const response = await api.get<Sensor[]>('/sensor');
  return response.data;
}

async function fetchSensorsByMachine(idMachine: string): Promise<Sensor[]> {
  const response = await api.get<Sensor[]>(`/machine/sensors?id=${idMachine}`);
  return response.data;
}

async function fetchSensor(id: string): Promise<Sensor> {
  const response = await api.get<Sensor>(`/sensor/${id}`);
  return response.data;
}

// Hooks
export function useSensors(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: sensorsKeys.list(params),
    queryFn: fetchSensors,
  });
}

export function useSensorsByMachine(idMachine: string | undefined) {
  return useQuery({
    queryKey: [...sensorsKeys.all, 'machine', idMachine],
    queryFn: () => {
      if (!idMachine) {
        return Promise.resolve([]);
      }
      return fetchSensorsByMachine(idMachine);
    },
    enabled: !!idMachine,
  });
}

export function useSensor(id: string) {
  return useQuery({
    queryKey: sensorsKeys.detail(id),
    queryFn: () => fetchSensor(id),
    enabled: !!id,
  });
}

// Helper hook for select components
export function useSensorsSelect() {
  return useSensors();
}

// Helper hook for machine-filtered select
export function useSensorsByMachineSelect(idMachine: string | undefined) {
  return useSensorsByMachine(idMachine);
}

// Helper function to map sensors to select options
export function mapSensorsToOptions(sensors: Sensor[]): SensorSelectOption[] {
  return sensors
    .map((sensor) => ({
      value: sensor.sensorId,
      label: sensor.sensor,
      id: sensor.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
