import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { GET, POST, request } from '@/lib/api/client';
import { comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';

export function useFinancialAddForm(patientId: string | undefined, onCancel: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<any>({
    defaultValues: {
      Patient: patientId || '',
      Professional: '',
      procedures: [{ procedure: '', price: 0, status: 'pending' as const }],
      price: 0,
      paid: 0,
      status: 'pending' as const,
      paymentMethod: 'none',
      installments: 1,
    },
    mode: 'onChange',
  });

  const procedures = form.watch('procedures') || [];
  const proceduresWithPrice = procedures.filter((proc: any) => proc.price && proc.price > 0);
  const allPending = proceduresWithPrice.every((proc: any) => proc.status === 'pending');
  const allPaid = proceduresWithPrice.every((proc: any) => proc.status === 'paid');
  const currentStatus = proceduresWithPrice.length === 0 ? 'pending' : allPaid ? 'paid' : allPending ? 'pending' : 'partial';
  const totalPrice = procedures.reduce((acc: number, curr: any) => acc + (Number(curr.price) || 0), 0);

  useEffect(() => {
    form.setValue('status', currentStatus);
    form.setValue('price', totalPrice);
  }, [currentStatus, totalPrice, form]);

  const fetchProfessionals = async () => {
    const res = await request('user/professionals', GET());
    return comboboxWithImgFormat(res.data);
  };

  const handleSubmit = async () => {
    if (!patientId) return;
    const values = form.getValues();

    if (!values.Professional) {
      toast.error('Selecione o profissional');
      return;
    }

    const body = {
      Patient: patientId,
      Professional: values.Professional,
      procedures: values.procedures,
      price: values.price,
      paid: values.paid,
      status: values.status,
      paymentMethod: values.paymentMethod,
      installments: values.installments,
    };

    setIsSubmitting(true);
    try {
      const res = await request('financial/create', POST(body));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      onCancel();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao criar registro financeiro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    fetchProfessionals,
    handleSubmit,
  };
}
