import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export interface Geofence {
  id: string;
  name: string;
  color: string;
  location: {
    type: string;
    coordinates: [number, number][];
    geometry?: {
      type: string;
      coordinates: [number, number];
    };
    properties?: {
      radius: number;
    };
  };
}

export const geofenceKeys = {
  all: ['geofences'] as const,
  mapList: (idEnterprise?: string) => [...geofenceKeys.all, 'map-list', idEnterprise] as const,
};

export function useGeofencesMap({ idEnterprise }: { idEnterprise?: string }) {
  return useQuery({
    queryKey: geofenceKeys.mapList(idEnterprise),
    queryFn: async () => {
      const response = await api.get<Geofence[]>(`/geofence/maplist${idEnterprise ? `?idEnterprise=${idEnterprise}` : ''}`);
      return response.data;
    },
    enabled: !!idEnterprise,
  });
}
