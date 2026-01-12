import L from 'leaflet';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { INDEX_REGION_DATA } from '../@consts/playback';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function RegionPlayback() {
  const { playback, showNames } = useFleetManagerStore();
  const { historyData, currentTime, isActive, type } = playback;

  if (!isActive || type !== 'region' || !historyData.length) return null;

  // historyData for region is a list of time-slices: [timestamp, vessels[]][]
  // Each vessel entry follows INDEX_REGION_DATA
  const currentSlice = historyData.find((slice) => slice[0] >= currentTime / 1000);
  if (!currentSlice || !currentSlice[1]) return null;

  const vessels = currentSlice[1].filter((v: any) => v[INDEX_REGION_DATA.LAT] != null);

  const getIcon = (vessel: any) => {
    const course = vessel[INDEX_REGION_DATA.HEADING] || vessel[INDEX_REGION_DATA.COURSE] || 0;
    const vesselClass = vessel[INDEX_REGION_DATA.VESSEL_CLASS] || '';
    let color = 'hsl(var(--primary))';

    if (vesselClass === 'TANKER') color = 'rgb(220, 38, 38)';
    if (vesselClass === 'TUG') color = 'rgb(5, 150, 105)';
    if (vesselClass === 'FISHING') color = 'rgb(180, 50, 172)';

    return L.divIcon({
      className: 'leaflet-div-icon-img',
      iconSize: [20, 20],
      html: `
        <div class="relative size-full flex items-center justify-center">
          <svg class="size-full drop-shadow-sm" style="transform: rotate(${course - 45}deg);" viewBox="0 0 512 512">
            <path fill="${color}" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" />
            <path fill="white" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" />
          </svg>
        </div>
      `,
    });
  };

  return (
    <>
      {vessels.map((v: any) => (
        <Marker key={v[INDEX_REGION_DATA.VESSEL_ID]} position={[v[INDEX_REGION_DATA.LAT], v[INDEX_REGION_DATA.LON]]} icon={getIcon(v)}>
          {showNames && (
            <Tooltip
              permanent
              direction="top"
              offset={[0, -10]}
              className="bg-background/80 backdrop-blur-sm border-none shadow-sm text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
            >
              {v[INDEX_REGION_DATA.NAME]}
            </Tooltip>
          )}
          <Popup className="rounded-lg shadow-xl border-none">
            <div className="p-3 w-48 space-y-2">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-sm uppercase tracking-wide leading-tight">{v[INDEX_REGION_DATA.NAME]}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] uppercase h-4 px-1">
                    {v[INDEX_REGION_DATA.VESSEL_CLASS] || 'Other'}
                  </Badge>
                  <span className="text-[9px] text-muted-foreground font-mono">MMSI: {v[INDEX_REGION_DATA.MMSI]}</span>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex flex-col">
                  <span className="text-muted-foreground uppercase font-bold text-[8px]">Speed</span>
                  <span className="font-mono">{v[INDEX_REGION_DATA.SPEED]} kn</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground uppercase font-bold text-[8px]">Course</span>
                  <span className="font-mono">{v[INDEX_REGION_DATA.COURSE]}°</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
