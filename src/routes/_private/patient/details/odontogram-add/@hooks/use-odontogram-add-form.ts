import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { GET, POST, request } from '@/lib/api/client';
import { comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';
import { type NewOdontogram, odontogramSchema } from '@/lib/interfaces/schemas/odontogram.schema';

export function useOdontogramAddForm(patientId: string | undefined, onCancel: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewOdontogram>({
    resolver: zodResolver(odontogramSchema) as any,
    defaultValues: {
      Patient: patientId || '',
      Professional: '',
      finished: false,
      teeth: [],
    },
    mode: 'onChange',
  });

  const fetchProfessionals = async () => {
    const res = await request('user/professionals', GET());
    return comboboxWithImgFormat(res.data);
  };

  const onSubmit = async (values: NewOdontogram) => {
    if (!patientId) return;
    const body = {
      Patient: patientId,
      teeth: values.teeth || [],
      Professional: values.Professional,
    };

    setIsSubmitting(true);
    try {
      const res = await request('odontogram/create', POST(body));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      onCancel();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao cadastrar odontograma');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    fetchProfessionals,
    onSubmit,
  };
}
