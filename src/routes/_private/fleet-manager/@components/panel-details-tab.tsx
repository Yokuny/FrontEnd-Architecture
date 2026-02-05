import { format, formatISO, subHours } from 'date-fns';
import { Activity, Anchor, Clock, Compass, Gauge, ListTree, TrendingUp, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DefaultLoading from '@/components/default-loading';
import { getChartColor } from '@/components/ui/chart';
import { ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { cn } from '@/lib/utils';
import { useMachineDetails, useMachineTimeline, useSpeedHistory } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { DetailGridItem } from './helpers/detail-items';
import { Proximity } from './helpers/proximity';

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
    <ItemGroup className="space-y-2 p-4">
      <ItemContent className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-col items-start">
          <ItemTitle className="truncate text-center font-bold text-[10px] text-muted-foreground uppercase tracking-tight">{t('departure')}</ItemTitle>
          <div className="flex items-center justify-center font-semibold text-xs">
            {data.travel?.dateTimeStart ? format(new Date(data.travel.dateTimeStart), 'dd MMM yy') : '-'}
          </div>
          <span className="font-semibold text-[10px] text-muted-foreground tabular-nums">
            {data.travel?.dateTimeStart ? format(new Date(data.travel.dateTimeStart), 'HH:mm') : '-'}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <ItemTitle className="truncate text-center font-bold text-[10px] text-muted-foreground uppercase tracking-tight">{t('proximity')}</ItemTitle>
          <div className="flex items-center justify-center font-semibold text-xs">
            {data?.data?.position ? <Proximity latitude={data.data.position[0]} longitude={data.data.position[1]} /> : '-'}
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {data?.data?.position ? `${data.data.position[0].toFixed(6)}, ${data.data.position[1].toFixed(6)}` : '-'}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <ItemTitle className="truncate text-center font-bold text-[10px] text-muted-foreground uppercase tracking-tight">{t('arrival')}</ItemTitle>
          <div className="flex items-center justify-center font-semibold text-xs">{data.travel?.dateTimeEnd ? format(new Date(data.travel.dateTimeEnd), 'dd MMM yy') : '-'}</div>
          <span className="font-semibold text-[10px] text-muted-foreground tabular-nums">
            {data.travel?.dateTimeEnd ? format(new Date(data.travel.dateTimeEnd), 'HH:mm') : '-'}
          </span>
        </div>
      </ItemContent>

      {data?.travel && (
        <ItemContent>
          <ItemTitle className="font-bold text-muted-foreground uppercase tracking-tight">{data.travel.code}</ItemTitle>
          <ItemContent>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t('source')}</span>
              <div className="mx-3 h-px w-full bg-muted-foreground" />
              <span className="text-muted-foreground">{t('destiny.port')}</span>
            </div>
            <div className="flex items-start justify-between text-xs">
              <div className="flex w-1/2 flex-col gap-1">
                <span className="font-medium">{data.travel.portPointStart?.code || '-'}</span>
                <span className="text-muted-foreground">{data.travel.portPointStart?.description || '-'}</span>
              </div>
              <div className="flex w-1/2 flex-col gap-1 text-right">
                <span className="font-medium">{data.travel.portPointEnd?.code || '-'}</span>
                <span className="text-right text-muted-foreground">{data.travel.portPointEnd?.description || '-'}</span>
              </div>
            </div>
          </ItemContent>
        </ItemContent>
      )}

      <ItemContent className={cn('grid gap-x-2 gap-y-4 rounded-md border border-accent bg-accent/50 p-2 py-4', columnsClass)}>
        {gridItems.map((item) => (
          <DetailGridItem key={item.id} label={item.label} icon={item.icon} value={item.value} />
        ))}
      </ItemContent>

      <ItemContent className="border-b pb-4">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="size-3 text-primary" />
          <ItemTitle className="font-bold text-[10px] text-muted-foreground uppercase tracking-tight">{t('speed.history')}</ItemTitle>
        </div>
        <div className="h-32 w-full rounded-lg border bg-accent">
          {chartData.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground underline decoration-dotted">{t('no.data')}</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getChartColor(0)} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={getChartColor(0)} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.[0]) {
                      return (
                        <div className="rounded-lg border bg-background p-2 text-[10px]">
                          <div className="font-bold">{format(new Date(payload[0].payload.time), 'HH:mm')}</div>
                          <div className="font-bold" style={{ color: getChartColor(0) }}>
                            {payload[0].value} kn
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 'auto']} />
                <Area type="monotone" dataKey="speed" stroke={getChartColor(0)} fill="url(#speedGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </ItemContent>

      <ItemContent className="border-b pb-4">
        <div className="flex items-center gap-2">
          <ListTree className="size-3 text-primary" />
          <ItemTitle className="font-bold text-[10px] text-muted-foreground uppercase tracking-tight">{t('timeline')}</ItemTitle>
        </div>
        <div className="relative space-y-3 pl-5 before:absolute before:top-2 before:bottom-2 before:left-[19px] before:w-px before:bg-border">
          {timeline.length === 0 ? (
            <div className="pl-5 text-muted-foreground text-xs italic">{t('no.events.recorded')}</div>
          ) : (
            timeline.slice(0, 5).map((event: any) => (
              <div key={event.id} className="group relative flex items-start gap-4">
                <div className="absolute z-10 mt-1.5 size-1 bg-primary" />
                <div className="flex flex-col gap-0.5 pl-2">
                  <span className="font-medium text-[10px] text-muted-foreground">{format(new Date(event.date), 'dd MMM, HH:mm')}</span>
                  <ItemTitle className="text-xs">{event.data?.status || event.type}</ItemTitle>
                </div>
              </div>
            ))
          )}
        </div>
      </ItemContent>
    </ItemGroup>
  );
}
