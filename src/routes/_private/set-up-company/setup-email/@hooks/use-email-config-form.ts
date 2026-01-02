import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { type EmailConfigFormData, emailConfigSchema } from '../@interface/setup-email';
import { useSetupEnterprise, useSetupEnterpriseApi } from './use-setup-enterprise-api';

interface UseEmailConfigFormOptions {
  idEnterprise?: string;
}

export function useEmailConfigForm({ idEnterprise }: UseEmailConfigFormOptions) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: setupData, isLoading: isLoadingData } = useSetupEnterprise(idEnterprise);
  const { saveSetupEnterprise } = useSetupEnterpriseApi();

  const form = useForm<EmailConfigFormData>({
    resolver: zodResolver(emailConfigSchema) as any,
    defaultValues: {
      idEnterprise: idEnterprise || '',
      id: '',
      host: '',
      port: 587,
      secure: false,
      email: '',
      password: '',
      accountname: '',
    },
  });

  // Popular formulário quando os dados carregarem
  useEffect(() => {
    if (setupData) {
      form.reset({
        idEnterprise: idEnterprise || '',
        id: setupData.id || '',
        host: setupData.email?.host || '',
        port: setupData.email?.port || 587,
        secure: !!setupData.email?.secure,
        email: setupData.email?.auth?.user || '',
        password: '',
        accountname: setupData.email?.accountname || '',
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
    try {
      await saveSetupEnterprise.mutateAsync({
        idEnterprise: data.idEnterprise,
        id: data.id,
        email: {
          host: data.host,
          port: data.port,
          secure: data.secure,
          accountname: data.accountname,
          auth: {
            user: data.email,
            pass: data.password,
          },
        },
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
    isPending: saveSetupEnterprise.isPending,
  };
}
