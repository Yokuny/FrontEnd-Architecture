import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GET, request } from '@/lib/api/fetch.config';
import { type ComboboxWithImg, comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';
import type { ProfessionalList } from '@/lib/interfaces/professional';
import type { EventColor } from '@/lib/interfaces/schedule';

export const useProfessionalsStore = create<ProfessionalsStore>()(
  persist(
    (set, get) => ({
      professionals: [],
      professionalsCombobox: null,

      refreshProfessionals: async () => {
        try {
          const res = await request('user/professionals', GET());
          if (!res.success) throw new Error(res.message);

          set({ professionals: res.data as ProfessionalList[] });
          return res.data as ProfessionalList[];
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getProfessionals: async () => {
        const { professionals } = get();
        if (professionals.length > 0) return professionals;

        try {
          await get().refreshProfessionals();
          const professionalsFound = get().professionals;
          if (!professionalsFound) throw new Error('Realize o cadastro da clínica antes de continuar.');
          return professionalsFound;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getProfessionalsCombobox: async () => {
        const { professionalsCombobox } = get();
        if (professionalsCombobox) return professionalsCombobox;

        try {
          const professionals = await get().getProfessionals();
          const comboboxData = comboboxWithImgFormat(professionals);
          set({ professionalsCombobox: comboboxData });
          return comboboxData;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getProfessionalName: (id: string | undefined) => {
        const { professionals } = get();
        if (!id || professionals.length === 0) return '';
        const professional = professionals.find((professional) => professional._id === id);
        return professional?.name || '';
      },

      getProfessionalImage: (id: string | undefined) => {
        const { professionals } = get();
        if (!id || professionals.length === 0) return undefined;
        const professional = professionals.find((professional) => professional._id === id);
        return professional?.image || undefined;
      },

      getProfessionalColor: (id: string | undefined) => {
        if (!id) return null;

        try {
          const storedColors = localStorage.getItem('professional-colors');
          if (!storedColors) return null;

          const colors = JSON.parse(storedColors);
          return colors[id] || null;
        } catch {
          return null;
        }
      },

      setProfessionalColor: (id: string, color: EventColor) => {
        try {
          const storedColors = localStorage.getItem('professional-colors');
          const colors = storedColors ? JSON.parse(storedColors) : {};

          colors[id] = color;
          localStorage.setItem('professional-colors', JSON.stringify(colors));
        } catch {
          throw new Error('Erro ao salvar cor do profissional');
        }
      },

      clearProfessionalColor: (id: string) => {
        try {
          const storedColors = localStorage.getItem('professional-colors');
          if (!storedColors) return;

          const colors = JSON.parse(storedColors);
          delete colors[id];
          localStorage.setItem('professional-colors', JSON.stringify(colors));
        } catch {
          throw new Error('Erro ao limpar cor do profissional');
        }
      },

      setProfessionals: (professionals: ProfessionalList[]) => {
        set({ professionals });
      },
    }),
    {
      name: 'professionals-storage',
      partialize: (state) => ({ professionals: state.professionals }),
    },
  ),
);

type ProfessionalsStore = {
  professionals: ProfessionalList[];
  professionalsCombobox: ComboboxWithImg[] | null;
  setProfessionals: (professionals: ProfessionalList[]) => void;
  getProfessionals: () => Promise<ProfessionalList[]>;
  refreshProfessionals: () => Promise<ProfessionalList[]>;
  getProfessionalsCombobox: () => Promise<ComboboxWithImg[]>;
  getProfessionalImage: (id: string | undefined) => string | undefined;
  getProfessionalName: (id: string | undefined) => string;
  getProfessionalColor: (id: string | undefined) => EventColor | null;
  setProfessionalColor: (id: string, color: EventColor) => void;
  clearProfessionalColor: (id: string) => void;
};
