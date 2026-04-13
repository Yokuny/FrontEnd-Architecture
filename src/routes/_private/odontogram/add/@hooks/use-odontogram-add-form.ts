import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { GET, request } from '@/lib/api/client.api';
import { comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';
import { type NewOdontogram, odontogramSchema } from '@/lib/interfaces/schemas/odontogram.schema';
import { useOdontogramMutations } from '@/query/odontogram';

export function useOdontogramAddForm(onSuccess: (patientId: string) => void) {
  const [patientOdontogram, setPatientOdontogram] = useState<any>(null);
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

  const fetchPatients = async () => {
    const res = await request('patient/partial', GET());
    return comboboxWithImgFormat(res.data);
  };

  const fetchProfessionals = async () => {
    const res = await request('user/professionals', GET());
    return comboboxWithImgFormat(res.data);
  };

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
