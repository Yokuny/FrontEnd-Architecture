import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export const statisticsKeys = {
  all: ['statistics'] as const,
  timeOperation: (filters: any) => [...statisticsKeys.all, 'time-operation', filters] as const,
  fleetStatus: (idEnterprise?: string) => [...statisticsKeys.all, 'fleet-status', { idEnterprise }] as const,
};

// --- Time Operation ---

export interface TimeOperationData {
  machine: {
    id: string;
    name: string;
  };
  listTimeStatus: {
    status: string;
    minutes: number;
    distance: number;
    [key: string]: any;
  }[];
  [key: string]: any; // For dynamic status percentages
}

export function useTimeOperation(filters: any) {
  return useQuery({
    queryKey: statisticsKeys.timeOperation(filters),
    queryFn: async () => {
      const response = await api.get<TimeOperationData[]>('/machineevent/statustime', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise && !!filters.min && !!filters.max,
  });
}

export function useTimeOperationDetails(idMachine: string | undefined, filters: any) {
  return useQuery({
    queryKey: [...statisticsKeys.timeOperation(filters), 'detail', idMachine],
    queryFn: async () => {
      const response = await api.get(`/machineevent/${idMachine}/kpis`, { params: filters });
      return response.data;
    },
    enabled: !!idMachine && !!filters.min && !!filters.max,
  });
}

// --- Fleet Status (Integration) ---

export interface FleetStatusData {
  name: string;
  date: string;
  createAt?: string;
  dataSheet?: {
    imo?: string;
    mmsi?: string;
    image?: { url: string };
  };
  eta?: string;
  destiny?: string;
  integration?: string;
  typeIntegration?: string;
  extra?: {
    api?: string;
  };
  image?: {
    url?: string;
  };
  [key: string]: any;
}

export function useFleetStatusList(idEnterprise?: string) {
  return useQuery({
    queryKey: statisticsKeys.fleetStatus(idEnterprise),
    queryFn: async () => {
      const response = await api.get<FleetStatusData[]>('/travel/fleet/status', {
        params: { idEnterprise },
      });
      return response.data;
    },
    enabled: !!idEnterprise,
  });
}
