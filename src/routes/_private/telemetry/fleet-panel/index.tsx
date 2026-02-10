import { createFileRoute } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { ModelMachineSelect } from '@/components/selects/model-machine-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useVesselPanelData } from '@/hooks/use-telemetry-api';
import { ItemVessel } from './@components/item-vessel';
import { MachinePanel } from './@components/machine-panel';
import { fleetPanelSearchSchema } from './@interface/vessel-panel.schema';
import type { VesselPanelItem } from './@interface/vessel-panel.types';

export const Route = createFileRoute('/_private/telemetry/fleet-panel/')({
  component: FleetPanelPage,
  validateSearch: (search) => fleetPanelSearchSchema.parse(search),
  staticData: {
    title: 'telemetry.fleet-panel',
    description:
      'Painel da frota com visualização em tempo real. Exibe cards de embarcações com status de conectividade, último update e acesso rápido ao painel individual de cada embarcação com sensores e métricas operacionais.',
    tags: ['fleet-panel', 'real-time', 'tempo-real', 'vessel-monitoring', 'connectivity', 'sensors', 'dashboard', 'iot'],
    examplePrompts: ['Ver painel da frota em tempo real', 'Acessar dados de sensores de uma embarcação', 'Monitorar status de conectividade da frota'],
    searchParams: [
      { name: 'idMachines', type: 'array', description: 'IDs das embarcações filtradas' },
      { name: 'idModels', type: 'array', description: 'IDs dos modelos filtrados' },
      { name: 'idMachine', type: 'string', description: 'ID da embarcação selecionada para visualização detalhada' },
      { name: 'name', type: 'string', description: 'Nome da embarcação selecionada' },
    ],
    relatedRoutes: [
      { path: '/_private/telemetry', relation: 'parent', description: 'Hub de telemetria' },
      { path: '/_private/telemetry/heatmap-fleet', relation: 'sibling', description: 'Heatmap da frota' },
      { path: '/_private/statistics/integration', relation: 'alternative', description: 'Status de integração' },
    ],
    entities: ['Machine', 'Sensor', 'VesselPanel'],
    capabilities: [
      'Grid de cards de embarcações',
      'Status de conectividade online/offline',
      'Último update de dados',
      'Filtros por embarcação e modelo',
      'Acesso ao painel individual',
      'Visualização de sensores em tempo real',
      'Métricas operacionais',
    ],
  },
});

function FleetPanelPage() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { idEnterprise } = useEnterpriseFilter();

  const idMachine = search.idMachine;
  const name = search.name;

  const [localFilters, setLocalFilters] = useState({
    idMachines: search.idMachines || [],
    idModels: search.idModels || [],
  });

  const { data, isLoading } = useVesselPanelData(idEnterprise, {
    idMachines: search.idMachines,
    idModels: search.idModels,
  });

  const handleFilter = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...localFilters,
      }),
    });
  };

  const handleVesselClick = (id: string, name: string) => {
    navigate({
      to: '/telemetry/fleet-panel',
      search: (prev) => ({
        ...prev,
        idMachine: id,
        name,
      }),
    });
  };

  if (idMachine) {
    return <MachinePanel idMachine={idMachine} name={name} idEnterprise={idEnterprise || ''} />;
  }

  return (
    <Card>
      <CardHeader title={t('fleet.panel')}>
        <div className="flex items-end gap-4">
          <MachineByEnterpriseSelect
            idEnterprise={idEnterprise}
            value={localFilters.idMachines}
            onChange={(val) => setLocalFilters((f) => ({ ...f, idMachines: val as string[] }))}
            mode="multi"
          />

          <ModelMachineSelect
            idEnterprise={idEnterprise}
            value={localFilters.idModels}
            onChange={(val) => setLocalFilters((f) => ({ ...f, idModels: val as string[] }))}
            mode="multi"
          />

          <Button onClick={handleFilter}>
            <Search className="size-4" />
            {t('filter')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !data || data.length === 0 ? (
          <DefaultEmptyData />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.map((vessel: VesselPanelItem) => (
              <ItemVessel key={vessel.id} data={vessel} onClick={handleVesselClick} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
