import { createFileRoute, useNavigate } from '@tanstack/react-router';

import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Add from '@/components/icons/Add.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { useFinancialsPartialQuery } from '@/query/financials';
import { FinancialList } from './@components/financial-list';

export const Route = createFileRoute('/_private/financial/')({
  component: FinancialListPage,
  staticData: {
    title: 'Financeiro',
    description: 'Lista registros financeiros pagos, cancelados ou em aberto.',
  },
});

function FinancialListPage() {
  const navigate = useNavigate();
  const { data: financials, isLoading } = useFinancialsPartialQuery();

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button onClick={() => navigate({ to: '/financial/add' })}>
            <Add className="mr-2 size-4" />
            Adicionar
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>{isLoading ? <DefaultLoading /> : !financials?.length ? <DefaultEmptyData /> : <FinancialList data={financials} />}</CardContent>
    </Card>
  );
}
