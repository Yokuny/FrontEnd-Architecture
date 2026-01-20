import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { api } from '@/lib/api/client';
import type { OperationalAssetSearch } from '../@interface/operational-asset.types';
import { processChartData } from '../@services/operational-asset.service';

export function useOperationalAsset(idEnterprise: string, filter: OperationalAssetSearch) {
  return useQuery({
    queryKey: ['operational-asset', idEnterprise, filter],
    queryFn: async () => {
      if (!idEnterprise) return null;

      const params = new URLSearchParams();
      params.append('idEnterprise', idEnterprise);
      params.append('timezone', format(new Date(), 'xxx'));

      if (filter.dateStart) {
        params.append('initialDate', `${filter.dateStart}T00:00:00.000${format(new Date(), 'xxx')}`);
      }
      if (filter.dateEnd) {
        params.append('finalDate', `${filter.dateEnd}T23:59:59.999${format(new Date(), 'xxx')}`);
      }
      if (filter.idMachine) {
        params.append('idMachine', filter.idMachine);
      }

      const response = await api.get(`/assetstatus/chartdata?${params.toString()}`);

      return processChartData(response.data as any[][], filter.dateEnd);
    },
    enabled: !!idEnterprise,
  });
}
