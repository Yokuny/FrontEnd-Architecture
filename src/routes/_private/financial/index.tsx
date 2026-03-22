import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Add from '@/components/icons/Add.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { DataTableAccordion } from '@/components/ui/data-table-accordion';
import { useFinancialsPartialQuery } from '@/query/financials';
import { FinancialView } from './@components/financial-view';
import { financialColumns } from './@utils/columns';

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

  const columns = useMemo(() => financialColumns(navigate), [navigate]);

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

      <CardContent>
        {isLoading && <DefaultLoading />}
        {!financials?.length && !isLoading && <DefaultEmptyData />}
        {financials?.length && !isLoading && (
          <DataTableAccordion
            data={financials}
            columns={columns}
            searchable
            itemsPerPage={5}
            bordered={false}
            onRowClick={(row) => navigate({ to: '/financial/details/$id', params: { id: row._id } })}
            renderExpanded={(row, isOpen) => <FinancialView id={row._id} isOpen={isOpen} />}
          />
        )}
      </CardContent>
    </Card>
  );
}
