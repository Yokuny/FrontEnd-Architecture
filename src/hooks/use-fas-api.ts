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

// ============================================
// OS ORDER HOOKS
// ============================================

import type { FasOrderDetails } from '@/routes/_private/service-management/fas/filled-os/@interface/os.schema';

/**
 * Query to fetch OS order details
 */
export function useFasOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: [...fasKeys.all, 'order', orderId],
    queryFn: async () => {
      const response = await api.get<FasOrderDetails>(`/fas/find-fas-order?id=${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });
}

/**
 * Query to fetch OS order events (timeline)
 */
export function useFasOrderEvents(orderId: string | undefined) {
  return useQuery({
    queryKey: [...fasKeys.all, 'order-events', orderId],
    queryFn: async () => {
      const response = await api.get(`/fas/order-events/find?id=${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });
}

/**
 * Mutation to confirm OS order
 */
export function useConfirmFasOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      confirmed: boolean;
      recommendedSupplier?: string;
      recommendedSupplierCount?: number;
      osRefusalReason?: string;
      osInsurance?: boolean;
      osDowntime?: boolean;
      confirmObservation?: string;
    }) => {
      const response = await api.post('/fas/confirm-fas-order', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Ordem confirmada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao confirmar ordem');
    },
  });
}

/**
 * Mutation to request FAS order (add supplier)
 */
export function useRequestFasOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      requestOrder?: string | null;
      vor?: string;
      supplierData?: Record<string, unknown>;
      reason?: string | null;
      returnOrder: boolean;
    }) => {
      const response = await api.post('/fas/request-fas-order', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Operação realizada com sucesso');
    },
    onError: () => {
      toast.error('Erro na operação');
    },
  });
}

/**
 * Mutation to confirm BMS
 */
export function useConfirmBMS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.get(`/fas/confirm-order-bms?id=${orderId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('BMS confirmado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao confirmar BMS');
    },
  });
}

/**
 * Mutation to refuse BMS
 */
export function useRefuseBMS() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; refusalReason: string }) => {
      const response = await api.post('/fas/refuse-order-bms', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('BMS recusado');
    },
    onError: () => {
      toast.error('Erro ao recusar BMS');
    },
  });
}

/**
 * Mutation to confirm payment
 */
export function useConfirmPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; paymentDate?: string; confirm: boolean; rejectInvoiceReason?: string }) => {
      const response = await api.post('/fas/confirm-payment', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Pagamento processado');
    },
    onError: () => {
      toast.error('Erro ao processar pagamento');
    },
  });
}

/**
 * Mutation to confirm contract
 */
export function useConfirmContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; confirmed: boolean; rejectContractReason?: string }) => {
      const response = await api.post('/fas/confirm-contract', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Contrato processado');
    },
    onError: () => {
      toast.error('Erro ao processar contrato');
    },
  });
}

/**
 * Mutation to confirm BMS SAP
 */
export function useConfirmBmsSap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; confirmed: boolean; rejectSapReason?: string }) => {
      const response = await api.post('/fas/confirm-bms-sap', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('SAP processado');
    },
    onError: () => {
      toast.error('Erro ao processar SAP');
    },
  });
}

/**
 * Mutation to mark order as not realized
 */
export function useOrderNotRealized() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; notRealizedReason: string }) => {
      const response = await api.post('/fas/order-not-realized', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Ordem marcada como não realizada');
    },
    onError: () => {
      toast.error('Erro ao marcar ordem');
    },
  });
}

/**
 * Mutation to cancel supplier
 */
export function useCancelSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.get(`/fas/cancel-order-supplier?id=${orderId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Fornecedor cancelado');
    },
    onError: () => {
      toast.error('Erro ao cancelar fornecedor');
    },
  });
}

/**
 * Mutation to add order attachment
 */
export function useAddOrderAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; files: File[]; supplierCanView: boolean }) => {
      const form = new FormData();
      form.append('id', params.id);
      for (const file of params.files) {
        form.append('files', file);
      }
      form.append('supplierCanView', String(params.supplierCanView));

      const response = await api.post('/fas/add-order-attachment', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Anexo adicionado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao adicionar anexo');
    },
  });
}

/**
 * Mutation to delete order attachment
 */
export function useDeleteOrderAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; fileName: string }) => {
      const response = await api.post('/fas/delete-order-attachment', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Anexo removido');
    },
    onError: () => {
      toast.error('Erro ao remover anexo');
    },
  });
}

/**
 * Mutation to edit recommended supplier
 */
export function useEditRecommendedSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; recommendedSupplier: string; recommendedSupplierCount?: number }) => {
      const response = await api.post('/fas/edit-recommended-supplier', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Fornecedor recomendado atualizado');
    },
    onError: () => {
      toast.error('Erro ao atualizar fornecedor recomendado');
    },
  });
}

/**
 * Mutation to edit recommended supplier count only
 */
export function useEditRecommendedSupplierCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; recommendedSupplierCount: number }) => {
      const response = await api.post('/fas/edit-recommended-supplier-count', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Limite de colaboradores atualizado');
    },
    onError: () => {
      toast.error('Erro ao atualizar limite');
    },
  });
}

/**
 * Mutation to edit order
 */
export function useEditOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Record<string, unknown>) => {
      const response = await api.post('/fas/edit-order', order);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Ordem atualizada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar ordem');
    },
  });
}

/**
 * Mutation to transfer order
 */
export function useTransferOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { orderId: string; destinationHeaderId: string; transferReason: string }) => {
      const response = await api.post('/fas/transfer-order', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Ordem transferida com sucesso');
    },
    onError: () => {
      toast.error('Erro ao transferir ordem');
    },
  });
}

/**
 * Mutation to cancel order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; item: string; cancelReason: string }) => {
      const response = await api.post('/fas/cancel-item', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Ordem cancelada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao cancelar ordem');
    },
  });
}

/**
 * Mutation to add buy request
 */
export function useAddOrderBuyRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; buyRequest: string }) => {
      const response = await api.post('/fas/add-order-buyreq', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Solicitação de compra adicionada');
    },
    onError: () => {
      toast.error('Erro ao adicionar solicitação');
    },
  });
}

/**
 * Get invoice URL
 */
export function useFasInvoice() {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.get<{ invoiceUrl: string }>(`/fas/invoice?id=${orderId}`);
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.invoiceUrl) {
        window.open(data.invoiceUrl);
      }
    },
    onError: () => {
      toast.error('Erro ao baixar nota fiscal');
    },
  });
}

/**
 * Get presigned URL for attachments
 */
export function useFasPresignedUrl() {
  return useMutation({
    mutationFn: async (params: { location: string }) => {
      const response = await api.post<{ url: string }>('/fas/presignedbylocation', params);
      return response.data;
    },
  });
}

export type { FasSupplier, FasContact, FasSupplierConfig };

// ============================================
// FAS HEADER (DETAILS) HOOKS
// ============================================

export interface FasDetailsData {
  id: string;
  type: string;
  serviceDate: string;
  local?: string;
  teamChange?: boolean;
  enterprise?: {
    id: string;
    name: string;
  };
  vessel?: {
    id: string;
    name: string;
    image?: { url: string };
  };
  orders?: FasDetailsOrder[];
  events?: FasEvent[];
}

export interface FasDetailsOrder {
  id: string;
  index?: string;
  name: string;
  job?: string;
  description?: string;
  materialFas?: string;
  onboardMaterial?: string;
  rmrb?: string;
  state: string;
  supplierData?: {
    razao?: string;
    cancelled?: boolean;
    addedBy?: string;
  };
  recommendedSupplier?: string;
}

export interface FasEvent {
  id: string;
  type: string;
  createdAt: string;
}

/**
 * Query to fetch FAS details (header + orders)
 */
export function useFasDetails(fasId: string | undefined, idEnterprise?: string) {
  return useQuery({
    queryKey: [...fasKeys.all, 'details', fasId, idEnterprise],
    queryFn: async () => {
      const response = await api.get<FasDetailsData>(`/fas/find?id=${fasId}&idEnterprise=${idEnterprise}`);

      // Sort orders by name and add index
      const ordersWithIndex =
        response.data?.orders
          ?.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          ?.map((order, index) => ({
            ...order,
            index: `${index + 1}`,
          })) || [];

      // Fetch FAS events
      const eventsResponse = await api.get<FasEvent[]>(`/fas/fas-events/find?id=${fasId}`);

      return {
        ...response.data,
        orders: ordersWithIndex,
        events: eventsResponse.data || [],
      };
    },
    enabled: !!(fasId && idEnterprise),
  });
}

/**
 * Mutation to update FAS header fields (serviceDate, local)
 */
export function useUpdateFasFields() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; serviceDate?: string; local?: string }) => {
      const response = await api.post('/fas/edit-fas', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('FAS atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar FAS');
    },
  });
}

/**
 * Mutation to add order to FAS
 */
export function useAddFasOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; orders: Array<Record<string, unknown>> }) => {
      const response = await api.post('/fas/add-fas-order', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('Serviço adicionado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao adicionar serviço');
    },
  });
}

/**
 * Mutation to cancel FAS (header level)
 */
export function useCancelFas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; cancelReason: string }) => {
      const response = await api.post('/fas/cancel-item', {
        id: params.id,
        item: 'fas',
        cancelReason: params.cancelReason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fasKeys.all });
      toast.success('FAS cancelado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao cancelar FAS');
    },
  });
}

/**
 * Check if FAS exists for same vessel/date combination
 */
export function useCheckFasExists() {
  return useMutation({
    mutationFn: async (params: { dateOnly: string; idVessel: string; type: string; notId?: string; timezone?: string }) => {
      const queryParams = new URLSearchParams();
      queryParams.append('dateOnly', params.dateOnly);
      queryParams.append('idVessel', params.idVessel);
      queryParams.append('type', params.type);
      if (params.notId) queryParams.append('notId', params.notId);
      if (params.timezone) queryParams.append('timezone', params.timezone);

      const response = await api.get<{ fasExists: boolean }>(`/fas/exists-validation?${queryParams.toString()}`);
      return response.data;
    },
  });
}
