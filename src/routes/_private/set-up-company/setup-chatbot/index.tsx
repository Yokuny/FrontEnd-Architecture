import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { SetupChatbotForm } from './@components/setup-chatbot-form';
import { useSetupChatbotForm } from './@hooks/use-setup-chatbot-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/set-up-company/setup-chatbot/')({
  component: SetupChatbotPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'setup.chatbot',
  }),
  staticData: {
    title: 'setup.chatbot',
    description:
      'Configuração de chatbot e integração com WhatsApp para notificações e comunicação automatizada. Configure credenciais, webhooks e parâmetros de conexão com serviços de mensageria.',
    tags: [
      'setup',
      'configuração',
      'config',
      'admin',
      'chatbot',
      'whatsapp',
      'bot',
      'mensagens',
      'messages',
      'integration',
      'integração',
      'notificações',
      'notifications',
      'webhook',
    ],
    examplePrompts: [
      'Como configurar o chatbot do WhatsApp?',
      'Como integrar notificações via chatbot?',
      'Onde configuro as credenciais do bot?',
      'Como testar o chatbot configurado?',
    ],
    searchParams: [{ name: 'id', type: 'string', description: 'ID da empresa para configurar chatbot', example: 'uuid-123' }],
    relatedRoutes: [
      { path: '/_private/set-up-company', relation: 'parent', description: 'Hub de configurações da empresa' },
      { path: '/_private/set-up-company/setup-email', relation: 'sibling', description: 'Configuração de email' },
      { path: '/_private/set-up-company/setup-api-external', relation: 'sibling', description: 'Configuração de APIs externas' },
    ],
    entities: ['Enterprise', 'ChatbotConfig', 'Integration'],
    capabilities: ['Configurar integração com WhatsApp', 'Gerenciar credenciais do chatbot', 'Configurar webhooks de mensageria', 'Ativar notificações automatizadas'],
  },
});

function SetupChatbotPage() {
  const { id: idEnterpriseQuery } = useSearch({ from: '/_private/set-up-company/setup-chatbot/' });

  return <SetupChatbotFormContent idEnterprise={idEnterpriseQuery} />;
}

function SetupChatbotFormContent({ idEnterprise }: { idEnterprise?: string }) {
  const { t } = useTranslation();
  const { form, onSubmit, isLoading, isPending } = useSetupChatbotForm({
    idEnterprise,
  });

  return (
    <Card>
      <CardHeader />
      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <SetupChatbotForm isEnterpriseDisabled={!!idEnterprise} />
              <CardFooter className="mt-6 px-0 pt-6">
                <Button type="submit" disabled={isPending || isLoading} className="min-w-[120px]">
                  {isPending ? <Spinner className="mr-2 size-4" /> : <Save className="mr-2 size-4" />}
                  {t('save')}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
