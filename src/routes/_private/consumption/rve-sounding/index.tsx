import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { BrushCleaning, CalendarIcon, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { cn } from '@/lib/utils';
import { RVESoundingList } from './@components/rve-sounding-list';
import { useRVESoundingDashboard } from './@hooks/use-rve-sounding-api';
import { type RVESoundingSearchParams, rveSoundingSearchParamsSchema } from './@interface/rve-sounding.types';

export const Route = createFileRoute('/_private/consumption/rve-sounding/')({
  staticData: {
    title: 'dashboard.rve.sounding',
    description:
      'Dashboard de análise integrada entre RVE (Relatório de Viagem Eletrônico), sounding (medição de nível de tanques de combustível) e RDO (Relatório Diário de Operação). Permite monitorar o consumo através de diferentes fontes de dados: operações registradas, medições físicas de tanques e recebimento/abastecimento de combustível. Essencial para auditoria e reconciliação de combustível.',
    tags: [
      'consumption',
      'consumo',
      'fuel',
      'combustível',
      'vessel',
      'embarcação',
      'rve',
      'sounding',
      'medição',
      'tanque',
      'tank',
      'rdo',
      'polling',
      'voyage',
      'viagem',
      'measurement',
    ],
    examplePrompts: [
      'Ver dashboard de sounding e RVE',
      'Monitorar medições de tanque de combustível',
      'Reconciliação de combustível com sounding',
      'Análise de abastecimento e consumo via sounding',
    ],
    searchParams: [
      { name: 'machines', type: 'string', description: 'IDs das embarcações separados por vírgula', example: 'id1,id2,id3' },
      { name: 'dateStart', type: 'string', description: 'Data inicial no formato YYYY-MM-DD', example: '2025-01-01' },
      { name: 'dateEnd', type: 'string', description: 'Data final no formato YYYY-MM-DD', example: '2025-02-04' },
    ],
    relatedRoutes: [
      { path: '/_private/consumption', relation: 'parent', description: 'Hub de consumo' },
      { path: '/_private/consumption/rve-rdo', relation: 'sibling', description: 'Dashboard RVE vs RDO' },
      { path: '/_private/consumption/daily', relation: 'sibling', description: 'Consumo diário' },
    ],
    entities: ['Asset', 'Operation', 'Sounding', 'RDO', 'RVE'],
    capabilities: [
      'Visualizar medições de sounding',
      'Acompanhar operações do RVE',
      'Reconciliar dados de RDO com sounding',
      'Monitorar recebimento e abastecimento',
      'Analisar níveis de tanque',
      'Filtrar por embarcações e período',
    ],
  },
  component: RVESoundingDashboardPage,
  validateSearch: rveSoundingSearchParamsSchema,
});

function RVESoundingDashboardPage() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useRVESoundingDashboard(idEnterprise, search.machines, search.dateStart, search.dateEnd);

  // Filter state
  const [localFilters, setLocalFilters] = useState<RVESoundingSearchParams>(search);

  useEffect(() => {
    setLocalFilters(search);
  }, [search]);

  const dateStart = localFilters.dateStart ? new Date(localFilters.dateStart) : undefined;
  const dateEnd = localFilters.dateEnd ? new Date(localFilters.dateEnd) : undefined;

  const handleFilterChange = (newFilters: any) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...newFilters,
      }),
    });
  };

  const handleSearch = () => {
    handleFilterChange(localFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      machines: undefined,
      dateStart: undefined,
      dateEnd: undefined,
    };
    setLocalFilters(clearedFilters);
    handleFilterChange(clearedFilters);
  };

  const hasFilter = !!(localFilters.machines || localFilters.dateStart || localFilters.dateEnd);

  return (
    <Card>
      <CardHeader title={t('polling')} />

      <CardContent>
        <Item variant="outline" className="bg-secondary">
          <ItemContent className="flex-none">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              {t('date.start')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateStart && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {dateStart ? format(dateStart, 'dd MM yyyy') : <span>{t('date.start')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateStart}
                  onSelect={(date) =>
                    setLocalFilters({
                      ...localFilters,
                      dateStart: date ? format(date, 'yyyy-MM-dd') : undefined,
                    })
                  }
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
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateEnd && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {dateEnd ? format(dateEnd, 'dd MM yyyy') : <span>{t('date.end')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateEnd}
                  onSelect={(date) =>
                    setLocalFilters({
                      ...localFilters,
                      dateEnd: date ? format(date, 'yyyy-MM-dd') : undefined,
                    })
                  }
                  captionLayout="dropdown-years"
                  startMonth={new Date(2010, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
          </ItemContent>

          <MachineByEnterpriseSelect
            mode="multi"
            label={t('vessels')}
            idEnterprise={idEnterprise}
            value={localFilters.machines?.split(',').filter(Boolean)}
            onChange={(val) => setLocalFilters({ ...localFilters, machines: val?.join(',') || undefined })}
            placeholder={t('vessels')}
            className="min-w-56"
          />

          <div className="ml-auto flex shrink-0 gap-2">
            {hasFilter && (
              <Button disabled={isLoading} onClick={handleClear}>
                <BrushCleaning className="size-4" />
              </Button>
            )}
            <Button variant="outline" className="gap-2 bg-background" disabled={isLoading} onClick={handleSearch}>
              <Search className="size-4" />
              {t('filter')}
            </Button>
          </div>
        </Item>

        <RVESoundingList data={data} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
