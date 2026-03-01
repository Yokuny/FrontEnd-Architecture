import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GET, PATCH, POST, request } from '@/lib/api/client';
import { valueAndLabel } from '@/lib/helpers/formatter.helper';
import type { DbOdontogram, PartialOdontogram } from '@/lib/interfaces/odontogram';

export const odontogramKeys = {
  all: ['odontogram'] as const,
  lists: () => [...odontogramKeys.all, 'list'] as const,
  list: () => [...odontogramKeys.lists()] as const,
  details: () => [...odontogramKeys.all, 'detail'] as const,
  detail: (id: string) => [...odontogramKeys.details(), id] as const,
  byPatient: (patientId: string) => [...odontogramKeys.all, 'patient', patientId] as const,
};

async function fetchOdontograms(): Promise<PartialOdontogram[]> {
  const res = await request('odontogram/list', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as PartialOdontogram[];
}

async function fetchOdontogram(id: string): Promise<DbOdontogram> {
  const res = await request(`odontogram/${id}`, GET());
  if (!res.success) throw new Error(res.message);
  return res.data as DbOdontogram;
}

async function createOdontogram(data: any): Promise<{ _id: string }> {
  const res = await request('odontogram/create', POST(data));
  if (!res.success) throw new Error(res.message);
  return res.data as { _id: string };
}

async function updateOdontogramStatus({ id, finished }: { id: string; finished: boolean }): Promise<void> {
  const res = await request(`odontogram/${id}/status`, PATCH({ finished }));
  if (!res.success) throw new Error(res.message);
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

export function useOdontogramMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createOdontogram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: odontogramKeys.lists() });
    },
  });

  const updateStatus = useMutation({
    mutationFn: updateOdontogramStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: odontogramKeys.lists() });
      queryClient.invalidateQueries({ queryKey: odontogramKeys.detail(variables.id) });
    },
  });

  return { create, updateStatus };
}

// --- Utilitário puro ---

export function mapOdontogramsToCombobox(odontograms: PartialOdontogram[] | undefined, patientId?: string) {
  if (!odontograms?.length) return [{ value: '', label: 'Nenhum odontograma encontrado' }];
  const filtered = patientId ? odontograms.filter((o) => o.patientID === patientId) : odontograms;
  return filtered.map((o) => valueAndLabel(o._id, new Date(o.createdAt).toLocaleDateString('pt-BR').trim()));
}
