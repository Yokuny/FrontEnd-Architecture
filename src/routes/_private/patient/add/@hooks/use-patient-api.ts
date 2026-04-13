import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DELETE, POST, PUT, request } from '@/lib/api/client.api';
import type { NewPatient } from '@/lib/interfaces/schemas/patient.schema';
import { patientKeys } from '@/query/patient';
import { patientsKeys } from '@/query/patients';

export function usePatientApi() {
  const queryClient = useQueryClient();

  const createPatient = useMutation({
    mutationFn: async (data: NewPatient) => {
      const res = await request('patient', POST(data));
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientsKeys.lists() });
    },
  });

  const updatePatient = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<NewPatient> }) => {
      const res = await request(`patient/${id}`, PUT(data));
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: patientsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
    },
  });

  const deletePatient = useMutation({
    mutationFn: async (id: string) => {
      const res = await request(`patient/${id}`, DELETE());
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: patientsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) });
    },
  });

  return { createPatient, updatePatient, deletePatient };
}
