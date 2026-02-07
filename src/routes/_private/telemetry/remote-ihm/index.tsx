import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/telemetry/remote-ihm/')({
  component: RemoteIHMPage,
  staticData: {
    title: 'telemetry.remote-ihm',
    description:
      'Interface Homem-Máquina (IHM) remota. Permite acesso e monitoramento remoto de painéis de controle das embarcações. Funcionalidade em desenvolvimento - será migrada do sistema iotlog-frontend.',
    tags: ['ihm', 'hmi', 'remote-control', 'control-panel', 'scada', 'remote-access', 'monitoring', 'todo'],
    examplePrompts: ['Acessar IHM remota da embarcação', 'Monitorar painel de controle remotamente', 'Ver interface de operação remota'],
    relatedRoutes: [
      { path: '/_private/telemetry', relation: 'parent', description: 'Hub de telemetria' },
      { path: '/_private/telemetry/fleet-panel', relation: 'sibling', description: 'Painel da frota' },
    ],
    entities: ['Machine', 'RemoteIHM'],
    capabilities: ['TODO: Migração do iotlog-frontend', 'Acesso remoto a painéis de controle', 'Monitoramento de variáveis operacionais'],
  },
});

function RemoteIHMPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted */}</CardContent>
    </Card>
  );
}
