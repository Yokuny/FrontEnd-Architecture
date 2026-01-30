import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import type { DiagramData, DiagramMarker, EquipmentStatusData, SensorStateData } from '../@interface/diagram-details.types';

export const diagramDetailsKeys = {
  all: ['diagram-details'] as const,
  detail: (id: string, idEnterprise: string) => [...diagramDetailsKeys.all, { id, idEnterprise }] as const,
  sensorState: (markers: DiagramMarker[]) => [...diagramDetailsKeys.all, 'sensors', markers.map((m) => `${m.machine}:${m.sensor}`)] as const,
};

export function useDiagramDetail(id: string | undefined, idEnterprise: string | undefined) {
  return useQuery({
    queryKey: diagramDetailsKeys.detail(id || '', idEnterprise || ''),
    queryFn: async () => {
      const response = await api.get<DiagramData>(`/machine/plant?id=${id}&idEnterprise=${idEnterprise}`);
      return response.data;
    },
    enabled: !!id && !!idEnterprise,
  });
}

export function useSensorStates(markers: DiagramMarker[], enabled: boolean) {
  return useQuery({
    queryKey: diagramDetailsKeys.sensorState(markers),
    queryFn: async () => {
      const params = markers.map((m) => `idMachines[]=${m.machine}&sensors[]=${m.sensor}`).join('&');
      const response = await api.get<SensorStateData[]>(`/sensorstate/last/machines/sensors?${params}`);
      return response.data;
    },
    enabled: enabled && markers.length > 0,
    refetchInterval: 60000,
  });
}

export function useEquipmentStatus(markers: DiagramMarker[], enabled: boolean) {
  return useQuery({
    queryKey: [...diagramDetailsKeys.all, 'equipment-status', markers.map((m) => `${m.machine}:${m.equipment}`)],
    queryFn: async () => {
      const maintenanceMarkers = markers.filter((m) => m.type === 'maintenance');
      if (!maintenanceMarkers.length) return [];

      const params = maintenanceMarkers.map((m) => `equipments[]=${encodeURIComponent(JSON.stringify({ machineId: m.machine, equipment: m.equipment }))}`).join('&');
      const response = await api.get<EquipmentStatusData[]>(`/formdata/cmms/equipmentstatus?${params}`);
      return response.data;
    },
    enabled: enabled && markers.some((m) => m.type === 'maintenance'),
    refetchInterval: 60000,
  });
}

export function useDiagramApi(idEnterprise: string | undefined) {
  const queryClient = useQueryClient();

  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<{ url: string }>('/upload', formData);
      return response.data;
    },
  });

  const saveDiagram = useMutation({
    mutationFn: async (data: { id?: string; description?: string; markers: DiagramMarker[]; image?: { url: string } | null; formId?: string | null }) => {
      const payload = {
        idEnterprise,
        description: data.description,
        data: data.markers,
        image: data.image,
        form: data.formId || null,
      };

      if (data.id) {
        return api.put(`/machine/plant/${data.id}`, payload);
      }
      return api.post('/machine/plant', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diagramDetailsKeys.all });
      toast.success('Diagram saved successfully');
    },
    onError: () => {
      toast.error('Error saving diagram');
    },
  });

  return { uploadImage, saveDiagram };
}
