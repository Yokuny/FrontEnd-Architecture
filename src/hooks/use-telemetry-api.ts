import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { VesselPanelItem } from '@/routes/_private/telemetry/fleet-panel/@interface/vessel-panel.types';

export const telemetryKeys = {
  all: ['telemetry'] as const,
  panel: (enterpriseId: string, filters: { idMachines?: string[]; idModels?: string[] }) => [...telemetryKeys.all, 'panel', enterpriseId, filters] as const,
  proximity: (lat: number, lng: number) => ['proximity', lat, lng] as const,
};

export function useVesselPanelData(enterpriseId: string | null, filters: { idMachines?: string[]; idModels?: string[] }) {
  return useQuery({
    queryKey: telemetryKeys.panel(enterpriseId || '', filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.idMachines?.length) {
        params.append('idMachines', filters.idMachines.join(','));
      }
      if (filters.idModels?.length) {
        params.append('idModels', filters.idModels.join(','));
      }

      const response = await api.get<VesselPanelItem[]>(`/treesensors/enterprise/${enterpriseId}/panel?${params.toString()}`);
      return response.data;
    },
    enabled: !!enterpriseId,
    refetchInterval: 60000, // Sync with legacy polling (60s)
  });
}

export interface ProximityData {
  name: string;
  state?: {
    code: string;
  };
  country: {
    code: string;
  };
}

export function useGetProximity(latitude?: number, longitude?: number) {
  return useQuery({
    queryKey: telemetryKeys.proximity(latitude || 0, longitude || 0),
    queryFn: async (): Promise<ProximityData[] | null> => {
      if (latitude === undefined || longitude === undefined) return null;
      const response = await fetch(`https://nearby-cities.vercel.app/api/search?latitude=${latitude}&longitude=${longitude}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: latitude !== undefined && longitude !== undefined,
    staleTime: 1000 * 60 * 60, // 1 hour, location data doesn't change fast
  });
}
