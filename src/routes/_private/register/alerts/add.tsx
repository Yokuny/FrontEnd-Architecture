import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import DefaultLoading from '@/components/default-loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { useAlert, useAlertsApi } from '@/hooks/use-alerts-api';
import { AlertForm } from './@components/alert-form';
import { mapAlertToFormData, useAlertForm } from './@hooks/use-alert-form';

const searchSchema = z.object({
  id: z.string().optional(),
  duplicate: z.enum(['true', 'false']).optional(),
});

export const Route = createFileRoute('/_private/register/alerts/add')({
  component: AlertAddPage,
  validateSearch: (search) => searchSchema.parse(search),
  beforeLoad: () => ({
    title: 'rule.alerts',
  }),
});

function AlertAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/register/alerts/add' });
  const { data: initialData, isLoading } = useAlert(id || null);

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t('edit.alert')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <AlertAddFormContent initialData={initialData} />;
}

function AlertAddFormContent({ initialData }: { initialData?: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id, duplicate } = useSearch({ from: '/_private/register/alerts/add' });
  const { remove } = useAlertsApi();

  const isDuplicate = duplicate === 'true';
  const isEditing = !!id && !isDuplicate;

  const formData = useMemo(() => {
    if (!initialData) return undefined;
    return mapAlertToFormData(initialData, t, isDuplicate);
  }, [initialData, t, isDuplicate]);

  const { form, onSubmit, isPending } = useAlertForm(formData);

  const handleSave = async () => {
    try {
      await onSubmit();
      toast.success(t('save.success'));
      navigate({ to: '/register/alerts', search: { page: 1, size: 10 } } as any);
    } catch (_error) {
      // Error handled by hook or API
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await remove.mutateAsync(id);
      toast.success(t('delete.success'));
      navigate({ to: '/register/alerts', search: { page: 1, size: 10 } } as any);
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={isEditing ? t('edit.alert') : t('new.alert')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <CardContent className="p-0">
            <AlertForm />
          </CardContent>

          <CardFooter className="justify-between">
            {isEditing ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={isPending || remove.isPending}>
                    {remove.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
                    {t('delete')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('confirm.delete')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('delete.message.default')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-background">
                      {t('confirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/register/alerts', search: { page: 1, size: 10 } } as any)}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isPending || remove.isPending} className="min-w-[120px]">
                {isPending && <Spinner className="mr-2 size-4" />}
                {t('save')}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
