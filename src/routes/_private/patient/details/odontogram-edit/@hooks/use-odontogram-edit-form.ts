import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PUT, request } from '@/lib/api/client.api';
import { type NewPatientOdontogram, patientOdontogramSchema } from '@/lib/interfaces/schemas/patient.schema';
import type { ToothStatusType } from '../@consts/tooth-data';

export function useOdontogramEditForm(patientId: string | undefined, initialOdontogram: any[] | undefined, onCancel: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewPatientOdontogram>({
    resolver: zodResolver(patientOdontogramSchema),
    defaultValues: {
      odontogram: initialOdontogram || [],
    },
    mode: 'onChange',
  });

  // Update form if initialOdontogram changes (e.g. after data fetch)
  useEffect(() => {
    if (initialOdontogram) {
      form.reset({ odontogram: initialOdontogram });
    }
  }, [initialOdontogram, form]);

  const getCurrentToothStatus = (toothNumber: number): ToothStatusType => {
    const odontogram = form.getValues('odontogram') || [];
    const tooth = odontogram.find((t) => t.number === toothNumber);
    return (tooth?.status as ToothStatusType) || 'normal';
  };

  const handleToothStatus = (toothNumber: number, status: ToothStatusType) => {
    const prev = form.getValues('odontogram') || [];
    const index = prev.findIndex((tooth) => tooth.number === toothNumber);

    if (index === -1) {
      form.setValue('odontogram', [...prev, { number: toothNumber, status }]);
    } else {
      const updated = [...prev];
      updated[index] = { number: toothNumber, status };
      form.setValue('odontogram', updated);
    }
  };

  const onSubmit = async () => {
    if (!patientId) return;
    const values = form.getValues();
    setIsSubmitting(true);
    try {
      const res = await request(`patient/${patientId}/odontogram`, PUT(values));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      onCancel();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao atualizar odontograma');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    getCurrentToothStatus,
    handleToothStatus,
    onSubmit,
  };
}
