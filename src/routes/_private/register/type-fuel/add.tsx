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
import { useFuelType, useFuelTypesApi } from '@/hooks/use-fuel-types-api';
import { TypeFuelForm } from './@components/type-fuel-form';
import { useTypeFuelForm } from './@hooks/use-type-fuel-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/type-fuel/add')({
  component: FuelTypeAddPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'type.fuel',
  }),
});

function FuelTypeAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/register/type-fuel/add' });
  const { data: fuelType, isLoading } = useFuelType(id);

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t('edit.type.fuel')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <FuelTypeAddFormContent initialData={fuelType} />;
}

function FuelTypeAddFormContent({ initialData }: { initialData?: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteFuelType } = useFuelTypesApi();

  const formData = useMemo(() => {
    if (!initialData) return undefined;
    return {
      id: initialData.id,
      description: initialData.description,
      idEnterprise: initialData.enterprise?.id,
      code: initialData.code,
      density: initialData.density,
      co2Coefficient: initialData.co2Coefficient,
      color: initialData.color,
    };
  }, [initialData]);

  const { form, onSubmit, isPending } = useTypeFuelForm(formData);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteFuelType.mutateAsync(initialData.id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/type-fuel' });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={initialData ? t('edit.type.fuel') : t('new.type.fuel')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <TypeFuelForm />
          </CardContent>
          <CardFooter>
            {initialData && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={deleteFuelType.isPending || isPending}>
                    {deleteFuelType.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
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
                      <Trash2 className="size-4" />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button type="submit" disabled={isPending || deleteFuelType.isPending} className="min-w-[120px]">
              {isPending && <Spinner className="mr-2 size-4" />}
              {t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
