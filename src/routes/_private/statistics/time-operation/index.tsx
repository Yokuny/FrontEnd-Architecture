import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { endOfDay, parseISO, startOfDay, subDays } from 'date-fns';
import { CalendarIcon, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { MachineSelect } from '@/components/selects/machine-select';
import { ModelMachineSelect } from '@/components/selects/model-machine-select.tsx';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useHasPermission } from '@/hooks/use-permissions';
import { useTimeOperation } from '@/hooks/use-statistics-api';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { TimeOperationTable } from './@components/TimeOperationTable';
import { LIST_STATUS_ORDERED } from './@consts/status-order';

const searchSchema = z.object({
  min: z.string().optional(),
  max: z.string().optional(),
  'idMachine[]': z.array(z.string()).optional(),
  'idModel[]': z.array(z.string()).optional(),
});

export const Route = createFileRoute('/_private/statistics/time-operation/')({
  component: TimeOperationPage,
  validateSearch: (search) => searchSchema.parse(search),
});

function TimeOperationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();
  const hasPermissionDetails = useHasPermission('/details-statistics-status');

  // Initialize state from URL params or defaults
  const [dateMin, setDateMin] = useState<Date>(search.min ? parseISO(search.min) : startOfDay(subDays(new Date(), 7)));
  const [dateMax, setDateMax] = useState<Date>(search.max ? parseISO(search.max) : endOfDay(subDays(new Date(), 1)));
  const [selectedMachines, setSelectedMachines] = useState<string[]>(search['idMachine[]'] || []);
  const [selectedModels, setSelectedModels] = useState<string[]>(search['idModel[]'] || []);

  const [orderColumn, setOrderColumn] = useState<{ column: string; order: 'asc' | 'desc' } | null>(null);

  // Derive API filters from URL params (Single Source of Truth)
  const apiFilters = useMemo(
    () => ({
      idEnterprise,
      min: search.min || formatDate(dateMin, "yyyy-MM-dd'T'00:00:00XXX"),
      max: search.max || formatDate(dateMax, "yyyy-MM-dd'T'23:59:59XXX"),
      'idMachine[]': search['idMachine[]'],
      'idModel[]': search['idModel[]'],
    }),
    [idEnterprise, search, dateMin, dateMax],
  );

  const { data: rawData, isLoading } = useTimeOperation(apiFilters);

  // Process data: combine "transit" and "underway using engine" into "UNDERWAY USING ENGINE"
  const preProcessData = useMemo(() => {
    if (!rawData) return [];
    return rawData.map((x) => {
      const listTimeStatusTransit = x.listTimeStatus?.filter((y) => y.status?.toLowerCase() === 'transit') || [];
      const listTimeStatusUnderway = x.listTimeStatus?.filter((y) => y.status?.toLowerCase() === 'underway using engine') || [];

      return {
        ...x,
        listTimeStatus: [
          ...(x.listTimeStatus?.filter((y) => !['underway using engine', 'transit'].includes(y.status?.toLowerCase())) || []),
          {
            status: 'UNDERWAY USING ENGINE',
            minutes: listTimeStatusTransit.reduce((a, b) => a + b.minutes, 0) + listTimeStatusUnderway.reduce((a, b) => a + b.minutes, 0),
            distance: listTimeStatusTransit.reduce((a, b) => a + b.distance, 0) + listTimeStatusUnderway.reduce((a, b) => a + b.distance, 0),
          },
        ],
      };
    });
  }, [rawData]);

  // Get statuses present in data
  const statusInData = useMemo(() => {
    const statuses = new Set<string>();
    preProcessData.forEach((x) => {
      x.listTimeStatus?.forEach((y) => {
        if (y.status) statuses.add(y.status.toLowerCase());
      });
    });
    return Array.from(statuses);
  }, [preProcessData]);

  // Filter statuses by the ordered list
  const listStatusAllow = useMemo(() => {
    return LIST_STATUS_ORDERED.filter((x) => statusInData.includes(x));
  }, [statusInData]);

  // Normalize data with percentages
  const normalizedData = useMemo(() => {
    if (!preProcessData) return [];
    const dataNormalized = preProcessData.map((x) => {
      const totalAllStatusInMinutes = x.listTimeStatus?.reduce((a, b) => a + (b.minutes || 0), 0) || 0;

      const percentuals: Record<string, number> = {};
      listStatusAllow.forEach((y) => {
        const statusItem = x.listTimeStatus?.find((z) => z.status?.toLowerCase() === y);
        percentuals[y] = totalAllStatusInMinutes > 0 && statusItem ? (statusItem.minutes / totalAllStatusInMinutes) * 100 : 0;
      });

      return {
        ...x,
        ...percentuals,
      } as typeof x & Record<string, number>;
    });

    if (orderColumn?.column) {
      return dataNormalized.sort((a, b) => {
        const aValue = (a[orderColumn.column] as number) ?? 0;
        const bValue = (b[orderColumn.column] as number) ?? 0;
        return orderColumn.order === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return dataNormalized;
  }, [preProcessData, listStatusAllow, orderColumn]);

  const handleSearch = useCallback(() => {
    navigate({
      search: {
        min: formatDate(dateMin, "yyyy-MM-dd'T'00:00:00XXX"),
        max: formatDate(endOfDay(dateMax), "yyyy-MM-dd'T'23:59:59XXX"),
        'idMachine[]': selectedMachines.length > 0 ? selectedMachines : undefined,
        'idModel[]': selectedModels.length > 0 ? selectedModels : undefined,
      },
      replace: true,
    });
  }, [navigate, dateMin, dateMax, selectedMachines, selectedModels]);

  return (
    <Card>
      <CardHeader title={t('time.operation')} />
      <CardContent>
        <Item variant="outline" className="bg-secondary">
          <MachineSelect
            mode="multi"
            className="min-w-48"
            label={t('select.machine')}
            placeholder={t('select.machine')}
            idEnterprise={idEnterprise}
            value={selectedMachines}
            onChange={setSelectedMachines}
          />

          <ModelMachineSelect
            mode="multi"
            className="min-w-48"
            label={t('model')}
            placeholder={t('model')}
            idEnterprise={idEnterprise}
            value={selectedModels}
            onChange={setSelectedModels}
          />

          <ItemContent className="flex-none">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-36 justify-start bg-background text-left font-normal', !dateMin && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {dateMin ? formatDate(dateMin, 'dd MM yyyy') : <span>{t('date.start')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateMin}
                  onSelect={(date) => date && setDateMin(date)}
                  initialFocus
                  captionLayout="dropdown-years"
                  startMonth={new Date(2010, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
          </ItemContent>

          <ItemContent className="flex-none">
            <Label>{t('date.end')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-36 justify-start bg-background text-left font-normal', !dateMax && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {dateMax ? formatDate(dateMax, 'dd MM yyyy') : <span>{t('date.end')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateMax}
                  onSelect={(date) => date && setDateMax(date)}
                  initialFocus
                  captionLayout="dropdown-years"
                  startMonth={new Date(2010, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
          </ItemContent>

          <Button variant="outline" className="ml-auto shrink-0 gap-2 bg-background" onClick={handleSearch}>
            <Search className="size-4" />
            {t('search')}
          </Button>
        </Item>

        {isLoading && <DefaultLoading />}
        {!isLoading && !normalizedData.length && <EmptyData />}
        {!isLoading && (
          <TimeOperationTable
            data={normalizedData}
            listStatusAllow={listStatusAllow}
            orderColumn={orderColumn}
            onOrderChange={setOrderColumn}
            filters={apiFilters}
            hasPermissionDetails={hasPermissionDetails}
          />
        )}
      </CardContent>
    </Card>
  );
}
