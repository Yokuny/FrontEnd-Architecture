import { Activity, ChevronDown, ChevronUp, FlipHorizontal2, Fuel } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import { useConsumptionComparativeDetails } from '../@hooks/use-consumption-comparative-api';
import type { ConsumptionComparativeData, ConsumptionComparativeFilters } from '../@interface/consumption-comparative.types';
import { ChartComparative } from './ChartComparative';

export function ConsumptionCard({ data, filters }: ConsumptionCardProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { machine, consumptionSources } = data;

  const { data: readings, isLoading } = useConsumptionComparativeDetails(machine.id, filters, isOpen);

  const manual = consumptionSources.manual;
  const telemetry = consumptionSources.telemetry;
  const diffValue = manual.value - telemetry.value;
  const diffPercent = telemetry.value ? (diffValue / telemetry.value) * 100 : 0;
  const hasValues = manual.value !== 0 && telemetry.value !== 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-lg border bg-card">
      <div className="flex items-center justify-between p-4 flex-wrap gap-4">
        <div className="flex items-center gap-4 min-w-[200px]">
          <Avatar className="size-12 border">
            <AvatarImage src={machine.image?.url} alt={machine.name} className="object-cover" />
            <AvatarFallback>{machine.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <ItemContent className="gap-0">
            <ItemTitle className="text-lg leading-none">{machine.name}</ItemTitle>
            <Badge variant={filters.viewType === 'consumption' ? 'default' : 'secondary'} className="mt-1">
              {filters.viewType === 'consumption' ? t('consume') : t('stock')}
            </Badge>
          </ItemContent>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Fuel className="size-4 text-amber-800" />
              <ItemDescription className="text-xs font-bold uppercase">{t('manual')}</ItemDescription>
            </div>
            <div className="flex items-center gap-1">
              <ItemTitle className="text-lg font-bold">{manual.value.toFixed(3)}</ItemTitle>
              <ItemDescription>{manual.unit}</ItemDescription>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Activity className="size-4 text-blue-700" />
              <ItemDescription className="text-xs font-bold uppercase">{t('telemetry')}</ItemDescription>
            </div>
            <div className="flex items-center gap-1">
              <ItemTitle className="text-lg font-bold">{telemetry.value.toFixed(3)}</ItemTitle>
              <ItemDescription>{telemetry.unit}</ItemDescription>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <FlipHorizontal2 className={cn('size-4', diffPercent > 0 ? 'text-red-700' : 'text-green-700')} />
              <ItemDescription className="text-xs font-bold uppercase">{t('diff')}</ItemDescription>
            </div>
            <ItemTitle className={cn('font-mono text-lg font-bold', diffPercent > 0 ? 'text-red-700' : 'text-green-700')}>
              {hasValues ? `${diffPercent.toFixed(1)}%` : '-'}
            </ItemTitle>
          </div>

          <CollapsibleTrigger asChild>
            <Button size="icon">{isOpen ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}</Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent>
        <div className="border-t p-4">
          {isLoading ? (
            <DefaultLoading />
          ) : readings && readings.length > 0 ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Item variant="outline">
                  <ItemContent>
                    <ItemDescription>{t('manual')}</ItemDescription>
                    <ItemTitle>
                      {manual.value.toFixed(2)} {manual.unit}
                    </ItemTitle>
                  </ItemContent>
                </Item>
                <Item variant="outline">
                  <ItemContent>
                    <ItemDescription>{t('telemetry')}</ItemDescription>
                    <ItemTitle>
                      {telemetry.value.toFixed(2)} {telemetry.unit}
                    </ItemTitle>
                  </ItemContent>
                </Item>
                <Item variant="outline">
                  <ItemContent>
                    <ItemDescription>{t('diff')}</ItemDescription>
                    <ItemTitle className={cn(diffPercent > 0 && 'text-red-500')}>
                      {diffValue.toFixed(2)} {manual.unit}
                    </ItemTitle>
                  </ItemContent>
                </Item>
                <Item variant="outline">
                  <ItemContent>
                    <ItemDescription>{t('percent')}</ItemDescription>
                    <ItemTitle className={cn(diffPercent > 0 && 'text-red-500')}>{diffPercent.toFixed(1)}%</ItemTitle>
                  </ItemContent>
                </Item>
              </div>
              <ChartComparative data={readings} unit={filters.unit || 'm³'} />
            </div>
          ) : (
            <DefaultEmptyData />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface ConsumptionCardProps {
  data: ConsumptionComparativeData;
  filters: ConsumptionComparativeFilters;
}
