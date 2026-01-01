import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
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
import { AlertForm } from './@components/alert-form';
import { useAlertForm } from './@hooks/use-alert-form';

const searchSchema = z.object({
  id: z.string().optional(),
  duplicate: z.enum(['true', 'false']).optional(),
});

export const Route = createFileRoute('/_private/register/alerts/add')({
  component: Wrapper,
  validateSearch: (search) => searchSchema.parse(search),
});

function Wrapper() {
  return <AlertAddPage />;
}

function AlertAddPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { form, onSubmit, handleDelete, isLoading, isEditing } = useAlertForm();
  const { id } = Route.useSearch();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader title={id && !form.formState.isLoading ? t('editor.register.alerts') : t('add.alert')} />
          <CardContent>
            {isLoading && !form.formState.isDirty ? ( // Show only spinner if initial load
              <div className="flex h-32 items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <AlertForm />
            )}
          </CardContent>
          <CardFooter className="justify-between">
            {isEditing ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={isLoading}>
                    {isLoading ? <Spinner className="mr-2" /> : null}
                    {t('delete')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('confirm.delete.title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('delete.message.default')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner className="mr-2" /> : null}
                {t('save')}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
