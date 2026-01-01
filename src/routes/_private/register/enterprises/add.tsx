import { createFileRoute } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
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
import { useEnterprise, useEnterprisesApi } from '@/hooks/use-enterprises-api';
import { EnterpriseForm } from './@components/enterprise-form';
import { useEnterpriseForm } from './@hooks/use-enterprise-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/enterprises/add')({
  component: EnterpriseAddPage,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  beforeLoad: () => ({
    title: 'enterprise',
  }),
});

function EnterpriseAddPage() {
  const { t } = useTranslation();
  const { id } = Route.useSearch();
  const { data: enterprise, isLoading } = useEnterprise(id || '');

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t('enterprise.edit')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  const formData: any = enterprise
    ? {
        ...enterprise,
        lat: enterprise.coordinate?.latitude,
        lon: enterprise.coordinate?.longitude,
        imagePreview: enterprise.logo || enterprise.image?.url,
        imagePreviewDark: typeof enterprise.imageDark?.url === 'string' ? enterprise.imageDark.url : (enterprise.imageDark?.url as any)?.url || (enterprise.imageDark as any),
      }
    : undefined;

  return <EnterpriseAddFormContent initialData={formData} />;
}

function EnterpriseAddFormContent({ initialData }: { initialData?: any }) {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { deleteEnterprise } = useEnterprisesApi();
  const { form, onSubmit, isPending } = useEnterpriseForm(initialData);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteEnterprise.mutateAsync(initialData.id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/enterprises', search: { page: 1, size: 10 } });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={initialData ? t('enterprise.edit') : t('enterprise.new')} />

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent className="p-0">
            <EnterpriseForm />
          </CardContent>

          <CardFooter layout="multi">
            {initialData && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={deleteEnterprise.isPending || isPending}>
                    {deleteEnterprise.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
                    {t('delete')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('confirm.delete')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('message.users.role.name', { name: initialData.name })}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-background">
                      {t('delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => navigate({ to: '/register/enterprises', search: { page: 1, size: 10 } })} disabled={isPending}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isPending || deleteEnterprise.isPending} className="min-w-[120px]">
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
