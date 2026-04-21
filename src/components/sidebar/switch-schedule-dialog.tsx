import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ClipboardCheckIcon } from '@/components/icons/ClipboardCheck.Icon';
import { ScheduleDialog } from '@/components/schedule/schedule-dialog';
import { Button } from '@/components/ui/button';
import type { PartialSchedule } from '@/lib/interfaces/schedule.interface';
import { scheduleKeys } from '@/query/schedule';

export function ScheduleDialogSwitcher() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleSave = (_saved: PartialSchedule) => {
    void queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    setOpen(false);
  };

  const handleDelete = (_id: string) => {
    void queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    setOpen(false);
  };

  return (
    <>
      <Button type="button" size="icon" variant="secondary" onClick={() => setOpen(true)} aria-label="Novo agendamento">
        <ClipboardCheckIcon size={16} className="text-foreground" />
        <span className="sr-only">Novo agendamento</span>
      </Button>
      <ScheduleDialog open={open} onOpenChange={setOpen} onClose={handleClose} event={null} onSave={handleSave} onDelete={handleDelete} />
    </>
  );
}
