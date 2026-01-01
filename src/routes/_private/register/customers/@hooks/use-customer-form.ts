import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useCustomer, useCustomersApi } from '@/hooks/use-customers-api';
import { type CustomerFormData, customerFormSchema } from '../@interface/customer';

export function useCustomerForm({ id, redirect }: { id?: string; redirect?: () => void }) {
  const { t } = useTranslation();
  const { createUpdate, remove } = useCustomersApi();
  const { data: initialData, isLoading: isLoadingData } = useCustomer(id || null);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      idEnterprise: '',
      name: '',
    },
    values: initialData
      ? {
          id: initialData.id,
          idEnterprise: initialData.enterprise?.id || '',
          name: initialData.name,
        }
      : undefined,
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      await createUpdate.mutateAsync(data);
      toast.success(t('save.successfull'));
      redirect?.();
    } catch {
      toast.error(t('error.save'));
    }
  };

  const onDelete = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast.success(t('delete.successfull'));
      redirect?.();
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return { form, onSubmit, onDelete, isLoadingData };
}
