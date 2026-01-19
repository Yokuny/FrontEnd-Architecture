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
        <p className="text-muted-foreground">{t('operation.downtime.description', { defaultValue: 'Gerenciamento de paradas e tempos de inatividade.' })}</p>
        <div className="mt-8 flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">Conteúdo em migração...</p>
        </div>
      </CardContent>
    </Card>
  );
}
