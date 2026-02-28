import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EventColor } from '@/lib/interfaces/schedule';

type ProfessionalColors = Record<string, EventColor>;

type ProfessionalColorsStore = {
  colors: ProfessionalColors;
  getColor: (id: string | undefined) => EventColor | null;
  setColor: (id: string, color: EventColor) => void;
  clearColor: (id: string) => void;
};

/**
 * Client State de cores dos profissionais (preferência de UI).
 * Dados dos profissionais (server state) vivem no TanStack Query via useProfessionalsQuery em @/query/professionals.
 */
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
