import { BarChart3, Calculator, Contact2, Info, InspectionPanel, Layers, PanelLeftOpen, Play, Search, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetActionButtons({ isLoadingHistory, onStartRoutePlayback }: FleetActionButtonsProps) {
  const { t } = useTranslation();
  const { selectedMachineId, playback, selectedPanel, setSelectedPanel, isFleetbarOpen, toggleFleetbar } = useFleetManagerStore();

  return (
    <div className="absolute right-0 pointer-events-none flex flex-col p-4" style={{ zIndex: 1010 }}>
      <ButtonGroup orientation="vertical" className="pointer-events-auto border rounded-lg">
        <Button
          title={t('menu')}
          size="icon-lg"
          className="border-accent"
          variant="default"
          onClick={() => {
            toggleFleetbar();
          }}
        >
          {isFleetbarOpen ? <InspectionPanel className="size-4" /> : <PanelLeftOpen className="size-4" />}
        </Button>

        <Button
          title={t('search')}
          size="icon-lg"
          className="border-accent"
          variant={selectedPanel === 'search' ? 'secondary' : 'default'}
          onClick={() => setSelectedPanel(selectedPanel === 'search' ? null : 'search')}
        >
          <Search className="size-4" />
        </Button>

        <Button
          title={t('options')}
          size="icon-lg"
          className="border-accent"
          variant={selectedPanel === 'options' ? 'secondary' : 'default'}
          onClick={() => setSelectedPanel(selectedPanel === 'options' ? null : 'options')}
        >
          <Layers className="size-4" />
        </Button>

        <Button
          title={t('measure')}
          size="icon-lg"
          className="border-accent"
          variant={selectedPanel === 'measure' ? 'secondary' : 'default'}
          onClick={() => {
            setSelectedPanel(selectedPanel === 'measure' ? null : 'measure');
          }}
        >
          <Calculator className="size-4" />
        </Button>

        {selectedMachineId && (
          <>
            <Button
              title={t('playback')}
              size="icon-lg"
              className="border-accent"
              variant={playback.isActive && playback.type === 'route' ? 'default' : 'secondary'}
              onClick={onStartRoutePlayback}
              disabled={isLoadingHistory}
            >
              <Play className="size-4" />
            </Button>

            <Button
              title={t('details')}
              size="icon-lg"
              className="border-accent"
              variant={selectedPanel === 'details' ? 'secondary' : 'default'}
              onClick={() => setSelectedPanel(selectedPanel === 'details' ? null : 'details')}
            >
              <BarChart3 className="size-4" />
            </Button>

            <Button
              title={t('crew')}
              size="icon-lg"
              className="border-accent"
              variant={selectedPanel === 'crew' ? 'secondary' : 'default'}
              onClick={() => setSelectedPanel(selectedPanel === 'crew' ? null : 'crew')}
            >
              <Contact2 className="size-4" />
            </Button>

            <Button
              title={t('consume')}
              size="icon-lg"
              className="border-accent"
              variant={selectedPanel === 'consume' ? 'secondary' : 'default'}
              onClick={() => setSelectedPanel(selectedPanel === 'consume' ? null : 'consume')}
            >
              <Zap className="size-4" />
            </Button>

            <Button
              title={t('info')}
              size="icon-lg"
              className="border-accent"
              variant={selectedPanel === 'info' ? 'secondary' : 'default'}
              onClick={() => setSelectedPanel(selectedPanel === 'info' ? null : 'info')}
            >
              <Info className="size-4" />
            </Button>
          </>
        )}
      </ButtonGroup>
    </div>
  );
}

interface FleetActionButtonsProps {
  isLoadingHistory?: boolean;
  onStartRoutePlayback: () => void;
}
