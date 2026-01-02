import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Port {
  id: string;
  code: string;
  description: string;
}

// Query keys
export const portsKeys = {
  all: ['ports'] as const,
  list: () => [...portsKeys.all, 'list'] as const,
};

// API functions
async function fetchPorts(): Promise<Port[]> {
  const response = await api.get<Port[]>('/geofence/ports');
  return response.data;
}

// Hooks
export function usePorts() {
  return useQuery({
    queryKey: portsKeys.list(),
    queryFn: fetchPorts,
  });
}

// Helper hook for select components
export function usePortsSelect() {
  return usePorts();
}

// Helper function to map ports to select options
export function mapPortsToOptions(ports: Port[]) {
  return ports
    .map((port) => ({
      value: port.id,
      label: `${port.code} - ${port.description}`,
      data: port,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
