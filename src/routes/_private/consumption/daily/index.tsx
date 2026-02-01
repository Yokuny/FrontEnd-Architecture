import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { subDays } from 'date-fns';
import { CalendarIcon, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { ConsumptionMachineSelect } from '@/components/selects/consumption-machine-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mapConsumptionMachinesToOptions, useConsumptionMachinesSelect } from '@/hooks/use-consumption-machines-api';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { ConsumptionChart } from './@components/ConsumptionChart';
import { ListPolling } from './@components/ListPolling';
import { Statistics } from './@components/Statistics';
import { DEFAULT_DATE_RANGE_DAYS, UNIT_OPTIONS } from './@consts/consumption-daily.consts';
import { useConsumptionDailyData } from './@hooks/use-consumption-daily-api';
import { searchSchema } from './@interface/consumption-daily.schema';

export const Route = createFileRoute('/_private/consumption/daily/')({
  component: ConsumptionDailyPage,
  validateSearch: searchSchema,
});

function ConsumptionDailyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  // Initialize state from URL params or defaults
  const [dateMin, setDateMin] = useState<Date>(search.dateMin ? new Date(search.dateMin) : subDays(new Date(), DEFAULT_DATE_RANGE_DAYS));
  const [dateMax, setDateMax] = useState<Date>(search.dateMax ? new Date(search.dateMax) : new Date());
  const [unit, setUnit] = useState<string>(search.unit || 'L');
  const [machineId, setMachineId] = useState<string | undefined>(search.machine);

  // Chart toggles
  const [showReal, setShowReal] = useState(true);
  const [showEstimated, setShowEstimated] = useState(true);

  // Derive API filters from URL params (Single Source of Truth)
  const apiFilters = useMemo(
    () => ({
      idMachine: search.machine || '',
      dateMin: search.dateMin ? new Date(search.dateMin) : dateMin,
      dateMax: search.dateMax ? new Date(search.dateMax) : dateMax,
      unit: search.unit || unit,
      idEnterprise,
    }),
    [search, dateMin, dateMax, unit, idEnterprise],
  );

  // Fetch data
  const { data = [], isLoading } = useConsumptionDailyData(apiFilters);

  const handleSearch = useCallback(() => {
    navigate({
      search: {
        dateMin: formatDate(dateMin, 'yyyy-MM-dd'),
        dateMax: formatDate(dateMax, 'yyyy-MM-dd'),
        machine: machineId,
        unit,
      },
      replace: true,
    });
  }, [navigate, dateMin, dateMax, machineId, unit]);

  // Check permissions - simplificado para esta implementação
  // TODO: Integrar com sistema de permissões real (useAuth ou similar)
  const hasPermissionEditor = true;

  // Get machine name
  const machinesQuery = useConsumptionMachinesSelect(idEnterprise);
  const machinesOptions = useMemo(() => (machinesQuery.data ? mapConsumptionMachinesToOptions(machinesQuery.data) : []), [machinesQuery.data]);
  const selectedMachine = machinesOptions.find((m: any) => m.value === machineId);
  const machineName = selectedMachine?.label || 'Unknown';

  return (
    <Card>
      <CardHeader title={t('consumption.daily')} />
      <CardContent>
        <Item variant="outline" className="mb-6 bg-secondary">
          <ItemContent className="flex-none">
            <Label>{t('date.start')}</Label>
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
                  onSelect={(date) => date && setDateMin(date)}
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
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateMax && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {dateMax ? formatDate(dateMax, 'dd MM yyyy') : <span>{t('date.end')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateMax}
                  onSelect={(date) => date && setDateMax(date)}
                  captionLayout="dropdown-years"
                  startMonth={new Date(2010, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
          </ItemContent>

          <ConsumptionMachineSelect
            mode="single"
            label={t('vessel')}
            placeholder={t('vessels.select.placeholder')}
            idEnterprise={idEnterprise}
            value={machineId}
            onChange={setMachineId}
          />

          <ItemContent className="min-w-28">
            <Label>{t('unit')}</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder={t('unit')} />
              </SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ItemContent>
          <div className="ml-auto">
            <Button variant="outline" className="shrink-0 gap-2" onClick={handleSearch} disabled={!machineId}>
              <Search className="size-4" />
              {t('filter')}
            </Button>
          </div>
        </Item>

        {isLoading && <DefaultLoading />}
        {!isLoading && !data.length && <DefaultEmptyData />}

        {!isLoading && data.length > 0 && (
          <div className="space-y-6">
            <ConsumptionChart data={data} showReal={showReal} showEstimated={showEstimated} onToggleReal={setShowReal} onToggleEstimated={setShowEstimated} />

            <Statistics data={data} machineId={machineId} machineName={machineName} hasPermissionEditor={hasPermissionEditor} />

            <ListPolling data={data} machineId={machineId} machineName={machineName} hasPermissionEditor={hasPermissionEditor} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
