import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatusIndicator } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { STATUS_VARIANTS } from '../@consts/heatmap-panel.consts';
import type { HeatmapEquipment, HeatmapMachine, HeatmapSubgroup } from '../@interface/heatmap-panel.types';

export function EquipmentDialog({ open, onOpenChange, machine, subgroup }: EquipmentDialogProps) {
  const { t } = useTranslation();

  const equipments = subgroup?.equipments?.sort((a, b) => a.name.localeCompare(b.name)) || [];

  const handleEquipmentClick = (equipment: HeatmapEquipment) => {
    const url = `https://app.tractian.com/analyze/${equipment.assetId}/insights/${equipment.insightId}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {machine?.name} - {subgroup?.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="flex flex-col gap-1">
            {equipments.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">{t('no.data')}</p>
            ) : (
              equipments.map((equipment, index) => (
                <Item
                  key={index}
                  variant="muted"
                  className="cursor-pointer flex-row items-center gap-3 p-3 transition-colors hover:bg-muted"
                  onClick={() => handleEquipmentClick(equipment)}
                >
                  <StatusIndicator status={STATUS_VARIANTS[equipment.status] || 'neutral'} />
                  <ItemContent className="flex-1">
                    <ItemTitle className="font-normal text-sm">{equipment.name}</ItemTitle>
                  </ItemContent>
                  <ExternalLink className="size-4 text-muted-foreground" />
                </Item>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface EquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machine?: HeatmapMachine;
  subgroup?: HeatmapSubgroup;
}
