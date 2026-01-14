import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingUserRMDay } from '@/hooks/use-tracking-activity-api';
import { CHART_COLORS, CHART_HEIGHT } from '../@consts';
import type { TrackingFilters, UserRMDayData } from '../@interface';

export function UserRMDayChart({ filters }: UserRMDayChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingUserRMDay(filters);
  const data = rawData as UserRMDayData | undefined;

  const chartData = useMemo(() => {
    if (!data) return [];

    const days = [...new Set([...(data.accessRMDay?.map((x) => x.date.slice(0, 10)) || []), ...(data.usersRMDay?.map((x) => x.date.slice(0, 10)) || [])])].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    return days.map((day) => ({
      date: format(new Date(day), 'dd/MM'),
      accesses: data.accessRMDay?.find((x) => x.date.slice(0, 10) === day)?.total || 0,
      users: data.usersRMDay?.find((x) => x.date.slice(0, 10) === day)?.total || 0,
    }));
  }, [data]);

  const chartConfig = {
    accesses: {
      label: t('access.day'),
      color: CHART_COLORS.chart3,
    },
    users: {
      label: t('users'),
      color: CHART_COLORS.chart4,
    },
  } satisfies ChartConfig;

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT} w-full`} />;

  return (
    <ChartContainer config={chartConfig} className={`${CHART_HEIGHT} w-full`}>
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={10} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="accesses" fill="var(--color-accesses)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

interface UserRMDayChartProps {
  filters: TrackingFilters;
}
