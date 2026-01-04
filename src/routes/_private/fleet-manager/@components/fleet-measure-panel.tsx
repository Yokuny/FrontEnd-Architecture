import { getPathLength } from 'geolib';
import { Calculator, Clock, MapPin, Ruler } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent, ItemGroup, ItemHeader, ItemSeparator, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetMeasurePanel() {
  const { t } = useTranslation();
  const { pointsMeasureLine, unitMeasureLine, setUnitMeasureLine } = useFleetManagerStore();
  const [speed, setSpeed] = useState(10); // Knots

  const getDistancesInUnit = (points: { lat: number; lng: number }[]) => {
    if (!points || points.length < 2) return 0;
    const distance = getPathLength(points); // in meters
    // 1 nautical mile = 1852 meters.
    if (unitMeasureLine === 'nm') {
      return distance / 1852;
    }
    return distance / 1000; // km
  };

  const formatDist = (val: number) => val.toFixed(2);

  const calculateTime = (points: { lat: number; lng: number }[]) => {
    if (!points || points.length < 2 || !speed) return 0;
    const distNM = getPathLength(points) / 1852;
    return distNM / speed; // hours
  };

  if (!pointsMeasureLine || pointsMeasureLine.length === 0) return null;

  return (
    <ItemGroup className="w-72 shadow-xl bg-background/95 backdrop-blur-md border border-primary/10 rounded-xl overflow-hidden flex flex-col max-h-[80vh] pointer-events-auto">
      <Item size="sm" className="border-b border-primary/10 rounded-none bg-primary/5 flex-col items-stretch">
        <ItemHeader>
          <ItemTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Calculator className="size-4 text-primary" />
            {t('measure')}
          </ItemTitle>
          <ItemActions>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase px-2" onClick={() => setUnitMeasureLine(unitMeasureLine === 'nm' ? 'm' : 'nm')}>
              {unitMeasureLine}
            </Button>
          </ItemActions>
        </ItemHeader>
        <ItemContent className="mt-2 flex flex-row items-center gap-2">
          <Label className="text-[10px] uppercase text-muted-foreground whitespace-nowrap">{t('speed')} (kn):</Label>
          <Input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="h-7 text-xs px-2 bg-background/50" />
        </ItemContent>
      </Item>
      <ScrollArea className="flex-1 no-scrollbar">
        <div className="p-3 space-y-3">
          {pointsMeasureLine.map((lineData, idx) => {
            const totalDist = getDistancesInUnit(lineData.points);
            const totalHours = calculateTime(lineData.points);
            const totalDays = totalHours / 24;

            return (
              <Item key={lineData.id || idx} variant="outline" size="sm" className="flex-col items-stretch p-3 gap-3 bg-background/40">
                <ItemHeader>
                  <div className="flex items-center justify-between w-full font-bold text-xs uppercase">
                    <span className="text-muted-foreground">
                      {t('route')} {idx + 1}
                    </span>
                    <span className="text-primary font-mono">
                      {formatDist(totalDist)} {unitMeasureLine}
                    </span>
                  </div>
                </ItemHeader>

                <ItemContent className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/30 p-1.5 rounded border border-primary/5">
                    <Clock className="size-3" />
                    {totalHours.toFixed(1)} HR
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/30 p-1.5 rounded border border-primary/5">
                    <Clock className="size-3" />
                    {totalDays.toFixed(1)} {t('days')}
                  </div>
                </ItemContent>

                <ItemSeparator />

                <div className="space-y-2">
                  <Label className="text-[9px] font-bold uppercase text-primary/70 px-1">{t('points')}</Label>
                  <div className="space-y-2 border-l-2 border-primary/20 ml-2 pl-3">
                    {lineData.points.map((_: any, ptIdx: number) => {
                      const distFromStart = getDistancesInUnit(lineData.points.slice(0, ptIdx + 1));
                      return (
                        <div key={ptIdx} className="relative py-1">
                          <MapPin className="size-3 text-muted-foreground absolute -left-[1.2rem] top-1.5 bg-background box-content py-0.5" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold">
                              {t('point')} {ptIdx + 1}
                            </span>
                            {ptIdx > 0 && (
                              <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                                <Ruler className="size-2.5" />
                                {formatDist(distFromStart)} {unitMeasureLine}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Item>
            );
          })}
        </div>
      </ScrollArea>
    </ItemGroup>
  );
}
