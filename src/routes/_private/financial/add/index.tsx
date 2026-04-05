import { createFileRoute } from '@tanstack/react-router';

import Check from '@/components/icons/Check.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { FinancialForm } from './@components/financial-form';
import { useFinancialCreateForm } from './@hooks/use-financial-form';

export const Route = createFileRoute('/_private/financial/add/')({
  component: FinancialAddPage,
  staticData: {
    title: 'Novo Registro',
    description: 'Criação de transações financeiras manuais.',
  },
});

function FinancialAddPage() {
  const { form, onSubmit, isPending } = useFinancialCreateForm();

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="submit" form="financial-form" disabled={isPending} className="ml-auto min-w-[120px]">
            {isPending ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">Cadastrar</span>
          </Button>
        </CardAction>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} id="financial-form">
          <CardContent>
            <FinancialForm />
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
