import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Check from '@/components/icons/Check.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useFinancialDetailQuery } from '@/query/financials';
import { useProfessionalsQuery } from '@/query/professionals';
import { FinancialDetailContent } from './@components/financial-detail-content';
import { FinancialEditForm } from './@components/financial-edit-form';
import { useFinancialEditForm } from './@hooks/use-financial-edit-form';
import { searchSchema } from './@interface/details.schema';

export const Route = createFileRoute('/_private/financial/details/')({
  component: FinancialDetailPage,
  validateSearch: searchSchema,
  staticData: {
    title: 'Detalhes do Registro',
    description: 'Visualização completa e edição de registro financeiro.',
  },
});

function FinancialDetailPage() {
  const search = Route.useSearch();
  const id = search.id;
  const { data: financial, isLoading } = useFinancialDetailQuery(id);
  const { data: professionals } = useProfessionalsQuery();

  const initialData = useMemo(
    () => ({
      price: financial?.price || 0,
      paid: financial?.paid || 0,
      paymentMethod: financial?.paymentMethod || 'none',
      installments: financial?.installments || 1,
      status: financial?.status || 'pending',
    }),
    [financial],
  );

  const { form, onSubmit, isPending } = useFinancialEditForm(id!, initialData);

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="submit" form="financial-edit-form" disabled={isPending}>
            {isPending ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">Salvar</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className={isLoading || !financial ? 'p-12' : ''}>
        {isLoading ? (
          <DefaultLoading />
        ) : !financial ? (
          <EmptyData />
        ) : (
          <div className="flex flex-col gap-8">
            <FinancialDetailContent financial={financial} professionals={professionals} />
            <Separator />
            <Form {...form}>
              <form onSubmit={onSubmit} id="financial-edit-form">
                <FinancialEditForm />
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
