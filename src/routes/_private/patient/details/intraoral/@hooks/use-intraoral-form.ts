import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PUT, request } from '@/lib/api/client';
import { intraoralSchema, type NewIntraoral } from '@/lib/interfaces/schemas/patient.schema';

export function useIntraoralForm(patientId: string | undefined, initialData: any, onCancel: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewIntraoral>({
    resolver: zodResolver(intraoralSchema),
    defaultValues: {
      hygiene: initialData?.hygiene || 'normal',
      halitosis: initialData?.halitosis || 'ausente',
      tartar: initialData?.tartar || 'ausente',
      gums: initialData?.gums || 'normal',
      mucosa: initialData?.mucosa || 'normal',
      tongue: initialData?.tongue || '',
      palate: initialData?.palate || '',
      oralFloor: initialData?.oralFloor || '',
      lips: initialData?.lips || '',
      otherObservations: initialData?.otherObservations || '',
    },
    mode: 'onChange',
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!patientId) return;
    setIsSubmitting(true);
    try {
      const res = await request(`patient/${patientId}/intraoral`, PUT(values));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      onCancel();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao salvar exame intraoral');
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    isSubmitting,
    onSubmit,
  };
}
