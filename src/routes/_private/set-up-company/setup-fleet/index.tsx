import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { SetupFleetForm } from './@components/setup-fleet-form';
import { useSetupFleetForm } from './@hooks/use-setup-fleet-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/set-up-company/setup-fleet/')({
  component: SetupFleetPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'setup.fleet',
  }),
  staticData: {
    title: 'setup.fleet',
    description:
      'Configuração de parâmetros da frota e integração com sistemas de rastreamento Fleet. Defina configurações gerais para gestão e monitoramento da frota de embarcações.',
    tags: ['setup', 'configuração', 'config', 'admin', 'fleet', 'frota', 'embarcações', 'rastreamento', 'tracking', 'monitoramento', 'monitoring'],
    examplePrompts: [
      'Como configurar a frota no sistema?',
      'Onde defino os parâmetros da frota?',
      'Como integrar o sistema Fleet?',
      'Quais configurações estão disponíveis para a frota?',
    ],
    searchParams: [{ name: 'id', type: 'string', description: 'ID da empresa para configurar frota', example: 'uuid-123' }],
    relatedRoutes: [
      { path: '/_private/set-up-company', relation: 'parent', description: 'Hub de configurações da empresa' },
      { path: '/_private/set-up-company/integration-list', relation: 'sibling', description: 'Lista de integrações AIS' },
      { path: '/_private/machines', relation: 'sibling', description: 'Gerenciamento de máquinas' },
    ],
    entities: ['Enterprise', 'FleetConfig', 'Machine'],
    capabilities: ['Configurar parâmetros da frota', 'Integrar com sistema Fleet', 'Definir configurações de rastreamento', 'Gerenciar configurações de embarcações'],
  },
});

function SetupFleetPage() {
  const { id: idEnterpriseQuery } = useSearch({ from: '/_private/set-up-company/setup-fleet/' });

  return <SetupFleetFormContent idEnterprise={idEnterpriseQuery} />;
}

function SetupFleetFormContent({ idEnterprise }: { idEnterprise?: string }) {
  const { t } = useTranslation();
  const { form, onSubmit, isLoading, isPending } = useSetupFleetForm({
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
              <SetupFleetForm isEnterpriseDisabled={!!idEnterprise} />
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
