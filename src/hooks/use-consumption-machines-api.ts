import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Machine } from './use-machines-api';

// Types
export interface ConsumptionMachine {
  machine: Machine;
}

// Query keys
export const consumptionMachinesKeys = {
  all: ['consumption-machines'] as const,
  byEnterprise: (id: string) => [...consumptionMachinesKeys.all, 'enterprise', id] as const,
};

// API functions
async function fetchConsumptionMachines(idEnterprise: string): Promise<ConsumptionMachine[]> {
  const response = await api.get<ConsumptionMachine[]>(`/consumption/machines?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function useConsumptionMachines(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: consumptionMachinesKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchConsumptionMachines(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useConsumptionMachinesSelect(idEnterprise: string | undefined) {
  return useConsumptionMachines(idEnterprise);
}

// Helper function to map consumption machines to select options
export function mapConsumptionMachinesToOptions(data: ConsumptionMachine[]) {
  return data
    .map((item) => ({
      value: item.machine.id,
      label: item.machine.name,
      data: item,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
