import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import React from 'react';
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
import { useParam, useParamsApi } from '@/hooks/use-params-api';
import { ParamForm } from './@components/param-form';
import { useParamForm } from './@hooks/use-param-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/params/add')({
  component: ParamAddPage,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  beforeLoad: () => ({
    title: 'params',
  }),
});

function ParamAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/register/params/add' });
  const { data: param, isLoading } = useParam(id);

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t(id ? 'edit.params' : 'new.params')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <ParamAddFormContent initialData={param} />;
}

function ParamAddFormContent({ initialData }: { initialData?: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteParam } = useParamsApi();

  const formData = React.useMemo(
    () => ({
      id: initialData?.id,
      idEnterprise: initialData?.enterprise?.id,
      description: initialData?.description,
      type: initialData?.type,
      options: initialData?.options,
    }),
    [initialData],
  );

  const { form, onSubmit, isPending } = useParamForm(formData);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteParam.mutateAsync(initialData.id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/params', search: { page: 1, size: 20 } });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={initialData ? t('edit.params') : t('new.params')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <ParamForm />
          </CardContent>
          <CardFooter>
            {initialData && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={deleteParam.isPending || isPending}>
                    {deleteParam.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
                    {t('delete')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('delete.confirmation')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('delete.message.default')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-background">
                      {t('delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button type="submit" disabled={isPending || deleteParam.isPending} className="min-w-[120px]">
              {isPending && <Spinner className="mr-2 size-4" />}
              {t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
