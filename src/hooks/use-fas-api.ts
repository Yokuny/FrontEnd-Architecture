import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';

export const fasKeys = {
  all: ['fas'] as const,
  suppliers: (params?: { page?: number; size?: number; search?: string }) => [...fasKeys.all, 'suppliers', params] as const,
  list: (params?: unknown) => [...fasKeys.all, 'list', params] as const,
};

// ... existing interfaces ...

interface FasSupplier {
  razao: string;
  codigoFornecedor: number;
  contacts: FasContact[];
  supplierConfig?: FasSupplierConfig;
}

interface FasContact {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'default';
}

interface FasSupplierConfig {
  id: string;
  validateContract: boolean;
}

interface FasSuppliersPaginatedResponse {
  data: FasSupplier[];
  pageInfo: Array<{ count: number }>;
}

import type { FasPaginatedResponse, FasSearch } from '@/routes/_private/service-management/fas/@interface/fas.schema';

export function useFasPaginated(params: FasSearch) {
  return useQuery({
    queryKey: fasKeys.list(params),
    queryFn: async () => {
      const response = await api.get<FasPaginatedResponse>('/fas/list/filter-os', { params });
      return response.data;
    },
    enabled: !!params.idEnterprise,
  });
}

export function useExportFas() {
  return useMutation({
    mutationFn: async (params: { idEnterprise: string; dateStart: string; dateEnd: string }) => {
      const response = await api.get<Blob>('/fas/export-fas-csv', {
        params,
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Export completed successfully');
    },
    onError: () => {
      toast.error('Error exporting data');
    },
  });
}

export function useFasSuppliersPaginated(params: { page: number; size: number; search?: string }) {
  return useQuery({
    queryKey: fasKeys.suppliers(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(params.page));
      queryParams.append('size', String(params.size));
      if (params.search) {
        queryParams.append('text', params.search);
      }

      const response = await api.get<FasSuppliersPaginatedResponse>(`/fas/list-suppliers?${queryParams.toString()}`);
      return response.data;
    },
  });
}

export function useUpdateSupplierRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: 'admin' | 'default' }) => {
      const response = await api.put('/fas/set-supplier-role', { id, role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.suppliers() });
      toast.success('Função atualizada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar função');
    },
  });
}

export function useUpdateSupplierConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, validateContract }: { id: string; validateContract: boolean }) => {
      const response = await api.put(`/fas/fassupplierconfig/${id}`, { validateContract });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.suppliers() });
      toast.success('Configuração atualizada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar configuração');
    },
  });
}

export function useCreateSupplierConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ razao, codigoFornecedor, validateContract }: { razao: string; codigoFornecedor: number; validateContract: boolean }) => {
      const response = await api.post('/fas/fassupplierconfig', { razao, codigoFornecedor, validateContract });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.suppliers() });
      toast.success('Configuração criada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao criar configuração');
    },
  });
}

export function useOpenFas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fas: any) => {
      const response = await api.post('/fas/open-fas', fas);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('FAS aberto com sucesso');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao abrir FAS';
      toast.error(message);
    },
  });
}

export function useFasExistsValidation(params: { dateOnly?: string; idVessel?: string; type?: string; timezone?: string }) {
  return useQuery({
    queryKey: [...fasKeys.all, 'exists-validation', params],
    queryFn: async () => {
      const response = await api.get<{ fasExists: boolean }>('/fas/exists-validation', { params });
      return response.data;
    },
    enabled: !!(params.dateOnly && params.idVessel && params.type),
  });
}

export function useFasOsExistsValidation(params: { search?: string; idEnterprise?: string; notId?: string }) {
  return useQuery({
    queryKey: [...fasKeys.all, 'os-exists-validation', params],
    queryFn: async () => {
      const response = await api.get<{ osExists: boolean }>('/fas/list/filter-os-create-validation', { params });
      return response.data;
    },
    enabled: !!(params.search && params.idEnterprise),
  });
}

export type { FasSupplier, FasContact, FasSupplierConfig };
