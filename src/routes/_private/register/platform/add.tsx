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
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { usePlatform, usePlatformsApi } from '@/hooks/use-platforms-api';
import { PlatformForm } from './@components/platform-form';
import { usePlatformForm } from './@hooks/use-platform-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/platform/add')({
  component: PlatformAddPage,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  beforeLoad: () => ({
    title: 'platform',
  }),
});

function PlatformAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/register/platform/add' });
  const { idEnterprise } = useEnterpriseFilter();
  const { data: platform, isLoading } = usePlatform(id, idEnterprise);

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t(id ? 'edit.platform' : 'new.platform')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <PlatformAddFormContent initialData={platform} />;
}

function PlatformAddFormContent({ initialData }: { initialData?: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deletePlatform } = usePlatformsApi();

  const formData = useMemo(() => {
    if (!initialData) return undefined;
    return {
      id: initialData.id,
      idEnterprise: initialData.enterprise?.id,
      name: initialData.name,
      code: initialData.code,
      acronym: initialData.acronym,
      basin: initialData.basin,
      type: initialData.type,
      modelType: initialData.modelType,
      operator: initialData.operator,
      imo: initialData.imo,
      mmsi: initialData.mmsi,
      latitude: initialData.location?.coordinates?.[0],
      longitude: initialData.location?.coordinates?.[1],
      radius: initialData.radius,
      ais: initialData.ais,
    };
  }, [initialData]);

  const { form, onSubmit, isPending } = usePlatformForm(formData);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deletePlatform.mutateAsync(initialData.id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/platform', search: { page: 1, size: 20 } });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={initialData ? t('edit.platform') : t('new.platform')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <PlatformForm isEdit={!!initialData} />
          </CardContent>
          <CardFooter>
            {initialData && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={deletePlatform.isPending || isPending}>
                    {deletePlatform.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
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
            <Button type="submit" disabled={isPending || deletePlatform.isPending} className="min-w-[120px]">
              {isPending && <Spinner className="mr-2 size-4" />}
              {t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
