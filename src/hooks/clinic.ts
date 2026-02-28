import { create } from 'zustand';
import type { PartialClinic } from '@/lib/interfaces/clinic';

type ClinicStore = {
  getRoomName: (clinic: PartialClinic | undefined, id: string | undefined) => string;
};

/**
 * useClinicStore - Client State only.
 * Dados da clínica (server state) vivem no TanStack Query via useClinicApi.
 * Este store guarda apenas utilitários de UI derivados do dado recebido.
 */
export const useClinicStore = create<ClinicStore>()(() => ({
  getRoomName: (clinic, id) => {
    if (!id || !clinic) return '';
    const room = clinic.rooms.find((room) => room._id === id);
    return room?.name.trim() || '';
  },
}));
