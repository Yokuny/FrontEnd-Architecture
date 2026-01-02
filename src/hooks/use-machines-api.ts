import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Machine {
  _id?: string;
  id: string;
  name: string;
  code?: string;
  mmsi?: string;
  imo?: string;
  idEnterprise?: string;
  enterprise?: {
    id: string;
    name: string;
    city?: string;
    state?: string;
  };
  image?: {
    url: string;
  };
  sensors?: Array<{
    sensorId: string;
    sensor: string;
    sensorKey?: string;
  }>;
  partsMachine?: Array<{
    id: string;
    name: string;
    sku?: string;
  }>;
  maintenancesPlan?: Array<{
    id: string;
    description: string;
  }>;
  modelMachine?: {
    id: string;
    description: string;
    typeMachine?: string;
  };
  dataSheet?: Record<string, any>;
  contacts?: Array<any>;
  cameras?: Array<{
    name: string;
    link: string;
  }>;
  inactiveAt?: string | null;
  idFleet?: string;
  isInactive?: boolean;
  isConfiguredFleet?: boolean;
  isConfiguredTravel?: boolean;
  alerts?: number;
}

export interface MachineSelectOption {
  value: string;
  label: string;
}

// Query keys
export const machinesKeys = {
  all: ['machines'] as const,
  lists: () => [...machinesKeys.all, 'list'] as const,
  list: (filters?: any) => [...machinesKeys.lists(), filters] as const,
  details: () => [...machinesKeys.all, 'detail'] as const,
  detail: (id: string) => [...machinesKeys.details(), id] as const,
};

// API functions
async function fetchMachines(filters?: any): Promise<{ data: Machine[]; totalCount: number }> {
  // Add default pagination as expected by the legacy backend
  const params = {
    page: 0,
    size: 100,
    ...filters,
  };

  const response = await api.get<any>('/machine/list', { params });

  // The legacy API returns { data: [], pageInfo: [{ count: number }] }
  const data = response.data?.data || [];
  const totalCount = response.data?.pageInfo?.[0]?.count ?? data.length;

  return { data, totalCount };
}

async function fetchMachinesByEnterprise(idEnterprise: string): Promise<Machine[]> {
  const response = await api.get<Machine[]>(`/machine/enterprise?idEnterprise=${idEnterprise}`);
  return response.data;
}

async function fetchMachine(id: string): Promise<Machine> {
  const response = await api.get<Machine>(`/machine/find?_id=${id}`);
  return response.data;
}

// Hooks
export function useMachines(filters?: any) {
  return useQuery({
    queryKey: machinesKeys.list(filters),
    queryFn: () => fetchMachines(filters),
  });
}

export function useMachinesByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: [...machinesKeys.all, 'enterprise', idEnterprise],
    queryFn: () => {
      if (!idEnterprise) {
        return Promise.resolve([]);
      }
      return fetchMachinesByEnterprise(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

export function useMachine(id: string | null) {
  return useQuery({
    queryKey: machinesKeys.detail(id || ''),
    queryFn: () => fetchMachine(id!),
    enabled: !!id,
  });
}

export function useMachinesApi() {
  const queryClient = useQueryClient();

  const createMachine = useMutation({
    mutationFn: (data: Partial<Machine>) => api.post('/machine', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: machinesKeys.lists() });
    },
  });

  const updateMachine = useMutation({
    mutationFn: (data: Partial<Machine>) => api.put('/machine', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: machinesKeys.all });
    },
  });

  const activateMachine = useMutation({
    mutationFn: (id: string) => api.patch(`/machine/active?id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: machinesKeys.all });
    },
  });

  const deactivateMachine = useMutation({
    mutationFn: (id: string) => api.patch(`/machine/deactive?id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: machinesKeys.all });
    },
  });

  const uploadMachineImage = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post(`/upload/machine?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: machinesKeys.all });
    },
  });

  const includeMachine = useMutation({
    mutationFn: (data: any) => api.post('/machine/include', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: machinesKeys.lists() });
    },
  });

  return {
    createMachine,
    updateMachine,
    activateMachine,
    deactivateMachine,
    uploadMachineImage,
    includeMachine,
  };
}

// Helper hook for select components
export function useMachinesSelect(filterQuery?: any) {
  return useQuery({
    queryKey: [...machinesKeys.all, 'select', filterQuery],
    queryFn: async () => {
      const response = await api.get<Machine[]>('/machine', { params: filterQuery });
      return response.data;
    },
  });
}

// Helper hook for enterprise-filtered select
export function useMachinesByEnterpriseSelect(idEnterprise: string | undefined) {
  return useMachinesByEnterprise(idEnterprise);
}

// Helper function to map machines to select options
export function mapMachinesToOptions(machines: Machine[]) {
  if (!Array.isArray(machines)) return [];
  return machines
    .map((machine) => ({
      value: machine.id,
      label: `${machine.name} (${machine.id})`,
      data: machine,
    }))
    .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
}

export function mapMachinesToOptionsSimple(machines: Machine[]) {
  if (!Array.isArray(machines)) return [];
  return machines
    .map((machine) => ({
      value: machine.id,
      label: machine.name,
      data: machine,
    }))
    .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
}
