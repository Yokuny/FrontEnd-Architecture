import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/telemetry/diagram-list/')({
  component: DiagramListPage,
});

function DiagramListPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('telemetry.diagram.list')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted/src/pages/diagram-list/index.jsx */}</CardContent>
    </Card>
  );
}
