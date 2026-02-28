import { useQuery } from '@tanstack/react-query';
import { GET, request } from '@/lib/api/client';
import { valueAndLabel } from '@/lib/helpers/formatter.helper';
import type { DbOdontogram, OdontogramList } from '@/lib/interfaces/odontogram';

export const odontogramKeys = {
  all: ['odontogram'] as const,
  lists: () => [...odontogramKeys.all, 'list'] as const,
  list: () => [...odontogramKeys.lists()] as const,
  details: () => [...odontogramKeys.all, 'detail'] as const,
  detail: (id: string) => [...odontogramKeys.details(), id] as const,
  byPatient: (patientId: string) => [...odontogramKeys.all, 'patient', patientId] as const,
};

async function fetchOdontograms(): Promise<OdontogramList[]> {
  const res = await request('odontogram/list', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as OdontogramList[];
}

async function fetchOdontogram(id: string): Promise<DbOdontogram> {
  const res = await request(`odontogram/${id}`, GET());
  if (!res.success) throw new Error(res.message);
  return res.data as DbOdontogram;
}

export function useOdontogramsQuery() {
  return useQuery({
    queryKey: odontogramKeys.list(),
    queryFn: fetchOdontograms,
  });
}

export function useOdontogramDetailQuery(id?: string) {
  return useQuery({
    queryKey: odontogramKeys.detail(id ?? ''),
    queryFn: () => fetchOdontogram(id!),
    enabled: !!id,
  });
}

// --- Utilitário puro ---

export function mapOdontogramsToCombobox(odontograms: OdontogramList[] | undefined, patientId?: string) {
  if (!odontograms?.length) return [{ value: '', label: 'Nenhum odontograma encontrado' }];
  const filtered = patientId ? odontograms.filter((o) => o.Patient === patientId) : odontograms;
  return filtered.map((o) => valueAndLabel(o._id, new Date(o.createdAt).toLocaleDateString('pt-BR').trim()));
}
