import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/voyage/list-travel/')({
  component: ListTravelPage,
});

function ListTravelPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('voyage.list')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted */}</CardContent>
    </Card>
  );
}
