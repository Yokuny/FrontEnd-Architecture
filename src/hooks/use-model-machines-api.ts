import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

import type { ModelMachine, ModelMachineFormData } from '@/routes/_private/register/model-machine/@interface/model-machine';
export type { ModelMachine, ModelMachineFormData };

// Query keys
export const modelMachinesKeys = {
  all: ['model-machines'] as const,
  lists: () => [...modelMachinesKeys.all, 'list'] as const,
  list: (params: any) => [...modelMachinesKeys.lists(), params] as const,
  byEnterprise: (id: string) => [...modelMachinesKeys.all, 'enterprise', id] as const,
  detail: (id: string) => [...modelMachinesKeys.all, 'detail', id] as const,
};

// API functions
async function fetchModelMachines(params: { idEnterprise?: string; page?: number; size?: number; search?: string }) {
  const queryParams = new URLSearchParams();
  if (params.idEnterprise) queryParams.append('idEnterprise', params.idEnterprise);
  if (params.page !== undefined) queryParams.append('page', String(params.page));
  if (params.size !== undefined) queryParams.append('size', String(params.size));
  if (params.search) queryParams.append('search', params.search);

  const response = await api.get<{ data: ModelMachine[]; pageInfo: [{ count: number }] }>(`/modelmachine/list?${queryParams.toString()}`);
  return {
    data: response.data.data,
    totalCount: response.data.pageInfo?.[0]?.count || 0,
  };
}

async function fetchModelMachineById(id: string): Promise<ModelMachine> {
  const response = await api.get<ModelMachine>(`/modelmachine/find?id=${id}`);
  return response.data;
}

// Hooks
export function useModelMachines(params: { idEnterprise?: string; page?: number; size?: number; search?: string }) {
  return useQuery({
    queryKey: modelMachinesKeys.list(params),
    queryFn: () => fetchModelMachines(params),
    enabled: !!params.idEnterprise,
  });
}

export function useModelMachine(id: string | undefined) {
  return useQuery({
    queryKey: modelMachinesKeys.detail(id || ''),
    queryFn: () => {
      if (!id) return Promise.resolve(undefined);
      return fetchModelMachineById(id);
    },
    enabled: !!id,
  });
}

export function useModelMachinesApi() {
  const queryClient = useQueryClient();

  const saveModelMachine = useMutation({
    mutationFn: async (data: ModelMachineFormData) => {
      if (data.id) {
        return api.post('/modelmachine', data); // Legacy used POST for both add and update if ID is present?
        // Checking legacy: let idModelMachine = editId; try { idModelMachine = (await Fetch.post("/modelmachine", data))?.data?.data?.id; }
        // Yes, legacy used POST /modelmachine for both.
      }
      return api.post('/modelmachine', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modelMachinesKeys.all });
    },
  });

  const deleteModelMachine = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/modelmachine?id=${id}`, { responseType: 'text' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modelMachinesKeys.all });
    },
  });

  const uploadFile = useMutation({
    mutationFn: async ({ id, file, type }: { id: string; file: File; type?: 'image' | 'icon' }) => {
      const formData = new FormData();
      formData.append('file', file);

      let url = `/upload/modelmachine?id=${id}`;
      if (type === 'image') url += '&isImage=true';
      if (type === 'icon') url += '&isIcon=true';

      return api.post(url, formData);
    },
  });

  const deleteFile = useMutation({
    mutationFn: async ({ idModelMachine, filename }: { idModelMachine: string; filename: string }) => {
      return api.delete(`/modelmachine/files?idModelMachine=${idModelMachine}&file[]=${filename}`);
    },
  });

  return {
    saveModelMachine,
    deleteModelMachine,
    uploadFile,
    deleteFile,
  };
}

// Helper hook for select components
export function useModelMachinesSelect(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: modelMachinesKeys.byEnterprise(idEnterprise || ''),
    queryFn: async () => {
      if (!idEnterprise) return [];
      const response = await api.get<ModelMachine[]>(`/modelmachine?idEnterprise=${idEnterprise}`);
      return response.data;
    },
    enabled: !!idEnterprise,
  });
}

// Helper function to map model machines to select options
export function mapModelMachinesToOptions(models: ModelMachine[]) {
  return models.map((model) => ({
    value: model.id,
    label: model.description,
    data: model,
  }));
}
