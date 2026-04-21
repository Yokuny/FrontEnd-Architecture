import { createFileRoute } from '@tanstack/react-router';
import Check from '@/components/icons/Check.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { t } from '@/lib/helpers/translate.helper';

import { ReminderForm } from './@components/reminder-form';
import { useReminderForm } from './@hooks/use-reminder-form';

export const Route = createFileRoute('/_private/reminders/add/')({
  component: ReminderAddPage,
  staticData: {
    title: t('reminder.new.title'),
    description: t('reminder.new.description'),
  },
});

function ReminderAddPage() {
  const { form, onSubmit, isPending } = useReminderForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="submit" form="reminder-form" disabled={isPending} className="ml-auto">
            {isPending ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">{t('save')}</span>
          </Button>
        </CardAction>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit} id="reminder-form">
          <CardContent>
            <ReminderForm />
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
