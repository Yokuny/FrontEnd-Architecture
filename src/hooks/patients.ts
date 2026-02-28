import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GET, request } from '@/lib/api/fetch.config';
import { type ComboboxWithImg, comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';
import type { PartialPatient } from '@/lib/interfaces/patient';

export const usePatientsStore = create<PatientsStore>()(
  persist(
    (set, get) => ({
      patients: [],
      patientsCombobox: null,

      refreshPatients: async () => {
        try {
          const res = await request('patient/partial', GET());
          if (!res.success) throw new Error(res.message);

          const patientsData = res.data as PartialPatient[];
          set({ patients: patientsData });
          return patientsData;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getPatients: async () => {
        const { patients } = get();
        if (patients.length > 0) return patients;

        try {
          await get().refreshPatients();
          return get().patients;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getPatientsCombobox: async () => {
        const { patientsCombobox } = get();
        if (patientsCombobox) return patientsCombobox;

        try {
          const patients = await get().getPatients();
          const comboboxData = comboboxWithImgFormat(patients);
          set({ patientsCombobox: comboboxData });
          return comboboxData;
        } catch (e: any) {
          throw new Error(e.message);
        }
      },

      getPatientName: (id: string | undefined) => {
        const { patients } = get();
        if (!id || patients.length === 0) return '';
        const patient = patients.find((patient) => patient._id === id);
        return patient?.name.trim() || '';
      },

      getPatientImage: (id: string | undefined) => {
        const { patients } = get();
        if (!id || patients.length === 0) return undefined;
        const patient = patients.find((patient) => patient._id === id);
        return patient?.image || undefined;
      },

      setPatients: (patients: PartialPatient[]) => {
        set({ patients });
      },
    }),
    {
      name: 'patients-storage',
      partialize: (state) => ({ patients: state.patients }),
    },
  ),
);

type PatientsStore = {
  patients: PartialPatient[];
  patientsCombobox: ComboboxWithImg[] | null;
  setPatients: (patients: PartialPatient[]) => void;
  refreshPatients: () => Promise<PartialPatient[]>;
  getPatients: () => Promise<PartialPatient[]>;
  getPatientsCombobox: () => Promise<ComboboxWithImg[]>;
  getPatientImage: (id: string | undefined) => string | undefined;
  getPatientName: (id: string | undefined) => string;
};
