import { ScheduleFormContent } from '@/components/schedule/schedule-form-content';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ScheduleFormProps } from '../@interface/schedule.interface';

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
