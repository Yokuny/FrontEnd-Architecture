import { format, parseISO } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingUserAccessDay } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT } from '../@consts';
import type { TrackingFilters, UserAccessDayData } from '../@interface';

export function UserAccessDayChart({ filters }: UserAccessDayChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingUserAccessDay(filters);
  const data = rawData as UserAccessDayData | undefined;

  const filterDateSize = useMemo(() => {
    if (!data) return 10;
    if ((data.usersDay?.length || 0) > 60 || (data.usersDayWhatsapp?.length || 0) > 60) {
      return 7; // YEAR_MONTH_SLICE
    }
    return 10; // YEAR_MONTH_DAY_SLICE
  }, [data]);

  const { chartData, totals } = useMemo(() => {
    if (!data) return { chartData: [], totals: { system: 0, whatsapp: 0 } };

    const days = [
      ...new Set([...(data.usersDay?.map((x) => x.date.slice(0, filterDateSize)) || []), ...(data.usersDayWhatsapp?.map((x) => x.date.slice(0, filterDateSize)) || [])]),
    ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const result = days.map((dateStr) => {
      const systemTotal = data.usersDay?.filter((x) => x.date.slice(0, filterDateSize) === dateStr).reduce((sum, item) => sum + item.total, 0) || 0;
      const whatsappTotal = data.usersDayWhatsapp?.filter((x) => x.date.slice(0, filterDateSize) === dateStr).reduce((sum, item) => sum + item.total, 0) || 0;

      return {
        key: dateStr,
        date: format(parseISO(dateStr.length === 7 ? `${dateStr}-01` : dateStr), filterDateSize === 10 ? 'dd/MM' : 'MM/yyyy'),
        system: systemTotal,
        whatsapp: whatsappTotal,
      };
    });

    const systemTotal = data.usersDay?.reduce((sum, x) => sum + x.total, 0) || 0;
    const whatsappTotal = data.usersDayWhatsapp?.reduce((sum, x) => sum + x.total, 0) || 0;

    return {
      chartData: result,
      totals: { system: systemTotal, whatsapp: whatsappTotal },
    };
  }, [data, filterDateSize]);

  const chartConfig = {
    system: {
      label: `${totals.system} - ${t('system')}`,
      color: getChartColor(0),
    },
    whatsapp: {
      label: `${totals.whatsapp} - WhatsApp`,
      color: getChartColor(13),
    },
  } satisfies ChartConfig;

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT} w-full`} />;

  const isEmpty = !data || ((data.usersDay?.length || 0) === 0 && (data.usersDayWhatsapp?.length || 0) === 0);

  return (
    <Item variant="outline" className="flex-col items-stretch w-full">
      <ItemHeader className="flex-col items-start gap-1 mb-6">
        <ItemTitle className="text-xl font-semibold">{t('users')}</ItemTitle>
        <ItemDescription>{t('tracking.activity.users.description', 'Acesso diário por usuário ao sistema e WhatsApp')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} className={`${CHART_HEIGHT} w-full`}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} hide />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />

              <Bar dataKey="system" stackId="a" fill={getChartColor(0)} radius={[0, 0, 4, 4]} />
              <Bar dataKey="whatsapp" stackId="a" fill={getChartColor(13)} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </ItemContent>
    </Item>
  );
}

interface UserAccessDayChartProps {
  filters: TrackingFilters;
}
