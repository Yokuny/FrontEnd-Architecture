import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { type SetupChatbotFormData, setupChatbotSchema } from '../@interface/setup-chatbot';
import { useSetupChatbot, useSetupChatbotApi } from './use-setup-chatbot-api';

interface UseSetupChatbotFormOptions {
  idEnterprise?: string;
}

export function useSetupChatbotForm({ idEnterprise }: UseSetupChatbotFormOptions) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: chatbotData, isLoading: isLoadingData } = useSetupChatbot(idEnterprise);
  const { saveChatbot } = useSetupChatbotApi();

  const form = useForm<SetupChatbotFormData>({
    resolver: zodResolver(setupChatbotSchema),
    defaultValues: {
      idEnterprise: idEnterprise || '',
      id: '',
      phone: '',
      messageWelcome: '',
    },
  });

  useEffect(() => {
    if (chatbotData) {
      form.reset({
        idEnterprise: idEnterprise || '',
        id: chatbotData.id || '',
        phone: chatbotData.chatbot?.phone || '',
        messageWelcome: chatbotData.chatbot?.messageWelcome || '',
      });
    }
  }, [chatbotData, idEnterprise, form]);

  useEffect(() => {
    if (idEnterprise) {
      form.setValue('idEnterprise', idEnterprise);
    }
  }, [idEnterprise, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await saveChatbot.mutateAsync({
        idEnterprise: data.idEnterprise,
        id: data.id,
        chatbot: {
          phone: data.phone || '',
          messageWelcome: data.messageWelcome || '',
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
    isPending: saveChatbot.isPending,
  };
}
