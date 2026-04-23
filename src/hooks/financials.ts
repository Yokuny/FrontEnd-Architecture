import { create } from 'zustand';
import { valueAndLabel } from '@/lib/helpers/formatter.helper';
import type { FinancialList, PartialFinancial } from '@/lib/interfaces/financial.interface';

type FinancialComboboxRow = FinancialList | PartialFinancial;

function getPatientId(f: FinancialComboboxRow): string {
  if ('patientID' in f && f.patientID) return f.patientID;
  return (f as FinancialList).Patient;
}

function getLabelDate(f: FinancialComboboxRow): string {
  if ('updatedAt' in f && f.updatedAt) {
    return new Date(f.updatedAt).toLocaleDateString('pt-BR').trim();
  }
  if ('createdAt' in f && f.createdAt) {
    return new Date(f.createdAt as string | Date).toLocaleDateString('pt-BR').trim();
  }
  return '';
}

export const useFinancialStore = create<FinancialStore>()(() => ({
  mapToCombobox: (financials, patientId) => {
    if (!financials?.length) return [{ value: '', label: 'Nenhum registro encontrado' }];
    const filtered = patientId ? financials.filter((f) => getPatientId(f) === patientId) : financials;
    return filtered.map((f) => valueAndLabel(f._id, getLabelDate(f)));
  },
}));

type FinancialStore = {
  mapToCombobox: (financials: FinancialComboboxRow[] | undefined, patientId?: string) => { value: string; label: string }[];
};
