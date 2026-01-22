import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { TimeOperationResponse } from '../@interface/time-operation.types';

export function useTimeOperationDashboard(idEnterprise?: string, machines?: string, dateMin?: string, dateMax?: string, isShowDisabled = false, unit = 'm³') {
  return useQuery({
    queryKey: ['consumption-time-operation', idEnterprise, machines, dateMin, dateMax, isShowDisabled, unit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (idEnterprise) params.append('idEnterprise', idEnterprise);

      if (machines) {
        machines.split(',').forEach((id) => {
          params.append('idMachine[]', id);
        });
      }

      if (dateMin) params.append('min', dateMin);
      if (dateMax) params.append('max', dateMax);

      params.append('isShowDisabled', String(isShowDisabled));
      params.append('unit', unit);

      const response = await api.get<TimeOperationResponse>(`/machineevent/dailyevents?${params.toString()}`);

      return response.data?.dataReturn || [];
    },
    enabled: !!idEnterprise && !!dateMin && !!dateMax,
  });
}
