import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { FilterDialog } from './@components/filter-dialog';
import { MonitoringPlanItem } from './@components/monitoring-plan-item';
import { useMonitoringPlans } from './@hooks/use-monitoring-plans-api';
import type { MonitoringFilter } from './@interface/monitoring-plan.schema';
import type { MonitoringMachine } from './@interface/monitoring-plan.types';

const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
});

export const Route = createFileRoute('/_private/maintenance/monitoring-plans/')({
  component: MonitoringPlansPage,
  validateSearch: searchSchema,
});

function MonitoringPlanCard({ machine }: { machine: MonitoringMachine }) {
  const initials = machine.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <Item variant="default" className="border-b bg-muted/10">
        <Avatar className="size-14">
          <AvatarImage src={machine.image?.url} alt={machine.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <ItemContent className="gap-0">
          <ItemTitle className="font-semibold text-base tracking-tight">{machine.name}</ItemTitle>
          <ItemDescription>{machine.enterprise?.name}</ItemDescription>
        </ItemContent>
      </Item>

      <ItemGroup className="space-y-2 p-4">
        {machine.monitoringPlan?.map((planItem, index) => (
          <MonitoringPlanItem key={`${planItem.idMaintenancePlan}-${index}`} planItem={planItem} idMachine={machine.idMachine} />
        ))}
      </ItemGroup>
    </div>
  );
}

function MonitoringPlansPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, search } = Route.useSearch();

  const { idEnterprise } = useEnterpriseFilter();

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

  const totalItems = data?.pageInfo?.[0]?.count ?? 0;

  return (
    <Card>
      <CardHeader title={t('monitoring.plan.maintenance')}>
        <FilterDialog idEnterprise={idEnterprise} filter={filter} onFilterChange={setFilter} />
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : data?.data && data.data.length > 0 ? (
          <ItemGroup>
            {data.data.map((machine) => (
              <MonitoringPlanCard key={machine.idMachine} machine={machine} />
            ))}
          </ItemGroup>
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
