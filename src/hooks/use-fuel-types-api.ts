import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export interface TypeFuel {
  id: string;
  code: string;
  description: string;
  color: string;
  co2Coefficient: number;
  density: number;
  enterprise?: {
    id: string;
    name: string;
  };
}

export interface TypeFuelFormData {
  id?: string;
  idEnterprise: string;
  code: string;
  description: string;
  color: string;
  co2Coefficient: number;
  density: number;
}

export const fuelTypesKeys = {
  all: ['fuel-types'] as const,
  lists: (idEnterprise?: string) => [...fuelTypesKeys.all, 'list', { idEnterprise }] as const,
  detail: (id: string) => [...fuelTypesKeys.all, 'detail', id] as const,
};

export function useFuelTypes(idEnterprise?: string) {
  return useQuery({
    queryKey: fuelTypesKeys.lists(idEnterprise),
    queryFn: async () => {
      const response = await api.get<{ data: TypeFuel[]; pageInfo: any[] }>(`/typefuel/list?page=0&size=999${idEnterprise ? `&idEnterprise=${idEnterprise}` : ''}`);
      return response.data.data;
    },
    enabled: !!idEnterprise,
  });
}

export function useFuelType(id?: string) {
  return useQuery({
    queryKey: fuelTypesKeys.detail(id as string),
    queryFn: async () => {
      const response = await api.get(`/typefuel?id=${id}`);
      return response.data as TypeFuel;
    },
    enabled: !!id,
  });
}

export function useFuelTypesApi() {
  const queryClient = useQueryClient();

  const createFuelType = useMutation({
    mutationFn: (data: TypeFuelFormData) => api.post('/typefuel', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: fuelTypesKeys.all }),
  });

  const updateFuelType = useMutation({
    mutationFn: (data: TypeFuelFormData) => api.post('/typefuel', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: fuelTypesKeys.all }),
  });

  const deleteFuelType = useMutation({
    mutationFn: (id: string) => api.delete(`/typefuel?id=${id}`, { responseType: 'text' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: fuelTypesKeys.all }),
  });

  return { createFuelType, updateFuelType, deleteFuelType };
}
