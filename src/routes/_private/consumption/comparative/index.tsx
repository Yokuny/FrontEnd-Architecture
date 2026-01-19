import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/consumption/comparative/')({
  component: ConsumptionComparativePage,
});

function ConsumptionComparativePage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('consumption.comparative')} />
      <CardContent>
        <DefaultLoading />
        {/* TODO: Implementar lógica de consumo comparativo */}
      </CardContent>
    </Card>
  );
}
