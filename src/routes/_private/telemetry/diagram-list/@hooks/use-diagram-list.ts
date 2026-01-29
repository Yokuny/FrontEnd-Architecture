import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { DiagramListResponse } from '../@interface/diagram.types';

export const diagramKeys = {
  all: ['diagrams'] as const,
  list: (idEnterprise: string, page: number, search?: string) => [...diagramKeys.all, 'list', { idEnterprise, page, search }] as const,
};

export function useDiagramList(idEnterprise: string | undefined, page = 0, size = 20, search?: string) {
  return useQuery({
    queryKey: diagramKeys.list(idEnterprise || '', page, search),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('size', String(size));
      if (idEnterprise) params.append('idEnterprise', idEnterprise);
      if (search) params.append('search', search);

      const response = await api.get<DiagramListResponse>(`/machine/plant/list?${params.toString()}`);
      return {
        data: response.data.data || [],
        totalCount: response.data.pageInfo?.[0]?.count || 0,
      };
    },
    enabled: !!idEnterprise,
  });
}
