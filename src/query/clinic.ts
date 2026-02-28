import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET, request } from '@/lib/api/client';
import type { PartialClinic } from '@/lib/interfaces/clinic';

export const clinicKeys = {
  all: ['clinic'] as const,
  detail: () => [...clinicKeys.all, 'detail'] as const,
};

async function fetchClinic(): Promise<PartialClinic> {
  const res = await request('clinic', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as PartialClinic;
}

/** Server State da clínica. Cache de 5 min; substitui refreshClinic/getClinic do antigo Zustand. */
export function useClinicApi() {
  return useQuery({
    queryKey: clinicKeys.detail(),
    queryFn: fetchClinic,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Atualiza o cache manualmente após uma mutação.
 * Substitui o antigo setClinic do Zustand.
 *
 * @example
 * const { setClinicCache } = useClinicCache();
 * setClinicCache((old) => ({ ...old, name: 'Novo Nome' }));
 */
export function useClinicCache() {
  const queryClient = useQueryClient();

  const setClinicCache = (updater: (old: PartialClinic) => PartialClinic) => {
    queryClient.setQueryData<PartialClinic>(clinicKeys.detail(), (old) => {
      if (!old) return old;
      return updater(old);
    });
  };

  const invalidateClinic = () => {
    queryClient.invalidateQueries({ queryKey: clinicKeys.all });
  };

  return { setClinicCache, invalidateClinic };
}
