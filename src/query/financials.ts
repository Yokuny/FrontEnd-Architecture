import { useQuery } from '@tanstack/react-query';
import { GET, request } from '@/lib/api/client';
import { valueAndLabel } from '@/lib/helpers/formatter.helper';
import type { FinancialList, FullFinancial } from '@/lib/interfaces/financial';

export const financialsKeys = {
  all: ['financials'] as const,
  lists: () => [...financialsKeys.all, 'list'] as const,
  list: () => [...financialsKeys.lists()] as const,
  details: () => [...financialsKeys.all, 'detail'] as const,
  detail: (id: string) => [...financialsKeys.details(), id] as const,
  byPatient: (patientId: string) => [...financialsKeys.all, 'patient', patientId] as const,
};

async function fetchFinancials(): Promise<FinancialList[]> {
  const res = await request('financial/list', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as FinancialList[];
}

async function fetchFinancial(id: string): Promise<FullFinancial> {
  const res = await request(`financial/${id}`, GET());
  if (!res.success) throw new Error(res.message);
  return res.data as FullFinancial;
}

export function useFinancialsQuery() {
  return useQuery({
    queryKey: financialsKeys.list(),
    queryFn: fetchFinancials,
  });
}

export function useFinancialDetailQuery(id?: string) {
  return useQuery({
    queryKey: financialsKeys.detail(id ?? ''),
    queryFn: () => fetchFinancial(id!),
    enabled: !!id,
  });
}

// --- Utilitários puros ---

export function mapFinancialsToCombobox(financials: FinancialList[] | undefined, patientId?: string) {
  if (!financials?.length) return [{ value: '', label: 'Nenhum registro encontrado' }];
  const filtered = patientId ? financials.filter((f) => f.Patient === patientId) : financials;
  return filtered.map((f) => valueAndLabel(f._id, new Date(f.createdAt).toLocaleDateString('pt-BR').trim()));
}
