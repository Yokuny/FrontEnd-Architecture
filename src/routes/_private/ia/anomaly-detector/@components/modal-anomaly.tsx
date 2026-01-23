import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ModalAnomalyProps {
  show: boolean;
  onClose: () => void;
  sensorsFeatures: Record<string, number> | null;
}

export function ModalAnomaly({ show, onClose, sensorsFeatures }: ModalAnomalyProps) {
  const { t } = useTranslation();
  const sensors = Object.keys(sensorsFeatures || {});

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('sensors')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-1">
            {sensors.map((sensor, index) => (
              <Item key={`${index}-${sensor}`} className="px-4 py-2 transition-colors hover:bg-muted/50">
                <ItemContent>
                  <ItemTitle className="font-medium text-sm">{sensor}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
            {sensors.length === 0 && <div className="p-8 text-center text-muted-foreground italic">{t('no.sensors.found') || 'Nenhum sensor identificado'}</div>}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
