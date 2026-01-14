import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, Treemap } from 'recharts';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingUsersRM } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT_LARGE, DEVICE_COLORS, TOP_USER_LIMIT } from '../@consts';
import type { TrackingFilters, TrackingUserData } from '../@interface';

export function UsersRMChart({ filters }: UsersRMChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingUsersRM(filters);
  const data = rawData as TrackingUserData[] | undefined;

  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => ({
        name: item.user || t('unknown'),
        value: item.total,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, TOP_USER_LIMIT);
  }, [data, t]);

  const chartConfig = {
    value: {
      label: t('actions'),
      color: DEVICE_COLORS[2] || DEVICE_COLORS[0],
    },
  } satisfies ChartConfig;

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT_LARGE} w-full`} />;

  return (
    <ChartContainer config={chartConfig} className={`${CHART_HEIGHT_LARGE} w-full`}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap data={chartData} dataKey="value" aspectRatio={4 / 3} stroke="#fff" fill={DEVICE_COLORS[2] || DEVICE_COLORS[0]}>
          <ChartTooltip content={<ChartTooltipContent />} />
        </Treemap>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

interface UsersRMChartProps {
  filters: TrackingFilters;
}
