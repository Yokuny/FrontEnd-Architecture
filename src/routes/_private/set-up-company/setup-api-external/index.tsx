import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { ApiExternalForm } from './@components/api-external-form';
import { useApiExternalForm } from './@hooks/use-api-external-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/set-up-company/setup-api-external/')({
  component: SetupApiExternalPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'setup.api.external',
  }),
  staticData: {
    title: 'setup.api.external',
    description:
      'Configuração de APIs externas e chaves de acesso para serviços de terceiros. Configure integrações com Windy e outros serviços meteorológicos e de dados externos.',
    tags: ['setup', 'configuração', 'config', 'admin', 'api', 'external api', 'api externa', 'integration', 'integração', 'windy', 'chaves', 'keys', 'terceiros'],
    examplePrompts: [
      'Como configurar a chave da API Windy?',
      'Onde adiciono chaves de APIs externas?',
      'Como testar uma API externa configurada?',
      'Como trocar a chave de acesso de um serviço externo?',
    ],
    searchParams: [{ name: 'id', type: 'string', description: 'ID da empresa para configurar APIs externas', example: 'uuid-123' }],
    relatedRoutes: [
      { path: '/_private/set-up-company', relation: 'parent', description: 'Hub de configurações da empresa' },
      { path: '/_private/set-up-company/external-users', relation: 'sibling', description: 'Usuários externos' },
      { path: '/_private/set-up-company/integration-list', relation: 'sibling', description: 'Lista de integrações' },
    ],
    entities: ['Enterprise', 'ApiConfig', 'Integration'],
    capabilities: ['Configurar chaves de APIs externas', 'Gerenciar credenciais de serviços terceiros', 'Integrar com Windy API', 'Atualizar configurações de APIs'],
  },
});

function SetupApiExternalPage() {
  const { id: idEnterpriseQuery } = useSearch({ from: '/_private/set-up-company/setup-api-external/' });

  return <SetupApiExternalFormContent idEnterprise={idEnterpriseQuery} />;
}

function SetupApiExternalFormContent({ idEnterprise }: { idEnterprise?: string }) {
  const { t } = useTranslation();
  const { form, onSubmit, isLoading, isPending } = useApiExternalForm({
    idEnterprise,
  });

  const windyKeyValue = form.watch('windyKey');
  const isKeyMasked = windyKeyValue?.includes('***');

  return (
    <Card>
      <CardHeader title={t('setup.api.external')} />
      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <ApiExternalForm showEnterpriseSelect={!idEnterprise} />
              <CardFooter className="mt-6 px-0 pt-6">
                <Button type="submit" disabled={isPending || isLoading || isKeyMasked} className="min-w-[120px]">
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
