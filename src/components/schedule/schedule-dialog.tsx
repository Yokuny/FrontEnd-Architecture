import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ItemDescription } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import type { PartialSchedule } from '@/lib/interfaces/schedule.interface';
import { useScheduleDetailQuery } from '@/query/schedule';
import { ScheduleForm } from './schedule-form';
import { ScheduleRender } from './schedule-render';

export type ScheduleDialogProps = {
  /** Elemento que abre o dialog (modo não controlado). */
  trigger?: React.ReactNode;
  event?: PartialSchedule | null;
  /** Modo controlado: estado aberto do dialog. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose: () => void;
  onSave: (event: PartialSchedule) => void;
  onDelete: (eventId: string) => void;
};

export function ScheduleDialog({ trigger, event = null, open: controlledOpen, onOpenChange, onClose, onSave, onDelete }: ScheduleDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
    if (!next) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <ScheduleDialogInner open={open} event={event} onSave={onSave} onDelete={onDelete} onClose={onClose} />
    </Dialog>
  );
}

/** Conteúdo view/edit reutilizado pelo dialog (sem o root Dialog). */
function ScheduleDialogInner({
  open,
  event,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  event: PartialSchedule | null;
  onClose: () => void;
  onSave: (event: PartialSchedule) => void;
  onDelete: (eventId: string) => void;
}) {
  const [mode, setMode] = useState<'view' | 'edit'>('edit');

  useEffect(() => {
    if (event?._id && open) {
      setMode('view');
    } else if (open) {
      setMode('edit');
    }
  }, [event, open]);

  const handleEdit = () => setMode('edit');

  const handleCloseEdit = () => {
    if (event?._id) {
      setMode('view');
    } else {
      onClose();
    }
  };

  return (
    <>
      {mode === 'view' && event?._id ? (
        <EventRenderWrapper event={event} onEdit={handleEdit} onClose={onClose} />
      ) : (
        <ScheduleForm event={event} onClose={handleCloseEdit} onSave={onSave} onDelete={onDelete} />
      )}
    </>
  );
}

function EventRenderWrapper({ event, onEdit, onClose }: { event: PartialSchedule; onEdit: () => void; onClose: () => void }) {
  const { data: schedule, isLoading } = useScheduleDetailQuery(event._id);

  return (
    <DialogContent className="w-11/12 gap-0 md:w-full md:max-w-4xl">
      {schedule && !isLoading ? (
        <ScheduleRender schedule={schedule} event={event} onEdit={onEdit} onClose={onClose} />
      ) : (
        <>
          <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row">
            <Skeleton className="h-7 w-[200px] md:h-8 md:w-[250px]" />
          </div>
          <div className="flex flex-col gap-4 md:gap-6 md:px-6">
            <ItemDescription>Atendimento</ItemDescription>
            <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
              <Skeleton className="flex w-full flex-row items-start py-16 md:max-w-lg md:flex-col" />
              <div className="flex w-full flex-row items-start justify-between gap-4 md:flex-col">
                <Skeleton className="w-full max-w-40 py-8" />
                <Skeleton className="w-full max-w-40 py-8" />
              </div>
            </div>
            <Skeleton className="py-32 md:max-w-lg" />
          </div>
        </>
      )}
    </DialogContent>
  );
}
