import { createFileRoute } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Item } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useFleetCII } from '@/hooks/use-esg-api';
import { FleetCIITable } from './@components/FleetCIITable';

export const Route = createFileRoute('/_private/esg/cii-fleet/')({
  component: CIIFleetPage,
});

function CIIFleetPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const filters = {
    idEnterprise,
    'idMachine[]': selectedMachines.length > 0 ? selectedMachines : undefined,
    search: search || undefined,
  };

  const { data, isLoading } = useFleetCII(filters);

  return (
    <Card>
      <CardHeader title={t('esg.fleet')} />
      <CardContent className="flex flex-col">
        <Item variant="outline" className="bg-secondary">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search-input">{t('search.placeholder')}</Label>
            <Input id="search-input" placeholder={t('search.placeholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-64 bg-background" />
          </div>

          <MachineByEnterpriseSelect mode="multi" label={t('assets')} idEnterprise={idEnterprise} value={selectedMachines} onChange={(vals) => setSelectedMachines(vals)} />

          <Button variant="outline" className="ml-auto gap-2 bg-background">
            <Search className="size-4" />
            {t('search')}
          </Button>
        </Item>

        <div className="overflow-auto">{isLoading ? <DefaultLoading /> : <FleetCIITable data={data || []} />}</div>
      </CardContent>
    </Card>
  );
}
