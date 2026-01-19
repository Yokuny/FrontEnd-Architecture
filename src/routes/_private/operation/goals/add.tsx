import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import { useGoal, useGoalsApi } from '@/hooks/use-goals-api';
import { GoalAddMachineModal } from './@components/goal-add-machine-modal';
import { GoalFormMeta } from './@components/goal-form-meta';
import { GoalFormTable } from './@components/goal-form-table';
import { useGoalForm } from './@hooks/use-goal-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/operation/goals/add')({
  component: GoalAddPage,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  beforeLoad: () => ({
    title: 'goal',
  }),
});

function GoalAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/operation/goals/add' });
  const { idEnterprise } = useEnterpriseFilter();

  const { data: goalData, isLoading } = useGoal(id || '');

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t('goal')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  // Inject idEnterprise if missing
  const initialData = goalData ? { ...goalData } : { idEnterprise: idEnterprise || '' };

  return <GoalAddFormContent initialData={initialData} />;
}

function GoalAddFormContent({ initialData }: { initialData: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteGoal } = useGoalsApi();
  const { form, onSubmit, isPending } = useGoalForm(initialData);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteGoal.mutateAsync(initialData.id);
      navigate({ to: '/operation/goals' });
    } catch {
      // Error handled by API toast
    }
  };

  return (
    <Card>
      <CardHeader title={initialData.id ? t('edit.goal') : t('add.goal')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <GoalFormMeta />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{t('goals')}</h3>
              <GoalAddMachineModal />
            </div>
            <GoalFormTable />
          </CardContent>

          <CardFooter layout="multi">
            <div>
              {initialData.id && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" disabled={deleteGoal.isPending || isPending}>
                      {deleteGoal.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
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
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/operation/goals' })}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isPending || deleteGoal.isPending} className="min-w-[120px]">
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
