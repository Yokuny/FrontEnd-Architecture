import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format, subDays } from 'date-fns';
import { BrushCleaning, CalendarIcon, Search, X } from 'lucide-react';
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
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { cn } from '@/lib/utils';
import { ConsumptionCard } from './@components/ConsumptionCard';
import { DEFAULT_UNIT, DEFAULT_VIEW_TYPE, UNIT_OPTIONS, VIEW_TYPE_OPTIONS } from './@consts/consumption-comparative.consts';
import { useConsumptionComparative } from './@hooks/use-consumption-comparative-api';
import { searchSchema } from './@interface/consumption-comparative.schema';

export const Route = createFileRoute('/_private/consumption/comparative/')({
  component: ConsumptionComparativePage,
  validateSearch: searchSchema,
});

function ConsumptionComparativePage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  const [dateMin, setDateMin] = useState<Date>(search.dateMin ? new Date(search.dateMin) : subDays(new Date(), 30));
  const [dateMax, setDateMax] = useState<Date>(search.dateMax ? new Date(search.dateMax) : new Date());
  const [unit, setUnit] = useState<string>(search.unit || DEFAULT_UNIT);
  const [viewType, setViewType] = useState<string>(search.viewType || DEFAULT_VIEW_TYPE);
  const [machineIds, setMachineIds] = useState<string[]>(search.machines ? search.machines.split(',') : []);

  const apiFilters = useMemo(
    () => ({
      idEnterprise,
      dateMin: format(dateMin, "yyyy-MM-dd'T'00:00:00xxx"),
      dateMax: format(dateMax, "yyyy-MM-dd'T'23:59:59xxx"),
      unit,
      viewType: viewType as 'consumption' | 'stock',
      machines: machineIds.join(','),
    }),
    [idEnterprise, dateMin, dateMax, unit, viewType, machineIds],
  );

  const { data, isLoading } = useConsumptionComparative(apiFilters);

  const handleSearch = useCallback(() => {
    navigate({
      search: {
        dateMin: format(dateMin, "yyyy-MM-dd'T'00:00:00xxx"),
        dateMax: format(dateMax, "yyyy-MM-dd'T'23:59:59xxx"),
        unit,
        viewType: viewType as any,
        machines: machineIds.join(','),
      },
      replace: true,
    });
  }, [navigate, dateMin, dateMax, unit, viewType, machineIds]);

  const clearFilter = () => {
    setMachineIds([]);
    setDateMin(subDays(new Date(), 30));
    setDateMax(new Date());
    setUnit(DEFAULT_UNIT);
    setViewType(DEFAULT_VIEW_TYPE);
    navigate({ search: {} as any, replace: true });
  };

  const hasFilter = search.machines || search.dateMin || search.dateMax || search.unit || search.viewType;

  return (
    <Card>
      <CardHeader title={t('consumption.comparative')} />
      <CardContent>
        {/* Filters */}
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

          <ItemContent className="min-w-[250px]">
            <ConsumptionMachineSelect
              mode="multi"
              label={t('vessels')}
              placeholder={t('vessels.select.placeholder')}
              idEnterprise={idEnterprise}
              value={machineIds}
              onChange={setMachineIds}
            />
          </ItemContent>

          <ItemContent className="w-32 flex-none">
            <Label>{t('type')}</Label>
            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VIEW_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ItemContent>

          <ItemContent className="w-24 flex-none">
            <Label>{t('unit')}</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ItemContent>

          <div className="flex ml-auto gap-2">
            {hasFilter && (
              <Button onClick={clearFilter} className="text-amber-700 hover:text-amber-800">
                <BrushCleaning className="size-4" />
              </Button>
            )}
            <Button variant={hasFilter ? 'default' : 'outline'} onClick={handleSearch} className="gap-2">
              <Search className="size-4" />
              {t('filter')}
            </Button>
          </div>
        </Item>

        {isLoading && <DefaultLoading />}
        {!isLoading && (!data || data.length === 0) && <DefaultEmptyData />}

        {!isLoading && data && (
          <div className="space-y-4">
            {data.map((vessel, index) => (
              <ConsumptionCard key={`${vessel.machine.id}-${index}`} data={vessel} filters={apiFilters} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
