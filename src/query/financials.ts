import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GET, PATCH, POST, PUT, request } from '@/lib/api/client';
import { valueAndLabel } from '@/lib/helpers/formatter.helper';
import type { FinancialList, FullFinancial, PartialFinancial } from '@/lib/interfaces/financial';

export const financialsKeys = {
  all: ['financials'] as const,
  lists: () => [...financialsKeys.all, 'list'] as const,
  list: () => [...financialsKeys.lists()] as const,
  partials: () => [...financialsKeys.all, 'partial'] as const,
  partial: () => [...financialsKeys.partials()] as const,
  details: () => [...financialsKeys.all, 'detail'] as const,
  detail: (id: string) => [...financialsKeys.details(), id] as const,
  byPatient: (patientId: string) => [...financialsKeys.all, 'patient', patientId] as const,
};

async function fetchFinancials(): Promise<FinancialList[]> {
  const res = await request('financial/list', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as FinancialList[];
}

async function fetchFinancialsPartial(): Promise<PartialFinancial[]> {
  const res = await request('financial/partial', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as PartialFinancial[];
}

async function fetchFinancial(id: string): Promise<FullFinancial> {
  const res = await request(`financial/${id}`, GET());
  if (!res.success) throw new Error(res.message);
  return res.data as FullFinancial;
}

async function createFinancial(body: object): Promise<{ success: boolean; message: string }> {
  const res = await request('financial/create', POST(body));
  if (!res.success) throw new Error(res.message);
  return res;
}

async function updateFinancial({ id, body }: { id: string; body: object }): Promise<{ success: boolean; message: string }> {
  const res = await request(`financial/${id}`, PUT(body));
  if (!res.success) throw new Error(res.message);
  return res;
}

async function updateFinancialStatus({ id, status }: { id: string; status: string }): Promise<{ success: boolean; message: string }> {
  const res = await request(`financial/${id}/status`, PATCH({ status }));
  if (!res.success) throw new Error(res.message);
  return res;
}

export function useFinancialsQuery() {
  return useQuery({
    queryKey: financialsKeys.list(),
    queryFn: fetchFinancials,
  });
}

export function useFinancialsPartialQuery() {
  return useQuery({
    queryKey: financialsKeys.partial(),
    queryFn: fetchFinancialsPartial,
  });
}

export function useFinancialDetailQuery(id?: string) {
  return useQuery({
    queryKey: financialsKeys.detail(id ?? ''),
    queryFn: () => fetchFinancial(id as string),
    enabled: !!id,
  });
}

export function useFinancialMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createFinancial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: financialsKeys.partials() });
    },
  });

  const update = useMutation({
    mutationFn: updateFinancial,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: financialsKeys.partials() });
      queryClient.invalidateQueries({ queryKey: financialsKeys.detail(variables.id) });
    },
  });

  const updateStatus = useMutation({
    mutationFn: updateFinancialStatus,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: financialsKeys.partials() });
      queryClient.invalidateQueries({ queryKey: financialsKeys.detail(variables.id) });
    },
  });

  return { create, update, updateStatus };
}

// --- Utilitários puros ---

export function mapFinancialsToCombobox(financials: FinancialList[] | undefined, patientId?: string) {
  if (!financials?.length) return [{ value: '', label: 'Nenhum registro encontrado' }];
  const filtered = patientId ? financials.filter((f) => f.Patient === patientId) : financials;
  return filtered.map((f) => valueAndLabel(f._id, new Date(f.createdAt).toLocaleDateString('pt-BR').trim()));
}
