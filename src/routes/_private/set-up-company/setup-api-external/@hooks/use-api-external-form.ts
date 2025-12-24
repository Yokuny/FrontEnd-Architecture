import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { type ApiExternalFormData, apiExternalSchema } from '../@interface/api-external';
import { useSetupApiExternal, useSetupApiExternalApi } from './use-setup-api-external-api';

interface UseApiExternalFormOptions {
  idEnterprise?: string;
}

export function useApiExternalForm({ idEnterprise }: UseApiExternalFormOptions) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: setupData, isLoading: isLoadingData } = useSetupApiExternal(idEnterprise);
  const { saveSetupApiExternal } = useSetupApiExternalApi();

  const form = useForm<ApiExternalFormData>({
    resolver: zodResolver(apiExternalSchema),
    defaultValues: {
      idEnterprise: idEnterprise || '',
      id: '',
      windyKey: '',
    },
  });

  // Popular formulário quando os dados carregarem
  useEffect(() => {
    if (setupData) {
      form.reset({
        idEnterprise: idEnterprise || '',
        id: setupData.id || '',
        windyKey: setupData.api?.windyKey || '',
      });
    }
  }, [setupData, idEnterprise, form]);

  // Atualizar idEnterprise no form quando mudar
  useEffect(() => {
    if (idEnterprise) {
      form.setValue('idEnterprise', idEnterprise);
    }
  }, [idEnterprise, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    // Validar se a key não é mascarada
    if (data.windyKey.includes('***')) {
      toast.warning(t('api.key.required'));
      return;
    }

    try {
      await saveSetupApiExternal.mutateAsync({
        idEnterprise: data.idEnterprise,
        id: data.id,
        windyKey: data.windyKey,
      });
      toast.success(t('success.save'));
      navigate({ to: '..' });
    } catch (_error) {
      toast.error(t('error.save'));
    }
  });

  return {
    form,
    onSubmit,
    isLoading: isLoadingData,
    isPending: saveSetupApiExternal.isPending,
  };
}
