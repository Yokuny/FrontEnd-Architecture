import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingUserAccessDay } from '@/hooks/use-tracking-activity-api';
import { CHART_COLORS, CHART_HEIGHT } from '../@consts';
import type { TrackingFilters, UserAccessDayData } from '../@interface';

export function UserAccessDayChart({ filters }: UserAccessDayChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingUserAccessDay(filters);
  const data = rawData as UserAccessDayData | undefined;

  const chartData = useMemo(() => {
    if (!data) return [];

    const days = [...new Set([...(data.usersDay?.map((x) => x.date.slice(0, 10)) || []), ...(data.usersDayWhatsapp?.map((x) => x.date.slice(0, 10)) || [])])].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    return days.map((day) => ({
      date: format(new Date(day), 'dd/MM'),
      system: data.usersDay?.find((x) => x.date.slice(0, 10) === day)?.total || 0,
      whatsapp: data.usersDayWhatsapp?.find((x) => x.date.slice(0, 10) === day)?.total || 0,
    }));
  }, [data]);

  const chartConfig = {
    system: {
      label: t('system'),
      color: CHART_COLORS.chart3,
    },
    whatsapp: {
      label: 'WhatsApp',
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
        <Bar dataKey="system" fill="var(--color-system)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="whatsapp" fill="var(--color-whatsapp)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

interface UserAccessDayChartProps {
  filters: TrackingFilters;
}
