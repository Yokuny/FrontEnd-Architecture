import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/operation/downtime/')({
  staticData: {
    title: 'downtime',
    description:
      'Análise e monitoramento de tempo de inatividade (downtime) da frota. Permite visualizar e categorizar períodos de parada operacional, incluindo downtime técnico, operacional, climático e portuário. Fundamental para calcular disponibilidade, uptime e identificar gargalos operacionais.',
    tags: [
      'downtime',
      'inatividade',
      'parada',
      'operational',
      'operacional',
      'technical',
      'técnico',
      'weather',
      'climático',
      'port',
      'portuário',
      'availability',
      'disponibilidade',
      'off-hire',
      'uptime',
    ],
    examplePrompts: [
      'Analisar downtime da frota',
      'Ver períodos de inatividade operacional',
      'Categorizar paradas técnicas',
      'Monitorar off-hire dos navios',
      'Calcular disponibilidade operacional',
    ],
    searchParams: [],
    relatedRoutes: [
      { path: '/_private/operation', relation: 'parent', description: 'Hub operacional' },
      { path: '/_private/operation/operational-asset', relation: 'sibling', description: 'Performance de ativos' },
      { path: '/_private/operation/operational-fleet', relation: 'sibling', description: 'Dashboard da frota' },
    ],
    entities: ['Machine', 'Downtime', 'OperationalData', 'Enterprise'],
    capabilities: [
      'Visualizar períodos de downtime',
      'Categorizar tipos de parada',
      'Analisar off-hire',
      'Calcular availability',
      'Identificar paradas técnicas',
      'Monitorar paradas operacionais',
    ],
  },
  component: DowntimePage,
});

function DowntimePage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader />
      <CardContent>
        <p className="text-muted-foreground">{t('operation.downtime.description')}</p>
        <div className="mt-8 flex items-center justify-center rounded-lg border-2 border-dashed p-8">
          <p className="text-muted-foreground text-sm">Conteúdo em migração...</p>
        </div>
      </CardContent>
    </Card>
  );
}
