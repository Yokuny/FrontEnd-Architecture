import { useQuery } from '@tanstack/react-query';
import { GET, request } from '@/lib/api/client';
import { comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';
import type { PartialPatient } from '@/lib/interfaces/patient';

export const patientsKeys = {
  all: ['patients'] as const,
  lists: () => [...patientsKeys.all, 'list'] as const,
  list: () => [...patientsKeys.lists()] as const,
};

async function fetchPatients(): Promise<PartialPatient[]> {
  const res = await request('patient/partial', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as PartialPatient[];
}

export function usePatientsQuery() {
  return useQuery({
    queryKey: patientsKeys.list(),
    queryFn: fetchPatients,
  });
}

// --- Utilitários puros (recebem os dados como argumento) ---

export function getPatientName(patients: PartialPatient[] | undefined, id: string | undefined): string {
  if (!id || !patients) return '';
  return patients.find((p) => p._id === id)?.name.trim() || '';
}

export function getPatientImage(patients: PartialPatient[] | undefined, id: string | undefined): string | undefined {
  if (!id || !patients) return undefined;
  return patients.find((p) => p._id === id)?.image || undefined;
}

export function mapPatientsToCombobox(patients: PartialPatient[] | undefined) {
  if (!patients?.length) return [];
  return comboboxWithImgFormat(patients);
}
