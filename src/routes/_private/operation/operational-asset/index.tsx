import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { subDays } from 'date-fns';
import { CalendarIcon, Eye, EyeOff, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemGroup } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { DownloadOperationalAssetCSV } from './@components/csv-download';
import { DailyOperabilityChart } from './@components/daily-operability-chart';
import { EventTypesChart } from './@components/event-types-chart';
import { KPI } from './@components/KPI';
import { MonthlyStatusChart } from './@components/monthly-status-chart';
import { RevenueChart } from './@components/revenue-chart';
import { DATE_FORMATS, DEFAULT_FILTER_DAYS, OPERATIONAL_ASSET_VIEW, PERMISSIONS } from './@consts/operational-asset.constants';
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
      dateStart: search.dateStart || formatDate(subDays(new Date(), DEFAULT_FILTER_DAYS), DATE_FORMATS.ISO),
      dateEnd: search.dateEnd || formatDate(new Date(), DATE_FORMATS.ISO),
      view: search.view || OPERATIONAL_ASSET_VIEW.OPERATIONAL,
    }),
    [search],
  );

  const [localFilter, setLocalFilter] = useState<OperationalAssetSearch>(filter);

  const handleFilterChange = (newFilter: OperationalAssetSearch) => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        ...newFilter,
      }),
    });
  };

  const handleSearch = () => {
    handleFilterChange(localFilter);
  };

  const { data, isLoading } = useOperationalAsset(idEnterprise || '', filter);

  const toggleFinancialView = () => {
    const nextView = viewFinancial ? OPERATIONAL_ASSET_VIEW.OPERATIONAL : OPERATIONAL_ASSET_VIEW.FINANCIAL;
    setViewFinancial(!viewFinancial);
    handleFilterChange({ ...filter, view: nextView });
  };

  const dateStart = localFilter.dateStart ? new Date(localFilter.dateStart) : undefined;
  const dateEnd = localFilter.dateEnd ? new Date(localFilter.dateEnd) : undefined;

  const hasData = data && (data.statusList.length > 0 || data.dailyList.length > 0);
  const hasPermissionViewFinancial = PERMISSIONS.VIEW_FINANCIAL;

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

      <CardContent className="flex flex-col">
        <Item variant="outline" className="bg-secondary">
          <div className={`min-w-40 space-y-2`}>
            <Label className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              {t('date.start')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !dateStart && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {dateStart ? formatDate(dateStart, DATE_FORMATS.DISPLAY) : <span>{t('date.start')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0">
                <Calendar
                  mode={'single'}
                  selected={dateStart}
                  onSelect={(date: Date | undefined) => setLocalFilter({ ...localFilter, dateStart: date ? formatDate(date, DATE_FORMATS.ISO) : undefined })}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="min-w-40 space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              {t('date.end')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !dateEnd && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {dateEnd ? formatDate(dateEnd, DATE_FORMATS.DISPLAY) : <span>{t('date.end')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0">
                <Calendar
                  mode={'single'}
                  selected={dateEnd}
                  onSelect={(date: Date | undefined) => setLocalFilter({ ...localFilter, dateEnd: date ? formatDate(date, DATE_FORMATS.ISO) : undefined })}
                />
              </PopoverContent>
            </Popover>
          </div>

          <MachineByEnterpriseSelect
            mode="single"
            idEnterprise={idEnterprise || ''}
            value={localFilter.idMachine}
            onChange={(val) => setLocalFilter({ ...localFilter, idMachine: val || undefined })}
            placeholder={t('select.asset')}
          />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Eye className="size-4" />
              {t('view.analytics')}
            </Label>
            <Select value={localFilter.view} onValueChange={(val) => setLocalFilter({ ...localFilter, view: val as any })}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OPERATIONAL_ASSET_VIEW.OPERATIONAL}>{t('operational')}</SelectItem>
                <SelectItem value={OPERATIONAL_ASSET_VIEW.FINANCIAL}>{t('financial')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto flex items-end">
            <Button className="w-full" disabled={isLoading} onClick={handleSearch}>
              <Search className="mr-1 size-4" />
              {t('search')}
            </Button>
          </div>
        </Item>

        {isLoading ? (
          <DefaultLoading />
        ) : !hasData ? (
          <DefaultEmptyData />
        ) : (
          <ItemGroup className="flex w-full flex-col space-y-6">
            <KPI data={data.statusList} totalLoss={data.totalLoss} totalRevenue={data.totalRevenue} viewFinancial={viewFinancial} />
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
