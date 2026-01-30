import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
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
import { useMachine, useMachinesApi } from '@/hooks/use-machines-api';
import { MachineForm } from './@components/machine-form';
import { useMachineForm } from './@hooks/use-machine-form';

export const Route = createFileRoute('/_private/register/machines/add')({
  component: MachineAddPage,
});

function MachineAddPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useSearch({ from: Route.id }) as { id?: string };
  const isEdit = !!search.id;

  const { data: machine, isLoading } = useMachine(search.id || '');
  const { activateMachine, deactivateMachine } = useMachinesApi();

  const { form, onSubmit, isPending } = useMachineForm(machine, search.id);

  const handleToggleStatus = async () => {
    if (!search.id) return;
    try {
      if (machine?.isInactive) {
        await activateMachine.mutateAsync(search.id);
        toast.success(t('activate'));
      } else {
        await deactivateMachine.mutateAsync(search.id);
        toast.success(t('deactivate.successfull'));
      }
      navigate({ to: '/register/machines' } satisfies { to: string });
    } catch {
      toast.error(t('activate'));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit();
      toast.success(t('save.success'));
      navigate({ to: '/register/machines' } satisfies { to: string });
    } catch {
      toast.error(t('error.save'));
    }
  };

  if (isEdit && isLoading) {
    return (
      <Card>
        <CardHeader title={t(isEdit ? 'machine.edit' : 'machine.new')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={isEdit ? t('machine.edit') : t('machine.new')} />
      <Form {...form}>
        <form id="machine-form" onSubmit={handleSave}>
          <CardContent>
            <MachineForm isEdit={isEdit} />
          </CardContent>
          <CardFooter layout="multi">
            {isEdit && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className={machine?.isInactive ? 'text-primary' : 'text-destructive'}>
                    {machine?.isInactive ? t('activate') : t('deactivate')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{machine?.isInactive ? t('activate') : t('activate')}</AlertDialogTitle>
                    <AlertDialogDescription>{machine?.isInactive ? t('activate') : t('activate')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleToggleStatus}>{t('confirm')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <div className="ml-auto flex items-center gap-2">
              <Button type="button" onClick={() => navigate({ to: '/register/machines' } satisfies { to: string })}>
                {t('cancel')}
              </Button>
              <Button type="submit" form="machine-form" disabled={isPending}>
                {t('save')}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
