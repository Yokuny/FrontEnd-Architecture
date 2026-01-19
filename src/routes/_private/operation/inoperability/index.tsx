import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/operation/inoperability/')({
  component: InoperabilityPage,
});

function InoperabilityPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('inoperability')} />
      <CardContent>
        <p className="text-muted-foreground">{t('operation.inoperability.description', { defaultValue: 'Análise de índices de inoperabilidade dos ativos.' })}</p>
        <div className="mt-8 flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">Conteúdo em migração...</p>
        </div>
      </CardContent>
    </Card>
  );
}
