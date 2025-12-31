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
import { useBuoy, useBuoysApi } from '@/hooks/use-buoys-api';
import { BuoyForm } from './@components/buoy-form';
import { useBuoyForm } from './@hooks/use-buoy-form';
import type { BuoyFormData } from './@interface/buoy';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/buoy/add')({
  component: BuoyAddPage,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  beforeLoad: () => ({
    title: 'buoys',
  }),
});

function BuoyAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/register/buoy/add' });
  const { data: buoy, isLoading } = useBuoy(id);

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t(id ? 'edit.buoy' : 'new.buoy')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <BuoyAddFormContent initialData={buoy} />;
}

function BuoyAddFormContent({ initialData }: { initialData?: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteBuoy } = useBuoysApi();

  const formData: BuoyFormData | undefined = React.useMemo(() => {
    if (!initialData) return undefined;

    // Handle data transformation from legacy API structure
    let coordinates = [0, 0];
    let delimitations = [];

    if (initialData.location?.type === 'Polygon' || Array.isArray(initialData.location)) {
      const locs = Array.isArray(initialData.location) ? initialData.location : [initialData.location];
      coordinates = [locs[0].geometry.coordinates[1], locs[0].geometry.coordinates[0]];
      delimitations = locs.map((l: any) => ({
        idDelimitation: l.idDelimitation,
        name: l.name,
        radius: l.properties.radius,
        color: l.color || '#3b82f6',
      }));
    }

    return {
      id: initialData.id,
      name: initialData.name,
      proximity: initialData.proximity,
      idEnterprise: initialData.idEnterprise,
      latitude: coordinates[0],
      longitude: coordinates[1],
      delimitations: delimitations.length > 0 ? delimitations : [{ name: '', radius: 0, color: '#3b82f6' }],
    };
  }, [initialData]);

  const { form, onSubmit, isPending } = useBuoyForm(formData);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteBuoy.mutateAsync(initialData.id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/buoy', search: { page: 1, size: 10 } });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={initialData ? t('edit.buoy') : t('new.buoy')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <BuoyForm isEdit={!!initialData} />
          </CardContent>
          <CardFooter className="flex justify-between items-center bg-muted/5 border-t py-4 px-6 mt-4">
            <div>
              {initialData && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" disabled={deleteBuoy.isPending || isPending}>
                      {deleteBuoy.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
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
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/register/buoy', search: { page: 1, size: 10 } })}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isPending || deleteBuoy.isPending} className="min-w-[120px]">
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
