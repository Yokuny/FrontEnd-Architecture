import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GET, request } from '@/lib/api/fetch.config';
import type { PartialClinic } from '@/lib/interfaces/clinic';

export const useClinicStore = create<ClinicStore>()(
  persist(
    (set, get) => ({
      clinic: null,

      refreshClinic: async () => {
        try {
          const res = await request('clinic', GET());
          if (!res.success) throw new Error(res.message);
          set({ clinic: res.data as PartialClinic });
          return res.data as PartialClinic;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getClinic: async () => {
        const { clinic } = get();
        if (clinic) return clinic;

        try {
          await get().refreshClinic();
          return get().clinic;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      setClinic: (clinic: PartialClinic) => {
        set({ clinic });
      },

      getRoomName: (id: string | undefined) => {
        const { clinic } = get();
        if (!id || !clinic) return '';
        const room = clinic.rooms.find((room) => room._id === id);
        return room?.name.trim() || '';
      },
    }),
    {
      name: 'clinic-storage',
      partialize: (state) => ({ clinic: state.clinic }),
    },
  ),
);

type ClinicStore = {
  clinic: PartialClinic | null;
  refreshClinic: () => Promise<PartialClinic>;
  getClinic: () => Promise<PartialClinic | null>;
  setClinic: (clinic: PartialClinic) => void;
  getRoomName: (id: string | undefined) => string;
};
