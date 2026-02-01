import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { endOfDay, parseISO, startOfDay, subDays } from 'date-fns';
import { BrushCleaning, CalendarIcon, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { AssetOperationalList } from './@components/asset-operational-list';
import { OperationalKPI } from './@components/KPI';
import { DEFAULT_RANGE_DAYS } from './@const/operational-fleet.const';
import { useOperationalDashboard } from './@hooks/use-operational-dashboard';
import { type OperationalFleetSearchParams, operationalFleetSearchParamsSchema } from './@interface/operational-dashboard.types';

export const Route = createFileRoute('/_private/operation/operational-fleet/')({
  component: OperationalDashboardPage,
  validateSearch: (search: Record<string, unknown>) => operationalFleetSearchParamsSchema.parse(search),
});

const DATE_FORMAT_DISPLAY = 'dd MM yyyy';

function OperationalDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = useSearch({ from: '/_private/operation/operational-fleet/' });
  const { idEnterprise } = useEnterpriseFilter();

  const [localFilters, setLocalFilters] = useState<OperationalFleetSearchParams>(search);

  useEffect(() => {
    setLocalFilters(search);
  }, [search]);

  const dateMinStr = search.dateMin || formatDate(startOfDay(subDays(new Date(), DEFAULT_RANGE_DAYS)), "yyyy-MM-dd'T'00:00:00XXX");
  const dateMaxStr = search.dateMax || formatDate(endOfDay(subDays(new Date(), 1)), "yyyy-MM-dd'T'23:59:59XXX");

  const { data, isLoading, dataUpdatedAt } = useOperationalDashboard(idEnterprise || '', dateMinStr, dateMaxStr);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const allDashboardData = data?.data || [];

  const handleFilterChange = useCallback(
    (newFilters: OperationalFleetSearchParams) => {
      navigate({
        search: (prev) => ({
          ...prev,
          ...newFilters,
        }),
      });
    },
    [navigate],
  );

  const handleQuickRange = (days: number) => {
    const end = endOfDay(subDays(new Date(), 1));
    const start = startOfDay(subDays(end, days - 1));

    const newFilters = {
      ...localFilters,
      dateMin: formatDate(start, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      dateMax: formatDate(end, "yyyy-MM-dd'T'HH:mm:ssXXX"),
    };

    setLocalFilters(newFilters);
    handleFilterChange(newFilters);
  };

  const handleClear = () => {
    const cleared = {
      search: localFilters.search,
      dateMin: undefined,
      dateMax: undefined,
    };
    setLocalFilters(cleared);
    handleFilterChange(cleared);
  };

  // Local filtering
  const filteredDashboardData = allDashboardData.filter((item) => {
    if (!search.search) return true;
    const s = search.search.toLowerCase();
    return item.machine.name.toLowerCase().includes(s) || item.status.toLowerCase().includes(s);
  });

  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdate(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

  const dateMin = localFilters.dateMin ? new Date(localFilters.dateMin) : undefined;
  const dateMax = localFilters.dateMax ? new Date(localFilters.dateMax) : undefined;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader title={t('performance.fleet.operational')}>
          <div className="items-end-safe flex gap-4">
            <div className="flex flex-col items-start">
              <ItemTitle className="leading-2">{t('period')}:</ItemTitle>
              <ItemDescription>
                {formatDate(parseISO(dateMinStr), 'dd MMM yy')} - {formatDate(parseISO(dateMaxStr), 'dd MMM yy')}
              </ItemDescription>
            </div>

            {lastUpdate && (
              <div className="flex flex-col items-start">
                <ItemTitle className="leading-2">{t('last.date.acronym')}:</ItemTitle>
                <ItemDescription>{formatDate(lastUpdate, 'dd MMM yy HH:mm')}</ItemDescription>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Item variant="outline" className="bg-secondary">
            <ItemContent className="flex-none">
              <Label className="flex items-center gap-2">{t('filter')}</Label>
              <div className="relative w-full sm:max-w-64">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('search')}
                  className="pl-9"
                  defaultValue={search.search || ''}
                  onBlur={(e) => {
                    if (e.target.value !== search.search) {
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
            </ItemContent>
            <ItemContent className="flex-none">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="size-4" />
                {t('date.start')}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('min-w-32 justify-start bg-background text-left font-normal', !dateMin && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-1 size-4" />
                    {dateMin ? formatDate(dateMin, DATE_FORMAT_DISPLAY) : <span>{t('date.start')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateMin}
                    onSelect={(date) =>
                      setLocalFilters({
                        ...localFilters,
                        dateMin: date ? `${formatDate(date, 'yyyy-MM-dd')}T00:00:00${formatDate(new Date(), 'XXX')}` : undefined,
                      })
                    }
                    initialFocus
                    captionLayout="dropdown-years"
                    startMonth={new Date(2010, 0)}
                    endMonth={new Date()}
                  />
                </PopoverContent>
              </Popover>
            </ItemContent>

            <ItemContent className="flex-none">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="size-4" />
                {t('date.end')}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn('min-w-32 justify-start bg-background text-left font-normal', !dateMax && 'text-muted-foreground')}>
                    <CalendarIcon className="mr-1 size-4" />
                    {dateMax ? formatDate(dateMax, DATE_FORMAT_DISPLAY) : <span>{t('date.end')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateMax}
                    onSelect={(date) =>
                      setLocalFilters({
                        ...localFilters,
                        dateMax: date ? `${formatDate(date, 'yyyy-MM-dd')}T23:59:59${formatDate(new Date(), 'XXX')}` : undefined,
                      })
                    }
                    initialFocus
                    captionLayout="dropdown-years"
                    startMonth={new Date(2010, 0)}
                    endMonth={new Date()}
                  />
                </PopoverContent>
              </Popover>
            </ItemContent>

            <ItemContent className="flex-none">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="size-4" />
                {t('period')}
              </Label>
              <ButtonGroup>
                {[7, 30, 90].map((days) => (
                  <Button key={days} className="bg-background" onClick={() => handleQuickRange(days)}>
                    {days}
                  </Button>
                ))}
              </ButtonGroup>
            </ItemContent>

            <div className="ml-auto flex shrink-0 gap-2 pb-1">
              <Button disabled={isLoading} onClick={handleClear}>
                <BrushCleaning className="size-4" />
              </Button>
              <Button variant="outline" className="gap-2 bg-background" disabled={isLoading} onClick={() => handleFilterChange(localFilters)}>
                <Search className="size-4" />
                {t('filter')}
              </Button>
            </div>
          </Item>

          <OperationalKPI data={allDashboardData} isLoading={isLoading} />

          {isLoading && <DefaultLoading />}
          {!isLoading && filteredDashboardData.length === 0 && <EmptyData />}
          {filteredDashboardData.length > 0 && <AssetOperationalList data={filteredDashboardData} isLoading={isLoading} />}
        </CardContent>
      </Card>
    </div>
  );
}
