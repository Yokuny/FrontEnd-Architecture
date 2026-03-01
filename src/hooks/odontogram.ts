import { create } from 'zustand';
import { valueAndLabel } from '@/lib/helpers/formatter.helper';
import type { PartialOdontogram } from '@/lib/interfaces/odontogram';

export const useOdontogramStore = create<OdontogramStore>()(() => ({
  mapToCombobox: (odontograms, patientId) => {
    if (!odontograms?.length) return [{ value: '', label: 'Nenhum odontograma encontrado' }];
    const filtered = patientId ? odontograms.filter((o) => o.patientID === patientId) : odontograms;
    return filtered.map((o) => valueAndLabel(o._id, new Date(o.createdAt).toLocaleDateString('pt-BR').trim()));
  },
}));

type OdontogramStore = {
  mapToCombobox: (odontograms: PartialOdontogram[] | undefined, patientId?: string) => { value: string; label: string }[];
};
