import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useProfessionalStore } from '@/hooks/professionals';
import { t } from '@/lib/helpers/translate.helper';
import { type NewOdontogram, odontogramSchema } from '@/lib/interfaces/schemas/odontogram.schema';
import { useOdontogramMutations } from '@/query/odontogram';
import { useProfessionalsQuery } from '@/query/professionals';

export function useOdontogramAddForm(patientId: string | undefined, onCancel: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: professionals } = useProfessionalsQuery();
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

  const fetchProfessionals = useCallback(async () => {
    return useProfessionalStore
      .getState()
      .mapToCombobox(professionals)
      .map((p) => ({ ...p, image: p.image || '' }));
  }, [professionals]);

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
    fetchProfessionals,
    onSubmit,
  };
}
