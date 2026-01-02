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
import { useGeofence, useGeofencesApi } from '@/hooks/use-geofences-api';
import { GeofenceForm } from './@components/geofence-form';
import { useGeofenceForm } from './@hooks/use-geofence-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/geofences/add')({
  component: GeofenceAddPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'geofence',
  }),
});

function GeofenceAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/register/geofences/add' });
  const { data: geofence, isLoading } = useGeofence(id);

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t(id ? 'edit.geofence' : 'add.geofence')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <GeofenceAddFormContent initialData={geofence} />;
}

function GeofenceAddFormContent({ initialData }: { initialData?: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteGeofence } = useGeofencesApi();

  const formData = useMemo(() => {
    if (!initialData) return undefined;
    return {
      id: initialData.id,
      idEnterprise: initialData.idEnterprise,
      type: initialData.type,
      code: initialData.code,
      description: initialData.description,
      city: initialData.city,
      state: initialData.state,
      country: initialData.country,
      timezone: initialData.timezone,
      color: initialData.color,
      idFence: initialData.idFence,
      link: initialData.link,
      initializeTravel: !!initialData.initializeTravel,
      finalizeTravel: !!initialData.finalizeTravel,
      nearestPort: !!initialData.nearestPort,
      location: initialData.location,
    };
  }, [initialData]);

  const { form, onSubmit, isPending } = useGeofenceForm(formData);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteGeofence.mutateAsync(initialData.id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/geofences' } satisfies { to: string });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={initialData ? t('edit.geofence') : t('add.geofence')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <GeofenceForm />
          </CardContent>
          <CardFooter>
            {initialData && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={deleteGeofence.isPending || isPending}>
                    {deleteGeofence.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
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
            <Button type="submit" disabled={isPending || deleteGeofence.isPending} className="ml-auto min-w-[120px]">
              {isPending && <Spinner className="mr-2 size-4" />}
              {t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
