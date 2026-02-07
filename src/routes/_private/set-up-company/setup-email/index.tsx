import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { EmailConfigForm } from './@components/email-config-form';
import { useEmailConfigForm } from './@hooks/use-email-config-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/set-up-company/setup-email/')({
  component: SetupEmailPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'setup.email',
  }),
  staticData: {
    title: 'setup.email',
    description:
      'Configuração de servidor SMTP para envio de emails do sistema. Configure host, porta, credenciais e parâmetros de autenticação para envio de notificações e relatórios por email.',
    tags: ['setup', 'configuração', 'config', 'admin', 'email', 'smtp', 'mail', 'notificações', 'notifications', 'servidor', 'server', 'autenticação'],
    examplePrompts: [
      'Como configurar o servidor SMTP para emails?',
      'Como testar o envio de emails?',
      'Onde configuro as credenciais do servidor de email?',
      'Como alterar a porta do servidor SMTP?',
    ],
    searchParams: [{ name: 'id', type: 'string', description: 'ID da empresa para configurar email SMTP', example: 'uuid-123' }],
    relatedRoutes: [
      { path: '/_private/set-up-company', relation: 'parent', description: 'Hub de configurações da empresa' },
      { path: '/_private/set-up-company/setup-chatbot', relation: 'sibling', description: 'Configuração de chatbot' },
    ],
    entities: ['Enterprise', 'EmailConfig'],
    capabilities: ['Configurar servidor SMTP', 'Gerenciar credenciais de email', 'Testar envio de emails', 'Configurar parâmetros de autenticação'],
  },
});

function SetupEmailPage() {
  const { id: idEnterpriseQuery } = useSearch({ from: '/_private/set-up-company/setup-email/' });

  return <SetupEmailFormContent idEnterprise={idEnterpriseQuery} />;
}

function SetupEmailFormContent({ idEnterprise }: { idEnterprise?: string }) {
  const { t } = useTranslation();
  const { form, onSubmit, isLoading, isPending } = useEmailConfigForm({
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
              <EmailConfigForm isEnterpriseDisabled={!!idEnterprise} />
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
