import L from 'leaflet';
import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';
import { GeoJSON, Marker, Polygon, Polyline, Tooltip } from 'react-leaflet';

const createIcon = (label: string, color: string) =>
  L.divIcon({
    html: `<div style="background:${color};color:#fff;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;border:1px solid rgba(255,255,255,0.3)">${label}</div>`,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

interface RouteGeometryProps {
  routeGeoJson: any;
}

export function RouteGeometry({ routeGeoJson }: RouteGeometryProps) {
  const { t } = useTranslation();

  if (!routeGeoJson?.features) return null;

  return (
    <>
      {routeGeoJson.features.map((item: any, i: number) => {
        if (item?.geometry?.type === 'MultiPolygon') {
          return item.geometry.coordinates.map((coords: any, j: number) => (
            <Polygon
              key={`${nanoid(4)}-${i}-${j}`}
              positions={coords[0].map((coord: any) => [coord[1], coord[0]])}
              color={item.properties?.type?.toLowerCase() === 'danger' ? '#ef4444' : '#DE33FF'}
              fillOpacity={0.4}
              weight={2}
            />
          ));
        }

        if (item?.geometry?.type === 'MultiLineString') {
          return item.geometry.coordinates.map((coords: any, j: number) => (
            <Polyline
              key={`${nanoid(4)}-${i}-${j}`}
              positions={coords.map((coord: any) => [coord[1], coord[0]])}
              color={['ConfinedWaters'].includes(item.properties?.tag) ? '#ef4444' : '#DE33FF'}
              weight={2}
              opacity={0.8}
            />
          ));
        }

        if (item?.geometry?.type === 'LineString') {
          return (
            <GeoJSON
              key={nanoid(4)}
              data={item}
              style={{
                color: ['ConfinedWaters'].includes(item.properties?.tag) ? '#ef4444' : '#DE33FF',
                weight: 2,
                opacity: 0.8,
              }}
            />
          );
        }

        if (item?.geometry?.type === 'Point') {
          return (
            <Marker
              key={nanoid(4)}
              position={[item.geometry.coordinates[1], item.geometry.coordinates[0]]}
              icon={createIcon(item.properties?.label || 'P', item.properties?.color || '#22c55e')}
            >
              <Tooltip>
                <div className="flex flex-col gap-1 p-1">
                  {Object.entries(item.properties || {}).map(([key, value]) => {
                    if (key === 'label' || key === 'color' || typeof value === 'object') return null;
                    return (
                      <div key={key} className="text-[10px]">
                        <span className="font-bold capitalize">{key}:</span> {String(value)}
                      </div>
                    );
                  })}
                  {item.properties?.description && (
                    <div className="text-[10px]">
                      <span className="font-bold">{t('description')}:</span> {item.properties.description}
                    </div>
                  )}
                </div>
              </Tooltip>
            </Marker>
          );
        }

        return null;
      })}
    </>
  );
}
