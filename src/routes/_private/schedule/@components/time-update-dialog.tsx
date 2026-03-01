import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { PartialSchedule } from '@/lib/interfaces/schedule';

export const TimeUpdateDialog = ({ isOpen, onClose, pendingEvent, onConfirm }: TimeUpdateProps) => {
  const handleConfirm = () => {
    if (!pendingEvent) return;
    onConfirm(pendingEvent);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar alteração de horário</DialogTitle>
          <DialogDescription>Tem certeza que deseja alterar o horário deste agendamento?</DialogDescription>
        </DialogHeader>
        {pendingEvent && (
          <div className="flex flex-col items-start space-y-2 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Dia</p>
            <div className="flex w-full items-baseline gap-2">
              <p className="font-bold text-2xl tabular-nums">{format(new Date(pendingEvent.end), 'dd - MMM', { locale: ptBR })}</p>
              <p className="text-muted-foreground text-sm">{format(new Date(pendingEvent.end), 'EEE', { locale: ptBR })}</p>
            </div>

            <p className="text-muted-foreground text-sm">Horário</p>
            <div className="flex w-full items-center gap-2">
              <p className="font-bold text-xl tabular-nums">{format(new Date(pendingEvent.start), 'HH:mm', { locale: ptBR })}</p>-
              <p className="font-bold text-xl tabular-nums">{format(new Date(pendingEvent.end), 'HH:mm', { locale: ptBR })}</p>
            </div>
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>Confirmar alteração</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type TimeUpdateProps = {
  isOpen: boolean;
  onClose: () => void;
  pendingEvent: PartialSchedule | null;
  onConfirm: (updatedEvent: PartialSchedule) => void;
};
