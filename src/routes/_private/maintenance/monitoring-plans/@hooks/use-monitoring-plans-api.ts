import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { MonitoringFilterParams, MonitoringPlansResponse } from '../@interface/monitoring-plan.types';

// Query keys centralizadas
export const monitoringPlanKeys = {
  all: ['monitoring-plans'] as const,
  list: (params: MonitoringFilterParams) => [...monitoringPlanKeys.all, 'list', params] as const,
  eventSchedule: (idEnterprise: string, idMachine: string, idMaintenancePlan: string) =>
    [...monitoringPlanKeys.all, 'event-schedule', idEnterprise, idMachine, idMaintenancePlan] as const,
};

// Hook para listar planos de monitoramento
export function useMonitoringPlans(params: MonitoringFilterParams) {
  return useQuery({
    queryKey: monitoringPlanKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      queryParams.append('page', String(params.page));
      queryParams.append('size', String(params.size));

      if (params.search) {
        queryParams.append('search', params.search);
      }

      if (params.idEnterprise) {
        queryParams.append('idEnterprise', params.idEnterprise);
      }

      if (params.idMachine?.length) {
        params.idMachine.forEach((id) => queryParams.append('idMachine[]', id));
      }

      if (params.idMaintenancePlan?.length) {
        params.idMaintenancePlan.forEach((id) => queryParams.append('idMaintenancePlan[]', id));
      }

      if (params.managers?.length) {
        params.managers.forEach((id) => queryParams.append('managers[]', id));
      }

      if (params.status) {
        queryParams.append('status', params.status);
      }

      const response = await api.get<MonitoringPlansResponse>(`/maintenancemachine/monitoring?${queryParams.toString()}`);
      return response.data;
    },
    enabled: !!params.idEnterprise,
  });
}

// Hook para buscar event-schedule de um plano
export function useEventSchedule(idEnterprise: string, idMachine: string, idMaintenancePlan: string) {
  return useQuery({
    queryKey: monitoringPlanKeys.eventSchedule(idEnterprise, idMachine, idMaintenancePlan),
    queryFn: async () => {
      const response = await api.get(`/event-schedule?idEnterprise=${idEnterprise}&idMachine[]=${idMachine}&idMaintenancePlan[]=${idMaintenancePlan}`);
      return response.data;
    },
    enabled: !!idEnterprise && !!idMachine && !!idMaintenancePlan,
  });
}
