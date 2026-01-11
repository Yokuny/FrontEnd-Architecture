import { createFileRoute } from '@tanstack/react-router';
import { Archive, BarChart3, Calculator, Contact2, InspectionPanel, Layers, PanelLeftOpen, Search, SendHorizontal, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group';
import { Map as BaseMap, MapLayers, MapMarker, MapTileLayer } from '@/components/ui/map';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { DataContainer } from '../@components/data-container';
import { FleetStatusSync } from '../@components/fleet-status-sync';
import { MapCoordinates } from '../@components/map-coordinates';
import { ExtraLayers } from '../@components/nautical/extra-layers';
import { NauticalLayers } from '../@components/nautical/nautical-layers';
import { RegionPlayback } from '../@components/region-playback';
import { RoutePlayback } from '../@components/route-playback';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../@consts/fleet-manager';
import { getNavigationStatusColor, getOperationStatusColor } from '../@hooks/status-utils';
import { useFleetHistory, useFleetMachines, useFleetPositions } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import type { FleetMachine } from '../@interface/fleet-api';

const fleetManagerSearchSchema = z.object({
  idVoyage: z.string().optional(),
  codeVoyage: z.string().optional(),
  request: z.string().optional(),
});

type FleetManagerSearch = z.infer<typeof fleetManagerSearchSchema>;

export const Route = createFileRoute('/_private/fleet-manager/fleet/')({
  component: FleetMapPage,
  validateSearch: (search: Record<string, unknown>): FleetManagerSearch => fleetManagerSearchSchema.parse(search),
  beforeLoad: () => ({
    title: 'fleet.map',
  }),
});

function FleetMapPage() {
  const { idEnterprise } = useEnterpriseFilter();
  const isMobile = useIsMobile();

  const { t } = useTranslation();
  const {
    showNames,
    showCodes,
    selectedMachineId,
    setSelectedMachineId,
    playback,
    setPlaybackActive,
    setPlaybackData,
    selectedPanel,
    setSelectedPanel,
    isNavigationIndicator,
    isOperationIndicator,
    statusMachine,
    operationMachines,
    isFleetbarOpen,
    toggleFleetbar,
    mapTheme,
  } = useFleetManagerStore();

  const { data: machines } = useFleetMachines({ idEnterprise });
  const machineIds = useMemo(() => machines?.map((m) => m.machine.id) || [], [machines]);
  const { data: positionsData } = useFleetPositions(machineIds, idEnterprise);

  const { data: historyData, isLoading: isLoadingHistory } = useFleetHistory({
    idMachine: selectedMachineId || undefined,
    hours: 24,
  });

  const vesselMarkers = useMemo(() => {
    const markersMap = new Map<string, { idMachine: string; position: [number, number]; machine: FleetMachine; heading: number }>();

    machines?.forEach((m) => {
      if (m.lastState?.coordinate) {
        markersMap.set(m.machine.id, {
          idMachine: m.machine.id,
          position: m.lastState.coordinate,
          machine: m,
          heading: m.lastState.heading || m.lastState.course || 0,
        });
      }
    });

    positionsData?.positions.forEach((pos) => {
      const machine = machines?.find((m) => m.machine.id === pos.idMachine);
      const course = positionsData.courses?.find((c) => c.idMachine === pos.idMachine);
      if (machine) {
        markersMap.set(pos.idMachine, {
          idMachine: pos.idMachine,
          position: pos.position,
          machine,
          heading: course?.course ?? machine.lastState?.heading ?? machine.lastState?.course ?? 0,
        });
      }
    });

    return Array.from(markersMap.values());
  }, [machines, positionsData]);

  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_MAP_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_MAP_ZOOM);

  useEffect(() => {
    if (selectedMachineId && positionsData?.positions) {
      const pos = positionsData.positions.find((p) => p.idMachine === selectedMachineId);
      if (pos) {
        setMapCenter(pos.position);
        setZoom(12);
      }
    }
  }, [selectedMachineId, positionsData]);

  const handleStartRoutePlayback = () => {
    if (historyData?.length) {
      const startTime = historyData[0][0] * 1000;
      const endTime = historyData[historyData.length - 1][0] * 1000;
      setPlaybackData(historyData, startTime, endTime);
      setPlaybackActive(true, 'route');
    }
  };

  return (
    <div className={cn('h-[calc(100dvh - 64px)] overflow-hidden', isMobile ? 'flex flex-col' : 'relative')}>
      <BaseMap center={mapCenter} zoom={zoom} className={cn('text-foreground flex-1 min-h-0', isMobile ? 'h-[80dvh] relative shrink-0' : 'fixed inset-0 z-0')}>
        <MapLayers defaultTileLayer={mapTheme}>
          <MapTileLayer name="default" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapTileLayer name="smoothdark" url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <MapTileLayer name="earth" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          <MapTileLayer
            name="rivers"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
          />
          <MapTileLayer
            name="simple"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
          />
          <MapTileLayer name="premium" url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAP_TILER}`} attribution="&copy; Maptiler" />

          {vesselMarkers.map((marker) => {
            const { machine, position, idMachine } = marker;
            const isSelected = selectedMachineId === idMachine;

            return (
              <MapMarker
                key={idMachine}
                position={position}
                icon={
                  <div className={`flex flex-col items-center transition-transform ${isSelected ? 'scale-125 z-50' : ''}`}>
                    {(showNames || showCodes) && (
                      <div className="bg-background/90 px-1.5 py-0.5 rounded border text-[10px] font-bold shadow-sm mb-1 whitespace-nowrap text-foreground">
                        {showNames && machine?.machine.name}
                        {showNames && showCodes && ' - '}
                        {showCodes && (machine?.machine.code || machine?.machine.id)}
                      </div>
                    )}
                    <div className="p-0.5 transition-transform">
                      {(() => {
                        let dynamicColor = machine?.modelMachine?.color;

                        if (isNavigationIndicator) {
                          const status = statusMachine?.find((x) => x.idMachine === idMachine)?.statusNavigation || machine?.lastState?.statusNavigation;
                          dynamicColor = getNavigationStatusColor(status) || dynamicColor;
                        } else if (isOperationIndicator) {
                          const opStatus = operationMachines?.find((o) => o?.machine?.id === idMachine)?.value;
                          dynamicColor = getOperationStatusColor(opStatus) || dynamicColor;
                        }

                        return (
                          <SendHorizontal
                            className="size-6 drop-shadow-md transition-all"
                            fill="currentColor"
                            style={{
                              color: dynamicColor,
                              transform: `rotate(${marker.heading - 90}deg)`,
                              filter: isSelected ? 'brightness(1.2) drop-shadow(0 0 4px currentColor)' : undefined,
                            }}
                          />
                        );
                      })()}
                    </div>
                  </div>
                }
                eventHandlers={{
                  click: () => setSelectedMachineId(idMachine),
                }}
              />
            );
          })}

          <NauticalLayers />
          <ExtraLayers />
          <FleetStatusSync />
          <RegionPlayback />

          <div className="absolute right-0 pointer-events-none flex flex-col p-4" style={{ zIndex: 1010 }}>
            <ButtonGroup orientation="vertical" className="pointer-events-auto border rounded-lg">
              <Button title={t('menu')} size="icon-lg" className="border-accent" variant="default" onClick={toggleFleetbar}>
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
                    onClick={handleStartRoutePlayback}
                    disabled={isLoadingHistory}
                  >
                    <Archive className="size-4" />
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
                    <Archive className="size-4" />
                  </Button>
                </>
              )}
            </ButtonGroup>
          </div>

          <MapCoordinates />

          <RoutePlayback idMachine={selectedMachineId || ''} />
          <DataContainer idEnterprise={idEnterprise} />
        </MapLayers>
      </BaseMap>
    </div>
  );
}
