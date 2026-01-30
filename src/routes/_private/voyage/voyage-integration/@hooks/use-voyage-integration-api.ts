import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { IntegrationAsset, IntegrationVoyage, IntegrationVoyageDetail, MachineEventStatus, VoyageIntegrationListResponse } from '../@interface/voyage-integration';

export const voyageIntegrationKeys = {
  all: ['voyage-integration'] as const,
  assets: (enterpriseId: string, search?: string) => [...voyageIntegrationKeys.all, 'assets', enterpriseId, search].filter(Boolean),
  voyages: (enterpriseId: string, idMachine: string) => [...voyageIntegrationKeys.all, 'voyages', enterpriseId, idMachine],
  detail: (idVoyage: string) => [...voyageIntegrationKeys.all, 'detail', idVoyage],
  route: (idVoyage: string) => [...voyageIntegrationKeys.all, 'route', idVoyage],
  status: (idMachine: string, min?: string, max?: string) => [...voyageIntegrationKeys.all, 'status', idMachine, min, max].filter(Boolean),
};

export function useIntegrationAssets(enterpriseId: string, search?: string) {
  return useQuery({
    queryKey: voyageIntegrationKeys.assets(enterpriseId, search),
    queryFn: async () => {
      if (!enterpriseId) return [] as IntegrationAsset[];
      const queryParams = new URLSearchParams();
      queryParams.append('idEnterprise', enterpriseId);
      if (search) queryParams.append('search', search);

      const response = await api.get<IntegrationAsset[]>(`/voyageintegration/assets?${queryParams.toString()}`);
      return response.data;
    },
    enabled: !!enterpriseId,
  });
}

export function useIntegrationVoyages(enterpriseId: string, idMachine: string | null) {
  return useQuery({
    queryKey: voyageIntegrationKeys.voyages(enterpriseId, idMachine || ''),
    queryFn: async () => {
      if (!idMachine || !enterpriseId) return [] as IntegrationVoyage[];
      const queryParams = new URLSearchParams();
      queryParams.append('idEnterprise', enterpriseId);
      queryParams.append('idMachine', idMachine);
      queryParams.append('page', '0');
      queryParams.append('size', '100'); // Increase size to get more data since we filter locally in the sidebar

      const response = await api.get<VoyageIntegrationListResponse>(`/voyageintegration/list?${queryParams.toString()}`);
      return response.data.data;
    },
    enabled: !!idMachine && !!enterpriseId,
  });
}

export function useIntegrationVoyageDetail(idVoyage: string | null) {
  return useQuery({
    queryKey: voyageIntegrationKeys.detail(idVoyage || ''),
    queryFn: async () => {
      if (!idVoyage) return [] as IntegrationVoyageDetail[];
      const response = await api.get<IntegrationVoyageDetail[]>(`/voyageintegration/find?idVoyage=${idVoyage}`);
      return response.data;
    },
    enabled: !!idVoyage,
  });
}

export function useVoyageRoute(idVoyage: string | null) {
  return useQuery({
    queryKey: voyageIntegrationKeys.route(idVoyage || ''),
    queryFn: async () => {
      if (!idVoyage) return [] as any[];
      const response = await api.get<any[]>(`/voyageintegration/route?idVoyage=${idVoyage}`);
      return response.data;
    },
    enabled: !!idVoyage,
  });
}

export function useOperationalStatus(idMachine: string | null, min?: string, max?: string) {
  return useQuery({
    queryKey: voyageIntegrationKeys.status(idMachine || '', min, max),
    queryFn: async () => {
      if (!idMachine) return [] as MachineEventStatus[];
      const queryParams = new URLSearchParams();
      queryParams.append('idMachine', idMachine);
      if (min) queryParams.append('min', min);
      if (max) queryParams.append('max', max);

      const response = await api.get<MachineEventStatus[]>(`/machineevent/statusbymachine?${queryParams.toString()}`);
      return response.data;
    },
    enabled: !!idMachine,
  });
}
