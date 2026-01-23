import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/cmms/filled-form-cmms/')({
  component: FilledFormCMMSPage,
});

function FilledFormCMMSPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('filled-form-cmms')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted/src/pages/forms/Filled/FilledListForms.jsx */}</CardContent>
    </Card>
  );
}
