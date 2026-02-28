import { create } from 'zustand';
import { GET, request } from '@/lib/api/fetch.config';
import type { FullPatient } from '@/lib/interfaces';

export const usePatientStore = create<PatientStore>((set, get) => ({
  patient: null,

  refreshPatient: async (id: string) => {
    try {
      const res = await request(`patient?id=${id}`, GET());
      if (!res.success) throw new Error(res.message);

      set({ patient: res.data as FullPatient });
      return res.data as FullPatient;
    } catch (e: any) {
      throw new Error(e.message);
    }
  },

  getPatient: async (id: string) => {
    const { patient } = get();
    if (patient) return patient;

    try {
      await get().refreshPatient(id);
      return get().patient;
    } catch (e: any) {
      throw new Error(e.message);
    }
  },

  setPatient: (patient: FullPatient | null) => {
    set({ patient });
  },
}));

type PatientStore = {
  patient: FullPatient | null;
  refreshPatient: (id: string) => Promise<FullPatient>;
  getPatient: (id: string) => Promise<FullPatient | null>;
  setPatient: (patient: FullPatient | null) => void;
};
