import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/consumo/rve-sounding/')({
  component: ConsumptionRVESoundingPage,
});

function ConsumptionRVESoundingPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('consumption.rve.sounding')} />
      <CardContent>
        <DefaultLoading />
        {/* TODO: Implementar dashboard RVE vs Sondagem */}
      </CardContent>
    </Card>
  );
}
