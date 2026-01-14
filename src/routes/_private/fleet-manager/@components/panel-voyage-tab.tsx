import { format, intervalToDuration } from 'date-fns';
import { Calendar, Clock, Flag, ListTree, Ship, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { useVoyageAnalytics, useVoyageDetails, useVoyageTimeline } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { DetailGridItem, DetailItemCard } from './helpers/detail-items';

export function VoyageDetailsPanel() {
  const { t } = useTranslation();
  const { selectedVoyageId } = useFleetManagerStore();

  const { data: voyageData, isLoading: isLoadingVoyage } = useVoyageDetails(selectedVoyageId);
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useVoyageAnalytics(voyageData?.machine?.id, voyageData?.dateTimeStart, selectedVoyageId ?? undefined);
  const { data: timelineData, isLoading: isLoadingTimeline } = useVoyageTimeline(
    voyageData?.machine?.id,
    selectedVoyageId ?? undefined,
    voyageData?.dateTimeStart,
    voyageData?.dateTimeEnd,
  );

  if (isLoadingVoyage || isLoadingAnalytics || isLoadingTimeline) {
    return (
      <ItemGroup className="p-4">
        <DefaultLoading />
      </ItemGroup>
    );
  }

  if (!voyageData) return null;

  const data = voyageData;
  const analytics = analyticsData?.data || (voyageData as any)?.analytics?.data || [];
  const timeline = timelineData || [];

  const formatDuration = (start: string, end?: string) => {
    if (!start) return '-';
    const duration = intervalToDuration({ start: new Date(start), end: end ? new Date(end) : new Date() });
    const parts = [];
    if (duration.days) parts.push(`${duration.days} ${t(duration.days === 1 ? 'day' : 'days')}`);
    if (duration.hours) parts.push(`${duration.hours} ${t(duration.hours === 1 ? 'hr' : 'hrs')}`);
    if (duration.minutes) parts.push(`${duration.minutes} min`);
    return parts.join(', ') || '0 min';
  };

  return (
    <ItemGroup className="p-4 space-y-4">
      <ItemTitle className="text-lg font-bold text-primary">{data.code}</ItemTitle>

      <div className="grid grid-cols-2 gap-3 border-b pb-4">
        <DetailItemCard label={t('departure')} icon={Calendar} value={data.dateTimeStart ? format(new Date(data.dateTimeStart), 'dd MMM, HH:mm') : '-'} />
        <DetailItemCard label="ETA" icon={Flag} value={data.metadata?.eta ? format(new Date(data.metadata.eta), 'dd MMM, HH:mm') : '-'} />
        {data.dateTimeEnd && (
          <>
            <DetailItemCard label={t('arrival')} icon={Clock} value={format(new Date(data.dateTimeEnd), 'dd MMM, HH:mm')} color="text-green-600" />
            <DetailItemCard label={t('duration')} icon={Clock} value={formatDuration(data.dateTimeStart, data.dateTimeEnd)} color="text-blue-600" />
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 border-b pb-4">
        <DetailGridItem label={t('vessel')} icon={Ship} value={<span className="font-bold text-primary">{data.machine?.name}</span>} />
        <ItemContent className="p-3 bg-accent/30 rounded-lg border border-primary/5">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 items-center">
              <div className="size-2 rounded-full bg-primary" />
              <div className="w-px h-8 bg-border" />
              <div className="size-2 rounded-full border border-primary bg-background" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase">{t('source')}</span>
                <span className="text-sm font-medium">
                  {data.portPointStart?.code} - {data.portPointStart?.description}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase">{t('destiny.port')}</span>
                <span className="text-sm font-medium">
                  {data.portPointEnd?.code || data.portPointDestiny?.code} - {data.portPointEnd?.description || data.portPointDestiny?.description}
                </span>
              </div>
            </div>
          </div>
        </ItemContent>
      </div>

      {analytics?.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-2 border-b pb-4">
            <TrendingUp className="size-3 text-primary" />
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">{t('analytics')}</Label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {analytics.map((a: any, i: number) => (
              <div key={i} className="p-2 rounded-md bg-accent/20 border border-primary/5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold truncate">{a.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold">{a.value}</span>
                  <span className="text-[10px] text-muted-foreground">{a.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {timeline?.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4 border-b pb-4">
            <ListTree className="size-3 text-primary" />
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">{t('timeline')}</Label>
          </div>
          <div className="space-y-4 ml-2 border-l-2 border-primary/10 pl-4 relative">
            {timeline.map((event: any, i: number) => (
              <div key={i} className="relative">
                <div className="absolute -left-[21px] top-1 size-2 rounded-full bg-primary" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">{event.type}</span>
                  <span className="text-xs font-medium">{event.data?.status || event.geofence?.description || event.type}</span>
                  <span className="text-[10px] text-muted-foreground">{event.date ? format(new Date(event.date), 'dd MMM, HH:mm') : '-'}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </ItemGroup>
  );
}
