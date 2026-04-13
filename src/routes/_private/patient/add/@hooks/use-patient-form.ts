import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { NewPatient } from '@/lib/interfaces/schemas/patient.schema';
import { patientSchema } from '@/lib/interfaces/schemas/patient.schema';
import { usePatientApi } from './use-patient-api';

export function usePatientForm(initialData?: Partial<NewPatient> & { id?: string }, onSuccess?: (id: string) => void) {
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
      const result = await updatePatient.mutateAsync({ id: initialData.id, data });
      toast.success(result.message);
      onSuccess?.(initialData.id);
    } else {
      const result = await createPatient.mutateAsync(data);
      toast.success(result.message);
      onSuccess?.(result.data._id);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createPatient.isPending || updatePatient.isPending,
  };
}
