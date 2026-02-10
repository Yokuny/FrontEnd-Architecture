import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { subDays } from 'date-fns';
import { BrushCleaning, CalendarIcon, Search } from 'lucide-react';
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
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { ConsumptionCard } from './@components/ConsumptionCard';
import { DEFAULT_UNIT, DEFAULT_VIEW_TYPE, UNIT_OPTIONS, VIEW_TYPE_OPTIONS } from './@consts/consumption-comparative.consts';
import { useConsumptionComparative } from './@hooks/use-consumption-comparative-api';
import { searchSchema } from './@interface/consumption-comparative.schema';

export const Route = createFileRoute('/_private/consumption/comparative/')({
  staticData: {
    title: 'consumption.comparative',
    description:
      'Página de comparativo de consumo e estoque de combustível entre múltiplas embarcações. Permite visualizar e comparar gráficos de consumo real vs estimado ou níveis de estoque de combustível para várias embarcações simultaneamente em um período específico.',
    tags: ['consumption', 'consumo', 'fuel', 'combustível', 'vessel', 'embarcação', 'comparative', 'comparativo', 'stock', 'estoque', 'comparison', 'análise'],
    examplePrompts: [
      'Comparar o consumo de combustível entre navios A, B e C no último mês',
      'Ver comparativo de estoque de combustível de várias embarcações',
      'Análise comparativa de consumo entre embarcações em janeiro',
      'Gráfico comparativo de múltiplas embarcações',
    ],
    searchParams: [
      { name: 'dateMin', type: 'string', description: 'Data inicial do período no formato ISO 8601', example: '2025-01-01T00:00:00+00:00' },
      { name: 'dateMax', type: 'string', description: 'Data final do período no formato ISO 8601', example: '2025-02-04T23:59:59+00:00' },
      { name: 'machines', type: 'string', description: 'IDs das embarcações separados por vírgula', example: 'id1,id2,id3' },
      { name: 'unit', type: 'string', description: 'Unidade de medida: L (litros), m³ (metros cúbicos), gal (galões)', example: 'L' },
      { name: 'viewType', type: 'string', description: 'Tipo de visualização: consumption (consumo) ou stock (estoque)', example: 'consumption' },
    ],
    relatedRoutes: [
      { path: '/_private/consumption', relation: 'parent', description: 'Hub de consumo' },
      { path: '/_private/consumption/daily', relation: 'sibling', description: 'Consumo diário de uma embarcação' },
      { path: '/_private/consumption/relatorio', relation: 'sibling', description: 'Relatório de consumo com múltiplas embarcações' },
    ],
    entities: ['ConsumptionData', 'Machine', 'Enterprise', 'StockData'],
    capabilities: [
      'Comparar consumo entre múltiplas embarcações',
      'Alternar entre visualização de consumo e estoque',
      'Filtrar por período personalizado',
      'Selecionar múltiplas embarcações',
      'Visualizar gráficos comparativos',
    ],
  },
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
      dateMin: formatDate(dateMin, "yyyy-MM-dd'T'00:00:00xxx"),
      dateMax: formatDate(dateMax, "yyyy-MM-dd'T'23:59:59xxx"),
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
        dateMin: formatDate(dateMin, "yyyy-MM-dd'T'00:00:00xxx"),
        dateMax: formatDate(dateMax, "yyyy-MM-dd'T'23:59:59xxx"),
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
      <CardHeader />
      <CardContent>
        {/* Filters */}
        <Item variant="outline" className="bg-secondary">
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
            mode="multi"
            label={t('vessels')}
            placeholder={t('vessels.select.placeholder')}
            idEnterprise={idEnterprise}
            value={machineIds}
            onChange={setMachineIds}
          />

          <div className="flex min-w-32 flex-col gap-1.5">
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
          </div>

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

          <div className="ml-auto flex gap-2">
            {hasFilter && (
              <Button onClick={clearFilter}>
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
