import L from 'leaflet';
import 'leaflet.polylinemeasure';
import 'leaflet.polylinemeasure/Leaflet.PolylineMeasure.css';
import { getPathLength } from 'geolib';
import { Clock, MapPin, Ruler, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemMedia, ItemTitle } from '@/components/ui/item';
import { DEFAULT_MEASURE_SPEED, METERS_IN_KILOMETER, METERS_IN_NAUTICAL_MILE } from '../@consts/fleet-manager';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetMeasurePanel() {
  const map = useMap();
  const { t } = useTranslation();
  const { pointsMeasureLine, unitMeasureLine, setUnitMeasureLine, setPointsMeasureLine } = useFleetManagerStore();
  const [speed, setSpeed] = useState(DEFAULT_MEASURE_SPEED); // Knots

  useEffect(() => {
    const instance = (L.control as any).polylineMeasure({
      unit: unitMeasureLine === 'nm' ? 'nauticalmiles' : 'metres',
      showBearings: false,
      clearMeasurementsOnStop: true,
      showClearControl: false,
      showUnitControl: false,
      measureControlClasses: ['measure-control-hidden'],
      unitControlTitle: {
        text: t('change.unit'),
        metres: t('meters.kilometers'),
        landmiles: t('miles'),
        nauticalmiles: t('nautical.miles'),
      },
      tooltipTextFinish: t('tooltip.text.finish'),
      tooltipTextDelete: t('tooltip.text.delete'),
      tooltipTextMove: t('tooltip.text.move'),
      tooltipTextResume: t('tooltip.text.resume'),
      tooltipTextAdd: t('tooltip.text.add'),
    });

    instance.addTo(map);
    instance._toggleMeasure();

    const handleStart = (currentLine: any) => {
      setPointsMeasureLine([{ id: currentLine.id, points: currentLine.circleCoords || [] }]);
    };

    const handleChange = (currentLine: any) => {
      setPointsMeasureLine([{ id: currentLine.id, points: currentLine.circleCoords || [] }]);
    };

    const handleClear = () => {
      setPointsMeasureLine([]);
    };

    map.on('polylinemeasure:start', handleStart);
    map.on('polylinemeasure:change', handleChange);
    map.on('polylinemeasure:clear', handleClear);

    (window as any)._measureRef = instance;

    return () => {
      instance._clearAllMeasurements();
      instance.remove();
      map.off('polylinemeasure:start', handleStart);
      map.off('polylinemeasure:change', handleChange);
      map.off('polylinemeasure:clear', handleClear);
      (window as any)._measureRef = null;
    };
  }, [map, t, unitMeasureLine, setPointsMeasureLine]);

  useEffect(() => {
    const instance = (window as any)._measureRef;
    if (instance?.options && instance._map) {
      instance.options.unit = unitMeasureLine === 'nm' ? 'nauticalmiles' : 'metres';
      try {
        if (instance._changeUnit) instance._changeUnit();
      } catch {
        // Silently fail
      }
    }
  }, [unitMeasureLine]);

  const handleClearAll = () => {
    const instance = (window as any)._measureRef;
    if (instance) {
      instance._clearAllMeasurements();
      setPointsMeasureLine([]);
    }
  };

  const getDistancesInUnit = (points: { lat: number; lng: number }[]) => {
    if (!points || points.length < 2) return 0;
    const distance = getPathLength(points); // in meters
    // 1 nautical mile = 1852 meters.
    if (unitMeasureLine === 'nm') {
      return distance / METERS_IN_NAUTICAL_MILE;
    }
    return distance / METERS_IN_KILOMETER; // km
  };

  const formatDist = (val: number) => val.toFixed(2);

  const calculateTime = (points: { lat: number; lng: number }[]) => {
    if (!points || points.length < 2 || !speed) return 0;
    const distNM = getPathLength(points) / METERS_IN_NAUTICAL_MILE;
    return distNM / speed; // hours
  };

  return (
    <ItemGroup className="p-4">
      <Item variant="outline" className="gap-2 bg-accent p-2 px-4">
        <ItemHeader>
          <ItemTitle className="font-semibold text-[10px] uppercase tracking-wider">{t('units')}</ItemTitle>
          <ItemActions>
            <Button size="sm" className="font-semibold text-[10px] uppercase" onClick={() => setUnitMeasureLine(unitMeasureLine === 'nm' ? 'm' : 'nm')}>
              {unitMeasureLine}
            </Button>
            <Button size="sm" className="text-destructive" onClick={handleClearAll} title={t('clear')}>
              <Trash2 className="size-4" />
            </Button>
          </ItemActions>
        </ItemHeader>
        <div className="flex items-center gap-2">
          <ItemTitle className="whitespace-nowrap text-[10px] uppercase">{t('speed')} (kn):</ItemTitle>
          <Input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="h-8 text-xs" />
        </div>
      </Item>

      {!pointsMeasureLine || pointsMeasureLine.length === 0 ? (
        <Item className="flex flex-col py-12 text-center">
          <MapPin className="size-6 text-muted-foreground" />
          <ItemDescription>{t('measure.empty.description')}</ItemDescription>
        </Item>
      ) : (
        pointsMeasureLine.map((lineData, idx) => {
          const totalDist = getDistancesInUnit(lineData.points);
          const totalHours = calculateTime(lineData.points);
          const totalDays = totalHours / 24;

          return (
            <Item key={lineData.id || idx} variant="outline" className="w-full flex-col items-stretch gap-4">
              <ItemHeader className="uppercase">
                <ItemTitle className="font-bold text-muted-foreground text-xs uppercase">
                  {t('route')} {idx + 1}
                </ItemTitle>
                <ItemTitle className="font-bold text-primary text-xs tabular-nums">
                  {formatDist(totalDist)} {unitMeasureLine}
                </ItemTitle>
              </ItemHeader>

              <ItemContent className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 rounded border border-accent p-1.5 font-semibold text-xs">
                  <Clock className="size-3" />
                  {totalHours.toFixed(1)} HR
                </div>
                <div className="flex items-center gap-1.5 rounded border border-accent p-1.5 font-semibold text-xs">
                  <Clock className="size-3" />
                  {totalDays.toFixed(1)} {t('days')}
                </div>
              </ItemContent>

              <ItemContent>
                <ItemHeader className="font-bold text-muted-foreground text-xs uppercase">{t('points')}</ItemHeader>
                <div className="ml-2 space-y-2 border-primary/20 border-l-2 pl-3">
                  {lineData.points.map((_: any, ptIdx: number) => {
                    const distFromStart = getDistancesInUnit(lineData.points.slice(0, ptIdx + 1));
                    return (
                      <div key={`${lineData.id}${ptIdx}`} className="relative py-1">
                        <ItemMedia className="absolute top-1.5 -left-[1.2rem] box-content bg-background py-0.5">
                          <MapPin className="size-3 text-muted-foreground" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="text-[10px]">
                            {t('point')} {ptIdx + 1}
                          </ItemTitle>
                          {ptIdx > 0 && (
                            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                              <Ruler className="size-2.5" />
                              {formatDist(distFromStart)} {unitMeasureLine}
                            </div>
                          )}
                        </ItemContent>
                      </div>
                    );
                  })}
                </div>
              </ItemContent>
            </Item>
          );
        })
      )}
    </ItemGroup>
  );
}
