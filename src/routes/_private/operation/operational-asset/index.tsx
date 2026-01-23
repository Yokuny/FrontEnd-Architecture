import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { format, subDays } from 'date-fns';
import { Eye, EyeOff } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ItemGroup } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { DownloadOperationalAssetCSV } from './@components/csv-download';
import { DailyOperabilityChart } from './@components/daily-operability-chart';
import { EventTypesChart } from './@components/event-types-chart';
import { MiniDashboards } from './@components/mini-dashboards';
import { MonthlyStatusChart } from './@components/monthly-status-chart';
import { OperationalAssetFilter } from './@components/page-filter';
import { RevenueChart } from './@components/revenue-chart';
import { DATE_FORMATS, DEFAULT_FILTER_DAYS, OPERATIONAL_ASSET_VIEW } from './@consts/operational-asset.constants';
import { useOperationalAsset } from './@hooks/use-operational-asset';
import type { OperationalAssetSearch } from './@interface/operational-asset.types';
import { operationalAssetSearchSchema } from './@interface/operational-asset.types';

export const Route = createFileRoute('/_private/operation/operational-asset/')({
  component: OperationalAssetPage,
  validateSearch: (search: Record<string, unknown>) => operationalAssetSearchSchema.parse(search),
});

function OperationalAssetPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = useSearch({ from: Route.id }) as OperationalAssetSearch;
  const { idEnterprise } = useEnterpriseFilter();

  const [viewFinancial, setViewFinancial] = useState(search.view === OPERATIONAL_ASSET_VIEW.FINANCIAL);

  const filter: OperationalAssetSearch = useMemo(
    () => ({
      idMachine: search.idMachine,
      dateStart: search.dateStart || format(subDays(new Date(), DEFAULT_FILTER_DAYS), DATE_FORMATS.ISO),
      dateEnd: search.dateEnd || format(new Date(), DATE_FORMATS.ISO),
      view: search.view || OPERATIONAL_ASSET_VIEW.OPERATIONAL,
    }),
    [search],
  );

  const handleFilterChange = (newFilter: OperationalAssetSearch) => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        ...newFilter,
      }),
    });
  };

  const { data, isLoading } = useOperationalAsset(idEnterprise || '', filter);

  const toggleFinancialView = () => {
    const nextView = viewFinancial ? OPERATIONAL_ASSET_VIEW.OPERATIONAL : OPERATIONAL_ASSET_VIEW.FINANCIAL;
    setViewFinancial(!viewFinancial);
    handleFilterChange({ ...filter, view: nextView });
  };

  const hasData = data && (data.statusList.length > 0 || data.dailyList.length > 0);
  const hasPermissionViewFinancial = true; // TODO: Implement actual permission check if needed

  return (
    <Card>
      <CardHeader title={t('performance.asset.operational')}>
        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          {hasData && (
            <div className="flex items-center gap-2">
              <Button onClick={toggleFinancialView} className="gap-2">
                {viewFinancial ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                {viewFinancial ? t('hide.financial') : t('view.financial')}
              </Button>
              <DownloadOperationalAssetCSV data={data.typesEvents} hasPermissionViewFinancial={hasPermissionViewFinancial} />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-secondary/50 p-4">
          <OperationalAssetFilter idEnterprise={idEnterprise || ''} filter={filter} onFilterChange={handleFilterChange} isLoading={isLoading} />
        </div>

        {isLoading ? (
          <DefaultLoading />
        ) : !hasData ? (
          <DefaultEmptyData />
        ) : (
          <ItemGroup className="flex w-full flex-col space-y-6">
            <MiniDashboards data={data.statusList} totalLoss={data.totalLoss} totalRevenue={data.totalRevenue} viewFinancial={viewFinancial} />

            <DailyOperabilityChart data={data.dailyList} isLoading={isLoading} />

            <MonthlyStatusChart data={data.statusList} isLoading={isLoading} viewFinancial={viewFinancial} />

            <RevenueChart data={data.statusList} isLoading={isLoading} totalRevenue={data.totalRevenue} totalLoss={data.totalLoss} />

            <EventTypesChart data={data.typesEvents} isLoading={isLoading} />
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}
