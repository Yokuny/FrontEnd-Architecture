import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { MonitoringWearMachine, MonitoringWearPart } from '../@interface/monitoring-wear.types';

export const monitoringWearKeys = {
  all: ['monitoring-wear'] as const,
  list: (params: any) => [...monitoringWearKeys.all, 'list', params] as const,
  details: (idMachine: string) => [...monitoringWearKeys.all, 'details', idMachine] as const,
};

export function useMonitoringWear(params: { page: number; size: number; search?: string; idEnterprise?: string }) {
  return useQuery({
    queryKey: monitoringWearKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(params.page));
      queryParams.append('size', String(params.size));
      if (params.search) queryParams.append('search', params.search);
      if (params.idEnterprise) queryParams.append('idEnterprise', params.idEnterprise);

      const response = await api.get<{ data: MonitoringWearMachine[]; pageInfo: [{ count: number }] }>('/wearstate/monitoring/list?' + queryParams.toString());
      return response.data;
    },
    enabled: !!params.idEnterprise,
  });
}

export function useMonitoringWearDetails(idMachine: string) {
  return useQuery({
    queryKey: [...monitoringWearKeys.all, 'details', idMachine],
    queryFn: async () => {
      const response = await api.get<MonitoringWearPart[]>(`/wearstate/monitoring/machine?idMachine=${idMachine}`);
      return response.data;
    },
    enabled: !!idMachine,
  });
}
