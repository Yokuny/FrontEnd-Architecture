import { format } from 'date-fns';
import L from 'leaflet';
import { SendHorizontal } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Circle, Marker, Polygon, Popup, Tooltip } from 'react-leaflet';
import { useBuoysMap, useVesselsNear } from '@/hooks/use-buoys-api';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { usePlatformsMap } from '@/hooks/use-platforms-api';
import { useGeofencesMap } from '../../@hooks/use-fences-api';
import { useFleetManagerStore } from '../../@hooks/use-fleet-manager-store';

const buoyIcon = new L.Icon({
  iconUrl: '/assets/img/bouy.png', // Ensure this exists or use a default
  iconSize: [20, 15],
});

export function ExtraLayers() {
  const { idEnterprise } = useEnterpriseFilter();
  const { showPlatforms, showBouys, showVesselsNearBouys, showGeofences, showNameFence } = useFleetManagerStore();

  const { data: platforms } = usePlatformsMap({ idEnterprise });
  const { data: buoys } = useBuoysMap({ idEnterprise });
  const { data: vesselsNear } = useVesselsNear(buoys || [], showVesselsNearBouys);
  const { data: geofences } = useGeofencesMap({ idEnterprise });

  return (
    <>
      {showGeofences &&
        geofences
          ?.filter((f) => f.location?.coordinates?.length)
          ?.map((f, i) => (
            <Polygon key={`${f.id}${i}-fence`} color={f.color} positions={f.location.coordinates} weight={1} dashArray="5,5">
              {showNameFence && <Tooltip permanent>{f.name}</Tooltip>}
              <Popup>{f.name}</Popup>
            </Polygon>
          ))}

      {showGeofences &&
        geofences
          ?.filter((f) => f.location?.properties?.radius && f.location?.geometry?.coordinates)
          ?.map((f, i) => (
            <Circle
              key={`${f.id}${i}-fence-circle`}
              color={f.color}
              weight={1}
              dashArray="5,5"
              center={f.location.geometry?.coordinates || [0, 0]}
              radius={f.location.properties?.radius || 0}
            >
              {showNameFence && <Tooltip permanent>{f.name}</Tooltip>}
              <Popup>{f.name}</Popup>
            </Circle>
          ))}

      {showPlatforms &&
        platforms
          ?.filter((p) => p.position?.length === 2 && p.position[0] !== null && p.position[1] !== null)
          ?.map((p) => (
            <Marker key={p.code} position={[p.position[1], p.position[0]]}>
              <Popup>{p.name}</Popup>
            </Marker>
          ))}

      {showBouys &&
        buoys
          ?.filter((b) => b.location?.length)
          ?.map((b, i) => {
            const position: [number, number] = [b.location[0].geometry.coordinates[1], b.location[0].geometry.coordinates[0]];
            return (
              <Marker key={`${b.vessel.navigationalInformation.location.latitude}${i}-buoy`} position={position} icon={buoyIcon}>
                <Circle center={position} radius={b.location[0].properties.radius} color={b.location[0].color} />
                <Popup>{b.name}</Popup>
              </Marker>
            );
          })}

      {showVesselsNearBouys &&
        vesselsNear?.map((group: any[], i: number) => (
          <div key={`${group[0].vessel.navigationalInformation.location.latitude}${i}-near-group`}>
            {group
              ?.filter((v) => v?.vessel?.datasheet?.vesselClass !== 'ATON' && v?.vessel?.navigationalInformation?.location)
              ?.map((v, j) => {
                const pos: [number, number] = [v.vessel.navigationalInformation.location.latitude, v.vessel.navigationalInformation.location.longitude];
                const heading = v.vessel.navigationalInformation.courseOverGround || 0;

                return (
                  <Marker
                    key={`${j}${v.vessel.navigationalInformation.location.latitude}-near`}
                    position={pos}
                    icon={
                      new L.DivIcon({
                        className: 'custom-vessel-near',
                        iconSize: [25, 25],
                        html: renderToStaticMarkup(
                          <div style={{ transform: `rotate(${heading - 45}deg)` }}>
                            <SendHorizontal size={25} color="#41454F" fill="#ffffff" />
                          </div>,
                        ),
                      })
                    }
                  >
                    <Popup>
                      <div className="text-xs">
                        <p className="font-bold">{v.vessel.identity.name}</p>
                        <p>MMSI: {v.vessel.identity.mmsi}</p>
                        <p>Class: {v.vessel.datasheet?.vesselClass}</p>
                        <p>Speed: {v.vessel.navigationalInformation?.speed || 0} knots</p>
                        <p>Last update: {v.vessel.navigationalInformation?.timestamp ? format(v.vessel.navigationalInformation.timestamp * 1000, 'dd MMM yyyy HH:mm:ss') : '-'}</p>
                        <p>Distance from buoy: {v.distance?.toFixed(1)} m</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </div>
        ))}
    </>
  );
}
