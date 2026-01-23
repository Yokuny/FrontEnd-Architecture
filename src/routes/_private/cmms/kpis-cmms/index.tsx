import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/cmms/kpis-cmms/')({
  component: KpisCMMSPage,
});

function KpisCMMSPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('kpis.cmms')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted/src/pages/maintenance/cmms/KPISCMMS.jsx */}</CardContent>
    </Card>
  );
}
