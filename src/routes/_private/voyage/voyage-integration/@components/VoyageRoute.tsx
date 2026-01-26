import L from 'leaflet';
import { Flag, Radio } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import { MapMarker, MapPolyline } from '@/components/ui/map';
import { useVoyageRoute } from '../@hooks/use-voyage-integration-api';
import { useVoyageIntegrationStore } from '../@hooks/use-voyage-integration-store';

export function VoyageRoute() {
  const map = useMap();
  const selectedVoyage = useVoyageIntegrationStore((state) => state.selectedVoyage);
  const kickVoyageFilter = useVoyageIntegrationStore((state) => state.kickVoyageFilter);

  const { data: rawPoints } = useVoyageRoute(selectedVoyage?.idVoyage || null);

  const points = useMemo(() => {
    if (!rawPoints?.length) return [];

    let filtered = rawPoints;
    if (kickVoyageFilter) {
      const departureUnix = Math.floor(new Date(kickVoyageFilter.dateTimeDeparture).getTime() / 1000);
      const arrivalUnix = Math.floor(new Date(kickVoyageFilter.dateTimeArrival).getTime() / 1000);
      filtered = rawPoints.filter((p: any) => p[0] >= departureUnix && p[0] <= arrivalUnix);
    }

    // Legacy format: [timestamp, lat, lon, speed, ...]
    return filtered.map((p: any) => [p[1], p[2]] as [number, number]);
  }, [rawPoints, kickVoyageFilter]);

  useEffect(() => {
    if (points.length > 0 && map) {
      const bounds = L.latLngBounds(points as L.LatLngExpression[]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [points, map]);

  if (!selectedVoyage || points.length === 0) return null;

  const startPoint = points[0];
  const endPoint = points[points.length - 1];

  return (
    <>
      <MapPolyline
        positions={points}
        pathOptions={{
          color: '#3b82f6',
          weight: 4,
          opacity: 0.8,
          lineJoin: 'round',
        }}
      />

      {/* Start Marker */}
      <MapMarker
        position={startPoint}
        icon={
          <div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-success shadow-lg">
            <Radio className="size-3 text-white" />
          </div>
        }
      />

      {/* End Marker */}
      <MapMarker
        position={endPoint}
        icon={
          <div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-primary shadow-lg">
            <Flag className="size-3 text-white" />
          </div>
        }
      />
    </>
  );
}
