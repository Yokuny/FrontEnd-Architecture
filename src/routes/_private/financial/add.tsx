import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { FinancialForm } from './@components/financial-form';
import { useFinancialCreateForm } from './@hooks/use-financial-form';

export const Route = createFileRoute('/_private/financial/add')({
  component: FinancialAddPage,
});

function FinancialAddPage() {
  const navigate = useNavigate();
  const { form, onSubmit, isPending } = useFinancialCreateForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Registro Financeiro</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <FinancialForm />
          </CardContent>
          <CardFooter>
            <Button type="button" variant="outline" onClick={() => navigate({ to: '/financial' })} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="ml-auto min-w-[120px]">
              {isPending && <Spinner className="mr-2 size-4" />}
              Cadastrar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
