import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { usePtaxApi } from '@/hooks/use-ptax-api';
import { type PtaxFormData, ptaxSchema } from '../@interface/ptax.schema';

export function usePtaxForm(initialData?: PtaxFormData, onSuccess?: () => void) {
  const { t } = useTranslation();
  const { createPtax, updatePtax } = usePtaxApi();
  const { idEnterprise } = useEnterpriseFilter();

  const form = useForm<PtaxFormData>({
    resolver: zodResolver(ptaxSchema),
    defaultValues: initialData || {
      date: new Date().toISOString(),
      value: 0,
      idEnterprise,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const payload = { ...data, idEnterprise: data.idEnterprise || idEnterprise };
      if (data.id) {
        await updatePtax.mutateAsync(payload);
        toast.success(t('save.success'));
      } else {
        await createPtax.mutateAsync(payload);
        toast.success(t('save.success'));
      }
      onSuccess?.();
    } catch {
      toast.error(t('server.error'));
    }
  });

  return {
    form,
    onSubmit,
    isLoading: createPtax.isPending || updatePtax.isPending,
  };
}
