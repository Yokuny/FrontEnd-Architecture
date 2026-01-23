import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/voyage/route-planner/')({
  component: RoutePlannerPage,
});

function RoutePlannerPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('route.planner')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted */}</CardContent>
    </Card>
  );
}
