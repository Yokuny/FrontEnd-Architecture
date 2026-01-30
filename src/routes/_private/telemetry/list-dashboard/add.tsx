import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useDashboard, useSaveDashboard } from '@/hooks/use-dashboards-api';
import { DashboardForm } from './@components/dashboard-form';
import { useDashboardForm } from './@hooks/use-dashboard-form';

export const Route = createFileRoute('/_private/telemetry/list-dashboard/add')({
  component: DashboardAddPage,
});

function DashboardAddPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useSearch({ from: Route.id }) as { id?: string };
  const id = search.id;
  const isEdit = !!id;

  const { data: dashboard, isLoading } = useDashboard(id);
  const saveDashboard = useSaveDashboard();

  const { form } = useDashboardForm(dashboard);

  const onSubmit = async (values: any) => {
    try {
      // Standardize the payload based on legacy requirements if needed
      const payload = {
        ...values,
        id,
        public: values.visibility === 'public',
        users: values.visibility === 'limited' ? values.users.map((id: string) => ({ id })) : [],
      };

      await saveDashboard.mutateAsync(payload);
      toast.success(t(isEdit ? 'save.success' : 'create.success'));
      navigate({ to: '/telemetry/list-dashboard' } as any);
    } catch {
      toast.error(t('error.save'));
    }
  };

  if (isEdit && isLoading) {
    return (
      <Card>
        <CardHeader title={t(isEdit ? 'edit' : 'new')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={t(isEdit ? 'edit' : 'new')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <DashboardForm form={form} />
          </CardContent>
          <CardFooter layout="multi">
            <div className="ml-auto flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/telemetry/list-dashboard' } as any)}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={saveDashboard.isPending}>
                {t('save')}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
