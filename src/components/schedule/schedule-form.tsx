import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { PartialSchedule } from '@/lib/interfaces/schedule.interface';
import { ScheduleFormContent } from './schedule-form-content';

export type ScheduleFormProps = {
  event: PartialSchedule | null;
  onClose: () => void;
  onSave: (event: PartialSchedule) => void;
  onDelete: (eventId: string) => void;
};

export function ScheduleForm({ event, onClose, onSave, onDelete }: ScheduleFormProps) {
  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Agendamento</DialogTitle>
        <DialogDescription>{event?._id ? 'Editar detalhes do agendamento' : 'Adicionar um novo agendamento'}</DialogDescription>
      </DialogHeader>

      <ScheduleFormContent event={event} onClose={onClose} onSave={onSave} onDelete={onDelete} />
    </DialogContent>
  );
}
