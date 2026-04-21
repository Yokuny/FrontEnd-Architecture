import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import Check from '@/components/icons/Check.Icon';
import { ScheduleFormContent } from '@/components/schedule';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
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
  const [isBusy, setIsBusy] = useState(false);

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
          <Button type="submit" form={SCHEDULE_ADD_FORM_ID} disabled={isBusy} className="ml-auto">
            {isBusy ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">{t('save')}</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ScheduleFormContent event={null} onClose={handleClose} onSave={handleSave} onDelete={handleDelete} hideFooter formId={SCHEDULE_ADD_FORM_ID} onBusyChange={setIsBusy} />
      </CardContent>
    </Card>
  );
}
