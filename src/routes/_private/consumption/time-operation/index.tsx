import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { endOfDay, parseISO, startOfDay, subDays } from 'date-fns';
import { BrushCleaning, CalendarIcon, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MachineByEnterpriseSelect, UnitSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Item, ItemContent, ItemDescription } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { TimeOperationTable } from './@components/time-operation-table';
import { useTimeOperationDashboard } from './@hooks/use-time-operation-api';
import { OPERATION_MODES, type TimeOperationSearchParams, timeOperationSearchParamsSchema } from './@interface/time-operation.types';

export const Route = createFileRoute('/_private/consumption/time-operation/')({
  component: TimeOperationDashboardPage,
  validateSearch: timeOperationSearchParamsSchema,
});

function TimeOperationDashboardPage() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { idEnterprise } = useEnterpriseFilter();

  const [orderColumn, setOrderColumn] = useState<{ column: string; order: 'asc' | 'desc' } | null>(null);

  // Initialize state from URL params or defaults
  const dateMinStr = search.dateMin || formatDate(startOfDay(subDays(new Date(), 8)), "yyyy-MM-dd'T'00:00:00XXX");
  const dateMaxStr = search.dateMax || formatDate(endOfDay(subDays(new Date(), 1)), "yyyy-MM-dd'T'23:59:59XXX");

  // Filter state
  const [localFilters, setLocalFilters] = useState<TimeOperationSearchParams>({ ...search, dateMin: dateMinStr, dateMax: dateMaxStr });

  useEffect(() => {
    setLocalFilters({ ...search, dateMin: dateMinStr, dateMax: dateMaxStr });
  }, [search, dateMinStr, dateMaxStr]);

  const dateMin = localFilters.dateMin ? new Date(localFilters.dateMin) : undefined;
  const dateMax = localFilters.dateMax ? new Date(localFilters.dateMax) : undefined;

  const { data: rawData, isLoading } = useTimeOperationDashboard(idEnterprise, search.machines, dateMinStr, dateMaxStr, search.isShowDisabled, search.unit);

  // Process data: combine "transit" and "underway using engine" into "UNDERWAY USING ENGINE"
  // (Pattern followed from statistics/time-operation)
  const preProcessData = useMemo(() => {
    if (!rawData) return [];
    return rawData.map((x) => {
      const listTimeStatusTransit = x.listTimeStatus?.filter((y) => y.status?.toLowerCase() === 'transit') || [];
      const listTimeStatusUnderway =
        x.listTimeStatus?.filter((y) =>
          ['underway using engine', 'underway_using_engine', 'underway', 'under way', 'under way using engine', 'under_way_using_engine'].includes(y.status?.toLowerCase()),
        ) || [];

      return {
        ...x,
        listTimeStatus: [
          ...(x.listTimeStatus?.filter(
            (y) =>
              !['underway using engine', 'underway_using_engine', 'underway', 'under way', 'under way using engine', 'under_way_using_engine', 'transit'].includes(
                y.status?.toLowerCase(),
              ),
          ) || []),
          {
            status: 'UNDERWAY USING ENGINE',
            minutes: listTimeStatusTransit.reduce((a, b) => a + (b.minutes || 0), 0) + listTimeStatusUnderway.reduce((a, b) => a + (b.minutes || 0), 0),
            consumption: listTimeStatusTransit.reduce((a, b) => a + (b.consumption || 0), 0) + listTimeStatusUnderway.reduce((a, b) => a + (b.consumption || 0), 0),
          },
        ],
      };
    });
  }, [rawData]);

  // Get statuses present in data and filter by OPERATION_MODES order
  const listStatusAllow = useMemo(() => {
    const statuses = new Set<string>();
    preProcessData.forEach((x) => {
      x.listTimeStatus?.forEach((y) => {
        if (y.status) statuses.add(y.status.toLowerCase());
      });
    });

    // Intersect with OPERATION_MODES values
    const orderedValues = OPERATION_MODES.map((m) => m.value);
    // Note: statistics uses a simplified list, we keep it consistent
    return orderedValues.filter((v) =>
      Array.from(statuses).some((s) => {
        const mode = OPERATION_MODES.find((m) => m.value === v);
        return mode?.accept.includes(s) || s === 'underway using engine'; // 'underway using engine' is our normalized key
      }),
    );
  }, [preProcessData]);

  // Normalize data with percentages for sorting
  const normalizedData = useMemo(() => {
    if (!preProcessData) return [];
    const dataNormalized = preProcessData.map((x) => {
      const totalAllStatusInMinutes = x.listTimeStatus?.reduce((a, b) => a + (b.minutes || 0), 0) || 0;

      const percentuals: Record<string, number> = {};
      listStatusAllow.forEach((v) => {
        const mode = OPERATION_MODES.find((m) => m.value === v);
        const statusItem = x.listTimeStatus?.find((z) => mode?.accept.includes(z.status?.toLowerCase()) || (v === 'underway' && z.status === 'UNDERWAY USING ENGINE'));
        percentuals[v] = totalAllStatusInMinutes > 0 && statusItem ? (statusItem.minutes / totalAllStatusInMinutes) * 100 : 0;
      });

      return {
        ...x,
        ...percentuals,
      };
    });

    if (orderColumn?.column) {
      return dataNormalized.sort((a, b) => {
        const aValue = ((a as any)[orderColumn.column] as number) ?? 0;
        const bValue = ((b as any)[orderColumn.column] as number) ?? 0;
        return orderColumn.order === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return dataNormalized;
  }, [preProcessData, listStatusAllow, orderColumn]);

  const handleFilterChange = useCallback(
    (newFilters: any) => {
      navigate({
        search: (prev: any) => ({
          ...prev,
          ...newFilters,
        }),
      });
    },
    [navigate],
  );

  const handleSearch = () => {
    handleFilterChange(localFilters);
  };

  const handleClear = () => {
    const clearedFilters: TimeOperationSearchParams = {
      machines: undefined,
      dateMin: undefined,
      dateMax: undefined,
      isShowDisabled: false,
      unit: 'm³',
    };
    setLocalFilters(clearedFilters);
    handleFilterChange(clearedFilters);
  };

  return (
    <Card>
      <CardHeader title={t('consumption.time.operation')}>
        {dateMinStr && dateMaxStr && (
          <ItemDescription>
            {formatDate(parseISO(dateMinStr), 'dd MMM yyyy')} - {formatDate(parseISO(dateMaxStr), 'dd MMM yyyy')}
          </ItemDescription>
        )}
      </CardHeader>

      <CardContent>
        {/* filters */}
        <Item variant="outline" className="bg-secondary">
          <ItemContent className="flex-none">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              {t('date.start')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateMin && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {dateMin ? formatDate(dateMin, 'dd MM yyyy') : <span>{t('date.start')}</span>}
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
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateMax && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {dateMax ? formatDate(dateMax, 'dd MM yyyy') : <span>{t('date.end')}</span>}
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

          <ItemContent className="min-w-44">
            <MachineByEnterpriseSelect
              mode="multi"
              label={t('vessels')}
              idEnterprise={idEnterprise}
              value={localFilters.machines?.split(',').filter(Boolean)}
              onChange={(val) => setLocalFilters({ ...localFilters, machines: val?.join(',') || undefined })}
              placeholder={t('vessels')}
            />
          </ItemContent>

          <UnitSelect value={localFilters.unit} onChange={(val) => setLocalFilters({ ...localFilters, unit: val || 'm³' })} />

          <div className="flex items-center space-x-2 pb-3">
            <Checkbox id="show-disabled" checked={localFilters.isShowDisabled} onCheckedChange={(checked) => setLocalFilters({ ...localFilters, isShowDisabled: !!checked })} />
            <Label htmlFor="show-disabled" className="cursor-pointer font-medium text-sm leading-none">
              {t('show.disabled')}
            </Label>
          </div>

          <div className="ml-auto flex shrink-0 gap-2 pb-1">
            <Button disabled={isLoading} onClick={handleClear}>
              <BrushCleaning className="size-4" />
            </Button>
            <Button variant="outline" className="gap-2 bg-background" disabled={isLoading} onClick={handleSearch}>
              <Search className="size-4" />
              {t('filter')}
            </Button>
          </div>
        </Item>

        <TimeOperationTable
          data={normalizedData}
          listStatusAllow={listStatusAllow}
          orderColumn={orderColumn}
          onOrderChange={setOrderColumn}
          unit={search.unit || 'm³'}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
