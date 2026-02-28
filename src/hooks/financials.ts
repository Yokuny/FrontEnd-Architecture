import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GET, request } from '@/lib/api/fetch.config';
import { type Combobox, valueAndLabel } from '@/lib/helpers/formatter.helper';
import type { FinancialList } from '@/lib/interfaces/financial';

export const useFinancialsStore = create<FinancialsStore>()(
  persist(
    (set, get) => ({
      financials: [],
      financialsCombobox: null,

      refreshFinancials: async () => {
        try {
          const res = await request('financial/list', GET());
          if (!res.success) throw new Error(res.message);

          set({ financials: res.data as FinancialList[] });
          return res.data as FinancialList[];
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getFinancials: async () => {
        const { financials } = get();
        if (financials.length > 0) return financials;

        try {
          await get().refreshFinancials();
          return get().financials;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getFinancialsCombobox: async (patientID?: string) => {
        const { financialsCombobox } = get();
        if (financialsCombobox) return financialsCombobox;

        const filterFinancials = (financials: FinancialList[], patientID?: string) => {
          if (patientID) return financials.filter((item) => item.Patient === patientID);
          return financials;
        };

        try {
          const financials = await get().getFinancials();
          if (!financials.length) return [{ value: '', label: 'Nenhum registro encontrado' }];

          const filtered = filterFinancials(financials, patientID);

          // TODO: buscar o nome do paciente pelo id em Patient, e cortar o nome em alguns caracteres
          const formattedData = filtered.map((financial) => valueAndLabel(financial._id, new Date(financial.createdAt).toLocaleDateString('pt-BR').trim()));

          return formattedData;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      setFinancials: (financials: FinancialList[]) => {
        set({ financials });
      },
    }),
    {
      name: 'financials-storage',
      partialize: (state) => ({ financials: state.financials }),
    },
  ),
);

type FinancialsStore = {
  financials: FinancialList[];
  financialsCombobox: Combobox[] | null;
  setFinancials: (financials: FinancialList[]) => void;
  getFinancials: () => Promise<FinancialList[]>;
  refreshFinancials: () => Promise<FinancialList[]>;
  getFinancialsCombobox: (patientId?: string) => Promise<Combobox[]>;
};
