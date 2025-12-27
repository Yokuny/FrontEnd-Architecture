import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api/client';

export interface EnterpriseFilterStore {
  idEnterprise: string;
  setIdEnterprise: (id: string) => void;
}

export const useEnterpriseFilter = create<EnterpriseFilterStore>()(
  persist(
    (set) => ({
      idEnterprise: '',
      setIdEnterprise: (id) => set({ idEnterprise: id }),
    }),
    {
      name: 'idEnterprise',
    },
  ),
);

// Types
export interface Enterprise {
  id: string;
  name: string;
  city: string;
  state: string;
  country?: string;
  active?: boolean;
  ssoSetuped?: boolean;
  image?: { url: string };
  imageDark?: { url: { url: string } | string }; // O formato pode variar na API antiga
}

export interface EnterpriseSelectOption {
  value: string;
  label: string;
}

// Query keys
export const enterprisesKeys = {
  all: ['enterprises'] as const,
  lists: () => [...enterprisesKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...enterprisesKeys.lists(), filters] as const,
  details: () => [...enterprisesKeys.all, 'detail'] as const,
  detail: (id: string) => [...enterprisesKeys.details(), id] as const,
  withSetup: () => [...enterprisesKeys.all, 'with-setup'] as const,
};

// API functions
async function fetchEnterprises(): Promise<Enterprise[]> {
  const response = await api.get<Enterprise[]>('/enterprise');
  return response.data;
}

async function fetchEnterprisesWithSetup(): Promise<Enterprise[]> {
  const response = await api.get<Enterprise[]>('/enterprise/withsetup');
  return response.data;
}

async function fetchEnterprise(id: string): Promise<Enterprise> {
  const response = await api.get<Enterprise>(`/enterprise?id=${id}`);
  return response.data;
}

async function createEnterprise(enterprise: Partial<Enterprise>): Promise<Enterprise> {
  const response = await api.post<Enterprise>('/enterprise', enterprise);
  return response.data;
}

async function updateEnterprise(enterprise: Enterprise): Promise<Enterprise> {
  const response = await api.put<Enterprise>('/enterprise', enterprise);
  return response.data;
}

async function deleteEnterprise(id: string): Promise<void> {
  await api.delete(`/enterprise?id=${id}`);
}

// Hooks - Query hooks
export function useEnterprises(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: enterprisesKeys.list(params),
    queryFn: fetchEnterprises,
  });
}

export function useEnterprise(id: string) {
  return useQuery({
    queryKey: enterprisesKeys.detail(id),
    queryFn: () => fetchEnterprise(id),
    enabled: !!id,
  });
}

// Mutation hooks
export function useEnterprisesApi() {
  const queryClient = useQueryClient();

  // Create enterprise mutation
  const createEnterpriseMutation = useMutation({
    mutationFn: createEnterprise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enterprisesKeys.lists() });
    },
  });

  // Update enterprise mutation
  const updateEnterpriseMutation = useMutation({
    mutationFn: updateEnterprise,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: enterprisesKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: enterprisesKeys.detail(data.id) });
      }
    },
  });

  // Delete enterprise mutation
  const deleteEnterpriseMutation = useMutation({
    mutationFn: deleteEnterprise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enterprisesKeys.lists() });
    },
  });

  return {
    createEnterprise: createEnterpriseMutation,
    updateEnterprise: updateEnterpriseMutation,
    deleteEnterprise: deleteEnterpriseMutation,
  };
}

// Helper hook for select components
export function useEnterprisesSelect() {
  return useEnterprises();
}

export function useEnterprisesWithSetupSelect() {
  return useQuery({
    queryKey: enterprisesKeys.withSetup(),
    queryFn: fetchEnterprisesWithSetup,
  });
}

// Helper function to map enterprises to select options
export function mapEnterprisesToOptions(enterprises: Enterprise[]): { value: string; label: string; data: Enterprise }[] {
  return enterprises
    .map((enterprise) => ({
      value: enterprise.id,
      label: `${enterprise.name} - ${enterprise.city} ${enterprise.state}`,
      data: enterprise,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
