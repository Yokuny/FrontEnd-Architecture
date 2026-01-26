import { createFileRoute } from '@tanstack/react-router';
import { Save, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { VoyageForm } from './@components/voyage-form';
import { useVoyageForm } from './@hooks/use-voyage-form';

const voyageAddSearchSchema = z.object({
  id: z.string().optional(),
});

type VoyageAddSearch = z.infer<typeof voyageAddSearchSchema>;

export const Route = createFileRoute('/_private/voyage/list-travel/add')({
  component: VoyageAddPage,
  validateSearch: (search: Record<string, unknown>): VoyageAddSearch => voyageAddSearchSchema.parse(search),
});

function VoyageAddPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { id } = Route.useSearch();

  const { form, onSubmit, onDelete, isLoadingData } = useVoyageForm({
    id,
    redirect: () => navigate({ to: '/voyage/list-travel', search: { page: 1, size: 10 } }),
  });

  const title = id ? t('edit.trip') : t('new.trip');

  if (id && isLoadingData) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={title} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <VoyageForm />
          </CardContent>

          <CardFooter layout="multi">
            <div>
              {id && (
                <Button variant="destructive" type="button" onClick={() => onDelete(id)} disabled={form.formState.isSubmitting}>
                  <Trash2 className="mr-2 size-4" />
                  {t('delete')}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/voyage/list-travel', search: { page: 1, size: 10 } })}>
                {t('cancel')}
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
                <Save className="mr-2 size-4" />
                {t('save')}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
