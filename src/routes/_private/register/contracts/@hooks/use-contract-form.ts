import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
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

  // Reset form when initialData changes (e.g. after fetching existing contract)
  useEffect(() => {
    if (initialData) {
      form.reset({
        idEnterprise: '',
        description: '',
        customer: '',
        competence: 'eof',
        groupConsumption: [],
        operations: [],
        events: [],
        ...initialData,
      });
    }
  }, [initialData, form]);

  const onSubmit = form.handleSubmit(async (values) => {
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
  });

  return {
    form,
    onSubmit,
    isPending: createContract.isPending || updateContract.isPending,
  };
}
