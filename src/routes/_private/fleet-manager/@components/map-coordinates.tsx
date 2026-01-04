import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Item, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item';

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
    const seconds = (absDD - degrees - minutes / 60) * Math.pow(60, 2);
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
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
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
    <div className="absolute bottom-4 right-4 z-1000 drop-shadow-sm select-none pointer-events-none">
      <ItemGroup className="bg-background/50 rounded-lg gap-0 p-2 px-3">
        <Item size="sm" className="justify-end items-center gap-2 p-0">
          <ItemTitle className="font-mono tabular-nums">{coords[0].toFixed(5)}</ItemTitle>
          <ItemDescription className="font-bold text-primary tabular-nums">{dms.getLatitude()}</ItemDescription>
        </Item>
        <Item size="sm" className="justify-end items-center gap-2 p-0">
          <ItemTitle className="font-mono tabular-nums">{coords[1].toFixed(5)}</ItemTitle>
          <ItemDescription className="font-bold text-primary tabular-nums">{dms.getLongitude()}</ItemDescription>
        </Item>
      </ItemGroup>
    </div>
  );
}
