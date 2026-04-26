import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Save from '@/components/icons/Save.Icon';
import { ScheduleFormContent } from '@/components/schedule';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { t } from '@/lib/helpers/translate.helper';
import type { PartialSchedule } from '@/lib/interfaces/schedule.interface';

const SCHEDULE_ADD_FORM_ID = 'schedule-add-form';

export const Route = createFileRoute('/_private/schedule/add/')({
  component: ScheduleAddPage,
  staticData: {
    title: t('new.appointment.page'),
    description: t('new.appointment.page.description'),
  },
});

function ScheduleAddPage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: '/schedule' });
  };

  const handleSave = (_saved: PartialSchedule) => {
    navigate({ to: '/schedule' });
  };

  const handleDelete = () => {
    // Novo agendamento na página dedicada não possui exclusão.
  };

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="submit" form={SCHEDULE_ADD_FORM_ID} className="ml-auto">
            <Save className="size-4" />
            <span className="sr-only md:not-sr-only">{t('save')}</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ScheduleFormContent event={null} onClose={handleClose} onSave={handleSave} onDelete={handleDelete} formId={SCHEDULE_ADD_FORM_ID} />
      </CardContent>
    </Card>
  );
}
