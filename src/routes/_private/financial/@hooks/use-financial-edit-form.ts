import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useFinancialMutations } from '@/query/financials';
import { type FinancialUpdateData, financialUpdateSchema } from '../@interface/financial.interface';

export function useFinancialEditForm(id: string, initialData?: Partial<FinancialUpdateData>) {
  const { update } = useFinancialMutations();

  const form = useForm<FinancialUpdateData>({
    resolver: zodResolver(financialUpdateSchema),
    defaultValues: {
      price: initialData?.price || 0,
      paid: initialData?.paid || 0,
      paymentMethod: initialData?.paymentMethod || 'none',
      installments: initialData?.installments || 1,
      status: initialData?.status || 'pending',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const res = await update.mutateAsync({ id, body: values });
      toast.success(res.message);
    } catch (e: any) {
      toast.error(e.message);
    }
  });

  return { form, onSubmit, isPending: update.isPending };
}
