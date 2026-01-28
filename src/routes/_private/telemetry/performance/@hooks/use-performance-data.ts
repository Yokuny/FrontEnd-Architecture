import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import type { PerformanceData } from '../@interface/performance.types';

interface FetchPerformanceDataParams {
  idMachine: string;
  sensorXId: string;
  sensorYIds: string[];
  lastDays: number;
}

/**
 * Build query string for performance data API
 */
function buildPerformanceQuery(params: FetchPerformanceDataParams): string {
  const query: string[] = [];

  // X sensor
  query.push(`idSensor[]=${params.sensorXId}`);

  // Y sensors
  for (const id of params.sensorYIds) {
    query.push(`idSensor[]=${id}`);
  }

  // Period
  query.push(`lastDays=${params.lastDays}`);

  return query.join('&');
}

/**
 * Fetch performance data from API
 */
async function fetchPerformanceData(params: FetchPerformanceDataParams): Promise<PerformanceData> {
  const query = buildPerformanceQuery(params);
  const response = await api.get<PerformanceData>(`/sensordata/${params.idMachine}?${query}`, {
    isV2: true,
  });

  return response.data || { data: [] };
}

/**
 * Mutation hook for fetching performance data
 */
export function usePerformanceDataMutation() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: fetchPerformanceData,
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        toast.warning(t('error.query.fields'));
      } else {
        toast.error(t('error.get'));
      }
    },
  });
}
