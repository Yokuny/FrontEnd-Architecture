import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useContractsApi } from '@/hooks/use-contracts-api';
import { type ContractFormData, contractSchema } from '../@interface/contract';

export function useContractForm(initialData?: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createContract, updateContract } = useContractsApi();

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema) as any,
    values: initialData,
    defaultValues: {
      idEnterprise: '',
      description: '',
      customer: '',
      competence: 'eof',
      groupConsumption: [],
      operations: [],
      events: [],
      ...initialData,
    },
  });

  const onSubmit = form.handleSubmit(
    async (values) => {
      try {
        if (values.id) {
          await updateContract.mutateAsync(values as any);
        } else {
          await createContract.mutateAsync(values as any);
        }
        toast.success(t('save.successfull'));
        navigate({ to: '/register/contracts' as any, search: { page: 1, size: 10 } as any });
      } catch {
        // Error handled by API client
      }
    },
    (errors) => {
      toast.error(t('error.form.validation', 'Please check the required fields.'));
      if (Object.keys(errors).length > 0) {
        // Safe way to notify about nested errors without console.error for lint
        const firstErrorField = Object.keys(errors)[0];
        toast.error(`${t('field.error')}: ${firstErrorField}`);
      }
    },
  );

  return {
    form,
    onSubmit,
    isPending: createContract.isPending || updateContract.isPending,
  };
}
