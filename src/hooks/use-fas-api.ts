import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';

export const fasKeys = {
  all: ['fas'] as const,
  suppliers: (params?: { page?: number; size?: number; search?: string }) => [...fasKeys.all, 'suppliers', params] as const,
};

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

export type { FasSupplier, FasContact, FasSupplierConfig };
