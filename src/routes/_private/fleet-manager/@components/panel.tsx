import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { FleetConsumePanel } from './fleet-consume-panel';
import { FleetCrewPanel } from './fleet-crew-panel';
import { FleetDetailsPanel } from './fleet-details-panel';
import { FleetInfoPanel } from './fleet-info-panel';
import { FleetManagerPanel } from './fleet-manager-panel';
import { FleetMeasurePanel } from './fleet-measure-panel';
import { FleetOptionsPanel } from './fleet-options-panel';

export function Panel({ idEnterprise }: PanelContainerProps) {
  const { t } = useTranslation();
  const { selectedPanel, selectedMachineId, selectedVoyageId, isFleetbarOpen, toggleFleetbar, setSelectedPanel, setSelectedMachineId, setSelectedVoyageId, setPointsMeasureLine } =
    useFleetManagerStore();

  const assetOrVoyageSelected = !!(selectedMachineId || selectedVoyageId);

  // Only one panel should be active in the unified card
  // Priority: Explicitly selected panel > Sidebar Toggle
  let activeView = selectedPanel;

  if (!activeView) {
    if (isFleetbarOpen) activeView = 'search';
  }

  const handleClose = () => {
    setSelectedPanel(null);
    setSelectedMachineId(null);
    setSelectedVoyageId(null);
    setPointsMeasureLine([]);
    if (isFleetbarOpen) toggleFleetbar();
  };

  if (!activeView) return null;

  const getTitle = () => {
    switch (activeView) {
      case 'options':
        return t('options');
      case 'search':
        return t('fleet.manager');
      case 'details':
        return t('details');
      case 'crew':
        return t('crew');
      case 'consume':
        return t('consume');
      case 'info':
        return t('info');
      case 'measure':
        return t('measure');
      default:
        return '';
    }
  };

  return (
    <ItemGroup className="w-full h-full flex flex-col pointer-events-auto bg-background/95 backdrop-blur-md border border-primary/10 rounded-xl shadow-2xl overflow-hidden gap-0">
      <Item size="sm" className="p-2 px-4 border-b bg-muted/30 shrink-0 rounded-none">
        <ItemHeader>
          <ItemTitle className="font-semibold text-sm uppercase tracking-wider">{getTitle()}</ItemTitle>
          <ItemActions>
            <Button variant="ghost" size="icon-sm" onClick={toggleFleetbar} title={isFleetbarOpen ? t('collapse') : t('expand')}>
              {isFleetbarOpen ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={handleClose} title={t('close')}>
              <X className="size-4" />
            </Button>
          </ItemActions>
        </ItemHeader>
      </Item>

      <ScrollArea className="flex-1 w-full">
        <div className="w-full h-full">
          {activeView === 'search' && <FleetManagerPanel idEnterprise={idEnterprise} />}
          {activeView === 'crew' && selectedMachineId && <FleetCrewPanel />}
          {activeView === 'details' && assetOrVoyageSelected && <FleetDetailsPanel />}
          {activeView === 'options' && <FleetOptionsPanel />}
          {activeView === 'measure' && <FleetMeasurePanel />}
          {activeView === 'consume' && selectedMachineId && <FleetConsumePanel />}
          {activeView === 'info' && selectedMachineId && <FleetInfoPanel />}
        </div>
      </ScrollArea>
    </ItemGroup>
  );
}

interface PanelContainerProps {
  idEnterprise?: string;
}
