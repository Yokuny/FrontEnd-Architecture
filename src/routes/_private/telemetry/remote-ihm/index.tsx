import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/telemetry/remote-ihm/')({
  component: RemoteIHMPage,
});

function RemoteIHMPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('telemetry.remote.ihm')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted */}</CardContent>
    </Card>
  );
}
