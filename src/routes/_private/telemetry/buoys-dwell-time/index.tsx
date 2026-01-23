import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/telemetry/buoys-dwell-time/')({
  component: BuoysDwellTimePage,
});

function BuoysDwellTimePage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('telemetry.buoys.dwell.time')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted */}</CardContent>
    </Card>
  );
}
