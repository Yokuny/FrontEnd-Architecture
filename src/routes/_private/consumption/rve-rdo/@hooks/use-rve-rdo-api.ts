import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { RVERDOData } from '../@interface/rve-rdo.types';

export const rveRdoKeys = {
  all: ['rve-rdo'] as const,
  dashboard: (params: any) => [...rveRdoKeys.all, 'dashboard', params] as const,
};

export function useRVERDOData(params: RVERDOQueryParams) {
  return useQuery({
    queryKey: rveRdoKeys.dashboard(params),
    queryFn: async () => {
      const queryParams: string[] = [];

      if (params.idEnterprise) {
        queryParams.push(`idEnterprise=${params.idEnterprise}`);
      }
      if (params.machines) {
        queryParams.push(`machines=${params.machines}`);
      }
      if (params.dateStart) {
        queryParams.push(`dateStart=${params.dateStart}`);
      }
      if (params.dateEnd) {
        queryParams.push(`dateEnd=${params.dateEnd}`);
      }

      const response = await api.get<any>(`/formdata/dashboardrverdo?${queryParams.join('&')}`);

      const data = response.data;
      if (!data.operations?.length) {
        return {
          operations: [],
          assets: [],
          rdo: [],
        } as RVERDOData;
      }

      const showInoperabilities = params.showInoperabilities;

      return {
        operations: data.operations.map((item: any) => ({
          code: item[0],
          idAsset: item[1],
          dateStart: new Date(item[2] * 1000),
          dateEnd: new Date(item[3] * 1000),
          consumptionDailyContract: !showInoperabilities && item[0]?.slice(0, 2) === 'IN' ? 0 : item[4],
        })),
        assets: data.assets.map((item: any) => ({
          id: item[0],
          name: item[1],
          image: { url: item[2] },
        })),
        rdo: data.rdo.map((item: any) => ({
          idAsset: item[0],
          date: new Date(item[1] * 1000),
          consumptionEstimated: item[2],
        })),
      } as RVERDOData;
    },
    enabled: !!params.idEnterprise && !!params.dateStart && !!params.dateEnd,
  });
}

export interface RVERDOQueryParams {
  idEnterprise?: string;
  machines?: string;
  dateStart?: string;
  dateEnd?: string;
  showInoperabilities?: boolean;
}
