import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';

import { ReminderForm } from './@components/reminder-form';
import { useReminderForm } from './@hooks/use-reminder-form';

export const Route = createFileRoute('/_private/reminders/add')({
  component: ReminderAddPage,
});

function ReminderAddPage() {
  const navigate = useNavigate();
  const { form, onSubmit, isPending } = useReminderForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <Card>
      <CardHeader />
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <ReminderForm />
          </CardContent>
          <CardFooter>
            <Button type="button" variant="outline" disabled={isPending} onClick={() => navigate({ to: '/reminders', search: { showAll: true } })}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="ml-auto min-w-[120px]">
              {isPending && <Spinner className="mr-2 size-4" />}
              Salvar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
