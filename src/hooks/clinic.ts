import { create } from 'zustand';
import type { PartialClinic } from '@/lib/interfaces/clinic.interface';

export const useClinicStore = create<ClinicStore>()(() => ({
  getRoomName: (clinic, id) => {
    if (!id || !clinic) return '';
    const room = clinic.rooms.find((room) => room._id === id);
    return room?.name.trim() || '';
  },
}));

type ClinicStore = {
  getRoomName: (clinic: PartialClinic | undefined, id: string | undefined) => string;
};
