import { createFileRoute } from '@tanstack/react-router';
import { CalendarIcon, List, ListChecks, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Item } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useEEOICIIIndicators } from '@/hooks/use-esg-api';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { DownloadCSV } from './@components/DownloadCSV';
import { IndicatorsTable } from './@components/IndicatorsTable';
import { IndicatorsTableDetails } from './@components/IndicatorsTableDetails';

export const Route = createFileRoute('/_private/esg/indicators-eeoi-cii/')({
  staticData: {
    title: 'menu.eeoi.cii',
    description:
      'Página de monitoramento de indicadores de eficiência energética operacional (EEOI) e intensidade de carbono (CII) por viagem. Calcula EEOI = CO₂ / (carga × distância) e CII attained vs CII required conforme IMO MEPC.328(76). Permite visualização consolidada por viagem ou detalhada por leg. Essencial para compliance anual CII e planejamento operacional sustentável.',
    tags: ['esg', 'eeoi', 'cii', 'indicators', 'indicadores', 'efficiency', 'eficiência', 'voyage', 'viagem', 'imo', 'mepc', 'compliance', 'carbon', 'carbono', 'operational'],
    examplePrompts: [
      'Calcular EEOI das viagens do último trimestre',
      'Ver CII attained por embarcação',
      'Comparar indicadores entre viagens',
      'Análise detalhada de legs da viagem',
      'Exportar dados EEOI/CII para relatório IMO',
      'Verificar performance energética da frota',
    ],
    searchParams: [
      { name: 'idEnterprise', type: 'string', description: 'ID da empresa filtrada', example: 'enterprise-uuid' },
      { name: 'idMachine[]', type: 'array', description: 'IDs das embarcações selecionadas', example: 'machine-uuid-1,machine-uuid-2' },
      { name: 'dateTimeStart', type: 'string', description: 'Data inicial do período no formato YYYY-MM-DD', example: '2025-01-01' },
      { name: 'dateTimeEnd', type: 'string', description: 'Data final do período no formato YYYY-MM-DD', example: '2025-02-04' },
      { name: 'search', type: 'string', description: 'Termo de busca para filtrar viagens', example: 'Santos' },
    ],
    relatedRoutes: [
      { path: '/_private/esg', relation: 'parent', description: 'Hub ESG - Menu principal de conformidade ambiental' },
      { path: '/_private/esg/consumption-co2', relation: 'sibling', description: 'Monitoramento de emissões de CO₂' },
      { path: '/_private/esg/cii-fleet', relation: 'sibling', description: 'Rating CII consolidado da frota' },
      { path: '/_private/esg/simulator-cii', relation: 'sibling', description: 'Simulador de CII' },
      { path: '/_private/voyages', relation: 'sibling', description: 'Gestão de viagens' },
    ],
    entities: ['Voyage', 'Machine', 'Enterprise', 'CII', 'EEOI', 'ConsumptionData', 'Leg'],
    capabilities: [
      'Calcular EEOI por viagem (CO₂ / carga × distância)',
      'Calcular CII attained vs CII reference por ano',
      'Visualizar dados consolidados por viagem',
      'Detalhar indicadores por legs da viagem',
      'Filtrar por embarcações e período',
      'Exportar dados em CSV para DCS/MRV',
      'Monitorar compliance com IMO MEPC.328(76)',
      'Analisar eficiência operacional da frota',
    ],
  },
  component: IndicatorsEEOICIIPage,
});

function IndicatorsEEOICIIPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const [dateMin, setDateMin] = useState<Date | undefined>();
  const [dateMax, setDateMax] = useState<Date | undefined>();
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isShowDetails, setIsShowDetails] = useState(false);

  const filters: IndicatorsFilters = {
    idEnterprise,
    dateTimeStart: dateMin ? formatDate(dateMin, 'yyyy-MM-dd') : undefined,
    dateTimeEnd: dateMax ? formatDate(dateMax, 'yyyy-MM-dd') : undefined,
    'idMachine[]': selectedMachines,
    search: search || undefined,
  };

  const { data, isLoading } = useEEOICIIIndicators(filters, isShowDetails);

  return (
    <Card>
      <CardHeader title={t('menu.eeoi.cii')}>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsShowDetails(!isShowDetails)} className="gap-2">
            {isShowDetails ? <ListChecks className="size-4" /> : <List className="size-4" />}
            {isShowDetails ? t('voyage.complete') : t('voyage.integration')}
          </Button>

          <DownloadCSV data={data || []} isShowDetails={isShowDetails} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        <Item variant="outline" className="bg-secondary">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search-input">{t('search.placeholder')}</Label>
            <Input id="search-input" placeholder={t('search.placeholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 bg-background" />
          </div>

          <MachineByEnterpriseSelect idEnterprise={idEnterprise} value={selectedMachines} onChange={(val: any) => setSelectedMachines(val)} mode="multi" />

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateMin && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-1 size-4" />
                  {dateMin ? formatDate(dateMin, 'dd MM yyyy') : <span>{t('date.start')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" captionLayout="dropdown-years" selected={dateMin} onSelect={(date) => setDateMin(date)} initialFocus />
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
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" captionLayout="dropdown-years" selected={dateMax} onSelect={(date) => setDateMax(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <Button variant="outline" className="ml-auto gap-2 bg-background">
            <Search className="size-4" />
            {t('search')}
          </Button>
        </Item>

        <div className="overflow-auto">
          {isLoading && <DefaultLoading />}
          {!isLoading && isShowDetails && <IndicatorsTableDetails data={data || []} />}
          {!isLoading && !isShowDetails && <IndicatorsTable data={data || []} />}
        </div>
      </CardContent>
    </Card>
  );
}

export interface IndicatorsFilters {
  idEnterprise: string;
  dateTimeStart?: string;
  dateTimeEnd?: string;
  'idMachine[]'?: string[];
  search?: string;
}
