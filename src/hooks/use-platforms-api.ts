import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export interface Platform {
  id: string;
  name: string;
  code: string;
  acronym?: string;
  basin?: string;
  type?: string;
  modelType?: string;
  operator?: string;
  imo?: string;
  mmsi?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  radius?: number;
  ais?: {
    distanceToBow?: number;
    distanceToStern?: number;
    distanceToStarboard?: number;
    distanceToPortSide?: number;
  };
  enterprise: {
    id: string;
    name: string;
    city?: string;
    state?: string;
  };
}

export interface PlatformFormData {
  id?: string;
  idEnterprise: string;
  name: string;
  code: string;
  acronym?: string;
  basin?: string;
  type?: string;
  modelType?: string;
  operator?: string;
  imo?: string;
  mmsi?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  ais?: {
    distanceToBow?: number;
    distanceToStern?: number;
    distanceToStarboard?: number;
    distanceToPortSide?: number;
  };
}

export const platformsKeys = {
  all: ['platforms'] as const,
  lists: (idEnterprise?: string) => [...platformsKeys.all, 'list', { idEnterprise }] as const,
  detail: (id: string) => [...platformsKeys.all, 'detail', id] as const,
};

export function usePlatforms({ idEnterprise, page = 0, size = 20, search }: { idEnterprise?: string; page?: number; size?: number; search?: string }) {
  return useQuery({
    queryKey: [...platformsKeys.lists(idEnterprise), { page, size, search }],
    queryFn: async () => {
      const response = await api.get<{ data: Platform[]; pageInfo: [{ count: number }] }>(
        `/platform/list?page=${page}&size=${size}${idEnterprise ? `&idEnterprise=${idEnterprise}` : ''}${search ? `&search=${search}` : ''}`,
      );
      return {
        data: response.data.data,
        totalCount: response.data.pageInfo?.[0]?.count || 0,
      };
    },
    enabled: !!idEnterprise,
  });
}

export function usePlatform(id?: string, idEnterprise?: string) {
  return useQuery({
    queryKey: [...platformsKeys.detail(id as string), { idEnterprise }],
    queryFn: async () => {
      const response = await api.get<Platform>(`/platform/find?id=${id}${idEnterprise ? `&idEnterprise=${idEnterprise}` : ''}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function usePlatformsApi() {
  const queryClient = useQueryClient();

  const createPlatform = useMutation({
    mutationFn: (data: PlatformFormData) => {
      const { latitude, longitude, id, ...rest } = data;
      return api.post('/platform', {
        ...rest,
        id: null,
        location: {
          type: 'Point',
          coordinates: [latitude ?? null, longitude ?? null],
        },
        radius: rest.radius ?? null,
        ais: {
          distanceToBow: rest.ais?.distanceToBow ?? null,
          distanceToStern: rest.ais?.distanceToStern ?? null,
          distanceToStarboard: rest.ais?.distanceToStarboard ?? null,
          distanceToPortSide: rest.ais?.distanceToPortSide ?? null,
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: platformsKeys.all }),
  });

  const updatePlatform = useMutation({
    mutationFn: (data: PlatformFormData) => {
      const { id, latitude, longitude, ...rest } = data;
      return api.put(`/platform/update?id=${id}`, {
        ...rest,
        id: id ?? null,
        location: {
          type: 'Point',
          coordinates: [latitude ?? null, longitude ?? null],
        },
        radius: rest.radius ?? null,
        ais: {
          distanceToBow: rest.ais?.distanceToBow ?? null,
          distanceToStern: rest.ais?.distanceToStern ?? null,
          distanceToStarboard: rest.ais?.distanceToStarboard ?? null,
          distanceToPortSide: rest.ais?.distanceToPortSide ?? null,
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: platformsKeys.all }),
  });

  const deletePlatform = useMutation({
    mutationFn: (id: string) => api.delete(`/platform?id=${id}`, { responseType: 'text' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: platformsKeys.all }),
  });

  return { createPlatform, updatePlatform, deletePlatform };
}

export function usePlatformsSelect(idEnterprise?: string) {
  return useQuery({
    queryKey: [...platformsKeys.lists(idEnterprise), 'select'],
    queryFn: async () => {
      const response = await api.get<{ data: Platform[] }>(`/platform/list?page=0&size=500${idEnterprise ? `&idEnterprise=${idEnterprise}` : ''}`);
      return response.data.data;
    },
    enabled: !!idEnterprise,
  });
}

export function mapPlatformsToOptions(platforms: Platform[]): { value: string; label: string; data: Platform }[] {
  return platforms
    .map((platform) => ({
      value: platform.id,
      label: platform.name,
      data: platform,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
