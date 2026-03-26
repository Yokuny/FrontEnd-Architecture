import { useQuery } from '@tanstack/react-query';
import { GET, request } from '@/lib/api/client.api';

import type { ProfessionalList } from '@/lib/interfaces/professional.interface';

export const professionalsKeys = {
  all: ['professionals'] as const,
  lists: () => [...professionalsKeys.all, 'list'] as const,
  list: () => [...professionalsKeys.lists()] as const,
};

async function fetchProfessionals(): Promise<ProfessionalList[]> {
  const res = await request('user/professionals', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as ProfessionalList[];
}

export function useProfessionalsQuery() {
  return useQuery({
    queryKey: professionalsKeys.list(),
    queryFn: fetchProfessionals,
  });
}
