import { Activity, Clock, MapPin, Ship } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';

interface VoyageKPIProps {
  data: any[];
}

export function KPI({ data }: VoyageKPIProps) {
  const { t } = useTranslation();

  const kpis = useMemo(() => {
    const maneuver = data?.find((x) => x.travelType === 'maneuver');
    const travel = data?.find((x) => x.travelType === 'travel');

    return {
      travelCount: travel?.count || 0,
      travelHours: Number((travel?.time ?? 0) / 60),
      travelAverage: travel?.count ? Number((travel?.time ?? 0) / 60) / travel.count : 0,
      maneuverCount: maneuver?.count || 0,
      maneuverHours: Number((maneuver?.time ?? 0) / 60),
      maneuverAverage: maneuver?.count ? Number((maneuver?.time ?? 0) / 60) / maneuver.count : 0,
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <MapPin className="size-5" />
          <ItemDescription className="font-medium">{t('list.travel')}</ItemDescription>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{kpis.travelCount}</ItemTitle>
      </Item>

      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <Clock className="size-5" />
          <ItemDescription className="font-medium">
            {t('hour.unity')} ({t('travel')})
          </ItemDescription>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{kpis.travelHours.toFixed(2)}</ItemTitle>
      </Item>

      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <Activity className="size-5" />
          <ItemDescription className="font-medium">
            {t('medium')} ({t('travel')} HR)
          </ItemDescription>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{kpis.travelAverage.toFixed(2)}</ItemTitle>
      </Item>

      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <Ship className="size-5" />
          <ItemDescription className="font-medium">{t('in.port')}</ItemDescription>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{kpis.maneuverCount}</ItemTitle>
      </Item>

      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <Clock className="size-5" />
          <ItemDescription className="font-medium">
            {t('hour.unity')} ({t('port')})
          </ItemDescription>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{kpis.maneuverHours.toFixed(2)}</ItemTitle>
      </Item>

      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <Activity className="size-5" />
          <ItemDescription className="font-medium">
            {t('medium')} ({t('port')} HR)
          </ItemDescription>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{kpis.maneuverAverage.toFixed(2)}</ItemTitle>
      </Item>
    </div>
  );
}
