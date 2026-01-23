import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { type SetupLimitsFormData, setupLimitsSchema } from '../@interface/setup-limits';
import { useSetupLimits, useSetupLimitsApi } from './use-setup-limits-api';

interface UseSetupLimitsFormOptions {
  idEnterprise?: string;
}

export function useSetupLimitsForm({ idEnterprise }: UseSetupLimitsFormOptions) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: limitsData, isLoading: isLoadingData } = useSetupLimits(idEnterprise);
  const { saveLimits } = useSetupLimitsApi();

  const form = useForm<SetupLimitsFormData>({
    resolver: zodResolver(setupLimitsSchema),
    defaultValues: {
      idEnterprise: idEnterprise || '',
      maxContacts: 0,
      maxUsers: 0,
      maxRequestHistorySensorApi: 0,
      maxRequestHistoryFleetApi: 0,
      maxRequestOffhireApi: 0,
    },
  });

  useEffect(() => {
    if (limitsData) {
      form.reset({
        idEnterprise: idEnterprise || '',
        maxContacts: limitsData.chatbot?.maxContacts || 0,
        maxUsers: limitsData.user?.maxUsers || 0,
        maxRequestHistorySensorApi: limitsData.api?.maxRequestHistorySensorApi || 0,
        maxRequestHistoryFleetApi: limitsData.api?.maxRequestHistoryFleetApi || 0,
        maxRequestOffhireApi: limitsData.api?.maxRequestOffhireApi || 0,
      });
    }
  }, [limitsData, idEnterprise, form]);

  useEffect(() => {
    if (idEnterprise) {
      form.setValue('idEnterprise', idEnterprise);
    }
  }, [idEnterprise, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await saveLimits.mutateAsync({
        idEnterprise: data.idEnterprise,
        chatbot: { maxContacts: data.maxContacts },
        user: { maxUsers: data.maxUsers },
        api: {
          maxRequestHistorySensorApi: data.maxRequestHistorySensorApi,
          maxRequestHistoryFleetApi: data.maxRequestHistoryFleetApi,
          maxRequestOffhireApi: data.maxRequestOffhireApi,
        },
      });
      toast.success(t('save.success'));
      navigate({ to: '..' });
    } catch (_error) {
      toast.error(t('error.save'));
    }
  });

  return {
    form,
    onSubmit,
    isLoading: isLoadingData,
    isPending: saveLimits.isPending,
  };
}
