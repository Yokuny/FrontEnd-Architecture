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
          <div className="flex flex-1 flex-wrap gap-4">
            <MachineByEnterpriseSelect
              mode="multi"
              label={t('vessels')}
              idEnterprise={idEnterprise}
              value={selectedMachines}
              onChange={(vals) => setSelectedMachines(vals)}
              className="min-w-[200px]"
            />
            <CustomerSelect
              mode="multi"
              label={t('customer')}
              idEnterprise={idEnterprise}
              value={selectedCustomers}
              onChange={(vals) => setSelectedCustomers(vals)}
              className="min-w-[200px]"
            />
          </div>

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
