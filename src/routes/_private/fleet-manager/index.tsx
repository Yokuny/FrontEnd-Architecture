import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { Map as BaseMap, MapLayers, MapTileLayer } from '@/components/ui/map';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { FleetStatusSync } from './@components/fleet-status-sync';
import { ExtraLayers } from './@components/helpers/extra-layers';
import { NauticalLayers } from './@components/helpers/nautical-layers';
import { MapCoordinates } from './@components/map-coordinates';
import { FleetActionButtons } from './@components/sidebar-buttons';
import { MenuPanel } from './@components/sidebar-panel';
import { VesselMarkers } from './@components/vessel-markers';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from './@consts/fleet-manager';
import { useFleetMachines, useFleetPositions } from './@hooks/use-fleet-api';
import { useFleetManagerStore } from './@hooks/use-fleet-manager-store';

const fleetManagerSearchSchema = z.object({
  idVoyage: z.string().optional(),
  codeVoyage: z.string().optional(),
  request: z.string().optional(),
});

type FleetManagerSearch = z.infer<typeof fleetManagerSearchSchema>;

export const Route = createFileRoute('/_private/fleet-manager/')({
  component: FleetMapPage,
  validateSearch: (search: Record<string, unknown>): FleetManagerSearch => fleetManagerSearchSchema.parse(search),
  beforeLoad: () => ({
    title: 'fleet.map',
  }),
});

function FleetMapPage() {
  const { idEnterprise } = useEnterpriseFilter();
  const isMobile = useIsMobile();
  const { selectedMachineId, mapTheme } = useFleetManagerStore();

  const { data: machines } = useFleetMachines({ idEnterprise });
  const machineIds = useMemo(() => machines?.map((m) => m.machine.id) || [], [machines]);
  const { data: positionsData } = useFleetPositions(machineIds, idEnterprise);

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

  return (
    <div className={cn('- 64px)] h-[calc(100dvh overflow-hidden', isMobile ? 'flex flex-col' : 'relative')}>
      <BaseMap
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom
        maxZoom={17}
        minZoom={3}
        worldCopyJump
        doubleClickZoom={false}
        className={cn('min-h-0 flex-1 text-foreground', isMobile ? 'relative h-[80dvh] shrink-0' : 'fixed inset-0 z-0')}
      >
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
          <NauticalLayers />
          <ExtraLayers />
          <FleetStatusSync />

          <VesselMarkers />
          <FleetActionButtons />
          <MenuPanel idEnterprise={idEnterprise} />
        </MapLayers>
        <MapCoordinates />
      </BaseMap>
    </div>
  );
}
