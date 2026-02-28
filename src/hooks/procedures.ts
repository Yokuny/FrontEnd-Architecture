import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GET, request } from '@/lib/api/fetch.config';
import { procedureSheetDataFormat } from '@/lib/helpers/formatter.helper';
import type { ProcedureData, ProcedureSheet } from '@/lib/interfaces';

export const useProceduresStore = create<ProceduresStore>()(
  persist(
    (set, get) => ({
      procedures: [],
      proceduresSheet: null,

      refreshProcedures: async () => {
        try {
          const res = await request('procedure', GET());
          if (!res.success) throw new Error(res.message);

          const procedures = res.data.procedures;
          set({ procedures: procedures });
          return procedures;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getProcedures: async () => {
        const { procedures } = get();
        if (procedures.length > 0) return procedures;

        try {
          await get().refreshProcedures();
          return get().procedures;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getProceduresSheet: async () => {
        const { proceduresSheet } = get();
        if (proceduresSheet) return proceduresSheet;

        try {
          const procedures = await get().getProcedures();
          const sheetData = procedureSheetDataFormat(procedures);
          set({ proceduresSheet: sheetData });
          return sheetData;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      setProcedures: (procedures: ProcedureData[]) => {
        set({ procedures });
      },
    }),
    {
      name: 'procedures-storage',
      partialize: (state) => ({ procedures: state.procedures }),
    },
  ),
);

type ProceduresStore = {
  procedures: ProcedureData[];
  proceduresSheet: ProcedureSheet[] | null;
  refreshProcedures: () => Promise<ProcedureData[]>;
  getProcedures: () => Promise<ProcedureData[]>;
  getProceduresSheet: () => Promise<ProcedureSheet[]>;
  setProcedures: (procedures: ProcedureData[]) => void;
};
