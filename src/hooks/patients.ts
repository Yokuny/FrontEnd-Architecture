import { create } from 'zustand';
import { comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';
import type { PartialPatient } from '@/lib/interfaces/patient';

export const usePatientStore = create<PatientStore>()(() => ({
  getName: (patients, id) => {
    if (!id || !patients) return '';
    return patients.find((p) => p._id === id)?.name.trim() || '';
  },
  getImage: (patients, id) => {
    if (!id || !patients) return undefined;
    return patients.find((p) => p._id === id)?.image || undefined;
  },
  mapToCombobox: (patients) => {
    if (!patients?.length) return [];
    return comboboxWithImgFormat(patients);
  },
}));

type PatientStore = {
  getName: (patients: PartialPatient[] | undefined, id: string | undefined) => string;
  getImage: (patients: PartialPatient[] | undefined, id: string | undefined) => string | undefined;
  mapToCombobox: (patients: PartialPatient[] | undefined) => { value: string; label: string; image?: string }[];
};
