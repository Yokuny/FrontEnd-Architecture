import { ScheduleDialog } from '@/components/schedule/schedule-dialog';
import type { EventDialogProps } from '../@interface/schedule.interface';

export function EventDialog({ event, isOpen, onClose, onSave, onDelete }: EventDialogProps) {
  return <ScheduleDialog open={isOpen} event={event} onClose={onClose} onSave={onSave} onDelete={onDelete} />;
}
