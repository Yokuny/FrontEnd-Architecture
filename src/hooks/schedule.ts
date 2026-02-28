import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GET, request } from '@/lib/api/fetch.config';
import type { PartialSchedule } from '@/lib/interfaces/schedule';

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      schedules: new Map<string, PartialSchedule[]>(),

      refreshSchedule: async (params: ScheduleParams) => {
        try {
          const paramsObj = {
            startDate: params.startDate.toISOString(),
            endDate: params.endDate.toISOString(),
          } as { startDate: string; endDate: string; roomID?: string };
          if (params.roomID && params.roomID !== 'all') {
            paramsObj.roomID = params.roomID;
          }
          const queryParams = new URLSearchParams(paramsObj);
          const res = await request(`schedule/partial?${queryParams}`, GET());
          if (!res.success) throw new Error(res.message);

          // Desativado cache: manter apenas retorno direto do backend
          // const key = `${params.startDate.toISOString()}_${params.endDate.toISOString()}_${params.roomID || 'all'}`;
          // const schedules = get().schedules;
          // schedules.set(key, res.data as PartialSchedule[]);
          // set({ schedules: new Map(schedules) });

          return res.data as PartialSchedule[];
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getSchedule: async (params: ScheduleParams) => {
        // Desativado cache: buscar sempre do backend
        // const key = `${params.startDate.toISOString()}_${params.endDate.toISOString()}_${params.roomID || 'all'}`;
        // const schedules = get().schedules;
        // const cached = schedules.get(key);
        // if (cached) return cached;

        try {
          return await get().refreshSchedule(params);
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      clearSchedules: () => {
        set({ schedules: new Map() });
      },
    }),
    {
      name: 'schedule-storage',
      partialize: (state) => ({
        schedules: Array.from(state.schedules.entries()),
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        schedules: new Map(persistedState.schedules || []),
      }),
    },
  ),
);

export type ScheduleParams = {
  startDate: Date;
  endDate: Date;
  roomID: string;
};

type ScheduleStore = {
  schedules: Map<string, PartialSchedule[]>;
  refreshSchedule: (params: ScheduleParams) => Promise<PartialSchedule[]>;
  getSchedule: (params: ScheduleParams) => Promise<PartialSchedule[]>;

  clearSchedules: () => void;
};
