import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { OsDetails } from '../@interface/os-details.types';

export const osDetailsKeys = {
  all: ['os-details'] as const,
  detail: (id: string) => [...osDetailsKeys.all, 'detail', id] as const,
};

export function useOsDetails(id: string) {
  return useQuery({
    queryKey: osDetailsKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<OsDetails>(`/maintenancemachine/os/details?id=${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
