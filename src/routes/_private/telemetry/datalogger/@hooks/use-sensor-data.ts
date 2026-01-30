import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import type { SensorDataSeries } from '../@interface/datalogger.types';
import { buildSensorDataQuery } from '../@utils/datalogger.utils';
import { decodeSensorTimeSeries } from '../@utils/protobuf.utils';

interface FetchSensorDataParams {
  idMachine: string;
  dateInit: string;
  dateEnd: string;
  timeInit?: string;
  timeEnd?: string;
  interval?: number;
  sensorIds: string[];
}

/**
 * Fetch sensor data from API
 */
async function fetchSensorData(params: FetchSensorDataParams): Promise<SensorDataSeries[]> {
  const query = buildSensorDataQuery(params);
  const response = await api.get<ArrayBuffer>(`/sensordata/${params.idMachine}?${query}`, {
    isV2: true,
    responseType: 'arraybuffer',
  });

  if (!response.data) {
    return [];
  }

  const buffer = new Uint8Array(response.data);
  return decodeSensorTimeSeries(buffer);
}

/**
 * Mutation hook for fetching sensor data
 */
export function useSensorDataMutation() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: fetchSensorData,
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        toast.warning(t('error.query.fields'));
      } else {
        toast.error(t('error.get'));
      }
    },
  });
}
