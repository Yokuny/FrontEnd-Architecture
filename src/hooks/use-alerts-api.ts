import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { AlertFormData, AlertRule } from '../routes/_private/register/alerts/@interface/alert';

export interface AlertsSearchParams {
  page?: number;
  size?: number;
  search?: string;
  idEnterprise?: string;
}

export interface AlertsListResponse {
  data: AlertRule[];
  pageInfo: Array<{
    count: number;
    page: number;
    size: number;
  }>;
}

async function fetchAlerts(params: AlertsSearchParams): Promise<AlertsListResponse> {
  const { data } = await api.get<AlertsListResponse>('/alertrule/list', { params });
  return data;
}

async function fetchMinMaxVessels(idEnterprise: string): Promise<any[]> {
  const { data } = await api.get(`/sensorminmax/filled/${idEnterprise}`);
  return data as any[];
}

async function fetchAlert(id: string): Promise<AlertRule> {
  const { data } = await api.get<AlertRule>(`/alertrule`, { params: { id } });
  return data;
}

async function createUpdateAlert(alert: AlertFormData): Promise<AlertRule> {
  const { data } = await api.post<AlertRule>('/alertrule', alert);
  return data;
}

async function deleteAlert(id: string): Promise<void> {
  await api.delete('/alertrule', { params: { id } });
}

export function useAlertsPaginated(params: AlertsSearchParams) {
  return useQuery({
    queryKey: ['alerts', params],
    queryFn: () => fetchAlerts(params),
    placeholderData: (previousData) => previousData,
    enabled: !!params.idEnterprise,
  });
}

export function useAlert(id: string | null) {
  return useQuery({
    queryKey: ['alert', id],
    queryFn: () => fetchAlert(id!),
    enabled: !!id,
  });
}

export function useAlertsApi() {
  const queryClient = useQueryClient();

  const createUpdate = useMutation({
    mutationFn: createUpdateAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  return {
    createUpdate,
    remove,
  };
}

export function useMinMaxVessels(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: ['min-max-vessels', idEnterprise],
    queryFn: () => fetchMinMaxVessels(idEnterprise || ''),
    enabled: !!idEnterprise,
  });
}
