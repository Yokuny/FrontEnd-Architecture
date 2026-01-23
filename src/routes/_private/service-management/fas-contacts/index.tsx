import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/service-management/fas-contacts/')({
  component: FASContactsPage,
});

function FASContactsPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('fas.contacts')} />
      <CardContent>{/* TODO: Migrate content (Suppliers) from iotlog-fronted/src/pages/forms/fas/Suppliers.jsx */}</CardContent>
    </Card>
  );
}
