import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { FleetMachine, FleetVoyagesResponse } from '../@interface/fleet-api';
import type { FleetPositionsCollection } from '../@interface/protobuf';
import { decodeFleetPositions } from './protobuf-utils';

// API functions
async function fetchFleetMachines(params: { idEnterprise: string; search?: string; idModels?: string[]; idMachines?: string[] }) {
  const queryParams = new URLSearchParams();
  queryParams.append('idEnterprise', params.idEnterprise);
  if (params.search) queryParams.append('search', params.search);
  params.idModels?.forEach((id) => {
    queryParams.append('idModel[]', id);
  });
  params.idMachines?.forEach((id) => {
    queryParams.append('idMachine[]', id);
  });

  const { data } = await api.get<FleetMachine[]>(`/travel/machinelist?${queryParams.toString()}`);
  return data;
}

async function fetchFleetPositions(idMachines: string[], idEnterprise: string): Promise<FleetPositionsCollection> {
  const response = await api.post('/fleet/lastpositions', { idAssets: idMachines, idEnterprise }, { responseType: 'arraybuffer' });
  return decodeFleetPositions(new Uint8Array(response.data as ArrayBuffer));
}

async function fetchFleetVoyages(params: { idEnterprise: string; search?: string; page?: number; size?: number; idMachines?: string[] }) {
  const queryParams = new URLSearchParams();
  queryParams.append('idEnterprise', params.idEnterprise);
  queryParams.append('travelType', 'travel');
  queryParams.append('page', (params.page || 0).toString());
  queryParams.append('size', (params.size || 15).toString());
  if (params.search) queryParams.append('search', params.search);
  params.idMachines?.forEach((id) => {
    queryParams.append('idMachine[]', id);
  });

  const { data } = await api.get<FleetVoyagesResponse>(`/travel/list?${queryParams.toString()}`);
  return data;
}

async function fetchMachineDetails(idMachine: string) {
  const { data } = await api.get(`/travel/machine?idMachine=${idMachine}`);
  return data;
}

async function fetchVoyageDetails(idVoyage: string) {
  const { data } = await api.get(`/travel/details?id=${idVoyage}`);
  return data;
}

// Hooks
export function useFleetMachines(params: { idEnterprise: string | undefined; search?: string; idModels?: string[]; idMachines?: string[] }) {
  return useQuery({
    queryKey: ['fleet', 'machines', params],
    queryFn: () => fetchFleetMachines(params as any),
    enabled: !!params.idEnterprise,
    refetchInterval: 120000, // 2 minutes polling as per legacy
  });
}

export function useFleetPositions(idMachines: string[], idEnterprise: string | undefined) {
  return useQuery({
    queryKey: ['fleet', 'positions', idMachines, idEnterprise],
    queryFn: () => {
      if (!idEnterprise) throw new Error('idEnterprise is required');
      return fetchFleetPositions(idMachines, idEnterprise);
    },
    enabled: !!idEnterprise && idMachines.length > 0,
    refetchInterval: 60000, // Sync positions every minute
  });
}

export function useFleetVoyages(params: { idEnterprise: string | undefined; search?: string; page?: number; size?: number; idMachines?: string[] }) {
  return useQuery({
    queryKey: ['fleet', 'voyages', params],
    queryFn: () => fetchFleetVoyages(params as any),
    enabled: !!params.idEnterprise,
  });
}

export function useMachineDetails(idMachine: string | null) {
  return useQuery({
    queryKey: ['fleet', 'machine-details', idMachine],
    queryFn: () => {
      if (!idMachine) throw new Error('idMachine is required');
      return fetchMachineDetails(idMachine);
    },
    enabled: !!idMachine,
  });
}

export function useVoyageDetails(idVoyage: string | null) {
  return useQuery({
    queryKey: ['fleet', 'voyage-details', idVoyage],
    queryFn: () => {
      if (!idVoyage) throw new Error('idVoyage is required');
      return fetchVoyageDetails(idVoyage);
    },
    enabled: !!idVoyage,
  });
}

export function useFleetCrew(idMachine: string | null, idEnterprise?: string) {
  return useQuery({
    queryKey: ['fleet', 'crew', idMachine, idEnterprise],
    queryFn: async () => {
      if (!idMachine || !idEnterprise) return null;
      const response = await api.get(`/crew?idMachine=${idMachine}&idEnterprise=${idEnterprise}`);
      return response.data;
    },
    enabled: !!idMachine && !!idEnterprise,
  });
}

export function useFleetConsume(idMachine: string | null) {
  return useQuery({
    queryKey: ['fleet', 'consume', idMachine],
    queryFn: async () => {
      if (!idMachine) return null;
      const response = await api.get(`/fleet/consume/machine?idMachine=${idMachine}`);
      return response.data;
    },
    enabled: !!idMachine,
  });
}

export function useMachineDatasheet(idMachine: string | null) {
  return useQuery({
    queryKey: ['fleet', 'datasheet', idMachine],
    queryFn: async () => {
      if (!idMachine) return null;
      const response = await api.get(`/machine/datasheet?id=${idMachine}`);
      return response.data;
    },
    enabled: !!idMachine,
  });
}

export function useMapApiConfig() {
  return useQuery({
    queryKey: ['fleet', 'map-api-config'],
    queryFn: async () => {
      const response = await api.get<{ isConfigured: boolean; token?: string }>('/setupenterprise/findapimap');
      return response.data;
    },
  });
}

export function useFleetHistory({ idMachine, min, max, hours, interval = 1 }: { idMachine?: string; min?: string; max?: string; hours?: number; interval?: number }) {
  return useQuery({
    queryKey: ['fleet', 'history', idMachine, min, max, hours, interval],
    queryFn: async () => {
      if (!idMachine) return [];
      const query = new URLSearchParams();
      query.set('idMachine', idMachine);
      if (min) query.set('min', min);
      if (max) query.set('max', max);
      if (!min && !max) query.set('hours', (hours ?? 12).toString());
      query.set('interval', interval.toString());

      const response = await api.get<any[]>(`/sensorstate/fleet/historyposition/details?${query.toString()}`);
      return response.data || [];
    },
    enabled: !!idMachine,
  });
}

export function useRegionPlayback({ hours = 5, idEnterprise }: { hours?: number; idEnterprise?: string }) {
  return useQuery({
    queryKey: ['fleet', 'region-playback', hours, idEnterprise],
    queryFn: async () => {
      const query = new URLSearchParams();
      query.set('hours', hours.toString());
      if (idEnterprise) query.set('idEnterprise', idEnterprise);

      const response = await api.get<any[]>(`/regiondata/playback?${query.toString()}`);
      return (response.data || []).sort((a: any, b: any) => a[0] - b[0]);
    },
  });
}
