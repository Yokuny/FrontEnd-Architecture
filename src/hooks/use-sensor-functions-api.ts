import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { SensorFunction } from '@/routes/_private/register/sensor-functions/@interface/sensor-function.schema';

export const sensorFunctionsKeys = {
  all: ['sensor-functions'] as const,
  lists: (idEnterprise?: string) => [...sensorFunctionsKeys.all, 'list', { idEnterprise }] as const,
  detail: (id: string) => [...sensorFunctionsKeys.all, 'detail', id] as const,
};

export function useSensorFunctions({ idEnterprise, page = 1, size = 20, description }: { idEnterprise: string; page?: number; size?: number; description?: string }) {
  return useQuery({
    queryKey: [...sensorFunctionsKeys.lists(idEnterprise), { page, size, description }],
    queryFn: async () => {
      const response = await api.get<{ data: SensorFunction[]; pageInfo: [{ count: number }] }>(
        `/sensor-function/list?page=${page - 1}&size=${size}${idEnterprise ? `&idEnterprise=${idEnterprise}` : ''}${description ? `&search=${description}` : ''}`,
      );
      return {
        data: response.data.data,
        total: response.data.pageInfo?.[0]?.count || 0,
      };
    },
    enabled: !!idEnterprise,
  });
}

export function useSensorFunction(id?: string) {
  return useQuery({
    queryKey: sensorFunctionsKeys.detail(id as string),
    queryFn: async () => {
      const response = await api.get<SensorFunction[]>(`/sensor-function/find/${id}`);
      return response.data[0];
    },
    enabled: !!id,
  });
}

export function useSensorFunctionsApi() {
  const queryClient = useQueryClient();

  const createSensorFunction = useMutation({
    mutationFn: (data: any) => api.post('/sensor-function', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sensorFunctionsKeys.all }),
  });

  const updateSensorFunction = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/sensor-function/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sensorFunctionsKeys.all }),
  });

  const toggleSensorFunction = useMutation({
    mutationFn: (id: string) => api.post(`/sensor-function/toggle/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sensorFunctionsKeys.all }),
  });

  const deleteSensorFunction = useMutation({
    mutationFn: (id: string) => api.delete(`/sensor-function/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sensorFunctionsKeys.all }),
  });

  return { createSensorFunction, updateSensorFunction, toggleSensorFunction, deleteSensorFunction };
}
