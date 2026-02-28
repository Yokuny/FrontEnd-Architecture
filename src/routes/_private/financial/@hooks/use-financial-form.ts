import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useFinancialMutations } from '@/query/financials';
import { type FinancialCreateData, financialCreateSchema } from '../@interface/financial.interface';

export function useFinancialCreateForm() {
  const navigate = useNavigate();
  const { create } = useFinancialMutations();

  const form = useForm<FinancialCreateData>({
    resolver: zodResolver(financialCreateSchema),
    defaultValues: {
      Patient: '',
      Professional: '',
      procedures: [{ procedure: '', price: 0, status: 'pending' }],
      price: 0,
      paid: 0,
      status: 'pending',
      paymentMethod: 'none',
      installments: 1,
    },
    mode: 'onChange',
  });

  const procedures = form.watch('procedures') || [];
  const proceduresWithPrice = procedures.filter((proc) => proc.price && proc.price > 0);
  const allPending = proceduresWithPrice.every((proc) => proc.status === 'pending');
  const allPaid = proceduresWithPrice.every((proc) => proc.status === 'paid');

  const currentStatus = proceduresWithPrice.length === 0 ? 'pending' : allPaid ? 'paid' : allPending ? 'pending' : 'partial';
  const totalPrice = procedures.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  useEffect(() => {
    form.setValue('status', currentStatus);
    form.setValue('price', totalPrice);
  }, [currentStatus, totalPrice, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (!values.Professional) throw new Error('Selecione o profissional');
      const res = await create.mutateAsync(values);
      toast.success(res.message);
      form.reset();
      navigate({ to: '/financial' });
    } catch (e: any) {
      toast.error(e.message);
    }
  });

  return { form, onSubmit, isPending: create.isPending };
}
