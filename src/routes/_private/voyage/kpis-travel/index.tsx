import { createFileRoute } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { CustomerSelect } from '@/components/selects/customer-select';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemGroup } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { VesselEstimateVsRealChart } from './@components/VesselEstimateVsRealChart';
import { VoyageEstimateVsRealChart } from './@components/VoyageEstimateVsRealChart';
import { useVoyageKpis } from './@hooks/use-kpis-voyage-api';

export const Route = createFileRoute('/_private/voyage/kpis-travel/')({
  staticData: {
    title: 'kpis.travel',
    description:
      'Análise de KPIs e métricas de performance de viagens marítimas. Compara valores estimados vs reais de consumo, tempo de viagem, distância percorrida e eficiência operacional. Permite filtrar por embarcação e cliente para análise detalhada de TCE (Time Charter Equivalent), fuel efficiency, pontualidade e otimização de rotas por voyage e por vessel.',
    tags: [
      'kpi',
      'voyage',
      'viagem',
      'travel',
      'performance',
      'análise',
      'estimate',
      'estimativa',
      'real',
      'consumo',
      'fuel',
      'combustível',
      'tce',
      'efficiency',
      'eficiência',
      'vessel',
      'embarcação',
      'customer',
      'cliente',
      'comparison',
      'comparação',
      'metrics',
      'métricas',
    ],
    examplePrompts: [
      'Analisar KPIs das viagens',
      'Comparar consumo estimado vs real por voyage',
      'Ver performance de eficiência das embarcações',
      'Filtrar KPIs por cliente',
      'Verificar TCE e fuel efficiency por travel',
    ],
    searchParams: [],
    relatedRoutes: [
      { path: '/_private/voyage', relation: 'parent', description: 'Hub de viagens' },
      { path: '/_private/voyage/list-travel', relation: 'sibling', description: 'Listagem de viagens' },
      { path: '/_private/esg/indicators-eeoi-cii', relation: 'sibling', description: 'Indicadores EEOI/CII por viagem' },
      { path: '/_private/consumption', relation: 'sibling', description: 'Consumo de combustível detalhado' },
    ],
    entities: ['Voyage', 'Travel', 'Machine', 'Customer', 'NoonReport', 'Enterprise'],
    capabilities: [
      'Visualizar KPIs de viagem',
      'Comparar estimado vs real',
      'Filtrar por embarcação',
      'Filtrar por cliente',
      'Analisar fuel efficiency',
      'Calcular TCE',
      'Monitorar performance operacional',
      'Identificar desvios de rota',
    ],
  },
  component: KpisVoyagePage,
});

function KpisVoyagePage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const filters = {
    idEnterprise,
    'idMachine[]': selectedMachines.length > 0 ? selectedMachines : undefined,
    'idCustomer[]': selectedCustomers.length > 0 ? selectedCustomers : undefined,
  };

  const { data, isLoading, refetch } = useVoyageKpis(filters);

  const dataToRender = data?.filter((x: any) => x.calculated) || [];

  return (
    <Card>
      <CardHeader title={t('kpis.travel')} />
      <CardContent className="flex flex-col gap-4">
        <Item variant="outline" className="bg-secondary">
          <MachineByEnterpriseSelect
            mode="multi"
            label={t('vessels')}
            idEnterprise={idEnterprise}
            value={selectedMachines}
            onChange={(vals) => setSelectedMachines(vals)}
            className="min-w-48"
          />
          <CustomerSelect
            mode="multi"
            label={t('customer')}
            idEnterprise={idEnterprise}
            value={selectedCustomers}
            onChange={(vals) => setSelectedCustomers(vals)}
            className="min-w-48"
          />

          <Button variant="outline" className="ml-auto gap-2 bg-background" onClick={() => refetch()}>
            <Search className="size-4" />
            {t('filter')}
          </Button>
        </Item>

        <div>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <DefaultLoading />
            </div>
          ) : dataToRender.length > 0 ? (
            <ItemGroup>
              <VoyageEstimateVsRealChart data={dataToRender} />
              <VesselEstimateVsRealChart data={dataToRender} />
            </ItemGroup>
          ) : (
            <DefaultEmptyData />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
