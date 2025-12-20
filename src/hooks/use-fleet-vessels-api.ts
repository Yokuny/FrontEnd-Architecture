import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Machine } from './use-machines-api';

// Types
export interface FleetMachines {
  description: string;
  machines: Machine[];
}

export interface FleetVesselItem extends Machine {
  fleet: string;
}

// Query keys
export const fleetVesselsKeys = {
  all: ['fleet-vessels'] as const,
  byEnterprise: (id: string) => [...fleetVesselsKeys.all, 'enterprise', id] as const,
};

// API functions
async function fetchFleetVessels(idEnterprise: string): Promise<FleetMachines[]> {
  const response = await api.get<FleetMachines[]>(`/machinefleet/machines?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function useFleetVessels(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: fleetVesselsKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchFleetVessels(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useFleetVesselsSelect(idEnterprise: string | undefined) {
  return useFleetVessels(idEnterprise);
}

// Helper function to map fleet vessels to grouped select options
// Note: DataSelect usually expects a flat list, but since this and the old component use groups,
// we might need to adapt. However, DataMultiSelect/DataSelect in this project might not support groups out of the box.
// If not, we can flatten them or update the base components if needed.
export function mapFleetVesselsToOptions(data: FleetMachines[]) {
  // If we want to keep the grouping structure for react-select:
  return data.map((fleet) => ({
    label: fleet.description,
    options: fleet.machines.map((machine) => ({
      value: machine.id,
      label: machine.name,
      data: machine,
    })),
  }));
}

// Flattened version for generic select if groups aren't supported
export function mapFleetVesselsToOptionsFlat(data: FleetMachines[]): { value: string; label: string; data: FleetVesselItem }[] {
  return data
    .flatMap((fleet) =>
      fleet.machines.map((machine) => ({
        value: machine.id,
        label: `${machine.name} (${fleet.description})`,
        data: { ...machine, fleet: fleet.description },
      })),
    )
    .sort((a, b) => a.label.localeCompare(b.label));
}
