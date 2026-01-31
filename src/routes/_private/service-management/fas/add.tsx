import { createFileRoute } from '@tanstack/react-router';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { FasForm } from './@components/fas-form';
import { useFasForm } from './@hooks/use-fas-form';

export const Route = createFileRoute('/_private/service-management/fas/add')({
  component: FasAddPage,
  beforeLoad: () => ({
    title: 'add.fas',
  }),
});

function FasAddPage() {
  const { t } = useTranslation();
  const { form, onSubmit, isPending } = useFasForm();

  return (
    <Card>
      <CardHeader title={t('add.fas')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent className="p-0">
            <FasForm />
          </CardContent>
          <CardFooter className="mt-6 bg-muted/5">
            <Button type="submit" disabled={isPending} className="ml-auto min-w-[120px]">
              {isPending ? <Spinner className="mr-2 size-4" /> : <Check className="mr-2 size-4" />}
              {isPending ? t('saving') : t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
