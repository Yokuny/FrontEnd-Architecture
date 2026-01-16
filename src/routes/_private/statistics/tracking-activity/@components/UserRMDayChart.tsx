import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingUserRMDay } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT } from '../@consts';
import type { TrackingFilters, UserRMDayData } from '../@interface';

export function UserRMDayChart({ filters }: UserRMDayChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingUserRMDay(filters);
  const data = rawData as UserRMDayData | undefined;

  const { chartData, totals } = useMemo(() => {
    if (!data) return { chartData: [], totals: { accesses: 0, users: 0 } };

    const days = [...new Set([...(data.accessRMDay?.map((x) => x.date.slice(0, 10)) || []), ...(data.usersRMDay?.map((x) => x.date.slice(0, 10)) || [])])].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    );

    const result = days.map((day) => ({
      date: format(new Date(day), 'dd/MM'),
      accesses: data.accessRMDay?.find((x) => x.date.slice(0, 10) === day)?.total || 0,
      users: data.usersRMDay?.find((x) => x.date.slice(0, 10) === day)?.total || 0,
    }));

    const accessesTotal = data.accessRMDay?.reduce((sum, x) => sum + x.total, 0) || 0;
    const usersTotal = data.usersRMDay?.reduce((sum, x) => sum + x.total, 0) || 0;

    return {
      chartData: result,
      totals: { accesses: accessesTotal, users: usersTotal },
    };
  }, [data]);

  const chartConfig = {
    accesses: {
      label: `${totals.accesses} - ${t('access.day')}`,
      color: 'var(--color-hue-cyan)',
    },
    users: {
      label: `${totals.users} - ${t('users')}`,
      color: 'var(--color-hue-violet)',
    },
  } satisfies ChartConfig;

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT} w-full`} />;

  const isEmpty = !data || ((data.accessRMDay?.length || 0) === 0 && (data.usersRMDay?.length || 0) === 0);

  return (
    <Item variant="outline" className="flex-col items-stretch w-full">
      <ItemHeader className="flex-col items-start gap-1 mb-6">
        <ItemTitle className="text-xl font-semibold">RM</ItemTitle>
        <ItemDescription>{t('tracking.activity.rm.day.description', 'Consultas e usuários únicos RM por dia')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <>
            <ChartContainer config={chartConfig} className={`${CHART_HEIGHT} w-full`}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} hide />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="accesses" fill="var(--color-hue-cyan)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="users" fill="var(--color-hue-violet)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
            <ItemFooter className="flex-wrap items-center justify-center gap-6 p-4 mt-4">
              <div className="flex flex-col items-center">
                <ItemDescription className="text-xs font-semibold text-muted-foreground uppercase">{t('total.accesses')}</ItemDescription>
                <ItemTitle className="tabular-nums font-semibold text-lg">{totals.accesses.toLocaleString()}</ItemTitle>
              </div>
              <div className="flex flex-col items-center">
                <ItemDescription className="text-xs font-semibold text-muted-foreground uppercase">{t('total.users')}</ItemDescription>
                <ItemTitle className="tabular-nums font-semibold text-lg">{totals.users.toLocaleString()}</ItemTitle>
              </div>
            </ItemFooter>
          </>
        )}
      </ItemContent>
    </Item>
  );
}

interface UserRMDayChartProps {
  filters: TrackingFilters;
}
