import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format, subMonths } from 'date-fns';
import { CalendarIcon, Download, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { ConsumptionMachineSelect } from '@/components/selects/consumption-machine-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { cn } from '@/lib/utils';
import { downloadCSV } from '../daily/@helpers/consumption-daily.helpers';
import { ConsumptionTable } from './@components/ConsumptionTable';
import { SummaryCards } from './@components/SummaryCards';
import { VesselComparison } from './@components/VesselComparison';
import { DEFAULT_DATE_RANGE_MONTHS, UNIT_OPTIONS } from './@consts/consumption-interval.consts';
import { useConsumptionIntervalData } from './@hooks/use-consumption-interval-api';
import { searchSchema } from './@interface/consumption-interval.schema';

export const Route = createFileRoute('/_private/consumption/relatorio/')({
  component: ConsumptionIntervalPage,
  validateSearch: searchSchema,
});

function ConsumptionIntervalPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  // Initialize state from URL params or defaults
  const [dateMin, setDateMin] = useState<Date>(search.dateMin ? new Date(search.dateMin) : subMonths(new Date(), DEFAULT_DATE_RANGE_MONTHS));
  const [dateMax, setDateMax] = useState<Date>(search.dateMax ? new Date(search.dateMax) : new Date());
  const [unit, setUnit] = useState<string>(search.unit || 'L');
  const [machineIds, setMachineIds] = useState<string[]>(search.machines || []);

  // View toggles
  const [showReal, setShowReal] = useState(true);
  const [showEstimated, setShowEstimated] = useState(false);

  // Derive API filters
  const apiFilters = useMemo(
    () => ({
      machines: machineIds,
      dateMin,
      dateMax,
      unit,
      idEnterprise,
    }),
    [machineIds, dateMin, dateMax, unit, idEnterprise],
  );

  const { data = [], isLoading } = useConsumptionIntervalData(apiFilters);

  const handleSearch = useCallback(() => {
    navigate({
      search: {
        dateMin: format(dateMin, 'yyyy-MM-dd'),
        dateMax: format(dateMax, 'yyyy-MM-dd'),
        machines: machineIds,
        unit,
      },
      replace: true,
    });
  }, [navigate, dateMin, dateMax, machineIds, unit]);

  const exportToCSV = () => {
    const csvData = data.map((x) => ({
      date: format(new Date(x.date), 'yyyy-MM-dd'),
      vessel: x.machine?.name,
      hours: x.hours,
      consumptionReal: x.consumptionReal?.value,
      consumptionRealType: x.consumptionReal?.type,
      consumptionEstimated: x.consumption?.value,
      consumptionEstimatedType: x.consumption?.type,
      consumptionEstimatedUnit: unit,
      consumptionEstimatedCo2: x.consumption?.co2,
      stock: x.oil?.stock,
      ...x.engines?.reduce(
        (acc, engine) => {
          acc[engine.description] = engine.consumption?.value;
          acc[`${engine.description}HR`] = engine.hours;
          return acc;
        },
        {} as Record<string, number | undefined>,
      ),
    }));

    downloadCSV(csvData, `consumption_interval`);
  };

  return (
    <Card>
      <CardHeader title={t('consume')}>
        {!isLoading && data.length > 0 && (
          <Button size="sm" onClick={exportToCSV}>
            <Download className="size-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {/* Filters Section */}
        <Item variant="outline" className="mb-6 flex-row items-end gap-4 overflow-x-auto bg-secondary">
          <ItemContent className="flex-none">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-44 justify-start bg-background text-left font-normal', !dateMin && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateMin ? format(dateMin, 'dd MM yyyy') : <span>{t('date.start')}</span>}
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
                <Button variant="outline" className={cn('w-44 justify-start bg-background text-left font-normal', !dateMax && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateMax ? format(dateMax, 'dd MM yyyy') : <span>{t('date.end')}</span>}
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

          <ItemContent className="min-w-[300px]">
            <ConsumptionMachineSelect
              mode="multi"
              label={t('vessel')}
              placeholder={t('vessels.select.placeholder')}
              idEnterprise={idEnterprise}
              value={machineIds}
              onChange={setMachineIds}
            />
          </ItemContent>

          <ItemContent className="min-w-[120px]">
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

          <Button variant="outline" className="ml-auto shrink-0 gap-2 bg-background" onClick={handleSearch} disabled={!idEnterprise}>
            <Search className="size-4" />
            {t('filter')}
          </Button>
        </Item>

        <div className="mb-6 flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="showReal" checked={showReal} onCheckedChange={(checked) => setShowReal(!!checked)} />
            <Label htmlFor="showReal" className="cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('real.consumption')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="showEstimated" checked={showEstimated} onCheckedChange={(checked) => setShowEstimated(!!checked)} />
            <Label htmlFor="showEstimated" className="cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('estimated.consumption')}
            </Label>
          </div>
        </div>

        {isLoading && <DefaultLoading />}
        {!isLoading && !data.length && <DefaultEmptyData />}

        {!isLoading && data.length > 0 && (
          <div className="space-y-8">
            {showReal && (
              <div className="space-y-4">
                <ItemTitle className="font-bold text-sky-600 uppercase">{t('polling')}</ItemTitle>
                <SummaryCards data={data} unit={unit} isReal={true} />
                <VesselComparison data={data} unit={unit} isReal={true} />
              </div>
            )}

            {showEstimated && (
              <div className="space-y-4">
                <ItemTitle className="font-bold text-amber-600 uppercase">{t('flowmeter')}</ItemTitle>
                <SummaryCards data={data} unit={unit} isReal={false} />
                <VesselComparison data={data} unit={unit} isReal={false} />
              </div>
            )}

            <ConsumptionTable data={data} unit={unit} isReal={showReal} isEstimated={showEstimated} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
