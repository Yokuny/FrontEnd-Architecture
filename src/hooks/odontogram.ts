import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GET, request } from '@/lib/api/fetch.config';
import { type Combobox, valueAndLabel } from '@/lib/helpers/formatter.helper';
import type { OdontogramList } from '@/lib/interfaces/odontogram';

export const useOdontogramStore = create<OdontogramStore>()(
  persist(
    (set, get) => ({
      odontograms: [],
      odontogramsCombobox: null,

      refreshOdontograms: async () => {
        try {
          const res = await request('odontogram/list', GET());
          if (!res.success) throw new Error(res.message);

          set({ odontograms: res.data as OdontogramList[] });
          return res.data as OdontogramList[];
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getOdontograms: async () => {
        const { odontograms } = get();
        if (odontograms.length > 0) return odontograms;

        try {
          await get().refreshOdontograms();
          return get().odontograms;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getOdontogramsCombobox: async (patientID?: string) => {
        const { odontogramsCombobox } = get();
        if (odontogramsCombobox) return odontogramsCombobox;

        const filterOdontograms = (odontograms: OdontogramList[], patientID?: string) => {
          if (patientID) return odontograms.filter((item) => item.Patient === patientID);
          return odontograms;
        };

        try {
          const odontograms = await get().getOdontograms();
          if (!odontograms.length) return [{ value: '', label: 'Nenhum odontograma encontrado' }];

          const filtered = filterOdontograms(odontograms, patientID);

          const formattedData = filtered.map((odontogram) => valueAndLabel(odontogram._id, new Date(odontogram.createdAt).toLocaleDateString('pt-BR').trim()));

          return formattedData;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      setOdontograms: (odontograms: OdontogramList[]) => {
        set({ odontograms });
      },
    }),
    {
      name: 'odontograms-storage',
      partialize: (state) => ({ odontograms: state.odontograms }),
    },
  ),
);

type OdontogramStore = {
  odontograms: OdontogramList[];
  odontogramsCombobox: Combobox[] | null;
  setOdontograms: (odontograms: OdontogramList[]) => void;
  getOdontograms: () => Promise<OdontogramList[]>;
  refreshOdontograms: () => Promise<OdontogramList[]>;
  getOdontogramsCombobox: (patientId?: string) => Promise<Combobox[]>;
};
