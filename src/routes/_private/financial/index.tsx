import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ItemGroup } from '@/components/ui/item';
import { useFinancialsPartialQuery } from '@/query/financials';
import { FinancialListItem } from './@components/financial-list';

export const Route = createFileRoute('/_private/financial/')({
  component: FinancialListPage,
});

function FinancialListPage() {
  const navigate = useNavigate();
  const { data: financials, isLoading } = useFinancialsPartialQuery();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Financeiro</CardTitle>
          <CardDescription>Lista registros financeiros. Pagos, cancelados ou em aberto.</CardDescription>
        </div>
        <CardAction>
          <Button onClick={() => navigate({ to: '/financial/add' })}>
            <Plus className="mr-2 size-4" />
            Adicionar
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !financials?.length ? (
          <DefaultEmptyData />
        ) : (
          <ItemGroup>
            {financials.map((financial) => (
              <FinancialListItem key={financial._id} financial={financial} />
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}
