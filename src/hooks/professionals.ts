import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';
import type { ProfessionalList } from '@/lib/interfaces/professional';
import type { EventColor } from '@/lib/interfaces/schedule';

export const useProfessionalColors = create<ProfessionalColorsStore>()(
  persist(
    (set, get) => ({
      colors: {},
      getColor: (id) => {
        if (!id) return null;
        return get().colors[id] ?? null;
      },
      setColor: (id, color) => {
        set((state) => ({ colors: { ...state.colors, [id]: color } }));
      },
      clearColor: (id) => {
        set((state) => {
          const { [id]: _, ...rest } = state.colors;
          return { colors: rest };
        });
      },
    }),
    {
      name: 'professional-colors',
    },
  ),
);

export const useProfessionalStore = create<ProfessionalStore>()(() => ({
  getName: (professionals, id) => {
    if (!id || !professionals) return '';
    return professionals.find((p) => p._id === id)?.name || '';
  },
  getImage: (professionals, id) => {
    if (!id || !professionals) return undefined;
    return professionals.find((p) => p._id === id)?.image || undefined;
  },
  mapToCombobox: (professionals) => {
    if (!professionals?.length) return [];
    return comboboxWithImgFormat(professionals);
  },
}));

type ProfessionalColors = Record<string, EventColor>;

type ProfessionalColorsStore = {
  colors: ProfessionalColors;
  getColor: (id: string | undefined) => EventColor | null;
  setColor: (id: string, color: EventColor) => void;
  clearColor: (id: string) => void;
};

type ProfessionalStore = {
  getName: (professionals: ProfessionalList[] | undefined, id: string | undefined) => string;
  getImage: (professionals: ProfessionalList[] | undefined, id: string | undefined) => string | undefined;
  mapToCombobox: (professionals: ProfessionalList[] | undefined) => { value: string; label: string; image?: string }[];
};
