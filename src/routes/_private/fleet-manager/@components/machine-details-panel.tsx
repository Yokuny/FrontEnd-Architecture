import { format, formatISO, subHours } from 'date-fns';
import { Activity, Anchor, Clock, Compass, Gauge, ListTree, TrendingUp, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DefaultLoading from '@/components/default-loading';
import { ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { cn } from '@/lib/utils';
import { useMachineDetails, useMachineTimeline, useSpeedHistory } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { DetailGridItem } from './detail-items';
import { Proximity } from './proximity';

export function MachineDetailsPanel() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();
  const { selectedMachineId } = useFleetManagerStore();

  const { data, isLoading: isLoadingMachine } = useMachineDetails(selectedMachineId);
  const speedHistoryMin = formatISO(subHours(new Date(), 12));
  const speedHistoryMax = formatISO(new Date());
  const { data: speedHistory, isLoading: isLoadingSpeedHistory } = useSpeedHistory(selectedMachineId ?? undefined, speedHistoryMin, speedHistoryMax);
  const { data: machineTimeline, isLoading: isLoadingMachineTimeline } = useMachineTimeline(selectedMachineId ?? undefined, idEnterprise);

  if (isLoadingMachine || isLoadingSpeedHistory || isLoadingMachineTimeline) {
    return (
      <ItemGroup className="p-4">
        <DefaultLoading />
      </ItemGroup>
    );
  }

  if (!data) return null;

  const chartData = Array.isArray(speedHistory) ? speedHistory.map((p) => ({ time: p[0] * 1000, speed: p[1] })) : [];
  const timeline = machineTimeline?.data || [];

  const gridItems = [
    data?.data?.status && { id: 'status', label: t('status'), icon: Activity, value: data?.data?.status || 'N/A' },
    { id: 'speed', label: t('speed'), icon: Gauge, value: data?.data?.speed !== undefined ? `${data.data.speed.toFixed(1)} ${t('kn')}` : `0 ${t('kn')}` },
    { id: 'course', label: t('course'), icon: Compass, value: data?.data?.course !== undefined ? `${data.data.course.toFixed(1)}°` : '0°' },
    data?.data?.destiny && { id: 'destiny', label: `${t('destiny.port')} AIS`, icon: Anchor, value: data.data.destiny },
    data?.data?.eta && { id: 'eta', label: 'ETA AIS', icon: Clock, value: format(new Date(data.data.eta), 'dd MMM, HH:mm') },
    data?.data?.draught !== undefined && { id: 'draught', label: t('draught', 'Draught'), icon: Waves, value: `${data.data.draught} m` },
  ].filter(Boolean) as any[];

  const columnsClass = gridItems.length === 4 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <ItemGroup className="p-4 space-y-2">
      <ItemContent className="flex flex-row justify-between items-center gap-2">
        <div className="flex flex-col items-start">
          <ItemTitle className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tight text-center">{t('departure')}</ItemTitle>
          <div className="text-xs font-semibold flex items-center justify-center">
            {data.travel?.dateTimeStart ? format(new Date(data.travel.dateTimeStart), 'dd MMM yy') : '-'}
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold tabular-nums">
            {data.travel?.dateTimeStart ? format(new Date(data.travel.dateTimeStart), 'HH:mm') : '-'}
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

        <div className="flex flex-col items-end">
          <ItemTitle className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tight text-center">{t('arrival')}</ItemTitle>
          <div className="text-xs font-semibold flex items-center justify-center">{data.travel?.dateTimeEnd ? format(new Date(data.travel.dateTimeEnd), 'dd MMM yy') : '-'}</div>
          <span className="text-[10px] text-muted-foreground font-semibold tabular-nums">
            {data.travel?.dateTimeEnd ? format(new Date(data.travel.dateTimeEnd), 'HH:mm') : '-'}
          </span>
        </div>
      </ItemContent>

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

      <ItemContent className={cn('grid gap-y-4 gap-x-2 p-2 py-4 bg-accent/50 rounded-md border-accent border', columnsClass)}>
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
            timeline.slice(0, 5).map((event: any) => (
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
    </ItemGroup>
  );
}
