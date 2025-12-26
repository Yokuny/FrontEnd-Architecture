import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { FilterDialog } from './@components/filter-dialog';
import { MonitoringPlanCard } from './@components/monitoring-plan-card';
import { useMonitoringPlans } from './@hooks/use-monitoring-plans-api';
import type { MonitoringFilter } from './@interface/monitoring-plan.schema';

const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
});

export const Route = createFileRoute('/_private/maintenance/monitoring-plans/')({
  component: MonitoringPlansPage,
  validateSearch: searchSchema,
});

function MonitoringPlansPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, search } = Route.useSearch();

  // Pegar idEnterprise do localStorage (mesmo padrão do legado com Redux)
  const idEnterprise = localStorage.getItem('id_enterprise_filter') || '';

  const [filter, setFilter] = useState<MonitoringFilter>({});

  const { data, isLoading } = useMonitoringPlans({
    page: page - 1,
    size,
    search,
    idEnterprise,
    idMachine: filter.idMachine,
    idMaintenancePlan: filter.idMaintenancePlan,
    managers: filter.managers,
    status: filter.status,
  });

  const handleSelectItem = (_idMachine: string, _idMaintenancePlan: string, _dateWindowEnd: string) => {
    // TODO: Abrir modal de edição do event-schedule (fase 2)
  };

  const totalItems = data?.pageInfo?.[0]?.count ?? 0;

  return (
    <Card>
      <CardHeader title={t('monitoring.plan.maintenance')}>
        <FilterDialog idEnterprise={idEnterprise} filter={filter} onFilterChange={setFilter} />
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full flex items-center justify-center">
            <Spinner />
          </Skeleton>
        ) : data?.data && data.data.length > 0 ? (
          <div className="space-y-4">
            {data.data.map((machine) => (
              <MonitoringPlanCard key={machine.idMachine} machine={machine} onSelectItem={handleSelectItem} />
            ))}

            {/* Paginação simples */}
            {totalItems > size && (
              <div className="flex justify-center gap-2 pt-4">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => navigate({ search: { page: page - 1, size, search } })}>
                  {t('previous')}
                </Button>
                <span className="flex items-center px-3 text-sm text-muted-foreground">
                  {t('page')} {page} / {Math.ceil(totalItems / size)}
                </span>
                <Button variant="outline" size="sm" disabled={page >= Math.ceil(totalItems / size)} onClick={() => navigate({ search: { page: page + 1, size, search } })}>
                  {t('next')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">{t('not.found')}</div>
        )}
      </CardContent>
    </Card>
  );
}
