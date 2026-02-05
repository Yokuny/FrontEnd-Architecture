import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { SetupLimitsForm } from './@components/setup-limits-form';
import { useSetupLimitsForm } from './@hooks/use-setup-limits-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/set-up-company/setup-limits/')({
  component: SetupLimitsPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'setup.limits',
  }),
  staticData: {
    title: 'setup.limits',
    description:
      'Configuração de limites e quotas de uso do sistema. Defina limites de usuários, máquinas, armazenamento, requisições de API e outros recursos disponíveis para a empresa.',
    tags: ['setup', 'configuração', 'config', 'admin', 'limits', 'limites', 'quotas', 'cotas', 'recursos', 'resources', 'usage', 'uso'],
    examplePrompts: [
      'Como definir limites de uso do sistema?',
      'Onde configuro as quotas da empresa?',
      'Como aumentar o limite de usuários?',
      'Quais limites podem ser configurados?',
    ],
    searchParams: [{ name: 'id', type: 'string', description: 'ID da empresa para configurar limites', example: 'uuid-123' }],
    relatedRoutes: [{ path: '/_private/set-up-company', relation: 'parent', description: 'Hub de configurações da empresa' }],
    entities: ['Enterprise', 'LimitConfig'],
    capabilities: ['Configurar limites de uso', 'Definir quotas de recursos', 'Gerenciar limites de usuários e máquinas', 'Controlar uso de API e armazenamento'],
  },
});

function SetupLimitsPage() {
  const { id: idEnterpriseQuery } = useSearch({ from: '/_private/set-up-company/setup-limits/' });

  return <SetupLimitsFormContent idEnterprise={idEnterpriseQuery} />;
}

function SetupLimitsFormContent({ idEnterprise }: { idEnterprise?: string }) {
  const { t } = useTranslation();
  const { form, onSubmit, isLoading, isPending } = useSetupLimitsForm({
    idEnterprise,
  });

  return (
    <Card>
      <CardHeader title={t('setup.limits')} />
      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <SetupLimitsForm isEnterpriseDisabled={!!idEnterprise} />
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
