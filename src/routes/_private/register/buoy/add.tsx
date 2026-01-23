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

  const formData = React.useMemo(() => {
    if (!initialData) return undefined;

    // Handle case where data might be nested (though the hook now handles this, being defensive)
    const raw = initialData.data || initialData;

    let latitude = 0;
    let longitude = 0;
    let delimitations: any[] = [];

    const loc = raw.location;

    if (loc) {
      if (Array.isArray(loc) && loc.length > 0) {
        latitude = loc[0].geometry?.coordinates?.[1] || 0;
        longitude = loc[0].geometry?.coordinates?.[0] || 0;
        delimitations = loc.map((l: any, index: number) => ({
          idDelimitation: l.idDelimitation || raw.location[index]?.idDelimitation || undefined,
          name: l.name || '',
          radius: l.properties?.radius || 0,
          color: l.color || '#3b82f6',
        }));
      } else if (loc.geometry?.coordinates) {
        latitude = loc.geometry.coordinates[1] || 0;
        longitude = loc.geometry.coordinates[0] || 0;
        delimitations = [
          {
            idDelimitation: loc.idDelimitation || undefined,
            name: loc.name || '',
            radius: loc.properties?.radius || 0,
            color: raw.color || loc.color || '#3b82f6',
          },
        ];
      }
    }

    return {
      id: raw.id,
      _id: raw._id,
      name: raw.name || '',
      proximity: raw.proximity || '',
      idEnterprise: raw.idEnterprise || raw.enterprise?.id || '',
      latitude,
      longitude,
      delimitations: delimitations.length > 0 ? delimitations : [{ name: '', radius: 0, color: '#3b82f6' }],
    };
  }, [initialData]);

  const { form, onSubmit, isPending } = useBuoyForm(formData as any);

  const handleDelete = async () => {
    const buoyId = initialData?.id || initialData?._id;
    if (!buoyId) return;
    try {
      await deleteBuoy.mutateAsync(buoyId);
      toast.success(t('delete.success'));
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
          <CardFooter layout="multi">
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
