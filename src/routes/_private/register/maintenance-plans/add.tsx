import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
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
import { useMaintenancePlan, useMaintenancePlansApi } from '@/hooks/use-maintenance-plans-api';
import { MaintenancePlanForm } from './@components/maintenance-plan-form';
import { useMaintenancePlanForm } from './@hooks/use-maintenance-plan-form';

const searchSchema = z.object({
  id: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export const Route = createFileRoute('/_private/register/maintenance-plans/add')({
  component: MaintenancePlanAddPage,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  beforeLoad: () => ({
    title: 'maintenance.plan',
  }),
});

function MaintenancePlanAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/register/maintenance-plans/add' });
  const { data: maintenancePlan, isLoading } = useMaintenancePlan(id);

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t(id ? 'maintenance.plan.edit' : 'maintenance.plan.new')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <MaintenancePlanAddFormContent initialData={maintenancePlan} />;
}

function MaintenancePlanAddFormContent({ initialData }: { initialData?: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteMaintenancePlan } = useMaintenancePlansApi();

  const { form, onSubmit, isPending } = useMaintenancePlanForm({
    id: initialData?.id,
    idEnterprise: initialData?.idEnterprise || initialData?.enterprise?.id || '',
    description: initialData?.description || '',
    typeMaintenance: initialData?.typeMaintenance || '',
    daysNotice: initialData?.daysNotice ?? 0,
    durationDays: initialData?.durationDays ?? 0,
    maintanceCycle: initialData?.maintanceCycle,
    maintanceWear: initialData?.maintanceWear,
    servicesGrouped: initialData?.servicesGrouped || [],
    partsCycle: initialData?.partsCycle || [],
  });

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteMaintenancePlan.mutateAsync(initialData.id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/maintenance-plans', search: { page: 1, size: 20 } });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={initialData ? t('maintenance.plan.edit') : t('maintenance.plan.new')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <MaintenancePlanForm />
          </CardContent>
          <CardFooter>
            {initialData && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={deleteMaintenancePlan.isPending || isPending}>
                    {deleteMaintenancePlan.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
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
            <Button type="submit" disabled={isPending || deleteMaintenancePlan.isPending} className="min-w-[120px]">
              {isPending && <Spinner className="mr-2 size-4" />}
              {t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
