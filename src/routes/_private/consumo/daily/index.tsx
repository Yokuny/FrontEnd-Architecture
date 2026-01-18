import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/consumo/daily/')({
  component: ConsumptionDailyPage,
});

function ConsumptionDailyPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('consumption.daily')} />
      <CardContent>
        <DefaultLoading />
        {/* TODO: Implementar lógica de consumo diário */}
      </CardContent>
    </Card>
  );
}
