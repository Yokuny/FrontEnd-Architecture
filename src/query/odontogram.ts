import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { GET, PATCH, POST, request } from '@/lib/api/client.api';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { type Combobox, valueAndLabel } from '@/lib/helpers/formatter.helper';

import type { DbOdontogram, PartialOdontogram } from '@/lib/interfaces/odontogram.interface';

export const odontogramKeys = {
  all: ['odontogram'] as const,
  lists: () => [...odontogramKeys.all, 'list'] as const,
  list: () => [...odontogramKeys.lists()] as const,
  partials: () => [...odontogramKeys.all, 'partial'] as const,
  partial: () => [...odontogramKeys.partials()] as const,
  details: () => [...odontogramKeys.all, 'detail'] as const,
  detail: (id: string) => [...odontogramKeys.details(), id] as const,
  byPatient: (patientId: string) => [...odontogramKeys.all, 'patient', patientId] as const,
};

async function fetchOdontogramsPartial(): Promise<PartialOdontogram[]> {
  const res = await request('odontogram/partial', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as PartialOdontogram[];
}

async function fetchOdontogram(id: string): Promise<DbOdontogram> {
  const res = await request(`odontogram/${id}`, GET());
  if (!res.success) throw new Error(res.message);
  return res.data as DbOdontogram;
}

async function createOdontogram(data: any) {
  const res = await request('odontogram/create', POST(data));
  if (!res.success) throw new Error(res.message);
  return res;
}

async function updateOdontogramStatus({ id, finished }: { id: string; finished: boolean }) {
  const res = await request(`odontogram/${id}/status`, PATCH({ finished }));
  if (!res.success) throw new Error(res.message);
  return res;
}

export function useOdontogramsQuery() {
  return useQuery({
    queryKey: odontogramKeys.partial(),
    queryFn: fetchOdontogramsPartial,
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
      queryClient.invalidateQueries({ queryKey: odontogramKeys.partials() });
    },
  });

  const updateStatus = useMutation({
    mutationFn: updateOdontogramStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: odontogramKeys.partials() });
      queryClient.invalidateQueries({ queryKey: odontogramKeys.detail(variables.id) });
    },
  });

  return { create, updateStatus };
}

export function mapOdontogramsToCombobox(odontograms: PartialOdontogram[] | undefined, patientId?: string): Combobox[] {
  if (!odontograms?.length) return [];
  const filtered = patientId ? odontograms.filter((o) => o.patientID === patientId) : odontograms;
  return filtered.map((o) => valueAndLabel(o._id, formatDate(o.createdAt)));
}

export function useOdontogramsComboboxQuery(patientId?: string) {
  const { data, isLoading } = useOdontogramsQuery();
  const options = useMemo(() => mapOdontogramsToCombobox(data, patientId), [data, patientId]);
  return { options, isLoading };
}
