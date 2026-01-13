import L from 'leaflet';
import { useEffect, useState } from 'react';
import { Polyline, useMap } from 'react-leaflet';
import { MarkerMotion } from '../@hooks/marker-motion';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

interface RoutePlaybackProps {
  idMachine: string;
}

export function RoutePlayback({ idMachine: _idMachine }: RoutePlaybackProps) {
  const { playback, setPlaybackTime, togglePlaybackPlay } = useFleetManagerStore();
  const { historyData, isPlaying, speed, isActive, type } = playback;
  const map = useMap();
  const [marker, setMarker] = useState<MarkerMotion | null>(null);

  useEffect(() => {
    if (!isActive || type !== 'route' || !historyData.length) return;

    const path = historyData.map((item) => [item[1], item[2]]);
    const icon = L.divIcon({
      className: 'leaflet-div-icon-img',
      iconSize: [25, 25],
      html: `
        <div class="relative size-full flex items-center justify-center">
          <svg class="size-full drop-shadow-md" style="transform: rotate(-45deg);" viewBox="0 0 512 512">
            <path fill="currentColor" class="text-primary" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" />
            <path fill="white" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" />
          </svg>
        </div>
      `,
    });

    const mm = new MarkerMotion(path as any, speed, {
      icon,
      rotation: true,
      autoplay: false,
      loop: false,
    });

    mm.addTo(map);

    mm.on('motion.segment', (e: any) => {
      const timestamp = historyData[e.index][0] * 1000;
      setPlaybackTime(timestamp);
    });

    mm.on('motion.end', () => {
      togglePlaybackPlay();
    });

    setMarker(mm);

    return () => {
      mm.remove();
      setMarker(null);
    };
  }, [isActive, type, historyData, map, speed, setPlaybackTime, togglePlaybackPlay]);

  useEffect(() => {
    if (!marker) return;
    if (isPlaying) marker.start();
    else marker.pause();
  }, [isPlaying, marker]);

  useEffect(() => {
    if (!marker) return;
    marker.setSpeed(speed);
  }, [speed, marker]);

  if (!isActive || type !== 'route' || !historyData.length) return null;

  const polylinePath = historyData.filter((item) => item[1] != null && item[2] != null).map((item) => [item[1], item[2]] as [number, number]);

  return (
    <div>
      <Polyline positions={polylinePath} color="hsl(var(--primary))" weight={3} opacity={0.6} dashArray="5, 10" />
    </div>
  );
}
