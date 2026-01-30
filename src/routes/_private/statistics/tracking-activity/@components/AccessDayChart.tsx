import { parseISO } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingAccessDay } from '@/hooks/use-tracking-activity-api';
import { formatDate } from '@/lib/formatDate';
import { CHART_HEIGHT } from '../@consts';
import type { AccessDayData, TrackingFilters } from '../@interface';

export function AccessDayChart({ filters }: AccessDayChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingAccessDay(filters);
  const data = rawData as AccessDayData | undefined;

  const filterDateSize = useMemo(() => {
    if (!data) return 10;
    if (data.acessDay.length > 60 || data.acessDayWhatsapp.length > 60) {
      return 7; // YEAR_MONTH_SLICE
    }
    return 10; // YEAR_MONTH_DAY_SLICE
  }, [data]);

  const chartData = useMemo(() => {
    if (!data) return [];

    const days = [
      ...new Set([...(data.acessDay?.map((x) => x.date.slice(0, filterDateSize)) || []), ...(data.acessDayWhatsapp?.map((x) => x.date.slice(0, filterDateSize)) || [])]),
    ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return days.map((dateStr) => {
      const systemTotal = data.acessDay?.filter((x) => x.date.slice(0, filterDateSize) === dateStr).reduce((sum, item) => sum + item.total, 0) || 0;

      const whatsappTotal = data.acessDayWhatsapp?.filter((x) => x.date.slice(0, filterDateSize) === dateStr).reduce((sum, item) => sum + item.total, 0) || 0;

      return {
        key: dateStr,
        date: formatDate(parseISO(dateStr.length === 7 ? `${dateStr}-01` : dateStr), filterDateSize === 10 ? 'dd MM' : 'MM yyyy'),
        system: systemTotal,
        whatsapp: whatsappTotal,
      };
    });
  }, [data, filterDateSize]);

  const totals = useMemo(() => {
    if (!data) return { system: 0, whatsapp: 0 };
    return {
      system: data.acessDay?.reduce((sum, x) => sum + x.total, 0) || 0,
      whatsapp: data.acessDayWhatsapp?.reduce((sum, x) => sum + x.total, 0) || 0,
    };
  }, [data]);

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

  const isEmpty = !data || (data.acessDay.length === 0 && data.acessDayWhatsapp.length === 0);

  return (
    <Item variant="outline" className="w-full flex-col items-stretch">
      <ItemHeader className="mb-6 flex-col items-start gap-1">
        <ItemTitle className="font-semibold text-xl">{t('access.day')}</ItemTitle>
        <ItemDescription>{t('tracking.activity.description', 'Atividades de acesso ao sistema e aplicativos')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} className={`${CHART_HEIGHT} w-full`}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
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

interface AccessDayChartProps {
  filters: TrackingFilters;
}
