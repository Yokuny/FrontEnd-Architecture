import { intervalToDuration } from 'date-fns';
import { Calendar, Clock, Flag, ListTree, Ship, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/formatDate';
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
    <ItemGroup className="space-y-4 p-4">
      <ItemTitle className="font-bold text-lg text-primary">{data.code}</ItemTitle>

      <div className="grid grid-cols-2 gap-3 border-b pb-4">
        <DetailItemCard label={t('departure')} icon={Calendar} value={data.dateTimeStart ? formatDate(data.dateTimeStart, 'dd MMM, HH:mm') : '-'} />
        <DetailItemCard label="ETA" icon={Flag} value={data.metadata?.eta ? formatDate(data.metadata.eta, 'dd MMM, HH:mm') : '-'} />
        {data.dateTimeEnd && (
          <>
            <DetailItemCard label={t('arrival')} icon={Clock} value={formatDate(data.dateTimeEnd, 'dd MMM, HH:mm')} color="text-green-600" />
            <DetailItemCard label={t('duration')} icon={Clock} value={formatDuration(data.dateTimeStart, data.dateTimeEnd)} color="text-blue-600" />
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 border-b pb-4">
        <DetailGridItem label={t('vessel')} icon={Ship} value={<span className="font-bold text-primary">{data.machine?.name}</span>} />
        <ItemContent className="rounded-lg border border-primary/5 bg-accent/30 p-3">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="size-2 rounded-full bg-primary" />
              <div className="h-8 w-px bg-border" />
              <div className="size-2 rounded-full border border-primary bg-background" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase">{t('source')}</span>
                <span className="font-medium text-sm">
                  {data.portPointStart?.code} - {data.portPointStart?.description}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase">{t('destiny.port')}</span>
                <span className="font-medium text-sm">
                  {data.portPointEnd?.code || data.portPointDestiny?.code} - {data.portPointEnd?.description || data.portPointDestiny?.description}
                </span>
              </div>
            </div>
          </div>
        </ItemContent>
      </div>

      {analytics?.length > 0 && (
        <>
          <div className="mb-2 flex items-center gap-2 border-b pb-4">
            <TrendingUp className="size-3 text-primary" />
            <Label className="font-bold text-[10px] text-muted-foreground uppercase">{t('analytics')}</Label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {analytics.map((a: any, i: number) => (
              <div key={`${a.id}${i}`} className="rounded-md border border-primary/5 bg-accent/20 p-2">
                <p className="truncate font-bold text-[10px] text-muted-foreground uppercase">{a.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-sm">{a.value}</span>
                  <span className="text-[10px] text-muted-foreground">{a.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {timeline?.length > 0 && (
        <>
          <div className="mb-4 flex items-center gap-2 border-b pb-4">
            <ListTree className="size-3 text-primary" />
            <Label className="font-bold text-[10px] text-muted-foreground uppercase">{t('timeline')}</Label>
          </div>
          <div className="relative ml-2 space-y-4 border-primary/10 border-l-2 pl-4">
            {timeline.map((event: any, i: number) => (
              <div key={`${event.type}${i}`} className="relative">
                <div className="absolute top-1 -left-[21px] size-2 rounded-full bg-primary" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-[10px] text-muted-foreground uppercase">{event.type}</span>
                  <span className="font-medium text-xs">{event.data?.status || event.geofence?.description || event.type}</span>
                  <span className="text-[10px] text-muted-foreground">{event.date ? formatDate(event.date, 'dd MMM, HH:mm') : '-'}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </ItemGroup>
  );
}
