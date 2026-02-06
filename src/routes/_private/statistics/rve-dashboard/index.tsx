import { createFileRoute } from '@tanstack/react-router';
import { isValid, subMonths } from 'date-fns';
import { CalendarIcon, Loader2, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRVEDashboard } from '@/hooks/use-cmms-rve-api';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { KPI } from './@components/KPI';
import { RVEOperationalChart } from './@components/RVEOperationalChart';
import { RVEScaleChart } from './@components/RVEScaleChart';

const searchSchema = z.object({
  initialDate: z.string().optional(),
  finalDate: z.string().optional(),
  machines: z.string().optional(),
});

export const Route = createFileRoute('/_private/statistics/rve-dashboard/')({
  component: RVEDashboardPage,
  validateSearch: (search) => searchSchema.parse(search),
  staticData: {
    title: 'statistics.rve-dashboard',
    description:
      'Dashboard de Relatórios de Viagem Eletrônicos (RVE). Exibe KPIs operacionais, gráficos de códigos operacionais por embarcação e análise de escalas (portos visitados), permitindo filtros por período e embarcações.',
    tags: ['rve', 'voyage-report', 'operational-codes', 'escalas', 'ports', 'portos', 'dashboard', 'statistics', 'analytics'],
    examplePrompts: ['Ver dashboard RVE da frota', 'Analisar códigos operacionais das embarcações', 'Consultar escalas e portos visitados'],
    searchParams: [
      { name: 'initialDate', type: 'string', description: 'Data inicial (formato: yyyy-MM-dd)' },
      { name: 'finalDate', type: 'string', description: 'Data final (formato: yyyy-MM-dd)' },
      { name: 'machines', type: 'string', description: 'IDs das embarcações separadas por vírgula' },
    ],
    relatedRoutes: [
      { path: '/_private/statistics', relation: 'parent', description: 'Hub de estatísticas' },
      { path: '/_private/consumption/rve-rdo', relation: 'sibling', description: 'RVE com RDO (consumo)' },
      { path: '/_private/consumption/rve-sounding', relation: 'sibling', description: 'RVE com sounding' },
    ],
    entities: ['RVE', 'VoyageReport', 'OperationalCode', 'Port'],
    capabilities: [
      'KPIs de códigos operacionais',
      'Gráfico de distribuição de códigos operacionais',
      'Gráfico de escalas e portos visitados',
      'Filtros por período e embarcações',
      'Suporta até 1 mês de dados',
    ],
  },
});

function RVEDashboardPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();
  const navigate = Route.useNavigate();
  const { initialDate, finalDate, machines } = Route.useSearch();

  const defaultInitial = useMemo(() => subMonths(new Date(), 1), []);
  const defaultFinal = useMemo(() => new Date(), []);

  const parsedInitialDate = useMemo(() => {
    if (!initialDate) return defaultInitial;
    const d = new Date(initialDate);
    return isValid(d) ? d : defaultInitial;
  }, [initialDate, defaultInitial]);

  const parsedFinalDate = useMemo(() => {
    if (!finalDate) return defaultFinal;
    const d = new Date(finalDate);
    return isValid(d) ? d : defaultFinal;
  }, [finalDate, defaultFinal]);

  const parsedMachines = useMemo(() => machines?.split(',').filter(Boolean) || [], [machines]);

  // Local state for filters
  const [dateMin, setDateMin] = useState<Date | undefined>(parsedInitialDate);
  const [dateMax, setDateMax] = useState<Date | undefined>(parsedFinalDate);
  const [selectedMachines, setSelectedMachines] = useState<string[]>(parsedMachines);

  // Sync local state when search params change
  useEffect(() => {
    setDateMin(parsedInitialDate);
    setDateMax(parsedFinalDate);
    setSelectedMachines(parsedMachines);
  }, [parsedInitialDate, parsedFinalDate, parsedMachines]);

  const apiFilters = useMemo(() => {
    const filters: any = {};
    if (parsedMachines.length > 0) {
      filters.machines = parsedMachines.join(',');
    }
    filters.dateStart = parsedInitialDate.toISOString();
    filters.dateEnd = parsedFinalDate.toISOString();
    return filters;
  }, [parsedMachines, parsedInitialDate, parsedFinalDate]);

  const { data, isLoading } = useRVEDashboard(idEnterprise, apiFilters);

  const handleSearch = () => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        machines: selectedMachines.length ? selectedMachines.join(',') : undefined,
        initialDate: dateMin ? formatDate(dateMin, 'yyyy-MM-dd') : undefined,
        finalDate: dateMax ? formatDate(dateMax, 'yyyy-MM-dd') : undefined,
      }),
    });
  };

  const hasData = useMemo(() => {
    return (data?.codigosOperacionais?.length || 0) > 0 || (data?.escalas?.length || 0) > 0;
  }, [data]);

  return (
    <Card>
      <CardHeader title="RVE Dashboard" />
      <CardContent className="flex flex-col">
        {/* Filtros */}
        <Item variant="outline" className="bg-secondary">
          <MachineByEnterpriseSelect
            idEnterprise={idEnterprise}
            mode="multi"
            value={selectedMachines}
            onChange={(vals) => setSelectedMachines(vals)}
            placeholder={t('vessels.select.placeholder')}
            className="min-w-48"
          />

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateMin && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {dateMin ? formatDate(dateMin, 'dd MM yyyy') : <span>{t('date.start')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateMin} onSelect={setDateMin} initialFocus captionLayout="dropdown-years" startMonth={new Date(2010, 0)} endMonth={new Date()} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.end')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateMax && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {dateMax ? formatDate(dateMax, 'dd MM yyyy') : <span>{t('date.end')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateMax} onSelect={setDateMax} initialFocus captionLayout="dropdown-years" startMonth={new Date(2010, 0)} endMonth={new Date()} />
              </PopoverContent>
            </Popover>
          </div>

          <Button variant="outline" className="ml-auto gap-2 bg-background" onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            {t('filter')}
          </Button>
        </Item>

        {isLoading && <DefaultLoading />}
        {!hasData && !isLoading && <DefaultEmptyData />}
        {!isLoading && hasData && (
          <>
            <KPI data={data?.codigosOperacionais || []} />
            <RVEOperationalChart data={data?.codigosOperacionais || []} />
            <RVEScaleChart data={data?.escalas || []} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
