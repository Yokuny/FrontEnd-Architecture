import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/telemetry/heatmap-panel/')({
  component: HeatmapPanelPage,
});

function HeatmapPanelPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('telemetry.heatmap.panel')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted/src/pages/heatmap/panel/HeatmapPanel.jsx */}</CardContent>
    </Card>
  );
}
