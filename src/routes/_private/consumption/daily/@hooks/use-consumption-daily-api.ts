import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import type { ConsumptionDailyData, UpdateOilPayload, UpdatePollingPayload } from '../@interface/consumption-daily.types';

export const consumptionDailyKeys = {
  all: ['consumption-daily'] as const,
  list: (params: ConsumptionDailyQueryParams) => [...consumptionDailyKeys.all, 'list', params] as const,
};

export function useConsumptionDailyData(params: ConsumptionDailyQueryParams) {
  return useQuery({
    queryKey: consumptionDailyKeys.list(params),
    queryFn: async () => {
      if (!params.idMachine) {
        return [];
      }

      const queryParams: string[] = [];

      if (params.dateMin) {
        queryParams.push(`min=${format(params.dateMin, "yyyy-MM-dd'T'00:00:00'Z'")}`);
      }

      if (params.dateMax) {
        queryParams.push(`max=${format(params.dateMax, "yyyy-MM-dd'T'23:59:59'Z'")}`);
      }

      if (params.unit) {
        queryParams.push(`unit=${params.unit}`);
      }

      if (params.idEnterprise) {
        queryParams.push(`idEnterprise=${params.idEnterprise}`);
      }

      const response = await api.get<ConsumptionDailyData[]>(`/consumption/daily/${params.idMachine}?${queryParams.join('&')}`);

      return (response.data || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    enabled: !!params.idMachine,
  });
}

export function useConsumptionDailyApi() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const updateOilMoving = useMutation({
    mutationFn: async (payload: UpdateOilPayload) => {
      const response = await api.put('/consumption/update-oil-moving', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consumptionDailyKeys.all });
      toast.success(t('save.success'));
    },
    onError: () => {
      toast.error(t('error.save'));
    },
  });

  const updatePolling = useMutation({
    mutationFn: async (payload: UpdatePollingPayload) => {
      const response = await api.put('/consumption/update-polling', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consumptionDailyKeys.all });
      toast.success(t('save.success'));
    },
    onError: () => {
      toast.error(t('error.save'));
    },
  });

  return {
    updateOilMoving,
    updatePolling,
  };
}

export interface ConsumptionDailyQueryParams {
  idMachine: string;
  dateMin?: Date;
  dateMax?: Date;
  unit?: string;
  idEnterprise?: string;
}
