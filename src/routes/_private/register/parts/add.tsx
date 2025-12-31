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
import { usePart, usePartsApi } from '@/hooks/use-parts-api';
import { PartForm } from './@components/part-form';
import { usePartForm } from './@hooks/use-part-form';
import type { PartFormData } from './@interface/part';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/parts/add')({
  component: PartAddPage,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  beforeLoad: () => ({
    title: 'parts',
  }),
});

function PartAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/register/parts/add' });
  const { data: part, isLoading } = usePart(id || '');

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t(id ? 'edit.part' : 'new.part')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <PartAddFormContent initialData={part} />;
}

function PartAddFormContent({ initialData }: { initialData?: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deletePart } = usePartsApi();

  const formData: PartFormData | undefined = React.useMemo(
    () =>
      initialData
        ? {
            id: initialData.id,
            name: initialData.name,
            sku: initialData.sku,
            idEnterprise: initialData.idEnterprise || '',
            description: initialData.description || '',
          }
        : undefined,
    [initialData],
  );

  const { form, onSubmit, isPending, imagePreview, onChangeImage } = usePartForm(formData, initialData?.image);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deletePart.mutateAsync(initialData.id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/parts', search: { page: 1, size: 10 } });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={initialData ? t('edit.part') : t('new.part')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <PartForm imagePreview={imagePreview} onChangeImage={onChangeImage} isEdit={!!initialData} />
          </CardContent>
          <CardFooter layout="multi">
            <div>
              {initialData && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" disabled={deletePart.isPending || isPending}>
                      {deletePart.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
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
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/register/parts', search: { page: 1, size: 10 } })}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isPending || deletePart.isPending} className="min-w-[120px]">
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
