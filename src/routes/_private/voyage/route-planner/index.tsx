import { createFileRoute } from '@tanstack/react-router';
import L from 'leaflet';
import { useCallback, useState } from 'react';
import { Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Map as MapRoot } from '@/components/ui/map';
import { useTicketNAV } from '../../fleet-manager/@hooks/use-nautical-api';
import { MapCoordinatesLocal } from './@components/MapCoordinatesLocal';
import { RouteGeometry } from './@components/RouteGeometry';
import { RoutePlannerPanel } from './@components/RoutePlannerPanel';
import { useCalculateRoute } from './@hooks/use-route-planner-api';
import { routePlannerSearchSchema } from './@interface/schema';

export const Route = createFileRoute('/_private/voyage/route-planner/')({
  component: RoutePlannerPage,
  validateSearch: (search) => routePlannerSearchSchema.parse(search),
});

function ClickHandler({ onSelect }: { onSelect: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

function NauticalNAV() {
  const { decryptedToken, isLoading } = useTicketNAV();
  if (isLoading || !decryptedToken) return null;
  return <TileLayer attribution="&copy; IoTLog powered by Konz" url={`https://siot-third.konztec.com/tile/{z}/{x}/{y}?token=${decryptedToken}`} zIndex={1} />;
}

const startIcon = L.divIcon({
  html: `<div style="background:#22c55e;color:#fff;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.3)">A</div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const endIcon = L.divIcon({
  html: `<div style="background:#ef4444;color:#fff;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.3)">B</div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function RoutePlannerPage() {
  const calculateRouteMutation = useCalculateRoute();

  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
  const [selectTarget, setSelectTarget] = useState<'origin' | 'destination' | null>(null);
  const [filterParams, setFilterParams] = useState<any>({
    origin: null,
    destination: null,
    draftRestriction: null,
    waveHeightRestriction: null,
  });

  const onChange = useCallback((field: string, value: any) => {
    setFilterParams((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const handleMapClick = useCallback(
    (latlng: L.LatLng) => {
      if (selectTarget === 'origin') {
        onChange('origin', { lat: latlng.lat, lng: latlng.lng });
        setSelectTarget(null);
      } else if (selectTarget === 'destination') {
        onChange('destination', { lat: latlng.lat, lng: latlng.lng });
        setSelectTarget(null);
      }
    },
    [selectTarget, onChange],
  );

  const resetRoute = useCallback(() => {
    setFilterParams({
      origin: null,
      destination: null,
      draftRestriction: null,
      waveHeightRestriction: null,
    });
    setRouteGeoJson(null);
  }, []);

  const handleCalculateRoute = async () => {
    if (!filterParams.origin || !filterParams.destination) return;

    let restrictions = null;
    if (filterParams.draftRestriction || filterParams.waveHeightRestriction) {
      restrictions = {
        ...(filterParams.draftRestriction ? { draft: filterParams.draftRestriction } : {}),
        ...(filterParams.waveHeightRestriction ? { wave: filterParams.waveHeightRestriction } : {}),
      };
    }

    const data = await calculateRouteMutation.mutateAsync({
      departure: {
        latitude: filterParams.origin.lat,
        longitude: filterParams.origin.lng,
      },
      arrival: {
        latitude: filterParams.destination.lat,
        longitude: filterParams.destination.lng,
      },
      restrictions,
    });

    setRouteGeoJson(data);
  };

  const loadRouteFromHistory = useCallback((historyData: any) => {
    if (historyData?.features) {
      setRouteGeoJson({
        type: 'FeatureCollection',
        features: historyData.features,
      });
    }
  }, []);

  const canRoute = !!(filterParams.origin && filterParams.destination);

  return (
    <Card className="flex h-[98vh] overflow-hidden p-0">
      <CardContent className="relative h-full p-0">
        <MapRoot center={[-26.266658, -45.25586]} zoom={5} className="z-0 h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <NauticalNAV />
          <ClickHandler onSelect={handleMapClick} />

          {filterParams.origin && <Marker position={[filterParams.origin.lat, filterParams.origin.lng]} icon={startIcon} />}
          {filterParams.destination && <Marker position={[filterParams.destination.lat, filterParams.destination.lng]} icon={endIcon} />}

          <RouteGeometry routeGeoJson={routeGeoJson} />
          <MapCoordinatesLocal />
        </MapRoot>

        <RoutePlannerPanel
          filterParams={filterParams}
          onChange={onChange}
          calculateRoute={handleCalculateRoute}
          canRoute={canRoute}
          isRouting={calculateRouteMutation.isPending}
          setSelectTarget={setSelectTarget}
          selectTarget={selectTarget}
          resetRoute={resetRoute}
          routeGeoJson={routeGeoJson}
          loadRouteFromHistory={loadRouteFromHistory}
        />
      </CardContent>
    </Card>
  );
}
