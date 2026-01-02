import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface TypeSensor {
  id: string;
  description: string;
}

export interface PartByMachine {
  id: string;
  name: string;
  sku: string;
}

export interface SensorByEnterprise {
  id: string;
  sensorId: string;
  sensor: string;
}

// Query keys
export const typeSensorsKeys = {
  all: ['type-sensors'] as const,
  byEnterprise: (id: string) => [...typeSensorsKeys.all, 'enterprise', id] as const,
};

export const partsByMachineKeys = {
  all: ['parts-by-machine'] as const,
  byMachine: (id: string) => [...partsByMachineKeys.all, 'machine', id] as const,
};

export const sensorsByEnterpriseKeys = {
  all: ['sensors-by-enterprise'] as const,
  byEnterprise: (id: string) => [...sensorsByEnterpriseKeys.all, 'enterprise', id] as const,
};

// API functions
async function fetchTypeSensorsByEnterprise(idEnterprise: string): Promise<TypeSensor[]> {
  const response = await api.get<TypeSensor[]>(`/typesensor?idEnterprise=${idEnterprise}`);
  return response.data;
}

async function fetchPartsByMachine(idMachine: string): Promise<PartByMachine[]> {
  const response = await api.get<PartByMachine[]>(`/part/machine?idMachine=${idMachine}`);
  return response.data;
}

async function fetchSensorsByEnterprise(idEnterprise: string): Promise<SensorByEnterprise[]> {
  const response = await api.get<SensorByEnterprise[]>(`/sensor?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function useTypeSensorsByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: typeSensorsKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchTypeSensorsByEnterprise(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

export function usePartsByMachine(idMachine: string | undefined) {
  return useQuery({
    queryKey: partsByMachineKeys.byMachine(idMachine || ''),
    queryFn: () => {
      if (!idMachine) return Promise.resolve([]);
      return fetchPartsByMachine(idMachine);
    },
    enabled: !!idMachine,
  });
}

export function useSensorsByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: sensorsByEnterpriseKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchSensorsByEnterprise(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hooks
export function useTypeSensorsSelect(idEnterprise: string | undefined) {
  return useTypeSensorsByEnterprise(idEnterprise);
}

export function usePartsByMachineSelect(idMachine: string | undefined) {
  return usePartsByMachine(idMachine);
}

export function useSensorsByEnterpriseSelect(idEnterprise: string | undefined) {
  return useSensorsByEnterprise(idEnterprise);
}

// Mapping functions
export function mapTypeSensorsToOptions(types: TypeSensor[]) {
  return types
    .map((type) => ({
      value: type.id,
      label: type.description,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function mapPartsByMachineToOptions(parts: PartByMachine[]) {
  return parts.map((part) => ({
    value: part.id,
    label: `${part.name} (${part.sku})`,
  }));
}

export function mapSensorsByEnterpriseToOptions(sensors: SensorByEnterprise[]) {
  return sensors
    .map((sensor) => ({
      value: sensor.sensorId,
      label: sensor.sensor,
      id: sensor.id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
