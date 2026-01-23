import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/voyage/kpis-travel/')({
  component: KpisTravelPage,
});

function KpisTravelPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('voyage.kpis')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted */}</CardContent>
    </Card>
  );
}
