import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Qlp {
  id: string;
  name: string;
  month: string;
  qt?: string;
  idEnterprise: string;
}

// Query keys
export const qlpKeys = {
  all: ['qlp'] as const,
  byEnterprise: (idEnterprise: string) => [...qlpKeys.all, 'enterprise', idEnterprise] as const,
};

// API functions
async function fetchQlpByEnterprise(idEnterprise: string): Promise<Qlp[]> {
  const response = await api.get<Qlp[]>(`/qlp?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function useQlpByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: qlpKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => fetchQlpByEnterprise(idEnterprise as string),
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useQlpSelect(idEnterprise: string | undefined) {
  return useQlpByEnterprise(idEnterprise);
}

// Helper function to map QLP to select options
export function mapQlpToOptions(qlps: Qlp[]) {
  return qlps
    .map((qlp) => {
      let label = `${qlp.name} - ${qlp.month}`;
      if (qlp.qt) {
        label = `${label} - ${qlp.qt}`;
      }
      return {
        value: qlp.id,
        label,
        data: qlp,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}
