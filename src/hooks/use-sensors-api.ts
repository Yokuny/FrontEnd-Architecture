import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Sensor {
  id: string;
  sensorId: string;
  sensor: string;
  description?: string;
  type?: string;
  unit?: string;
  valueMin?: number;
  valueMax?: number;
  enterprise?: {
    id: string;
    name: string;
  };
  machines?: string[];
}

export interface SensorSelectOption {
  value: string;
  label: string;
  id: string;
}

export interface SensorFormData {
  id?: string;
  sensorId: string;
  idEnterprise: string;
  sensor: string;
  description?: string;
  type?: string;
  unit?: string;
  valueMin?: number;
  valueMax?: number;
}

// Query keys
export const sensorsKeys = {
  all: ['sensors'] as const,
  lists: (idEnterprise?: string) => [...sensorsKeys.all, 'list', { idEnterprise }] as const,
  detail: (id: string) => [...sensorsKeys.all, 'detail', id] as const,
  machines: (idMachine: string) => [...sensorsKeys.all, 'machine', idMachine] as const,
};

// Hooks
export function useSensors(idEnterprise?: string, page = 0, size = 20, search?: string) {
  return useQuery({
    queryKey: [...sensorsKeys.lists(idEnterprise), { page, size, search }],
    queryFn: async () => {
      const response = await api.get<{ data: Sensor[]; pageInfo: [{ count: number }] }>(
        `/sensor/list?page=${page}&size=${size}${idEnterprise ? `&idEnterprise=${idEnterprise}` : ''}${search ? `&search=${search}` : ''}`,
      );
      return {
        data: response.data.data,
        totalCount: response.data.pageInfo?.[0]?.count || 0,
      };
    },
    enabled: !!idEnterprise,
  });
}

export function useSensorsByMachine(idMachine: string | undefined) {
  return useQuery({
    queryKey: idMachine ? sensorsKeys.machines(idMachine) : [...sensorsKeys.all, 'machine'],
    queryFn: async () => {
      if (!idMachine) return [];
      const response = await api.get<Sensor[]>(`/machine/sensors?id=${idMachine}`);
      return response.data;
    },
    enabled: !!idMachine,
  });
}

export function useSensor(id?: string) {
  return useQuery({
    queryKey: sensorsKeys.detail(id as string),
    queryFn: async () => {
      const response = await api.get<Sensor>(`/sensor/find?id=${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useSensorsApi() {
  const queryClient = useQueryClient();

  const createSensor = useMutation({
    mutationFn: (data: SensorFormData) => api.post('/sensor', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sensorsKeys.all }),
  });

  const updateSensor = useMutation({
    mutationFn: (data: SensorFormData) => api.post('/sensor', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sensorsKeys.all }),
  });

  const deleteSensor = useMutation({
    mutationFn: (id: string) => api.delete(`/sensor?id=${id}`, { responseType: 'text' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sensorsKeys.all }),
  });

  return { createSensor, updateSensor, deleteSensor };
}

// Helper hooks for select components
export function useSensorsSelect(idEnterprise?: string) {
  return useQuery({
    queryKey: [...sensorsKeys.lists(idEnterprise), 'select'],
    queryFn: async () => {
      const response = await api.get<{ data: Sensor[] }>(`/sensor/list?page=0&size=999${idEnterprise ? `&idEnterprise=${idEnterprise}` : ''}`);
      return response.data.data;
    },
    enabled: !!idEnterprise,
  });
}

export function useSensorsByMachineSelect(idMachine: string | undefined) {
  return useSensorsByMachine(idMachine);
}

// Helper function to map sensors to select options
export function mapSensorsToOptions(sensors: Sensor[]): SensorSelectOption[] {
  if (!sensors || !Array.isArray(sensors)) return [];
  return sensors
    .map((sensor) => ({
      value: sensor.sensorId,
      label: sensor.sensor,
      id: sensor.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
