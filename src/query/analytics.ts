import { useQuery } from '@tanstack/react-query';
import { GET, request } from '@/lib/api/client.api';
import type { DbPatientAnalytics } from '@/lib/interfaces/analytics.interface';

export const analyticsKeys = {
  all: ['analytics'] as const,
  patients: () => [...analyticsKeys.all, 'patients'] as const,
};

async function fetchPatientAnalytics(): Promise<DbPatientAnalytics> {
  const res = await request('patient/analytics', GET());
  if (!res.success) throw new Error(res.message || 'Falha ao carregar dados de análise');
  return res.data as DbPatientAnalytics;
}

export function usePatientAnalyticsQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: analyticsKeys.patients(),
    queryFn: fetchPatientAnalytics,
    enabled,
  });
}
