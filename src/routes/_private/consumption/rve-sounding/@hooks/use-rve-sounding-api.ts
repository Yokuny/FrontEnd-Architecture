import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Asset, NormalizedData, Operation, RDO, RVESoundingDashboardResponse, Sounding } from '../@interface/rve-sounding.types';

export const rveSoundingKeys = {
  all: ['rve-sounding'] as const,
  dashboard: (filters: Record<string, any>) => [...rveSoundingKeys.all, 'dashboard', filters] as const,
};

export function useRVESoundingDashboard(idEnterprise?: string, machines?: string, dateStart?: string, dateEnd?: string) {
  return useQuery({
    queryKey: rveSoundingKeys.dashboard({ idEnterprise, machines, dateStart, dateEnd }),
    queryFn: async (): Promise<NormalizedData> => {
      const params = new URLSearchParams();
      if (idEnterprise) params.append('idEnterprise', idEnterprise);
      if (machines) params.append('machines', machines);
      if (dateStart) params.append('dateStart', dateStart);
      if (dateEnd) params.append('dateEnd', dateEnd);

      const response = await api.get<RVESoundingDashboardResponse>(`/formdata/dashboardrvesounding?${params.toString()}`);
      const { data } = response;

      const assets: Asset[] =
        data.assets?.map((item) => ({
          id: item[0],
          name: item[1],
          image: { url: item[2] },
        })) || [];

      const operations: Operation[] =
        data.operations?.map((item) => ({
          code: item[0],
          idAsset: item[1],
          dateStart: new Date(item[2] * 1000),
          dateEnd: new Date(item[3] * 1000),
          consumptionDailyContract: item[0]?.slice(0, 2) === 'IN' ? 0 : item[4],
        })) || [];

      const sounding: Sounding[] = (
        data.sounding?.map((item) => ({
          idAsset: item[0],
          date: new Date(item[1] * 1000),
          volume: item[2],
        })) || []
      ).sort((a, b) => a.date.getTime() - b.date.getTime());

      const rdo: RDO[] =
        data.rdo?.map((item) => ({
          idAsset: item[0],
          date: new Date(item[1] * 1000),
          received: item[2] || 0,
          supply: item[3] || 0,
        })) || [];

      return {
        assets,
        operations,
        sounding,
        rdo,
      };
    },
    enabled: !!idEnterprise,
  });
}
