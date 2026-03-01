import { useQuery } from '@tanstack/react-query';
import { GET, request } from '@/lib/api/client';

import type { PartialPatient } from '@/lib/interfaces/patient';

export const patientsKeys = {
  all: ['patients'] as const,
  lists: () => [...patientsKeys.all, 'list'] as const,
  list: () => [...patientsKeys.lists()] as const,
};

async function fetchPatients(): Promise<PartialPatient[]> {
  const res = await request('patient/partial', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as PartialPatient[];
}

export function usePatientsQuery() {
  return useQuery({
    queryKey: patientsKeys.list(),
    queryFn: fetchPatients,
  });
}
