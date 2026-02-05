import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { MonitoringWearCard } from './@components/monitoring-wear-card';
import { useMonitoringWear } from './@hooks/use-monitoring-wear-api';

const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_private/maintenance/monitoring-wear/')({
  staticData: {
    title: 'monitoring.wear.part',
    description:
      'Página de monitoramento de desgaste de peças e componentes (Wear Monitoring). Permite acompanhar o ciclo de vida de spare parts críticas, visualizar histórico de substituições, calcular vida útil restante baseada em running hours ou tempo de uso, e identificar peças próximas do limite de troca. Essencial para manutenção preditiva, gestão de estoque de spare parts e prevenção de falhas (breakdown).',
    tags: [
      'maintenance',
      'manutenção',
      'wear',
      'desgaste',
      'parts',
      'peças',
      'spare-parts',
      'monitoring',
      'monitoramento',
      'predictive',
      'preditiva',
      'lifecycle',
      'ciclo-vida',
      'running-hours',
      'replacement',
      'substituição',
    ],
    examplePrompts: [
      'Monitorar desgaste de peças da frota',
      'Ver peças próximas do limite de troca',
      'Verificar histórico de substituição de spare parts',
      'Calcular vida útil restante de componentes críticos',
      'Identificar peças com desgaste crítico por embarcação',
    ],
    searchParams: [
      { name: 'page', type: 'number', description: 'Número da página (paginação)', example: '1' },
      { name: 'size', type: 'number', description: 'Quantidade de registros por página', example: '10' },
      { name: 'search', type: 'string', description: 'Termo de busca para filtrar peças ou embarcações', example: 'filtro óleo' },
    ],
    relatedRoutes: [
      { path: '/_private/maintenance', relation: 'parent', description: 'Hub de manutenção' },
      { path: '/_private/maintenance/list-os-done', relation: 'sibling', description: 'Histórico de OS concluídas' },
      { path: '/_private/maintenance/monitoring-plans', relation: 'sibling', description: 'Monitoramento de planos de manutenção' },
    ],
    entities: ['Part', 'Machine', 'Enterprise', 'WearData', 'ReplacementHistory', 'Equipment'],
    capabilities: [
      'Visualizar desgaste de peças agrupadas por embarcação',
      'Monitorar vida útil restante de spare parts',
      'Identificar componentes próximos do limite de troca',
      'Acompanhar histórico de substituições',
      'Filtrar por termo de busca (peça ou embarcação)',
      'Calcular percentual de desgaste baseado em running hours',
      'Prevenir breakdowns com alertas de manutenção preditiva',
    ],
  },
  component: MonitoringWearPage,
  validateSearch: searchSchema,
});

function MonitoringWearPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, search } = Route.useSearch();

  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useMonitoringWear({
    page: page - 1,
    size,
    search,
    idEnterprise,
  });

  const totalItems = data?.pageInfo?.[0]?.count ?? 0;

  return (
    <Card>
      <CardHeader title={t('monitoring.wear.part')}>
        <div className="relative w-full max-w-64">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('search')}
            className="pl-9"
            defaultValue={search || ''}
            onBlur={(e: any) => {
              if (e.target.value !== search) {
                navigate({ search: (prev: SearchParams) => ({ ...prev, search: e.target.value || undefined, page: 1 }) });
              }
            }}
            onKeyDown={(e: any) => {
              if (e.key === 'Enter') {
                navigate({ search: (prev: SearchParams) => ({ ...prev, search: e.target.value || undefined, page: 1 }) });
              }
            }}
          />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : data?.data && data.data.length > 0 ? (
          <div className="space-y-4">
            {data.data.map((item) => (
              <MonitoringWearCard key={item.machine.id} data={item} />
            ))}
          </div>
        ) : (
          <EmptyData />
        )}
      </CardContent>

      {totalItems > size && (
        <CardFooter layout="multi">
          <Button variant="outline" disabled={page <= 1} onClick={() => navigate({ search: { page: page - 1, size, search } })}>
            {t('previous')}
          </Button>
          <span className="flex items-center px-3 text-muted-foreground text-sm">
            {t('page')} {page} / {Math.ceil(totalItems / size)}
          </span>
          <Button variant="outline" disabled={page >= Math.ceil(totalItems / size)} onClick={() => navigate({ search: { page: page + 1, size, search } })}>
            {t('next')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
