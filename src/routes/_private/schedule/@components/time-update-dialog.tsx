import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item, ItemActions, ItemDescription, ItemTitle } from '@/components/ui/item';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { TimeUpdateProps } from '../@interface/schedule.interface';

export function TimeUpdateDialog({ isOpen, onClose, pendingEvent, onConfirm }: TimeUpdateProps) {
  const handleConfirm = () => {
    if (!pendingEvent) return;
    onConfirm(pendingEvent);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('confirm.time.title')}</DialogTitle>
          <DialogDescription>{t('confirm.time.description')}</DialogDescription>
        </DialogHeader>
        {pendingEvent && (
          <Item className="flex-col items-start gap-2 rounded-lg border p-4">
            <ItemDescription>{t('day')}</ItemDescription>
            <ItemActions className="w-full items-baseline gap-2">
              <ItemTitle className="text-2xl tabular-nums">{formatDate(new Date(pendingEvent.end), 'dd - MMM')}</ItemTitle>
              <ItemDescription>{formatDate(new Date(pendingEvent.end), 'EEE')}</ItemDescription>
            </ItemActions>

            <ItemDescription>{t('time.label')}</ItemDescription>
            <ItemActions className="w-full items-center gap-2">
              <ItemTitle className="text-xl tabular-nums">{formatDate(new Date(pendingEvent.start), 'HH:mm')}</ItemTitle>-
              <ItemTitle className="text-xl tabular-nums">{formatDate(new Date(pendingEvent.end), 'HH:mm')}</ItemTitle>
            </ItemActions>
          </Item>
        )}
        <DialogFooter className="gap-2">
          <Button variant="info" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleConfirm}>{t('confirm.time.action')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
