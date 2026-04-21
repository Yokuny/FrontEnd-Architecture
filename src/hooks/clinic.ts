import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PartialClinic } from '@/lib/interfaces/clinic.interface';

export const useClinicStore = create<ClinicStore>()(
  persist(
    (set) => ({
      selectedRoom: null,
      setSelectedRoom: (roomID) => set({ selectedRoom: roomID }),
      getRoomName: (clinic, id) => {
        if (!id || !clinic) return '';
        const room = clinic.rooms.find((room) => room._id === id);
        return room?.name.trim() || '';
      },
    }),
    {
      name: 'clinic-ui',
      partialize: (state) => ({ selectedRoom: state.selectedRoom }),
    },
  ),
);

type ClinicStore = {
  selectedRoom: string | null;
  setSelectedRoom: (roomID: string) => void;
  getRoomName: (clinic: PartialClinic | undefined, id: string | undefined) => string;
};
