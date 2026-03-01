import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { NewPatient } from '@/lib/interfaces/schemas/patient.schema';
import { patientSchema } from '@/lib/interfaces/schemas/patient.schema';
import { usePatientApi } from './use-patient-api';

export function usePatientForm(initialData?: Partial<NewPatient> & { id?: string }) {
  const { createPatient, updatePatient } = usePatientApi();

  const form = useForm<NewPatient>({
    resolver: zodResolver(patientSchema),
    values: initialData as NewPatient,
    defaultValues: {
      name: '',
      email: undefined,
      cpf: undefined,
      rg: undefined,
      birthdate: undefined,
      sex: 'M',
      phone: [],
      cep: undefined,
      address: undefined,
      ...initialData,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    if (initialData?.id) {
      await updatePatient.mutateAsync({ id: initialData.id, data });
    } else {
      await createPatient.mutateAsync(data);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createPatient.isPending || updatePatient.isPending,
  };
}
