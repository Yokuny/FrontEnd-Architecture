import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ItemDescription } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { AssetOperationalList } from './@components/asset-operational-list';
import { useOperationalDashboard } from './@hooks/use-operational-dashboard';

const dashboardSearchSchema = z.object({
  search: z.string().optional(),
});

export const Route = createFileRoute('/_private/operation/operational-fleet/')({
  component: OperationalDashboardPage,
  validateSearch: (search: Record<string, unknown>) => dashboardSearchSchema.parse(search),
});

function OperationalDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { search } = useSearch({ from: '/_private/operation/operational-fleet/' });
  const { idEnterprise } = useEnterpriseFilter();
  const { data, isLoading, dataUpdatedAt } = useOperationalDashboard(idEnterprise || '');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const allDashboardData = data?.data || [];

  // Local filtering
  const filteredDashboardData = allDashboardData.filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return item.machine.name.toLowerCase().includes(s) || item.status.toLowerCase().includes(s);
  });

  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdate(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

  return (
    <Card>
      <CardHeader title={t('performance.fleet.operational')}>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          {lastUpdate && (
            <ItemDescription>
              {t('last.date.acronym')}: {format(lastUpdate, 'dd MM yyyy HH:mm')}
            </ItemDescription>
          )}
          <div className="relative w-full sm:max-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-9"
              defaultValue={search || ''}
              onBlur={(e) => {
                if (e.target.value !== search) {
                  navigate({
                    search: (prev) => ({ ...prev, search: e.target.value || undefined }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev) => ({ ...prev, search: e.currentTarget.value || undefined }),
                  });
                }
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        {isLoading && <DefaultLoading />}
        {filteredDashboardData.length === 0 && <EmptyData />}
        {filteredDashboardData.length > 0 && <AssetOperationalList data={filteredDashboardData} isLoading={isLoading} />}
      </CardContent>
    </Card>
  );
}
