import { create } from 'zustand';
import { valueAndLabel } from '@/lib/helpers/formatter.helper';
import type { FinancialList } from '@/lib/interfaces/financial.interface';

export const useFinancialStore = create<FinancialStore>()(() => ({
  mapToCombobox: (financials, patientId) => {
    if (!financials?.length) return [{ value: '', label: 'Nenhum registro encontrado' }];
    const filtered = patientId ? financials.filter((f) => f.Patient === patientId) : financials;
    return filtered.map((f) => valueAndLabel(f._id, new Date(f.createdAt).toLocaleDateString('pt-BR').trim()));
  },
}));

type FinancialStore = {
  mapToCombobox: (financials: FinancialList[] | undefined, patientId?: string) => { value: string; label: string }[];
};
