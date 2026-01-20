import { Clock, CloudUpload, Droplet, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { ConsumptionIntervalData } from '../@interface/consumption-interval.types';

export function VesselComparison({ data, unit, isReal }: VesselComparisonProps) {
  const { t } = useTranslation();

  const vesselsDistinct = Array.from(new Set(data?.map((x) => x?.machine?.id)));

  if (vesselsDistinct.length <= 1) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {vesselsDistinct.map((vesselId) => {
        const vesselData = data.filter((x) => x.machine.id === vesselId);
        const vesselName = vesselData[0]?.machine?.name || 'Unknown';
        const totalHours = vesselData.reduce((acc, curr) => acc + (curr.hours || 0), 0);
        const totalConsumption = vesselData.reduce((acc, curr) => acc + ((isReal ? curr.consumptionReal?.value : curr.consumption?.value) || 0), 0);
        const totalCo2 = vesselData.reduce((acc, curr) => acc + ((isReal ? curr.consumptionReal?.co2 : curr.consumption?.co2) || 0), 0);
        const average = totalHours > 0 ? totalConsumption / totalHours : 0;

        return (
          <Item key={vesselId} variant="outline">
            <ItemHeader className="flex flex-row items-center justify-between">
              <ItemTitle className="text-lg">{vesselName}</ItemTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant={isReal ? 'default' : 'secondary'}>{isReal ? 'SON*' : 'FLM*'}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t(isReal ? 'real.consumption' : 'estimated.consumption')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </ItemHeader>
            <ItemContent data-slot="item-content" className="flex-row justify-between">
              <ItemContent className="flex-none">
                <div className="flex items-center gap-2">
                  <Clock className={cn('size-4', isReal ? 'text-blue-800' : 'text-amber-800')} />
                  <ItemDescription className="text-sm font-medium">HR</ItemDescription>
                </div>
                <ItemTitle className="text-lg font-bold">{totalHours.toFixed(2)}</ItemTitle>
              </ItemContent>

              <ItemContent className="flex-none">
                <div className="flex items-center gap-2">
                  <Droplet className={cn('size-4', isReal ? 'text-blue-600' : 'text-amber-600')} />
                  <ItemDescription className="text-sm font-medium">{unit}</ItemDescription>
                </div>
                <ItemTitle className="text-lg font-bold">{totalConsumption.toFixed(2)}</ItemTitle>
              </ItemContent>

              <ItemContent className="flex-none">
                <div className="flex items-center gap-2">
                  <Droplets className={cn('size-4', isReal ? 'text-blue-600' : 'text-amber-600')} />
                  <ItemDescription className="text-sm font-medium">{unit}/HR</ItemDescription>
                </div>
                <ItemTitle className="text-lg font-bold">{average.toFixed(3)}</ItemTitle>
              </ItemContent>

              <ItemContent className="flex-none">
                <div className="flex items-center gap-2">
                  <CloudUpload className="size-4 text-zinc-500" />
                  <ItemDescription className="text-sm font-medium">Ton</ItemDescription>
                </div>
                <ItemTitle className="text-lg font-bold">{(totalCo2 / 1000).toFixed(2)}</ItemTitle>
              </ItemContent>
            </ItemContent>
          </Item>
        );
      })}
    </div>
  );
}

interface VesselComparisonProps {
  data: ConsumptionIntervalData[];
  unit: string;
  isReal: boolean;
}
