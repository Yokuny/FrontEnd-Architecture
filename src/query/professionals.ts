import { useQuery } from '@tanstack/react-query';
import { GET, request } from '@/lib/api/client';
import { comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';
import type { ProfessionalList } from '@/lib/interfaces/professional';

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

// --- Utilitários puros (recebem os dados como argumento) ---

export function getProfessionalName(professionals: ProfessionalList[] | undefined, id: string | undefined): string {
  if (!id || !professionals) return '';
  return professionals.find((p) => p._id === id)?.name || '';
}

export function getProfessionalImage(professionals: ProfessionalList[] | undefined, id: string | undefined): string | undefined {
  if (!id || !professionals) return undefined;
  return professionals.find((p) => p._id === id)?.image || undefined;
}

export function mapProfessionalsToCombobox(professionals: ProfessionalList[] | undefined) {
  if (!professionals?.length) return [];
  return comboboxWithImgFormat(professionals);
}
