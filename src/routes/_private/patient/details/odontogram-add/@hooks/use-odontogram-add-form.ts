import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { t } from '@/lib/helpers/translate.helper';
import { type NewOdontogram, odontogramSchema } from '@/lib/interfaces/schemas/odontogram.schema';
import { useOdontogramMutations } from '@/query/odontogram';

export function useOdontogramAddForm(patientId: string | undefined, onCancel: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { create } = useOdontogramMutations();

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

  const onSubmit = async (values: NewOdontogram) => {
    if (!patientId) return;
    const body = {
      Patient: patientId,
      teeth: values.teeth || [],
      Professional: values.Professional,
    };

    setIsSubmitting(true);
    try {
      const res = await create.mutateAsync(body);
      toast.success(res.message);
      onCancel();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t('error.create.odontogram'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
}
