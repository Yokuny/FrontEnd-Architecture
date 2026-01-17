import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export const cmmsKeys = {
  all: ['cmms'] as const,
  kpis: (filters: any) => [...cmmsKeys.all, 'kpis', filters] as const,
};

export function useCMMSKPIs(filters: any) {
  // Legacy form ID for CMMS KPIs
  const FORM_ID = 'cad37398-1a88-4538-ae6c-2be7ce4377f8';

  return useQuery({
    queryKey: cmmsKeys.kpis(filters),
    queryFn: async () => {
      const response = await api.get<any[]>(`/formdata/data/${FORM_ID}`, {
        params: {
          fieldDate: 'dataAbertura',
          isNotDeletedDate: 'true',
          ...filters,
        },
      });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}

export const rveKeys = {
  all: ['rve'] as const,
  dashboard: (idEnterprise: string, filters: any) => [...rveKeys.all, 'dashboard', idEnterprise, filters] as const,
};

export function useRVEDashboard(idEnterprise: string | undefined, filters: any) {
  return useQuery({
    queryKey: rveKeys.dashboard(idEnterprise || '', filters),
    queryFn: async () => {
      const response = await api.get<any[]>(`/formdata/rvedashboard/${idEnterprise}`, { params: filters });
      return (Array.isArray(response.data) ? response.data[0] : response.data) || [];
    },
    enabled: !!idEnterprise,
  });
}
