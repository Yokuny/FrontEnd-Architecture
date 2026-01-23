import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const Route = createFileRoute('/_private/contracts/contract-list/')({
  component: ContractListPage,
});

function ContractListPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('contract.list')} />
      <CardContent>{/* TODO: Migrate content from iotlog-fronted/src/pages/register/contract/view/ListContract.jsx */}</CardContent>
    </Card>
  );
}
