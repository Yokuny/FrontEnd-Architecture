import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useFleetStatusList } from '@/hooks/use-statistics-api';
import { FleetStatusTable } from './@components/FleetStatusTable';

const searchSchema = z.object({
  idEnterprise: z.string().optional(),
});

export const Route = createFileRoute('/_private/statistics/integration/')({
  component: FleetStatusListPage,
  validateSearch: (search) => searchSchema.parse(search),
});

function FleetStatusListPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useFleetStatusList(idEnterprise);

  return (
    <Card>
      <CardHeader title={t('status.fleet')} />
      <CardContent>{isLoading ? <DefaultLoading /> : <FleetStatusTable data={data || []} />}</CardContent>
    </Card>
  );
}
