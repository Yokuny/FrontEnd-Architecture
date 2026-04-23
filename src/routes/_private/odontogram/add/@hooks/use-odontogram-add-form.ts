import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { usePatientStore } from '@/hooks/patients';
import { useProfessionalStore } from '@/hooks/professionals';
import { GET, request } from '@/lib/api/client.api';
import { type NewOdontogram, odontogramSchema } from '@/lib/interfaces/schemas/odontogram.schema';
import { useOdontogramMutations } from '@/query/odontogram';
import { usePatientsQuery } from '@/query/patients';
import { useProfessionalsQuery } from '@/query/professionals';

export function useOdontogramAddForm(onSuccess: (patientId: string) => void) {
  const [patientOdontogram, setPatientOdontogram] = useState<any>(null);
  const { data: patients } = usePatientsQuery();
  const { data: professionals } = useProfessionalsQuery();
  const { create } = useOdontogramMutations();

  const form = useForm<NewOdontogram>({
    resolver: zodResolver(odontogramSchema) as any,
    defaultValues: {
      Patient: '',
      Professional: '',
      finished: false,
      teeth: [],
    },
    mode: 'onChange',
  });

  const fetchPatients = useCallback(async () => {
    return usePatientStore
      .getState()
      .mapToCombobox(patients)
      .map((p) => ({ ...p, image: p.image || '' }));
  }, [patients]);

  const fetchProfessionals = useCallback(async () => {
    return useProfessionalStore
      .getState()
      .mapToCombobox(professionals)
      .map((p) => ({ ...p, image: p.image || '' }));
  }, [professionals]);

  const fetchPatientOdontogram = async (patientId: string) => {
    try {
      const res = await request(`patient/${patientId}/odontogram`, GET());
      if (res.success) setPatientOdontogram(res.data);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const clearPatientOdontogram = () => setPatientOdontogram(null);

  const onSubmit = async (values: NewOdontogram) => {
    try {
      const result = await create.mutateAsync(values);
      toast.success(result.message);
      form.reset();
      onSuccess(values.Patient);
    } catch {
      // error handled globally via MutationCache.onError
    }
  };

  return {
    form,
    patientOdontogram,
    isPending: create.isPending,
    fetchPatients,
    fetchProfessionals,
    fetchPatientOdontogram,
    clearPatientOdontogram,
    onSubmit,
  };
}
