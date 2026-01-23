import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/operation/downtime/')({
  component: DowntimePage,
});

function DowntimePage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('downtime')} />
      <CardContent>
        <p className="text-muted-foreground">{t('operation.downtime.description')}</p>
        <div className="mt-8 flex items-center justify-center rounded-lg border-2 border-dashed p-8">
          <p className="text-muted-foreground text-sm">Conteúdo em migração...</p>
        </div>
      </CardContent>
    </Card>
  );
}
