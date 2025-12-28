import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Machine {
  id: string;
  name: string;
  idEnterprise?: string;
  image?: {
    url: string;
  };
}

export interface MachineSelectOption {
  value: string;
  label: string;
}

// Query keys
export const machinesKeys = {
  all: ['machines'] as const,
  lists: () => [...machinesKeys.all, 'list'] as const,
  list: (filters?: string) => [...machinesKeys.lists(), filters] as const,
  details: () => [...machinesKeys.all, 'detail'] as const,
  detail: (id: string) => [...machinesKeys.details(), id] as const,
};

// API functions
async function fetchMachines(filterQuery = ''): Promise<Machine[]> {
  const response = await api.get<Machine[]>(`/machine?${filterQuery}`);
  return response.data;
}

async function fetchMachinesByEnterprise(idEnterprise: string): Promise<Machine[]> {
  const response = await api.get<Machine[]>(`/machine/enterprise?idEnterprise=${idEnterprise}`);
  return response.data;
}

async function fetchMachine(id: string): Promise<Machine> {
  const response = await api.get<Machine>(`/machine/${id}`);
  return response.data;
}

// Hooks
export function useMachines(filterQuery?: string) {
  return useQuery({
    queryKey: machinesKeys.list(filterQuery),
    queryFn: () => fetchMachines(filterQuery),
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

export function useMachine(id: string) {
  return useQuery({
    queryKey: machinesKeys.detail(id),
    queryFn: () => fetchMachine(id),
    enabled: !!id,
  });
}

// Helper hook for select components
export function useMachinesSelect(filterQuery?: string) {
  return useMachines(filterQuery);
}

// Helper hook for enterprise-filtered select
export function useMachinesByEnterpriseSelect(idEnterprise: string | undefined) {
  return useMachinesByEnterprise(idEnterprise);
}

// Helper function to map machines to select options
export function mapMachinesToOptions(machines: Machine[]) {
  return machines
    .map((machine) => ({
      value: machine.id,
      label: `${machine.name} (${machine.id})`,
      data: machine,
    }))
    .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
}

export function mapMachinesToOptionsSimple(machines: Machine[]) {
  return machines
    .map((machine) => ({
      value: machine.id,
      label: machine.name,
      data: machine,
    }))
    .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
}
