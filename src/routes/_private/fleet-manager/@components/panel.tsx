import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { FleetCamerasPanel } from './fleet-cameras-panel';
import { FleetConsumePanel } from './fleet-consume-panel';
import { FleetContactsPanel } from './fleet-contacts-panel';
import { FleetCrewPanel } from './fleet-crew-panel';
import { FleetInfoPanel } from './fleet-info-panel';
import { FleetLastVoyagePanel } from './fleet-last-voyage-panel';
import { FleetManagerPanel } from './fleet-manager-panel';
import { FleetMeasurePanel } from './fleet-measure-panel';
import { FleetNavigation } from './fleet-navigation';
import { FleetOptionsPanel } from './fleet-options-panel';
import { MachineDetailsPanel } from './machine-details-panel';
import { MachineSummaryPanel } from './summary-panel';
import { VoyageDetailsPanel } from './voyage-details-panel';

export function Panel({ idEnterprise }: PanelContainerProps) {
  const { t } = useTranslation();
  const { selectedPanel, selectedMachineId, selectedVoyageId, isFleetbarOpen, toggleFleetbar, resetSelection, revertPanel } = useFleetManagerStore();

  // Only one panel should be active in the unified card
  // Priority: Explicitly selected panel > Sidebar Toggle
  let activeView = selectedPanel;

  if (!activeView) {
    if (isFleetbarOpen) activeView = 'search';
  }

  const handleClose = () => {
    resetSelection();
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
      case 'summary':
        return t('summary', 'Resumo');
      case 'cameras':
        return t('camera');
      case 'contacts':
        return t('contacts');
      case 'last-voyage':
        return t('travel');
      case 'voyage':
        return t('travel');
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
            <Button variant="ghost" size="icon-sm" onClick={revertPanel} title={t('back')}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={handleClose} title={t('close')}>
              <X className="size-4" />
            </Button>
          </ItemActions>
        </ItemHeader>
      </Item>

      <div className="w-full h-full pb-20">
        <ScrollArea className="flex-1 w-full h-full">
          {activeView === 'search' && <FleetManagerPanel idEnterprise={idEnterprise} />}
          {activeView === 'summary' && selectedMachineId && <MachineSummaryPanel />}
          {activeView === 'details' && selectedMachineId && <MachineDetailsPanel />}
          {activeView === 'voyage' && selectedVoyageId && <VoyageDetailsPanel />}
          {activeView === 'cameras' && selectedMachineId && <FleetCamerasPanel />}
          {activeView === 'contacts' && selectedMachineId && <FleetContactsPanel />}
          {activeView === 'last-voyage' && selectedMachineId && <FleetLastVoyagePanel />}
          {activeView === 'options' && <FleetOptionsPanel />}
          {activeView === 'measure' && <FleetMeasurePanel />}
          {activeView === 'crew' && selectedMachineId && <FleetCrewPanel />}
          {activeView === 'consume' && selectedMachineId && <FleetConsumePanel />}
          {activeView === 'info' && selectedMachineId && <FleetInfoPanel />}
        </ScrollArea>
        {selectedMachineId && activeView !== 'search' && activeView !== 'options' && activeView !== 'measure' && <FleetNavigation />}
      </div>
    </ItemGroup>
  );
}

interface PanelContainerProps {
  idEnterprise?: string;
}
