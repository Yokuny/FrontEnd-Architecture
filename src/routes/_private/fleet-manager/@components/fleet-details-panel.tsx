import { format, formatISO, intervalToDuration, subHours } from 'date-fns';
import { Activity, Anchor, Calendar, Clock, Compass, Flag, Gauge, ListTree, MapPin, Navigation2, Ship, TrendingUp, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { cn } from '@/lib/utils';
import { useMachineDetails, useMachineTimeline, useSpeedHistory, useVoyageAnalytics, useVoyageDetails, useVoyageTimeline } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import type { FleetVoyage, MachineDetailsResponse, SpeedHistoryResponse, TimelineEvent } from '../@interface/fleet-api';
import { Proximity } from './proximity';

export function FleetDetailsPanel() {
  const { selectedMachineId, selectedVoyageId } = useFleetManagerStore();
  const { idEnterprise } = useEnterpriseFilter();

  // Machine Data
  const { data: machineData, isLoading: isLoadingMachine } = useMachineDetails(selectedMachineId);
  const speedHistoryMin = formatISO(subHours(new Date(), 12));
  const speedHistoryMax = formatISO(new Date());
  const { data: speedHistory, isLoading: isLoadingSpeedHistory } = useSpeedHistory(selectedMachineId ?? undefined, speedHistoryMin, speedHistoryMax);
  const { data: machineTimeline, isLoading: isLoadingMachineTimeline } = useMachineTimeline(selectedMachineId ?? undefined, idEnterprise);

  // Voyage Data
  const { data: voyageData, isLoading: isLoadingVoyage } = useVoyageDetails(selectedVoyageId);
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useVoyageAnalytics(voyageData?.machine?.id, voyageData?.dateTimeStart, selectedVoyageId ?? undefined);
  const { data: timelineData, isLoading: isLoadingTimeline } = useVoyageTimeline(
    voyageData?.machine?.id,
    selectedVoyageId ?? undefined,
    voyageData?.dateTimeStart,
    voyageData?.dateTimeEnd,
  );

  // Loading Logic: Wait for all data related to the current selection
  const isMachineLoading = !!selectedMachineId && (isLoadingMachine || isLoadingSpeedHistory || isLoadingMachineTimeline);
  const isVoyageLoading = !!selectedVoyageId && (isLoadingVoyage || isLoadingAnalytics || isLoadingTimeline);

  if (isMachineLoading || isVoyageLoading) {
    return (
      <ItemGroup className="p-4">
        <DefaultLoading />
      </ItemGroup>
    );
  }

  if (selectedMachineId && machineData) {
    return <MachineDetailsView data={machineData} speedHistory={speedHistory} timeline={machineTimeline?.data || []} />;
  }

  if (selectedVoyageId && voyageData) {
    return <VoyageDetailsView data={voyageData} analytics={analyticsData?.data || (voyageData as any)?.analytics?.data} timeline={timelineData || []} />;
  }

  return null;
}

function DetailGridItem({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: any }) {
  return (
    <div className="space-y-1 flex flex-col items-center w-full">
      <ItemTitle className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tight text-center">{label}</ItemTitle>
      <div className="text-xs font-semibold flex items-center gap-1.5">
        {Icon && <Icon className="size-3 text-muted-foreground shrink-0" />}
        <div className="truncate text-center text-ellipsis">{value}</div>
      </div>
    </div>
  );
}

/**
 * Machine Details View
 */
function MachineDetailsView({ data, speedHistory, timeline }: { data: MachineDetailsResponse; speedHistory: SpeedHistoryResponse | undefined; timeline: TimelineEvent[] }) {
  const { t } = useTranslation();
  const { selectedPanel, setSelectedPanel } = useFleetManagerStore();

  const chartData = Array.isArray(speedHistory) ? speedHistory.map((p) => ({ time: p[0] * 1000, speed: p[1] })) : [];

  const gridItems = [
    { id: 'status', label: t('status'), icon: Activity, value: data?.data?.status || 'N/A' },
    { id: 'speed', label: t('speed'), icon: Gauge, value: data?.data?.speed !== undefined ? `${data.data.speed.toFixed(1)} kn` : '0 kn' },
    { id: 'course', label: t('course'), icon: Compass, value: data?.data?.course !== undefined ? `${data.data.course.toFixed(1)}°` : '0°' },
    data?.data?.destiny && { id: 'destiny', label: `${t('destiny.port')} AIS`, icon: Anchor, value: data.data.destiny },
    data?.data?.eta && { id: 'eta', label: 'ETA AIS', icon: Clock, value: format(new Date(data.data.eta), 'dd MMM, HH:mm') },
    data?.data?.draught !== undefined && { id: 'draught', label: t('draught', 'Draught'), icon: Waves, value: `${data.data.draught} m` },
  ].filter(Boolean) as any[];

  const columnsClass = gridItems.length === 4 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <ItemGroup className="p-4 space-y-2">
      {data?.travel && (
        <ItemContent>
          <ItemTitle className=" text-muted-foreground uppercase font-bold tracking-tight">{data.travel.code}</ItemTitle>
          <ItemContent>
            <div className="flex justify-between text-xs items-center">
              <span className="text-muted-foreground">{t('source')}</span>
              <div className="w-full h-px mx-3 bg-muted-foreground" />
              <span className="text-muted-foreground">{t('destiny.port')}</span>
            </div>
            <div className="flex justify-between text-xs items-start">
              <div className="flex flex-col gap-1 w-1/2">
                <span className="font-medium">{data.travel.portPointStart?.code || '-'}</span>
                <span className="text-muted-foreground">{data.travel.portPointStart?.description || '-'}</span>
              </div>
              <div className="flex flex-col text-right gap-1 w-1/2">
                <span className="font-medium">{data.travel.portPointEnd?.code || '-'}</span>
                <span className="text-muted-foreground text-right">{data.travel.portPointEnd?.description || '-'}</span>
              </div>
            </div>
          </ItemContent>
        </ItemContent>
      )}

      <ItemContent className="flex flex-row justify-between items-center gap-2">
        <div className="flex flex-col items-center">
          <ItemTitle className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tight text-center">{t('departure')}</ItemTitle>
          <div className="text-xs font-semibold flex items-center justify-center">
            {data.travel?.dateTimeStart ? format(new Date(data.travel.dateTimeStart), 'dd MMM yy') : '-'}
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold tabular-nums">
            {data.travel?.dateTimeStart ? format(new Date(data.travel.dateTimeStart), 'HH:mm') : '-'}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <ItemTitle className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tight text-center">{t('arrival')}</ItemTitle>
          <div className="text-xs font-semibold flex items-center justify-center">{data.travel?.dateTimeEnd ? format(new Date(data.travel.dateTimeEnd), 'dd MMM yy') : '-'}</div>
          <span className="text-[10px] text-muted-foreground font-semibold tabular-nums">
            {data.travel?.dateTimeEnd ? format(new Date(data.travel.dateTimeEnd), 'HH:mm') : '-'}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <ItemTitle className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tight text-center">{t('proximity')}</ItemTitle>
          <div className="text-xs font-semibold flex items-center justify-center">
            {data?.data?.position ? <Proximity latitude={data.data.position[0]} longitude={data.data.position[1]} /> : '-'}
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {data?.data?.position ? `${data.data.position[0].toFixed(6)}, ${data.data.position[1].toFixed(6)}` : '-'}
          </span>
        </div>
      </ItemContent>

      <ItemContent className={cn('grid gap-y-4 gap-x-2 border-b pb-4', columnsClass)}>
        {gridItems.map((item) => (
          <DetailGridItem key={item.id} label={item.label} icon={item.icon} value={item.value} />
        ))}
      </ItemContent>

      <ItemContent className="border-b pb-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="size-3 text-primary" />
          <ItemTitle className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{t('speed.history')}</ItemTitle>
        </div>
        <div className="h-32 w-full bg-accent rounded-lg border">
          {chartData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground underline decoration-dotted">{t('no.data')}</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.[0]) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-lg text-[10px]">
                          <div className="font-bold">{format(new Date(payload[0].payload.time), 'HH:mm')}</div>
                          <div className="text-primary font-bold">{payload[0].value} kn</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 'auto']} />
                <Area type="monotone" dataKey="speed" stroke="hsl(var(--primary))" fill="url(#speedGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </ItemContent>

      <ItemContent className="border-b pb-4">
        <div className="flex items-center gap-2">
          <ListTree className="size-3 text-primary" />
          <ItemTitle className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{t('timeline')}</ItemTitle>
        </div>
        <div className="space-y-3 relative pl-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {timeline.length === 0 ? (
            <div className="text-xs text-muted-foreground italic pl-4">{t('no.events.recorded')}</div>
          ) : (
            timeline.slice(0, 5).map((event) => (
              <div key={event.id} className="relative flex items-start gap-4 group">
                <div className="absolute -left-px mt-1.5 size-2 rounded-full border-2 border-background bg-primary ring-4 ring-background z-10" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium">{format(new Date(event.date), 'dd MMM, HH:mm')}</span>
                  <span className="text-xs font-semibold group-hover:text-primary transition-colors">{event.data?.status || event.type}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </ItemContent>

      <div className="grid grid-cols-3 gap-2 pt-2">
        {['info', 'crew', 'consume'].map((panel) => (
          <Button
            key={panel}
            variant={selectedPanel === panel ? 'default' : 'secondary'}
            size="sm"
            className="text-[10px] font-bold uppercase h-9 shadow-sm"
            onClick={() => setSelectedPanel(panel as any)}
          >
            {t(panel)}
          </Button>
        ))}
      </div>
    </ItemGroup>
  );
}

/**
 * Voyage Details View
 */
function VoyageDetailsView({ data, analytics, timeline }: { data: FleetVoyage; analytics: any[]; timeline: TimelineEvent[] }) {
  const { t } = useTranslation();

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
            {timeline.map((event, i) => (
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

function DetailItemCard({ label, icon: Icon, value, color }: { label: string; icon: any; value: string; color?: string }) {
  return (
    <Item className="flex-col items-start p-3 bg-accent/30 rounded-lg border border-primary/5 space-y-1">
      <div className="flex items-center gap-2">
        <Icon className={`size-3 text-primary ${color}`} />
        <span className="text-[10px] text-muted-foreground uppercase font-bold">{label}</span>
      </div>
      <p className="text-sm font-semibold">{value}</p>
    </Item>
  );
}
