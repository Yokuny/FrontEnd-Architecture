import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEnterpriseFilter } from '@/hooks/use-enterprises-api';
import { MonitoringWearCard } from './@components/monitoring-wear-card';
import { useMonitoringWear } from './@hooks/use-monitoring-wear-api';

const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_private/maintenance/monitoring-wear/')({
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
        <CardFooter className="flex justify-center gap-2 border-t py-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => navigate({ search: { page: page - 1, size, search } })}>
            {t('previous')}
          </Button>
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            {t('page')} {page} / {Math.ceil(totalItems / size)}
          </span>
          <Button variant="outline" size="sm" disabled={page >= Math.ceil(totalItems / size)} onClick={() => navigate({ search: { page: page + 1, size, search } })}>
            {t('next')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
