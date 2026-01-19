import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { PtaxFormData } from '@/routes/_private/operation/ptax/@interface/ptax.schema';

export const ptaxKeys = {
  all: ['ptax'] as const,
  lists: (idEnterprise: string) => [...ptaxKeys.all, 'list', idEnterprise] as const,
};

export interface PtaxListResponse {
  data: any[];
  pageInfo?: Array<{ count: number }>;
}

export function usePtax(params: { idEnterprise: string; search?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: [...ptaxKeys.lists(params.idEnterprise), params],
    queryFn: async () => {
      if (!params.idEnterprise) return { data: [] };

      const queryParams = new URLSearchParams();
      queryParams.append('idEnterprise', params.idEnterprise);
      if (params.search) queryParams.append('search', params.search);
      if (params.page !== undefined) queryParams.append('page', String(params.page));
      if (params.size !== undefined) queryParams.append('size', String(params.size));

      const response = await api.get(`/ptax?${queryParams.toString()}`);

      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          pageInfo: [{ count: response.data.length }],
        } as PtaxListResponse;
      }

      return response.data as PtaxListResponse;
    },
    enabled: !!params.idEnterprise,
  });
}

export function usePtaxApi() {
  const queryClient = useQueryClient();

  const createPtax = useMutation({
    mutationFn: (data: PtaxFormData) => api.post('/ptax', data),
    onSuccess: (_, variables) => {
      if (variables.idEnterprise) {
        queryClient.invalidateQueries({ queryKey: ptaxKeys.lists(variables.idEnterprise) });
      }
    },
  });

  const updatePtax = useMutation({
    mutationFn: (data: PtaxFormData) => api.put(`/ptax/${data.id}`, data),
    onSuccess: (_, variables) => {
      if (variables.idEnterprise) {
        queryClient.invalidateQueries({ queryKey: ptaxKeys.lists(variables.idEnterprise) });
      }
    },
  });

  const deletePtax = useMutation({
    mutationFn: ({ id }: { id: string; idEnterprise: string }) => api.delete(`/ptax/${id}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ptaxKeys.lists(variables.idEnterprise) });
    },
  });

  return { createPtax, updatePtax, deletePtax };
}
