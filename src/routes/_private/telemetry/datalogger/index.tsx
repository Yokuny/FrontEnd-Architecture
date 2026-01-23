import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/telemetry/datalogger/')({
  component: DataloggerPage,
});

function DataloggerPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('telemetry.datalogger')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted/src/pages/datalogger/index.jsx */}</CardContent>
    </Card>
  );
}
