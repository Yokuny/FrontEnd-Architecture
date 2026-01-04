import { Ship } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Map as BaseMap, MapLayers, MapLayersControl, MapMarker, MapTileLayer } from '@/components/ui/map';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../@consts/fleet-manager';
import { useFleetMachines, useFleetPositions } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { MapCoordinates } from './map-coordinates';
import { MapMeasure } from './map-measure';
import { RegionPlayback } from './region-playback';
import { RoutePlayback } from './route-playback';

interface FleetMapProps {
  idEnterprise?: string;
}

export function FleetMap({ idEnterprise }: FleetMapProps) {
  const { showNames, showCodes, selectedMachineId, setSelectedMachineId, showMeasureLine, unitMeasureLine } = useFleetManagerStore();

  const { data: machines } = useFleetMachines({ idEnterprise });
  const machineIds = useMemo(() => machines?.map((m) => m.machine.id) || [], [machines]);
  const { data: positionsData } = useFleetPositions(machineIds, idEnterprise);

  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_MAP_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_MAP_ZOOM);

  // Center on selected machine
  useEffect(() => {
    if (selectedMachineId && positionsData?.positions) {
      const pos = positionsData.positions.find((p) => p.idMachine === selectedMachineId);
      if (pos) {
        setMapCenter(pos.position);
        setZoom(12);
      }
    }
  }, [selectedMachineId, positionsData]);

  return (
    <BaseMap center={mapCenter} zoom={zoom} className="size-full">
      <MapLayers defaultTileLayer="Default">
        <MapTileLayer name="Default" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapTileLayer name="Smooth Dark" url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <MapTileLayer name="Earth" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

        {/* Vessel Markers */}
        {positionsData?.positions.map((pos) => {
          const machine = machines?.find((m) => m.machine.id === pos.idMachine);
          const isSelected = selectedMachineId === pos.idMachine;

          return (
            <MapMarker
              key={pos.idMachine}
              position={pos.position}
              icon={
                <div className={`flex flex-col items-center transition-transform ${isSelected ? 'scale-125 z-50' : ''}`}>
                  {(showNames || showCodes) && (
                    <div className="bg-background/90 px-1.5 py-0.5 rounded border text-[10px] font-bold shadow-sm mb-1 whitespace-nowrap">
                      {showNames && machine?.machine.name}
                      {showNames && showCodes && ' - '}
                      {showCodes && (machine?.machine.code || machine?.machine.id)}
                    </div>
                  )}
                  <div className={`p-1.5 rounded-full border-2 bg-background shadow-md ${isSelected ? 'border-primary' : 'border-muted-foreground/30'}`}>
                    <Ship className={`size-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                </div>
              }
              eventHandlers={{
                click: () => setSelectedMachineId(pos.idMachine),
              }}
            />
          );
        })}
        <MapLayersControl />
        {showMeasureLine && <MapMeasure unit={unitMeasureLine} />}
        <RoutePlayback idMachine={selectedMachineId || ''} />
        <RegionPlayback />
      </MapLayers>
      <MapCoordinates />
    </BaseMap>
  );
}
