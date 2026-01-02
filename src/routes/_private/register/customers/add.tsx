import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { CustomerForm } from './@components/customer-form';
import { useCustomerForm } from './@hooks/use-customer-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/customers/add')({
  component: CustomerAddPage,
  validateSearch: (search) => searchSchema.parse(search),
});

function CustomerAddPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { id } = Route.useSearch();

  const { form, onSubmit, onDelete, isLoadingData } = useCustomerForm({
    id,
    redirect: () => navigate({ to: '/register/customers' } as any),
  });

  if (isLoadingData) {
    return (
      <Card>
        <CardHeader title={t('customer')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={t('customer')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <CustomerForm />
          </CardContent>

          <CardFooter layout="multi">
            <div>
              {id && (
                <Button variant="destructive" type="button" onClick={() => onDelete(id)} disabled={form.formState.isSubmitting}>
                  {t('delete')}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={() => navigate({ to: '/register/customers' } as any)}>
                {t('cancel')}
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
                {t('save')}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
