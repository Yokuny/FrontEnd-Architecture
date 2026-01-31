import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-leaflet';
import { ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

function truncate(n: number) {
  return n > 0 ? Math.floor(n) : Math.ceil(n);
}

class Dms {
  private _dd: number;
  private _hemisphere: string;

  constructor(dd: number, longOrLat: 'long' | 'lat') {
    this._dd = dd;
    this._hemisphere = longOrLat === 'long' ? (dd < 0 ? 'W' : 'E') : dd < 0 ? 'S' : 'N';
  }

  get dmsArray() {
    const absDD = Math.abs(this._dd);
    const degrees = truncate(absDD);
    const minutes = truncate((absDD - degrees) * 60);
    const seconds = (absDD - degrees - minutes / 60) * 60 ** 2;
    return [degrees, minutes, seconds, this._hemisphere];
  }

  toString() {
    const dmsArray = this.dmsArray;
    return `${dmsArray[0]}° ${dmsArray[1]}′ ${Number(dmsArray[2]).toFixed(2)}″ ${dmsArray[3]}`;
  }
}

export class DmsCoordinates {
  private longitude: Dms;
  private latitude: Dms;

  constructor(lat: number, lon: number) {
    this.longitude = new Dms(lon, 'long');
    this.latitude = new Dms(lat, 'lat');
  }

  getLatitude() {
    return this.latitude.toString();
  }

  getLongitude() {
    return this.longitude.toString();
  }
}

export function MapCoordinates() {
  const { t } = useTranslation();
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const map = useMap();
  const { mapTheme, nauticalChart } = useFleetManagerStore();

  const getMapTheme = () => {
    const nauticalDark = nauticalChart === 'cmap_dark' || nauticalChart === 'cmap_relief';
    if (nauticalDark) return 'text-white';
    if (nauticalChart === 'nav') return 'text-black';
    const mapDark = mapTheme === 'smoothdark' || mapTheme === 'earth';
    if (mapDark) return 'text-white';
    return 'text-black';
  };

  const textColor = getMapTheme();

  useEffect(() => {
    if (!map) return;

    const handleMouseMove = (e: any) => {
      if (e.latlng) {
        setCoords([e.latlng.lat, e.latlng.lng]);
      }
    };

    map.on('mousemove', handleMouseMove);
    return () => {
      map.off('mousemove', handleMouseMove);
    };
  }, [map]);

  if (!coords) return null;

  const dms = new DmsCoordinates(coords[0], coords[1]);

  return (
    <div className={cn('pointer-events-none fixed right-20 bottom-6 select-none transition-colors duration-300', textColor)} style={{ zIndex: 9999 }}>
      <div className="flex flex-col">
        <ItemTitle className={cn('mb-1.5 font-bold text-[10px] uppercase leading-none tracking-tighter opacity-70', textColor)}>{t('setup.fleet.coordinates')}</ItemTitle>
        <div className="flex gap-2">
          <CoordinateItem label="lat" dd={coords[0]} dms={dms.getLatitude()} textColor={textColor} />
          <CoordinateItem label="lon" dd={coords[1]} dms={dms.getLongitude()} textColor={textColor} />
        </div>
      </div>
    </div>
  );
}

function CoordinateItem({ label, dd, dms, textColor }: { label: string; dd: number; dms: string; textColor: string }) {
  return (
    <div className="flex min-w-[110px] flex-col">
      <div className="flex items-baseline gap-1.5">
        <span className={cn('font-bold font-mono text-[9px] uppercase opacity-60', textColor)}>{label}</span>
        <span className={cn('font-bold text-xs tabular-nums tracking-tight', textColor)}>{dd.toFixed(6)}°</span>
      </div>
      <span className={cn('whitespace-nowrap font-medium text-[10px] tabular-nums opacity-80', textColor)}>{dms}</span>
    </div>
  );
}
