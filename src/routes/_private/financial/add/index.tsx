import { createFileRoute } from '@tanstack/react-router';

import Check from '@/components/icons/Check.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { t } from '@/lib/helpers/translate.helper';
import { FinancialForm } from './@components/financial-form';
import { useFinancialCreateForm } from './@hooks/use-financial-form';

export const Route = createFileRoute('/_private/financial/add/')({
  component: FinancialAddPage,
  staticData: {
    title: t('record.new.title'),
    description: t('record.new.description'),
  },
});

function FinancialAddPage() {
  const { form, onSubmit, isPending } = useFinancialCreateForm();

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="submit" form="financial-form" disabled={isPending} className="ml-auto">
            {isPending ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">{t('register')}</span>
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
      <CardFooter>
        <CardAction>
          <Button type="submit" form="financial-form" disabled={isPending} className="ml-auto">
            {isPending ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">{t('register')}</span>
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
