import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/service-management/fas/')({
  component: FASPage,
});

function FASPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('fas')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted/src/pages/forms/fas/TableListFas.jsx */}</CardContent>
    </Card>
  );
}
