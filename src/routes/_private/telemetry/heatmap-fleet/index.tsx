import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/telemetry/heatmap-fleet/')({
  component: HeatmapFleetPage,
});

function HeatmapFleetPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('telemetry.heatmap.fleet')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted */}</CardContent>
    </Card>
  );
}
