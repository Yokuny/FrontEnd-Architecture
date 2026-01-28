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
import { fleetPanelSearchSchema } from './@interface/vessel-panel.schema';
import type { VesselPanelItem } from './@interface/vessel-panel.types';

export const Route = createFileRoute('/_private/telemetry/fleet-panel/')({
  component: FleetPanelPage,
  validateSearch: (search) => fleetPanelSearchSchema.parse(search),
});

function FleetPanelPage() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { idEnterprise } = useEnterpriseFilter();

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
      to: '/telemetry/list-dashboard',
      search: { idMachine: id, name },
    });
  };

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
