import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/telemetry/download-data-asset-request/')({
  component: DownloadDataAssetRequestPage,
});

function DownloadDataAssetRequestPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('telemetry.download.data.asset.request')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted/src/pages/download/asset/index.jsx */}</CardContent>
    </Card>
  );
}
