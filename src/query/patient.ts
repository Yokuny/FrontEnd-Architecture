import { useQuery } from '@tanstack/react-query';
import { GET, request } from '@/lib/api/client';
import type { FullPatient } from '@/lib/interfaces';

export const patientKeys = {
  all: ['patient'] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
};

async function fetchPatient(id: string): Promise<FullPatient> {
  const res = await request(`patient?id=${id}`, GET());
  if (!res.success) throw new Error(res.message);
  return res.data as FullPatient;
}

export function usePatientQuery(id?: string) {
  return useQuery({
    queryKey: patientKeys.detail(id ?? ''),
    queryFn: () => fetchPatient(id!),
    enabled: !!id,
  });
}
