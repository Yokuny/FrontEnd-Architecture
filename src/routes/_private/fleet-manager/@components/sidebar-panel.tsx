import { ChevronLeft, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { FleetCamerasPanel } from './panel-cameras';
import { FleetConsumePanel } from './panel-consume';
import { FleetContactsPanel } from './panel-contacts';
import { FleetCrewPanel } from './panel-crew';
import { MachineDetailsPanel } from './panel-details-tab';
import { FleetInfoPanel } from './panel-info';
import { FleetMeasurePanel } from './panel-measure';
import { FleetNavigation } from './panel-navigation-btn';
import { FleetOptionsPanel } from './panel-options';
import { FleetManagerPanel } from './panel-search';
import { MachineSummaryPanel } from './panel-summary';
import { FleetLastVoyagePanel } from './panel-voyage';
import { VoyageDetailsPanel } from './panel-voyage-tab';

export function MenuPanel({ idEnterprise }: PanelContainerProps) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { selectedPanel, selectedMachineId, selectedVoyageId, isFleetbarOpen, toggleFleetbar, resetSelection, revertPanel } = useFleetManagerStore();

  if (!isFleetbarOpen) return null;

  const activeView = selectedPanel || 'search';

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
        return t('summary');
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
    <div className={cn('pointer-events-none z-1000', isMobile ? 'absolute inset-0 flex flex-col gap-2 p-2' : 'absolute inset-0 ml-13')}>
      <div className={cn('pointer-events-none', isMobile ? 'min-h-0 flex-1' : 'absolute top-4 bottom-4 left-4 w-96')}>
        <ItemGroup className="pointer-events-auto flex h-full w-full flex-col gap-0 overflow-hidden rounded-xl border border-primary/10 bg-background/95 shadow-2xl backdrop-blur-md">
          <Item size="sm" className="shrink-0 rounded-none border-b bg-muted/30 p-2 px-4">
            <ItemHeader>
              <ItemTitle className="font-semibold text-sm uppercase tracking-wider">{getTitle()}</ItemTitle>
              <ItemActions>
                <Button variant="ghost" size="icon-sm" onClick={revertPanel} title={t('back')}>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  title={t('close')}
                  onClick={() => {
                    resetSelection();
                    if (isFleetbarOpen) toggleFleetbar();
                  }}
                >
                  <X className="size-4" />
                </Button>
              </ItemActions>
            </ItemHeader>
          </Item>

          <div className="h-full w-full pb-20">
            <ScrollArea className="h-full w-full flex-1">
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
      </div>
    </div>
  );
}

interface PanelContainerProps {
  idEnterprise?: string;
}
