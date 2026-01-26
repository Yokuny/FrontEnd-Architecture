import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { formatDate } from '@/lib/formatDate';
import type { ConsumptionIntervalData } from '../@interface/consumption-interval.types';

export const consumptionIntervalKeys = {
  all: ['consumption-interval'] as const,
  list: (params: ConsumptionIntervalQueryParams) => [...consumptionIntervalKeys.all, 'list', params] as const,
};

export function useConsumptionIntervalData(params: ConsumptionIntervalQueryParams) {
  return useQuery({
    queryKey: consumptionIntervalKeys.list(params),
    queryFn: async () => {
      const queryParams: string[] = [];

      if (params.dateMin) {
        queryParams.push(`dateMin=${formatDate(params.dateMin, "yyyy-MM-dd'T'00:00:00'Z'")}`);
      }

      if (params.dateMax) {
        queryParams.push(`dateMax=${formatDate(params.dateMax, "yyyy-MM-dd'T'23:59:59'Z'")}`);
      }

      if (params.unit) {
        queryParams.push(`unit=${params.unit}`);
      }

      if (params.idEnterprise) {
        queryParams.push(`idEnterprise=${params.idEnterprise}`);
      }

      if (params.machines?.length) {
        params.machines.forEach((id) => {
          queryParams.push(`idMachine[]=${id}`);
        });
      }

      const response = await api.get<ConsumptionIntervalData[]>(`/consumption?${queryParams.join('&')}`);
      return response.data || [];
    },
    enabled: !!params.idEnterprise && !!params.dateMin && !!params.dateMax,
  });
}

export interface ConsumptionIntervalQueryParams {
  machines?: string[];
  dateMin?: Date;
  dateMax?: Date;
  unit?: string;
  idEnterprise?: string;
}
